// Windowsでコマンドプロンプトが起動するのを阻止する
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// imports
use base64::encode;
use chrono::Utc;
use reqwest::RequestBuilder;
use ring::hmac;
use serde::{Deserialize, Serialize};
use serde_json::{json, Result as SerdeResult, Value};
use tauri::{Manager, SystemTray, SystemTrayEvent};
use tauri_plugin_positioner::{Position, WindowExt};
use window_shadows::set_shadow;

#[cfg(target_os = "macos")]
use tauri::ActivationPolicy;
// use
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
            set_shadow(&window, true).unwrap();
            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(ActivationPolicy::Accessory); // hide in dock
            }
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
                    let _ = window.move_window(Position::TrayCenter);
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
        .invoke_handler(tauri::generate_handler![
            get_devices,
            send_command,
            get_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// IPC通信用API

#[derive(Debug, Serialize, Deserialize)]
struct Tokens {
    token: String,
    secret: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Command {
    deviceId: String,
    command: String,
    parameter: String,
}

enum RequestType {
    Get,
    Post,
}

// HTTPリクエストのベースを作成する
fn get_client(tokens: &Tokens, url: &str, req_type: RequestType) -> RequestBuilder {
    //タイムタンプ取得
    let t = (Utc::now().timestamp_millis() as i64).to_string();
    // ランダムな文字列
    let nonce = "".to_string();
    //署名作成
    let str_to_sign = format!("{}{}{}", &tokens.token, t, nonce);
    let key = hmac::Key::new(hmac::HMAC_SHA256, &tokens.secret.as_bytes());
    let signature = hmac::sign(&key, str_to_sign.as_bytes());
    let sign = encode(signature.as_ref());
    //リクエスト作成
    let request = match req_type {
        RequestType::Get => reqwest::Client::new().get(url),
        RequestType::Post => reqwest::Client::new().post(url),
    };
    request
        .header("Authorization", &tokens.token)
        .header("t", t)
        .header("sign", sign)
        .header("nonce", nonce)
        .header("Content-Type", "application/json")
}

// SwitchBotAPIにGETリクエストを送信する
async fn get_request(tokens: &Tokens, url: &str) -> Result<Value, Box<dyn std::error::Error>> {
    let body = get_client(tokens, url, RequestType::Get)
        .send()
        .await?
        .text()
        .await?;
    // レスポンスをデコードする
    let res: Value = serde_json::from_str(&body)?;
    //ステータスコードを確認する
    let Some(obj) = res.as_object() else {return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "request error")))};
    match obj.get("statusCode") {
        Some(status) => match status.as_i64() {
            Some(100) => {
                return Ok(obj["body"].clone());
            }
            Some(190) => {
                return Err(Box::new(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    "device internal error",
                )))
            }
            _ => {
                return Err(Box::new(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    "unknown statusCode",
                )))
            }
        },
        None => {
            return Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                "invalid token",
            )))
        }
    }
}

// SwitchBotAPIにPOSTリクエストを送信する
async fn post_request(
    tokens: &Tokens,
    url: &str,
    req_json: &Value,
) -> Result<Value, Box<dyn std::error::Error>> {
    let body = get_client(tokens, url, RequestType::Post)
        .body(req_json.to_string())
        .send()
        .await?
        .text()
        .await?;
    // レスポンスをデコードする
    let res: Value = serde_json::from_str(&body)?;
    //ステータスコードを確認して成功していた場合結果を返す
    let Some(obj) = res.as_object() else {return Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "request error")))};
    match obj.get("statusCode") {
        Some(status) => match status.as_i64() {
            Some(100) => {
                return Ok(obj["message"].clone());
            }
            _ => {}
        },
        None => {}
    }
    // エラー処理
    match obj.get("message") {
        Some(msg) => {
            return Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                msg.as_str().unwrap(),
            )));
        }
        None => {
            return Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                "unknown error",
            )));
        }
    }
}

// デバイスリストを取得する
#[tauri::command]
async fn get_devices(tokens: Tokens) -> Result<Value, String> {
    let res = match get_request(&tokens, "https://api.switch-bot.com/v1.1/devices").await {
        Ok(result) => {
            let mut devices: Vec<Value> = Vec::new();
            ["deviceList", "infraredRemoteList"].iter().for_each(|x| {
                result[x].as_array().unwrap().iter().for_each(|x| {
                    devices.push(x.clone());
                });
            });
            return Ok(json!(devices));
        }
        Err(msg) => return Err(msg.to_string()),
    };
}

//デバイスステータスを取得する
#[tauri::command]
async fn get_status(tokens: Tokens, device_id: String) -> Result<Value, String> {
    let url = format!(
        "https://api.switch-bot.com/v1.1/devices/{}/status",
        device_id
    );
    let res = match get_request(&tokens, &url).await {
        Ok(result) => {
            return Ok(result);
        }
        Err(msg) => return Err(msg.to_string()),
    };
}

// デバイス操作コマンドを送信する
#[tauri::command]
async fn send_command(tokens: Tokens, command: Command) -> Result<String, String> {
    let url = format!(
        "https://api.switch-bot.com/v1.1/devices/{}/commands",
        command.deviceId
    );
    let req_json = json!({
        "command": command.command,
        "parameter": command.parameter,
    });
    let res = match post_request(&tokens, &url, &req_json).await {
        Ok(result) => {
            return Ok(result.as_str().unwrap().to_string());
        }
        Err(msg) => return Err(msg.to_string()),
    };
}
