import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  TextField,
  IconButton,
} from "@mui/material";

import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocketFunctions } from "src/utils/socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

import SendIcon from "@mui/icons-material/Send";

import Color from "src/theme/colors";

const SMSManager = ({ label, device, onClose }) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const { onSocketManager, onGetGalleryEvent } = useSocketFunctions();

  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" });

  const [galleryData, setGalleryData] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState(null);

  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef(null);

  const [state, setState] = useState({
    width: isTablet ? 500 : 800,
    height: isTablet ? 600 : 700,
    x: isTablet ? 20 : 50,
    y: isTablet ? -400 : -120,
    minWidth: isTablet ? 400 : 500,
    minHeight: 400,
    maxWidth: 800,
    maxHeight: 700,
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setState((prevState) => ({
          ...prevState,
          width: window.innerWidth - 20, // Account for padding
          height: window.innerWidth - 20, // Keep it square
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          width: 720,
          height: 720,
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const init = async () => {
    try {
      console.log("get messages");
    } catch (error) {
      console.log("get gallery error:", error);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
    scrollToBottom();
  };

  const onCloseModal = async () => {
    try {
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello, how are you?", sender: "user", timestamp: "10:30 AM" },
    { id: 2, text: "I'm fine, thanks! What about you?", sender: "robot", timestamp: "10:31 AM" },
  ]);

  // Dummy user info for avatars
  const userAvatar = "/path/to/user-avatar.jpg";
  const robotAvatar = "/path/to/robot-avatar.jpg";

  return (
    <MonitorViewer initialState={state} onClose={onCloseModal}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            overflowY: "auto",
            height: "100%",
            py: { md: 1, xs: 5 },
            gap: "15px",
          }}
        >
          <div
            style={{
              flex: "40%",
              overflowY: "auto",
              border: `solid 1px ${Color.background.border}`,
              borderRadius: "5px",
            }}
          >
            <div style={{ backgroundColor: Color.background.main }}>
              {galleryData.length === 0 ? (
                <Typography style={{ color: "white" }}>
                  {t("devicesPage.managers.gallery-noimage")}
                </Typography>
              ) : (
                galleryData.map((image, index) => (
                  <Typography
                    key={index}
                    onClick={() => onSelectImage(image)}
                    style={{
                      cursor: "pointer",
                      marginBottom: "8px",
                      color: selectedImageId === image.imageId ? Color.text.purple : "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedImage || selectedImage.imageId !== image.imageId) {
                        e.currentTarget.style.backgroundColor = Color.background.purple_opacity;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedImage || selectedImage.imageId !== image.imageId) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {image.filepath.split("/").pop()}
                  </Typography>
                ))
              )}
            </div>
          </div>

          <div
            style={{
              flexBasis: "70%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              border: `solid 1px ${Color.background.border}`,
              borderRadius: "5px",
            }}
          >
            {!selectedMessages ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Chat Messages Area */}
                <Box
                  ref={chatContainerRef}
                  sx={{
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                    backgroundColor: Color.background.chatBackground,
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                        marginBottom: "15px",
                      }}
                    >
                      {message.sender === "robot" && (
                        <Avatar
                          src={robotAvatar}
                          sx={{ width: 35, height: 35, marginRight: "10px" }}
                        />
                      )}
                      <Box
                        sx={{
                          backgroundColor:
                            message.sender === "user"
                              ? Color.background.purple_opacity01
                              : Color.background.main_gray01,
                          padding: "10px 15px",
                          border: `solid 1px ${
                            message.sender == "user"
                              ? Color.background.purple_opacity01
                              : Color.background.purple
                          }`,
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                          borderBottomLeftRadius: "10px",
                          color: "white",
                          maxWidth: "60%",
                          textAlign: message.sender === "user" ? "right" : "left",
                        }}
                      >
                        <Typography variant="body2">{message.text}</Typography>
                        <Typography variant="caption" sx={{ fontSize: "0.8rem", color: "gray" }}>
                          {message.timestamp}
                        </Typography>
                      </Box>
                      {message.sender === "user" && (
                        <Avatar
                          src={userAvatar}
                          sx={{ width: 35, height: 35, marginLeft: "10px" }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Message Input Area */}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    padding: "10px",
                    borderTop: `1px solid ${Color.background.border}`,
                    backgroundColor: Color.background.main,
                  }}
                >
                  <TextField
                    className="screen-message"
                    fullWidth
                    placeholder={t("Type a message...")}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    inputProps={{
                      style: {
                        backgroundColor: Color.background.main,
                        padding: "10px 50px 10px 10px",
                      },
                    }}
                  />

                  <IconButton
                    onClick={handleSendMessage}
                    variant="contained"
                    sx={{
                      marginLeft: "10px",
                      borderRadius: "50%",
                      padding: "10px",
                      color: Color.text.primary,
                      backgroundColor: Color.background.purple,
                      "&:hover": {
                        backgroundColor: Color.background.purple_light,
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </div>
            ) : (
              <Typography sx={{ fontSize: "14px", textAlign: "center", color: "white" }}>
                {t("devicesPage.managers.gallery-select-image")}
              </Typography>
            )}
          </div>
        </Box>
      </div>
    </MonitorViewer>
  );
};

export default SMSManager;
