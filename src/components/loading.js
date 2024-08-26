import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@mui/material";

const Loading = (props) => {
  console.log(props);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#212631",
        zIndex: 9999, // Ensures the loading spinner appears on top
      }}
    >
      <CircularProgress sx={{ color: "#564FEE" }} />
    </Grid>
  );
};

export default Loading;
