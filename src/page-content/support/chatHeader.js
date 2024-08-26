import React from "react";
import { Avatar, Grid, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const ChatHeader = ({ handleClose, selectHuman }) => (
  <Grid
    sx={{
      py: 2,
      pl: 1,
      pr: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#111927",
      borderRadius: "10px",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {selectHuman ? (
        <Avatar
          className="chat-avatar"
          sx={{ mr: 1, backgroundColor: "#564FEE" }}
          src="/assets/logos/icone.png"
        />
      ) : (
        <Avatar sx={{ mr: 1, backgroundColor: "#564FEE" }}>
          <SmartToyIcon />
        </Avatar>
      )}{" "}
      <Typography variant="caption" sx={{ fontSize: "18px", color: "#564FEE" }}>
        {selectHuman ? "GHOSTSPY Administrator" : "GHOSTSPY"}
      </Typography>
    </Box>
    <IconButton className="modal-close-icon" edge="end" onClick={handleClose} aria-label="close">
      <CloseIcon />
    </IconButton>
  </Grid>
);

export default ChatHeader;
