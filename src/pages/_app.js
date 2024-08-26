import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import { useRouter } from "next/router";
import Head from "next/head";

import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline, CircularProgress, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import SocketContextProvider from "../hooks/use-socket";
import "simplebar-react/dist/simplebar.min.css";
import i18n from "../../i18n";
import "../styles/global.scss";

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => (
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
      zIndex: 9999,
    }}
  >
    <CircularProgress sx={{ color: "#564FEE" }} />
  </Grid>
);

const GHOSTSPYApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const path = router.asPath;
  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  useEffect(() => {
    setLoading(true);
    if (path === "/") {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, [path]);

  return (
    <React.Fragment>
      <Head>
        <title>GHOSTSPY</title>
      </Head>
      <CacheProvider value={emotionCache}>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            bottom: 50,
            style: { padding: "16px", color: "white" },
            success: {
              iconTheme: { primary: "white", secondary: "#38A169" },
              style: { background: "#38A169" },
            },
            error: {
              iconTheme: { primary: "white", secondary: "#E53E3E" },
              style: { background: "#E53E3E" },
            },
            loading: {
              iconTheme: { primary: "black", secondary: "white" },
              style: { background: "white", color: "black" },
            },
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthConsumer>
                {(auth) =>
                  loading ? (
                    <SplashScreen />
                  ) : (
                    getLayout(
                      <I18nextProvider i18n={i18n}>
                        <SocketContextProvider>
                          <Component {...pageProps} />
                        </SocketContextProvider>
                      </I18nextProvider>
                    )
                  )
                }
              </AuthConsumer>
            </ThemeProvider>
          </AuthProvider>
        </LocalizationProvider>
      </CacheProvider>
    </React.Fragment>
  );
};

export default GHOSTSPYApp;
