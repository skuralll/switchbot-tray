#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// imports
use tauri::{Manager, SystemTray, SystemTrayEvent};
use tauri_plugin_positioner::{Position, WindowExt};
use window_shadows::set_shadow;

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
            set_shadow(&window, true).unwrap(); // round up corner
            window.hide().unwrap(); // hide window
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
        // .invoke_handler(tauri::generate_handler![get_token, get_secret,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
