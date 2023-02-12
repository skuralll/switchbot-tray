#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
#[cfg(target_os = "macos")]

// imports
use chrono::Utc;
use ring::{hmac};
use base64::{encode};
use serde::{ Serialize, Deserialize };
use serde_json::{Result as SerdeResult, Value};
use tauri::{Manager, SystemTray, SystemTrayEvent,ActivationPolicy};
use tauri_plugin_positioner::{Position, WindowExt};
use window_shadows::set_shadow;

// メインプロセス

fn main() {
    // System Tray
    let tray = SystemTray::new();
    // Build
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .system_tray(tray)
        // 各種設定
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.hide().unwrap(); // hide window
            app.set_activation_policy(ActivationPolicy::Accessory); // hide in dock
			#[cfg(any(windows, target_os = "macos"))]
			set_shadow(&window, true).unwrap();
            //dev
            window.set_always_on_top(true).unwrap(); // always on top
            Ok(())
        })
        // システムトレイの各イベントハンドラ
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);
            match event {
                SystemTrayEvent::LeftClick {
                    position: _,
                    size: _,
                    ..
                } => {
                    // クリック時にウィンドウの表示切替
                    let window = app.get_window("main").unwrap();
                    let _ = window.move_window(Position::RightCenter);
                    if window.is_visible().unwrap() {
                        window.hide().unwrap();
                    } else {
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![get_devices,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// IPC通信用API

#[derive(Debug, Serialize, Deserialize)]
struct Tokens {
	token: String,
	secret: String,
}

// SwitchBotAPIにGETリクエストを送信する
async fn get_request(tokens: &Tokens, url: &str) -> Result<Value, Box<dyn std::error::Error>>{
    //タイムタンプ取得
    let t = (Utc::now().timestamp_millis() as i64).to_string();
    // ランダムな文字列
    let nonce = "".to_string();
    //署名作成
    let str_to_sign = format!("{}{}{}", &tokens.token, t, nonce);
    let key = hmac::Key::new(hmac::HMAC_SHA256, &tokens.secret.as_bytes());
    let signature = hmac::sign(&key, str_to_sign.as_bytes());
    let sign = encode(signature.as_ref());
    //リクエスト作成->送信->レスポンス取得
    let client = reqwest::Client::new();
    let body = client.get(url)
        .header("Authorization", &tokens.token)
        .header("t", t)
        .header("sign", sign)
        .header("nonce", nonce)
        .header("Content-Type", "application/json")
        .send()
        .await?
        .text()
        .await?;
    // レスポンスをデコードする
    let res: Value = serde_json::from_str(&body)?;
    //ステータスコードを確認する
    let Some(obj) = res.as_object() else {return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "request error")))};
    match obj.get("statusCode"){
        Some(status) => {
            match status.as_i64(){
                Some(100) => {
                    return Ok(obj["body"].clone());
                },
                Some(190) => return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "device internal error"))),
                _ => return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "unknown statusCode"))),
            }
        },
        None => return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "invalid token"))),
    }
}

// 
#[tauri::command]
async fn get_devices (tokens: Tokens) -> Result<Value, String>{
	println!("{}\n{}", &tokens.token, &tokens.secret);
    let res = match get_request(&tokens, "https://api.switch-bot.com/v1.1/devices").await {
        Ok(result) => return Ok(result),
        Err(msg) => return Err(msg.to_string()),
    };
}