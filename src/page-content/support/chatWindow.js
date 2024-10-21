import React, { useState, useRef, useEffect } from "react";
import { Paper, Grid, Box, TextField, IconButton, Typography } from "@mui/material";
import ChatHeader from "./chatHeader";
import ChatMessage from "./chatMessage";
import ChatOptions from "./chatOptions";
import FeedbackForm from "./feedbackForm";
import ChatLastConfrim from "./chatLast";

import SendIcon from "@mui/icons-material/Send";
import Color from "src/theme/colors";

const ChatWindow = ({
  open,
  handleClose,
  messages,
  options,
  onOptionClick,
  showReview,
  feedbackGiven,
  feedback,
  feedbackOptions,
  handleFeedbackChange,
  rating,
  handleRatingChange,
  onSubmitFeedback,
  onSelectOption,
  handleBotMessageSeen,
  botMessageSeen,
  chatLast,
  onOtherHelp,
  onExitHelp,
  selectHuman,
  sendMessage,
  t,
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const gridRef = useRef(null);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (gridRef.current) {
      gridRef.current.scrollTop = gridRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {open && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            height: 600,
            width: {
              xs: "282px",
              sm: "400px",
            },
            display: "flex",
            flexDirection: "column",
            borderRadius: "10px",
            boxShadow: 3,
            zIndex: 1300,
            backgroundColor: Color.background.main,
          }}
        >
          <ChatHeader handleClose={handleClose} selectHuman={selectHuman} />

          <Grid
            ref={gridRef}
            sx={{
              backgroundColor: Color.background.secondary,
              height: "100%",
              px: 1,
              py: 2,
              flex: 1,
              position: "relative",
              overflowY: "auto",
              borderBottomRightRadius: selectHuman ? "0px" : "10px",
              borderBottomLeftRadius: selectHuman ? "0px" : "10px",
            }}
          >
            {messages &&
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  onBotMessageSeen={handleBotMessageSeen}
                />
              ))}
            {botMessageSeen && (
              <ChatOptions
                options={options}
                onOptionClick={onOptionClick}
                onSelectOption={onSelectOption}
              />
            )}
            {Object.keys(options).length === 0 && botMessageSeen && !selectHuman && (
              <FeedbackForm
                showReview={showReview}
                feedbackGiven={feedbackGiven}
                feedback={feedback}
                feedbackOptions={feedbackOptions}
                handleFeedbackChange={handleFeedbackChange}
                rating={rating}
                handleRatingChange={handleRatingChange}
                onSubmitFeedback={onSubmitFeedback}
                t={t}
              />
            )}
            <ChatLastConfrim
              t={t}
              chatLast={chatLast}
              onOtherHelp={onOtherHelp}
              onExitHelp={onExitHelp}
            />
          </Grid>
          {selectHuman && (
            <Grid
              sx={{
                px: 2,
                py: 1,
                backgroundColor: Color.background.purple_opacity,

                borderBottomRightRadius: selectHuman ? "10px" : "0px",
                borderBottomLeftRadius: selectHuman ? "10px" : "0px",
              }}
            >
              <Box
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px",
                  backgroundColor: Color.background.main,
                  p: "3px",
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <TextField
                  inputRef={inputRef}
                  className="chatting-message"
                  variant="outlined"
                  fullWidth
                  multiline
                  maxRows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("userFeedback.placeholder-message")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{ color: "white" }}
                />
                <IconButton
                  className="modal-close-icon"
                  type="submit"
                  color="primary"
                  sx={{ p: 1 }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "white",
                  fontWeight: 300,
                  textAlign: "end",
                  color: "#f1f1f1",
                }}
              >
                {t("userFeedback.add-line")}
              </Typography>
            </Grid>
          )}
        </Paper>
      )}
    </>
  );
};

export default ChatWindow;
