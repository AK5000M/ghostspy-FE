import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Avatar } from "@mui/material";
import { PulseLoader } from "react-spinners";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const ChatMessage = ({ message, onBotMessageSeen }) => {
  const [showSpinner, setShowSpinner] = useState(message.sender === "bot");

  useEffect(() => {
    if (message.sender === "bot") {
      const timer = setTimeout(() => {
        setShowSpinner(false);
        onBotMessageSeen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [message.sender, onBotMessageSeen]);

  // Split message into lines
  const lines = message.text.split("\n");

  return (
    <Box sx={{ mb: 2 }}>
      <Grid
        sx={{
          display: "flex",
          flexDirection:
            message.sender === "bot" || message.sender === "admin" ? "row" : "row-reverse",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          {message.sender === "bot" ? (
            <Avatar sx={{ mr: 1, backgroundColor: "#564FEE" }}>
              <SmartToyIcon />
            </Avatar>
          ) : message.sender === "admin" ? (
            <Avatar
              className="chat-avatar"
              sx={{ mr: 1, backgroundColor: "#564FEE" }}
              src="/assets/logos/icone.png"
            />
          ) : (
            <Avatar className="chat-avatar" sx={{ ml: 1, backgroundColor: "#564FEE" }} />
          )}
        </Box>

        {message.sender === "bot" || message.sender === "admin" ? (
          showSpinner ? (
            <Grid
              sx={{
                backgroundColor: "#564FEE2e",
                borderRadius: "0px 15px 15px 15px",
                px: 2,
                py: 1,
                maxWidth: "75%",
                wordWrap: "break-word",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PulseLoader size={6} color={"#564FEE"} />
            </Grid>
          ) : (
            <Grid
              sx={{
                backgroundColor: "#564FEE2e",

                borderRadius: "0px 15px 15px 15px",
                px: 2,
                py: 1,
                maxWidth: "75%",
                wordWrap: "break-word",
              }}
            >
              {lines.map((line, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontSize: "16px",
                    color: "white",
                    fontWeight: 300,
                  }}
                >
                  {line}
                </Typography>
              ))}
            </Grid>
          )
        ) : (
          <Grid
            sx={{
              backgroundColor: "#11161eb5",
              borderRadius: "15px 15px 0 15px",
              py: 1,
              px: 2,
              maxWidth: "70%",
              wordWrap: "break-word",
            }}
          >
            {lines.map((line, index) => (
              <Typography
                key={index}
                sx={{
                  fontSize: "16px",
                  color: "white",
                  fontWeight: 300,
                }}
              >
                {line}
              </Typography>
            ))}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ChatMessage;
