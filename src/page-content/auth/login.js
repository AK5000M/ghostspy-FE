import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import {
  Button,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Container,
  Link,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import Color from "src/theme/colors";
import Header from "../../components/header";

import { useAuth } from "src/hooks/use-auth";

export const LoginContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    // Validation for Errors
    validate: (values) => {
      const errors = {};
      // Check if email is empty
      if (!values.email) {
        errors.email = t("validation.email");
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = t("validation.emailInvalid");
      }
      if (!values.password && values.password.length < 8) {
        errors.password = t("validation.passwordMinLength");
      }
      return errors;
    },

    // Submit SignIn function
    onSubmit: async (values, helpers) => {
      try {
        // const ip = await fetchPublicIP();

        if (isChecked) {
          const signInData = {
            ...values,
            role: "user",
            // ip,
          };

          setLoading(true);

          const result = await auth.SignIn(signInData);
          console.log("auth data=>", result);
          // Check response status
          if (result.status === "201") {
            // Success
            localStorage.setItem("token", result.data.token);

            toast.success(t("toast.success.login"), {
              position: "bottom-center",
              reverseOrder: false,
              duration: 5000,
              style: {
                backgroundColor: Color.background.green_gray01,
                borderRadius: "5px",
                padding: "3px 10px",
                minWidth: "250px",
              },
            });

            router.push("/dashboard");
          } else if (result.status === "400") {
            setLoading(false);
            toast.error(t("toast.error.login"), {
              position: "bottom-center",
              reverseOrder: false,
              duration: 5000,
              style: {
                backgroundColor: Color.background.red_gray01,
                borderRadius: "5px",
                padding: "3px 10px",
              },
            });
          } else if (result.error_code === 6) {
            setLoading(false);
            helpers.setErrors({ submit: t("toast.error.access-limitation") });
          } else if (result.status === "403") {
            setLoading(false);
            toast.error(t("toast.error.license-expire"), {
              position: "bottom-center",
              reverseOrder: false,
              duration: 5000,
              style: {
                backgroundColor: Color.background.red_gray01,
                borderRadius: "5px",
                padding: "3px 10px",
              },
            });
          } else {
            setLoading(false);
          }
        } else {
          setShowMessage(true);
        }
      } catch (err) {
        setLoading(false);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        toast.error(t("toast.error.server-error"), {
          position: "bottom-center",
          reverseOrder: false,
          duration: 5000,
          style: {
            backgroundColor: Color.background.red_gray01,
            borderRadius: "5px",
            padding: "3px 10px",
          },
        });
      }
    },
  });

  const onCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Helper function to fetch public IP address
  const fetchPublicIP = async () => {
    try {
      // const response = await fetch("https://api.ipify.org?format=json");
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return null; // Return null if there is an error
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgb(29 29 195 / 78%), rgb(19 19 20 / 81%)), url(/assets/background/6020105.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {" "}
      <Header />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          mt: "85px",
          mb: "85px",
        }}
      >
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "center" },
              justifyContent: "space-between",
              backgroundColor: Color.background.main_gray01,
              borderRadius: "5px",
              border: `solid 1px ${Color.background.purple}`,
              height: "550px",
            }}
          >
            {/* First Part - 5/10 */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "50%" },
                height: "100%",
                display: { md: "flex", xs: "none" },
                alignItems: "flex-end",
              }}
            >
              <video
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
                src="/assets/background/video_ghostspy.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </Box>

            {/* Second Part - 5/10 */}
            <Box
              sx={{
                width: "100%",
                flexBasis: { md: "50%", xs: "100%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: { xs: 4, md: 0 },
              }}
            >
              <img
                src="/assets/logos/spy/ghostspy-logo-_2_.webp"
                alt="Logo"
                style={{ width: "180px", marginBottom: "20px" }}
              />
              <Box
                sx={{
                  px: { md: "20px", xs: "10px" },
                  py: { md: "10px", xs: "30px" },
                  width: "100%",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    color: Color.text.primary,
                    fontSize: "24px",
                    fontFamily: "Anton SC, sans-serif",
                    textAlign: "center",
                  }}
                >
                  {t("login.sigin-title")}
                </Typography>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      className="text-field"
                      error={!!formik.errors.email}
                      fullWidth
                      helperText={formik.errors.email}
                      label={t("home.email")}
                      id="email"
                      name="email"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      inputProps={{ style: { color: "white" } }}
                    />
                    <TextField
                      className="text-field"
                      error={!!formik.errors.password}
                      fullWidth
                      helperText={formik.errors.password}
                      label={t("home.password")}
                      name="password"
                      id="password"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="password"
                      inputProps={{ style: { color: "white" } }}
                    />
                  </Stack>
                  {formik.errors.submit && (
                    <Typography color="error" sx={{ mt: 3 }} variant="body2">
                      {formik.errors.submit}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                    <Link
                      href="/auth/forgot-password"
                      variant="body2"
                      sx={{
                        color: Color.text.purple,
                        textDecorationLine: "none",
                        "&:hover": {
                          color: Color.text.purple_gray,
                        },
                      }}
                    >
                      {t("home.forgotPassword")}
                    </Link>
                  </Box>
                  <Box sx={{ marginTop: "16px" }}>
                    {showMessage && !isChecked && (
                      <Typography color="error" sx={{ mt: 3, fontSize: "12px" }}>
                        {t("login.checkError")}
                      </Typography>
                    )}
                    <FormControlLabel
                      control={<Checkbox checked={isChecked} onChange={onCheckboxChange} />}
                      label={t("buildAPKPage.term")}
                      sx={{ color: Color.text.primary }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: Color.background.purple,
                      borderRadius: "5px",
                      "&:hover": {
                        bgcolor: Color.background.purple_gray,
                      },
                    }}
                    disabled={loading ? true : false}
                  >
                    {loading ? <CircularProgress size={28} /> : t("home.continue")}
                  </Button>
                </form>
                <Box
                  sx={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href="/auth/register"
                    variant="body2"
                    sx={{
                      mt: 2,
                      fontSize: "16px",
                      color: Color.text.purple,
                      textDecorationLine: "none",
                      "&:hover": {
                        color: Color.text.purple_gray,
                      },
                    }}
                  >
                    {t("home.register")}
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
