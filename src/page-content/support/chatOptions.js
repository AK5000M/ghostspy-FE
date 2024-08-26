import React from "react";
import { Box, Button } from "@mui/material";

const ChatOptions = ({ options, onOptionClick, onSelectOption }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "5px",
      ml: 4,
      mt: 2,
      p: 2,
    }}
  >
    {Object.keys(options).map((key, index) => (
      <Button
        className="mobile-transfer-button"
        key={index}
        color="primary"
        onClick={() => {
          onOptionClick(key, options[key]);
          onSelectOption();
        }}
        sx={{
          mb: 1,
          textTransform: "none",
          borderRadius: "5px",
          fontWeight: 300,
          fontSize: "14px",
        }}
      >
        {options[key]}
      </Button>
    ))}
  </Box>
);

export default ChatOptions;
