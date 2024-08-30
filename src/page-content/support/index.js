import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useAuth } from "src/hooks/use-auth";
import { useSocket } from "../../hooks/use-socket";
import { Container, Typography, Fab, Grid, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

import ChatWindow from "./chatWindow";
import ExplainContent from "./explain";

import { sendBotFeedback, sendChatMessage } from "../../store/actions/chat.action";
import Color from "src/theme/colors";

export const SupportContent = () => {
  const { t } = useTranslation();

  const user = useAuth();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [botMessageSeen, setBotMessageSeen] = useState(false);
  const [chatLast, setChatLast] = useState(false);
  const [selectHuman, setSelectHuman] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: t("welcome.message"),
        timestamp: new Date(),
      },
    ]);
    setOptions(t("welcome.options", { returnObjects: true }));
  }, [t]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setMessages([
      {
        sender: "bot",
        text: t("welcome.message"),
        timestamp: new Date(),
      },
    ]);
    setOptions(t("welcome.options", { returnObjects: true }));
    setShowReview(false);
    setOpen(false);
    setBotMessageSeen(false);
    setFeedbackGiven(false);
    setSelectHuman(false);
  };

  const onOptionClick = (option, optionText) => {
    if (option === "human-chat") {
      // Create a room for chatting with human
      const userId = user.user?._id;
      socket.emit(`ChatRoom`, userId);

      setSelectHuman(true);
    } else {
      setSelectHuman(false);
    }
    // Set User message
    const userMessage = {
      sender: "user",
      text: optionText,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // set bot bot message
    const message = t(`${option}.message`);

    const optionsData = Object.entries(t(`${option}.options`, { returnObjects: true })).map(
      ([key, value]) => ({ [key]: value })
    );
    const options = Object.assign({}, ...optionsData);

    if (Object.keys(options).length === 0) {
      setShowReview(true);
    } else {
      setShowReview(false);
    }

    const newMessage = {
      sender: "bot",
      text: message,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setOptions(options);
  };

  // Leave feedback
  const handleFeedbackChange = (event) => {
    const selectedFeedback = event.target.value;
    setFeedback(selectedFeedback);
    const newMessage = {
      sender: "user",
      text: selectedFeedback,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setFeedbackGiven(true);
  };

  // Leave stars
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleBotMessageSeen = (seen) => {
    setBotMessageSeen(false);
    if (seen) {
      setBotMessageSeen(seen);
    }
  };

  const onSelectOption = () => {
    setBotMessageSeen(false);
  };

  // submit feedback
  const onSubmitFeedback = async () => {
    try {
      const values = {
        user: user.user?._id,
        feedback,
        rate: rating,
      };

      const response = await sendBotFeedback(values);

      if (response.status === 200) {
        setChatLast(true);
      } else {
        toast.error(t("toast.error.default"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
        return;
      }
    } catch (error) {
      console.log("submit feedback error", error);
    }
  };

  // Input Message
  const handleSendMessage = async (message) => {
    try {
      const newMessage = {
        sender: "user",
        text: message,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const userId = user.user?._id;

      const values = {
        userId,
        message,
        sender: "user",
      };

      const response = await sendChatMessage(values);
      if (response.status === 200) {
        socket.emit("chatMessage", { userId, message: values });

        socket.on(`chatMessageToUser`, onAdminMessageResponse);

        return () => {
          socket.off("chatMessageToUser", onAdminMessageResponse);
        };
      } else {
        toast.error(t("toast.error.default"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
        return;
      }
    } catch (error) {
      console.log("submit message error", error);
    }
  };

  const onAdminMessageResponse = (data) => {
    const newMessage = {
      sender: data?.sender,
      text: data?.message,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    // Scroll to bottom after adding new message
  };

  const onOtherHelp = () => {
    setMessages([
      {
        sender: "bot",
        text: t("welcome.message"),
        timestamp: new Date(),
      },
    ]);
    setOptions(t("welcome.options", { returnObjects: true }));
    setChatLast(false);
    setFeedbackGiven(false);
  };

  const onExitHelp = () => {
    setChatLast(false);
    handleClose();
  };

  const feedbackOptions = [
    t("feedback.0"),
    t("feedback.1"),
    t("feedback.2"),
    t("feedback.3"),
    t("feedback.4"),
    t("feedback.5"),
    t("feedback.6"),
    t("feedback.7"),
    t("feedback.8"),
    t("feedback.9"),
    t("feedback.10"),
    t("feedback.11"),
  ];

  return (
    <React.Fragment>
      <Container maxWidth="full" sx={{ py: 3 }}>
        <Grid sx={{ p: 5 }}>
          <ExplainContent />
        </Grid>
        <Fab
          aria-label="chat"
          onClick={handleClickOpen}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            bgcolor: "#564FEE",
            borderRadius: "5px",
            color: "white",
            "&:hover": {
              bgcolor: "#4841db",
            },
          }}
        >
          <ChatIcon />
        </Fab>
      </Container>

      <ChatWindow
        open={open}
        handleClose={handleClose}
        messages={messages}
        options={options}
        onOptionClick={onOptionClick}
        showReview={showReview}
        feedbackGiven={feedbackGiven}
        feedback={feedback}
        feedbackOptions={feedbackOptions}
        handleFeedbackChange={handleFeedbackChange}
        rating={rating}
        handleRatingChange={handleRatingChange}
        onSubmitFeedback={onSubmitFeedback}
        onSelectOption={onSelectOption}
        handleBotMessageSeen={handleBotMessageSeen}
        botMessageSeen={botMessageSeen}
        chatLast={chatLast}
        onOtherHelp={onOtherHelp}
        onExitHelp={onExitHelp}
        selectHuman={selectHuman}
        sendMessage={handleSendMessage}
        t={t}
      />
    </React.Fragment>
  );
};
