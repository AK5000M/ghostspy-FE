import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const ChatLastConfrim = ({ chatLast, onOtherHelp, onExitHelp, t }) => (
  <>
    {chatLast && (
      <Box
        sx={{
          pt: 2,
          pb: 2,
          mt: 2,
          textAlign: "center",
          backgroundColor: "#11161e",
          borderRadius: "5px",
        }}
      >
        <Typography sx={{ color: "#564FEE", mb: 1 }}>{t("userFeedback.lastMessage")}</Typography>

        <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <Button
            className="mobile-transfer-button"
            color="primary"
            sx={{
              mb: 1,
              textTransform: "none",
              borderRadius: "5px",
              fontWeight: 300,
              fontSize: "14px",
            }}
            onClick={onOtherHelp}
          >
            {t("userFeedback.agreement-action")}
          </Button>

          <Button
            className="mobile-transfer-button"
            color="primary"
            sx={{
              mb: 1,
              textTransform: "none",
              borderRadius: "5px",
              fontWeight: 300,
              fontSize: "14px",
            }}
            onClick={onExitHelp}
          >
            {t("userFeedback.not-action")}
          </Button>
        </Grid>
      </Box>
    )}
  </>
);

export default ChatLastConfrim;
