import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSocket } from "../../hooks/use-socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";

import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  getInstagramClientList,
  getInstagramClientMessages,
} from "../../store/actions/social.action";

const InstagramChattingManager = (props) => {
  const { t } = useTranslation();
  const { social, device } = props;
  const { socket } = useSocket();

  const [selectedUser, setSelectedUser] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [clientListLoading, setClientListLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const onFetchClientList = async () => {
    try {
      setClientListLoading(true);
      setClientList([]);
      setMessages([]);
      const deviceId = device?.deviceId;
      const socialName = social?.label;

      const result = await getInstagramClientList(deviceId, socialName);
      setClientList(result?.data);
    } catch (error) {
      console.log("get client list error", error);
    } finally {
      setClientListLoading(false);
    }
  };

  const onFetchMessages = async (user) => {
    try {
      setMessageLoading(true);
      setSelectedUser(user);
      const result = await getInstagramClientMessages(user);
      setMessages(result.data);
    } catch (error) {
      console.log("get message error", error);
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    if (social && device) {
      onFetchClientList();
    }

    if (socket) {
      // Receive the instagram data from server
      socket.on(`${SocketIOPublicEvents.WHATSAPP_CHIENTLIST_TO_WEB}-${device?.deviceId}`, () =>
        onFetchClientList()
      );

      socket.on(`${SocketIOPublicEvents.WHATSAPP_MESSAGE_TO_WEB}-${device?.deviceId}`, () =>
        onFetchMessages(selectedUser)
      );

      return () => {
        socket.off(`${SocketIOPublicEvents.WHATSAPP_CHIENTLIST_TO_WEB}-${device?.deviceId}`);
        socket.off(`${SocketIOPublicEvents.WHATSAPP_MESSAGE_TO_WEB}-${device?.deviceId}`);
      };
    }
  }, [social, device, socket]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      {/* User List */}
      <div
        style={{
          flex: "0 0 30%",
          overflowY: "auto",
          backgroundColor: "#212631",
          borderTopLeftRadius: "5px",
          borderBottomLeftRadius: "5px",
        }}
      >
        {clientListLoading && (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              color: "gray",
              width: "100%",
              height: "100%",
              zIndex: 1,
              backgroundColor: "#00000069",
              color: "white",
              width: "100%",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#564FEE",
                width: "30px",
                height: "30px",
                borderRadius: "5px",
              }}
            >
              <CircularProgress sx={{ color: "white" }} size={20} />
            </Grid>
          </Grid>
        )}
        <List>
          {clientList && clientList?.length > 0 ? (
            clientList.map((user) => (
              <ListItem
                button
                key={user?._id}
                onClick={() => onFetchMessages(user)}
                selected={selectedUser?._id === user?._id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#34495e",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ color: "white", fontSize: "16px", fontWeight: "300" }}>
                        {user?.userName}
                      </div>
                      <div style={{ fontSize: "0.8em", color: "gray" }}>
                        {user?.lastMessage} {user?.lastDate}
                      </div>
                    </Box>
                  }
                />
              </ListItem>
            ))
          ) : (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                color: "gray",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography sx={{ fontSize: "14px", textAlign: "center" }}>
                {t("devicesPage.noData")}
              </Typography>
            </Grid>
          )}
        </List>
      </div>

      {/* Chat Panel */}
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {messageLoading && (
          <Grid
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
              color: "white",
              width: "100%",
              backgroundColor: "#00000069",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#564FEE",
                width: "30px",
                height: "30px",
                borderRadius: "5px",
              }}
            >
              <CircularProgress sx={{ color: "white" }} size={20} />
            </Grid>
          </Grid>
        )}
        <Paper
          style={{
            flexGrow: 1,
            padding: "16px",
            overflowY: "auto",
            borderRadius: "0px",
            backgroundImage:
              "linear-gradient(rgb(10 10 10 / 89%), rgb(19 19 20 / 91%)), url(/assets/instagram-chatting-bg.webp)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
          }}
        >
          {messages?.length > 0 &&
            messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.referenceType === "from" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    color: "white",
                    padding: "10px",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                    fontSize: "14px",
                    fontWeight: "300",
                    backgroundColor: msg.referenceType === "from" ? "#671bcda1" : "#111927c9",
                    borderBottomRightRadius: msg.referenceType === "from" ? "0" : "10px",
                    borderBottomLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    borderTopLeftRadius: msg.referenceType === "to" ? "0" : "10px",
                  }}
                >
                  {msg.messageText}
                </Typography>
                <div
                  style={{
                    color: "gray",
                    fontSize: "12px",
                    alignItems: msg.referenceType === "from" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.messageTime}
                </div>
              </Box>
            ))}
        </Paper>
      </div>
    </div>
  );
};

export default InstagramChattingManager;
