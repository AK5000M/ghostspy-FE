import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import Header from "../../components/header";
import Footer from "../../components/footer";

import { sendContactMessage } from "../../store/actions/contact.action";
import Color from "src/theme/colors";
export const ContactContent = () => {
  const { t } = useTranslation();

  const [isChecked, setIsChecked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required(t("validation.fullnameInvalid")),
      email: Yup.string().email("Invalid email").required(t("validation.emailInvalid")),
      subject: Yup.string().required(t("validation.subjectInvalid")),
      message: Yup.string().required(t("validation.messageInvalid")),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (isChecked) {
          const response = await sendContactMessage(values);

          if (response.status == "200") {
            toast.success(t("toast.success.send-message"), {
              position: "bottom-center",
              reverseOrder: false,
              style: {
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "16px",
              },
            });
          } else if (response.status == "500") {
            toast.error(t("toast.error.send-message"), {
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
          resetForm();
        } else {
          setShowMessage(true);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleBlur = (event) => {
    formik.handleBlur(event);
  };

  const onCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(rgb(0 0 0 / 30%), rgb(17 25 39)), url("/assets/images/background/background02.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid sx={{ position: "relative" }}>
        <Header />
      </Grid>

      <Container
        sx={{
          maxWidth: "100%",
          py: "100px",
          width: "100%",
          mt: { md: "50px", xs: "0px" },
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              color: "#DEDEDE",
              fontSize: { md: "40px", xs: "28px" },
              width: "100%",
              fontFamily: "Anton SC, sans-serif",
            }}
          >
            {t("contact.title")}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "white",
              fontSize: "20px",
              width: { md: "55%", xs: "100%" },
            }}
          >
            {t("contact.description")}
          </Typography>
        </Grid>

        <Grid sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 3 }}>
          <Grid
            sx={{
              width: {
                md: "50%",
                xs: "100%",
                backgroundColor: "#000000bf",
                borderRadius: "5px",
              },
            }}
          >
            <form
              noValidate
              onSubmit={formik.handleSubmit}
              style={{ marginTop: 16, padding: "20px" }}
            >
              <Grid container sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <Grid>
                  <TextField
                    error={!!formik.errors.fullName && !!formik.touched.fullName}
                    fullWidth
                    helperText={formik.touched.fullName && formik.errors.fullName}
                    label={t("contact.fullName")}
                    id="fullName"
                    name="fullName"
                    onBlur={handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    inputProps={{ style: { color: "white" } }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    error={!!formik.errors.email && !!formik.touched.email}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label={t("contact.email")}
                    id="email"
                    name="email"
                    onBlur={handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    inputProps={{ style: { color: "white" } }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    error={!!formik.errors.subject && !!formik.touched.subject}
                    fullWidth
                    helperText={formik.touched.subject && formik.errors.subject}
                    label={t("contact.subject")}
                    id="subject"
                    name="subject"
                    onBlur={handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    inputProps={{ style: { color: "white" } }}
                  />
                </Grid>
                <Grid>
                  <TextField
                    error={!!formik.errors.message && !!formik.touched.message}
                    fullWidth
                    rows={4}
                    multiline
                    helperText={formik.touched.message && formik.errors.message}
                    label={t("contact.message")}
                    id="message"
                    name="message"
                    onBlur={handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    inputProps={{ style: { color: "white" } }}
                  />
                </Grid>

                <Grid>
                  {showMessage && (
                    <Typography color="error" sx={{ fontSize: "12px" }}>
                      {t("login.checkError")}
                    </Typography>
                  )}
                  <FormControlLabel
                    control={<Checkbox checked={isChecked} onChange={onCheckboxChange} />}
                    label={t("buildAPKPage.term")}
                    sx={{ color: "#f1f1f1" }}
                  />
                </Grid>

                <Grid>
                  <Button
                    color="primary"
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 2,
                      borderRadius: "5px",
                      "&:hover": {
                        bgcolor: "#24ee21e3",
                      },
                    }}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      t("contact.action")
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};
