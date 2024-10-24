import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import { Button, Stack, TextField, Typography, Box, Container, Link } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import Header from "../../components/header";
import { useAuth } from "src/hooks/use-auth";
import Color from "src/theme/colors";

export const RegisterContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const formik = useFormik({
    initialValues: {
      username: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    validate: (values) => {
      const errors = {};
      // Check if username is empty
      if (!values.username) {
        errors.username = t("validation.username");
      } else if (!/^[a-zA-Z\s]+$/i.test(values.username)) {
        errors.username = t("validation.usernameInvalid");
      }
      // Check if email is empty
      if (!values.email) {
        errors.email = t("validation.email");
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = t("validation.emailInvalid");
      }
      if (!values.password) {
        errors.password = t("validation.password");
      } else if (values.password.length < 8) {
        errors.password = t("validation.passwordMinLength");
      }
      if (!values.confirmpassword) {
        errors.confirmpassword = t("validation.password");
      } else if (values.confirmpassword.length < 8) {
        errors.confirmpassword = t("validation.passwordMinLength");
      }
      return errors;
    },

    onSubmit: async (values, helpers) => {
      setLoading(true);
      try {
        const ip = await fetchPublicIP();
        if (values.password === values.confirmpassword) {
          const signupData = {
            ...values,
            ip,
          };
          const result = await auth.SignUp(signupData);

          if (result.status === "400") {
            toast.error(t("toast.error.register"), {
              position: "bottom-center",
              reverseOrder: false,
              duration: 5000,

              style: {
                backgroundColor: Color.background.red_gray01,
                borderRadius: "5px",
                padding: "3px 10px",
              },
            });
            setLoading(false);
          } else if (result.status === "201") {
            localStorage.setItem("token", result.data.token);

            toast.success(t("toast.success.register"), {
              position: "bottom-center",
              reverseOrder: false,
              duration: 5000,
              style: {
                backgroundColor: Color.background.green_gray01,
                borderRadius: "5px",
                padding: "3px 10px",
              },
            });
            router.push("/dashboard");
          }
        } else {
          setLoading(false);
          toast.error(t("toast.error.passwordnotsame"), {
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
      } catch (err) {
        setLoading(false);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleBlur = (event) => {
    formik.handleBlur(event);
    setTouchedFields({
      ...touchedFields,
      [event.target.name]: true,
    });
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
      return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: { md: "100vh", xs: "auto" },
        backgroundImage: `linear-gradient(rgb(19 19 20 / 71%), rgb(29 29 195 / 85%)), url(/assets/background/6057272.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
              border: `solid 1px ${Color.background.purple}`,
              borderRadius: "5px",
              height: "720px",
            }}
          >
            {/* First Part - 5/10 */}
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
                  {t("register.sigup-title")}
                </Typography>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      className="text-field"
                      error={!!formik.errors.username && touchedFields.username}
                      fullWidth
                      helperText={touchedFields.username && formik.errors.username}
                      label={t("home.username")}
                      id="username"
                      name="username"
                      onBlur={handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      inputProps={{ style: { color: "white" } }}
                    />

                    <TextField
                      className="text-field"
                      error={!!formik.errors.email && touchedFields.email}
                      fullWidth
                      helperText={touchedFields.email && formik.errors.email}
                      label={t("home.email")}
                      id="email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={formik.handleChange}
                      type="text"
                      inputProps={{ style: { color: "white" } }}
                    />
                    <TextField
                      className="text-field"
                      error={!!formik.errors.password && touchedFields.password}
                      fullWidth
                      helperText={touchedFields.password && formik.errors.password}
                      label={t("home.password")}
                      name="password"
                      id="password"
                      onBlur={handleBlur}
                      onChange={formik.handleChange}
                      type="password"
                      inputProps={{ style: { color: "white" } }}
                    />
                    <TextField
                      className="text-field"
                      error={!!formik.errors.confirmpassword && touchedFields.confirmpassword}
                      fullWidth
                      helperText={touchedFields.confirmpassword && formik.errors.confirmpassword}
                      label={t("home.confirmpassword")}
                      name="confirmpassword"
                      id="confirmpassword"
                      onBlur={handleBlur}
                      onChange={formik.handleChange}
                      type="password"
                      inputProps={{ style: { color: "white" } }}
                    />
                  </Stack>

                  <Typography
                    color="error"
                    sx={{ mt: 3, color: "white", fontSize: "14px", textAlign: "center" }}
                  >
                    {t("register.accept")}
                    {"  "}
                    <Link href="/term-condition" sx={{ color: "#564FEE" }}>
                      {t("buildAPKPage.term")}
                    </Link>
                  </Typography>

                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: Color.background.purple,
                      borderRadius: "5px",
                      "&:hover": {
                        bgcolor: Color.background.purple_gray,
                      },
                    }}
                    disabled={loading ? true : false}
                  >
                    {loading ? <CircularProgress size={28} /> : t("register.register")}
                  </Button>
                </form>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Link
                    href="/auth/login"
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
                    {t("home.login")}
                  </Link>
                </Box>
              </Box>
            </Box>

            {/* Second Part - 5/10 */}
            <Box
              sx={{
                flexBasis: { xs: "100%", md: "50%" },

                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
                height: "100%",
                display: { md: "flex", xs: "none" },
                alignItems: "flex-end",
              }}
            >
              {" "}
              <video
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
                src="/assets/background/video2_ghostspy.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
