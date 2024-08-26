import { Box, Grid, Typography, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Fade } from "react-awesome-reveal";
import React from "react";
import Color from "../../theme/colors";

export const FunctionSection = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const products = [
    {
      image: "/assets/products/monitors.webp",
      title: t("product.monitor-title"),
      service: t("product.monitor-service"),
      description: t("product.monitor-description"),
    },
    {
      image: "/assets/products/managers.webp",
      title: t("product.manager-title"),
      service: t("product.manager-service"),
      description: t("product.manager-description"),
    },
    {
      image: "/assets/products/social.webp",
      title: t("product.social-title"),
      service: t("product.social-service"),
      description: t("product.social-description"),
    },
    {
      image: "/assets/products/extra.webp",
      title: t("product.extra-title"),
      service: t("product.extra-service"),
      description: t("product.extra-description"),
    },
  ];

  return (
    <Container>
      <Grid container spacing={10}>
        {products.map((product, index) => (
          <Grid item xs={12} key={index}>
            <Fade>
              <Grid container spacing={3} alignItems="start">
                {index % 2 === 0 ? (
                  <React.Fragment>
                    <Grid item xs={12} sm={6}>
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ padding: 2 }}>
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            color: Color.theme.light,
                            marginBottom: 1,
                            fontWeight: 600,
                            fontFamily: "Teko, sans-serif",
                          }}
                        >
                          {product.title}
                        </Typography>
                      </Box>
                      <Box sx={{ padding: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ color: Color.theme.gray1, marginBottom: "10px" }}
                        >
                          {product.service}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: Color.theme.gray1, marginBottom: "10px" }}
                        >
                          {product.description}
                        </Typography>
                      </Box>
                    </Grid>
                  </React.Fragment>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ padding: 2 }}>
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            color: Color.theme.light,
                            marginBottom: 1,
                            fontWeight: 600,
                            fontFamily: "Teko, sans-serif",
                          }}
                        >
                          {product.title}
                        </Typography>
                      </Box>
                      <Box sx={{ padding: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ color: Color.theme.gray1, marginBottom: "10px" }}
                        >
                          {product.service}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: Color.theme.gray1, marginBottom: "10px" }}
                        >
                          {product.description}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{
                          width: "100%",
                          height: "auto",
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
