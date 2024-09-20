import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Container, Grid, Box, Button } from "@mui/material";
import Languages from "./languageSelect";
import { useRouter } from "next/router";

const Header = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const onLoginPage = () => {
    router.push("/auth/login");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "85px",
        display: "flex",
        alignItems: "center",
        position: "fixed",
        zIndex: "1000",
      }}
    >
      <Container maxWidth={"xl"} sx={{ py: 1 }}>
        <Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Languages />
        </Grid>
      </Container>
    </div>
  );
};

export default Header;
