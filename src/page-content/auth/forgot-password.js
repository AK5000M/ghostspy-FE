import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import { Button, Stack, TextField, Typography, Box, Container, Link } from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import Header from "../../components/header";
import Color from "src/theme/colors";

export const ForgotPasswordContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useAuth();
  const [touchedFields, setTouchedFields] = useState({});

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};

      // Email validation
      if (!values.email) {
        errors.email = t("validation.email");
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = t("validation.emailInvalid");
      }

      // Password validation (must be at least 8 characters long)
      if (!values.password) {
        errors.password = t("validation.password");
      } else if (values.password.length < 8) {
        errors.password = t("validation.passwordMinLength");
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      try {
        const result = await auth.ForgotPassword(values);

        if (result.status === "200") {
          toast.success(t("toast.success.reset-password"), {
            position: "bottom-center",
            reverseOrder: false,
            style: {
              borderRadius: "5px",
              padding: "5px 10px",
              fontSize: "16px",
            },
          });

          router.push("/auth/login");
        } else if (result.status === "404") {
          toast.error(t("toast.error.forgot-password-notfind-user"), {
            position: "bottom-center",
            reverseOrder: false,
            duration: 5000,
            style: {
              backgroundColor: Color.background.red_gray01,
              borderRadius: "5px",
              padding: "3px 10px",
            },
          });
        } else if (result.status === "403") {
          toast.error(t("toast.error.not-available-new-password"), {
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
          toast.error(t("toast.error.forgot-password-error"), {
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
      } catch (err) {
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgb(19 19 20 / 50%), rgb(19 19 20 / 60%)), url("/assets/background/f-1240.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          mt: "85px",
          mb: "85px",
        }}
      >
        <Container maxWidth="xl">
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "30px",
                borderRadius: "5px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: Color.text.primary,
                  fontSize: "24px",
                  fontFamily: "Anton SC, sans-serif",
                  textAlign: "left",
                }}
              >
                {t("home.resetPassword")}
              </Typography>

              <div
                style={{
                  width: "450px",
                  backgroundColor: Color.background.main_gray01,
                  border: `solid 1px ${Color.background.border}`,
                  padding: "40px 20px",
                  borderRadius: "5px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    color: "#f1f1f1",
                    fontSize: "20px",
                  }}
                >
                  {t("forgot-password.description")}
                </Typography>
                <form noValidate onSubmit={formik.handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      error={!!formik.errors.email && touchedFields.email}
                      fullWidth
                      helperText={touchedFields.email && formik.errors.email}
                      label={t("home.email")}
                      id="email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      inputProps={{ style: { color: "white" } }}
                    />
                    <TextField
                      error={!!formik.errors.password && touchedFields.password}
                      fullWidth
                      helperText={touchedFields.password && formik.errors.password}
                      label={t("home.newPassword")}
                      id="password"
                      name="password"
                      onBlur={handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      type="password"
                      inputProps={{ style: { color: "white" } }}
                    />
                  </Stack>

                  <Button
                    fullWidth
                    size="large"
                    sx={{
                      mt: 3,
                      borderRadius: "5px",
                      bgcolor: "#564FEE",
                      "&:hover": {
                        bgcolor: "#4841db",
                      },
                    }}
                    type="submit"
                    variant="contained"
                  >
                    {t("forgot-password.continue")}
                  </Button>
                </form>
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
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
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Box>
    </Box>
  );
};
