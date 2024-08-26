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
  getWhatsappClientList,
  getWhatsappClientMessages,
} from "../../store/actions/social.action";
import dayjs from "dayjs"; // Import dayjs for date manipulation

export const WhatsappChattingManager = (props) => {
  const { t } = useTranslation();
  const { social, device } = props;
  const { socket } = useSocket();

  const [clientList, setClientList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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

      const result = await getWhatsappClientList(deviceId, socialName);
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
      const result = await getWhatsappClientMessages(user);
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
      socket.on(`${SocketIOPublicEvents.INSTAGRAM_CLIENTLIST_TO_WEB}-${device?.deviceId}`, () =>
        onFetchClientList()
      );

      socket.on(`${SocketIOPublicEvents.INSTAGRAM_MESSAGE_TO_WEB}-${device?.deviceId}`, () =>
        onFetchMessages(selectedUser)
      );

      return () => {
        socket.off(`${SocketIOPublicEvents.INSTAGRAM_CLIENTLIST_TO_WEB}-${device?.deviceId}`);
        socket.off(`${SocketIOPublicEvents.INSTAGRAM_MESSAGE_TO_WEB}-${device?.deviceId}`);
      };
    }
  }, [social, device, socket]);

  // Utility function to group and sort messages by date
  const groupMessagesByDate = (messages) => {
    // Group messages by date
    const grouped = messages.reduce((acc, message) => {
      const messageDate = dayjs(message.messageDate, "DD/MM/YYYY").format("YYYY-MM-DD");
      if (!acc[messageDate]) {
        acc[messageDate] = [];
      }
      acc[messageDate].push(message);
      return acc;
    }, {});

    // Sort messages within each date group by time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => dayjs(a.messageTime, "h:mm A") - dayjs(b.messageTime, "h:mm A"));
    });

    return grouped;
  };

  // Grouped and sorted messages by date
  const groupedMessages = groupMessagesByDate(messages);

  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => dayjs(a).diff(dayjs(b)));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        maxHeight: "100%",
      }}
    >
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
            [...clientList].reverse().map(
              (
                user // Reverse the client list
              ) => (
                <ListItem
                  button
                  key={user?._id}
                  onClick={() => onFetchMessages(user)}
                  selected={selectedUser?._id === user?._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#34495e",
                      borderRadius: "5px",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "white", fontSize: "16px", fontWeight: "300" }}>
                          {user?.userName || user?.phoneNumber}
                        </span>
                        <span style={{ fontSize: "0.8em", color: "gray" }}>{user?.lastDate}</span>
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          color: "gray",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "200px",
                        }}
                      >
                        {user?.lastMessage}
                      </Box>
                    }
                  />
                </ListItem>
              )
            )
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
          position: "relative",
          height: "100%",
        }}
      >
        {" "}
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
            display: "flex",
            flexDirection: "column-reverse",
            flexGrow: 1,
            padding: "16px",
            overflowY: "auto",
            borderRadius: "0px",
            backgroundImage:
              "linear-gradient(rgb(10 10 10 / 89%), rgb(19 19 20 / 91%)), url(/assets/whatsapp-bg.webp)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
          }}
        >
          {sortedDates?.length > 0 &&
            sortedDates.map((date) => (
              <div key={date}>
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "14px",
                    textAlign: "center",
                    margin: "10px 0",
                  }}
                >
                  {dayjs(date).format("DD/MM/YYYY")}
                </Typography>
                {groupedMessages[date].map((msg, index) => (
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
                        backgroundColor: msg.referenceType === "from" ? "#564FEE5c" : "#111927c9",
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
                      {msg.messageDate} {msg.messageTime}
                    </div>
                  </Box>
                ))}
              </div>
            ))}
        </Paper>
      </div>
    </div>
  );
};
