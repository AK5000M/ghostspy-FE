import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  Box,
  Grid,
  Typography,
  CardContent,
  Card,
  Button,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
} from "@mui/material";

import { useRouter } from "next/router";

import Header from "../../components/header";
import Footer from "../../components/footer";
import { SolutionSection } from "../home/solution";
import { DirectionSection } from "../home/direction";

import { Fade, Slide } from "react-awesome-reveal";
import Color from "../../theme/colors";

export const PriceContent = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isYearly, setIsYearly] = useState(false);

  const onChangePlanMethod = async (event) => {
    setIsYearly(event.target.value === "yearly");
  };

  const onChangeSelectPlan = async (price) => {
    router.push("/auth/login");
  };

  const plans = [
    {
      name: t("plan.basic.basic"),
      monthlyPrice: "297",
      yearlyPrice: "3100.99",
      explain: t("plan.basic.explain"),
      services: [
        [
          { title: t("plan.basic.services.1.title") },
          {
            index: "1",
            service: t("plan.basic.services.1.1"),
          },
          {
            index: "2",
            service: t("plan.basic.services.1.2"),
          },
        ],
        [
          { title: t("plan.basic.services.2.title") },
          {
            index: "1",
            service: t("plan.basic.services.2.1"),
          },
          {
            index: "2",
            service: t("plan.basic.services.2.2"),
          },
          {
            index: "3",
            service: t("plan.basic.services.2.3"),
          },
        ],
        [
          { title: t("plan.basic.services.3.title") },
          {
            index: "1",
            service: t("plan.basic.services.3.1"),
          },
          {
            index: "2",
            service: t("plan.basic.services.3.2"),
          },
          {
            index: "3",
            service: t("plan.basic.services.3.3"),
          },
          {
            index: "4",
            service: t("plan.basic.services.3.4"),
          },
        ],
        [
          { title: t("plan.basic.services.4.title") },
          {
            index: "1",
            service: t("plan.basic.services.4.1"),
          },
          {
            index: "2",
            service: t("plan.basic.services.4.2"),
          },
          {
            index: "3",
            service: t("plan.basic.services.4.3"),
          },
        ],
      ],
    },
    {
      name: t("plan.premium.premium"),
      monthlyPrice: "397",
      yearlyPrice: "4100.99",
      explain: t("plan.premium.explain"),
      services: [
        [
          { title: t("plan.premium.services.1.title") },
          {
            index: "1",
            service: t("plan.premium.services.1.1"),
          },
          // {
          //   index: "2",
          //   service: t("plan.premium.services.1.2"),
          // },
        ],
        [
          { title: t("plan.premium.services.2.title") },
          {
            index: "1",
            service: t("plan.premium.services.2.1"),
          },
          {
            index: "2",
            service: t("plan.premium.services.2.2"),
          },
          {
            index: "3",
            service: t("plan.premium.services.3.3"),
          },
        ],
        [
          { title: t("plan.premium.services.3.title") },
          {
            index: "1",
            service: t("plan.premium.services.3.1"),
          },
          {
            index: "2",
            service: t("plan.premium.services.3.2"),
          },
          {
            index: "3",
            service: t("plan.premium.services.3.3"),
          },
        ],
        [
          { title: t("plan.premium.services.4.title") },
          {
            index: "0",
            service: t("plan.premium.services.4.0"),
          },
          {
            index: "1",
            service: t("plan.premium.services.4.1"),
          },
          {
            index: "2",
            service: t("plan.premium.services.4.2"),
          },
          {
            index: "3",
            service: t("plan.premium.services.4.3"),
          },
          {
            index: "4",
            service: t("plan.premium.services.4.4"),
          },
          {
            index: "5",
            service: t("plan.premium.services.4.5"),
          },
          {
            index: "6",
            service: t("plan.premium.services.4.6"),
          },
        ],
      ],
    },
  ];

  return (
    <React.Fragment>
      <Box
        sx={{
          backgroundColor: "#111927",
          flexGrow: 1,
        }}
      >
        <Grid sx={{ position: "relative" }}>
          <Header />
        </Grid>

        <Container
          maxWidth={"xl"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "180px",
            paddingLeft: "42px",
          }}
        >
          <Grid
            container
            spacing={3}
            width={"100%"}
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "white",
                px: "15px",
                pt: "3px",
                pb: "5px",
                borderRadius: "50px",
                backgroundColor: "#564FEE30",
                border: "solid 1px #564FEE7a",
                textAlign: "center",
                color: "white",
                marginBottom: "30px",
              }}
            >
              {t("prices.sm-title")}
            </Typography>

            <Fade cascade triggerOnce={true} style={{ display: "flex", justifyContent: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  color: "#DEDEDE",
                  fontSize: { md: "40px", xs: "28px" },
                  width: "100%",
                  fontFamily: "Anton SC, sans-serif",
                  marginBottom: "20px",
                }}
              >
                {t("prices.title")}
              </Typography>
            </Fade>

            <Slide
              direction="up"
              triggerOnce={true}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  fontSize: "20px",
                  color: Color.theme.gray1,
                }}
                dangerouslySetInnerHTML={{ __html: t("prices.description") }}
              />
            </Slide>

            <FormControl component="fieldset" sx={{ my: 4, alignItems: "center" }}>
              <RadioGroup
                aria-label="plan-option"
                name="plan-option"
                value={isYearly ? "yearly" : "monthly"}
                onChange={onChangePlanMethod}
                sx={{ flexDirection: "row", alignItems: "start" }}
              >
                {/* <Typography sx={{ mr: 2, color: "white" }}> {t("plan.option.title")}</Typography> */}
                <FormControlLabel
                  value="monthly"
                  control={<Radio />}
                  label={t("plan.option.month")}
                  sx={{
                    color: isYearly ? "white" : "#564FEE",
                    "&.Mui-checked": {
                      color: "#564FEE",
                    },
                  }}
                />
                <FormControlLabel
                  value="yearly"
                  control={<Radio />}
                  label={t("plan.option.year")}
                  sx={{
                    color: isYearly ? "#564FEE" : "white",
                    "&.Mui-checked": {
                      color: "#564FEE",
                    },
                  }}
                />
              </RadioGroup>
              <div
                className="plan-discount"
                style={{ marginTop: "10px", padding: "0px 15px", textAlign: "center" }}
              >
                13% {t("plan.option.discount")}
              </div>
            </FormControl>

            <Grid container spacing={6}>
              {plans.map((plan, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      border: "2px solid #212631",
                      backgroundColor: "#212631",
                      transition: "background-color 0.3s ease, border 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#212c41",
                        border: "2px solid #564FEE",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h4"
                        sx={{
                          color: "#dedede",
                          mb: 3,
                          textAlign: "center",
                          fontWeight: 600,
                          fontFamily: "Teko, sans-serif",
                        }}
                      >
                        {plan.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          color: Color.theme.gray1,
                          mb: 5,
                          textAlign: "center",
                        }}
                      >
                        {plan.explain}
                      </Typography>

                      <Grid
                        sx={{
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          gap: "10px",
                          mb: 5,
                        }}
                      >
                        <Typography variant="h5" color="text.secondary" sx={{ color: "white" }}>
                          {"R$"} {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ color: Color.theme.gray1 }}
                        >
                          {" / "}
                          {isYearly ? t("plan.option.peryear") : t("plan.option.permonth")}
                        </Typography>
                      </Grid>

                      <Grid sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#564FEE", color: "#212631" }}
                          onClick={() =>
                            handleButtonClick(isYearly ? plan.yearlyPrice : plan.monthlyPrice)
                          }
                        >
                          {t("plan.button")} {plan.name}
                        </Button>
                      </Grid>

                      <ul style={{ padding: 0 }}>
                        {plan.services.map((serviceSet, setIndex) => (
                          <React.Fragment key={setIndex}>
                            {serviceSet.map((service, serviceIndex) => (
                              <li
                                key={serviceIndex}
                                style={{ listStyleType: "none", marginBottom: "15px" }}
                              >
                                {service.title && (
                                  <Typography sx={{ fontSize: "20px", color: "#564FEE" }}>
                                    {service.title}
                                  </Typography>
                                )}
                                <Grid sx={{ display: "flex", alignItems: "center" }}>
                                  <Typography sx={{ fontSize: "16px", color: Color.theme.gray1 }}>
                                    {service.service}
                                  </Typography>
                                </Grid>
                              </li>
                            ))}
                          </React.Fragment>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Container>

        <Container
          maxWidth={"xl"}
          sx={{
            maxWidth: "100%",
            px: 3,
            py: "50px",
            width: "100%",
          }}
        >
          <DirectionSection />
        </Container>

        <Container
          maxWidth={"xl"}
          sx={{
            maxWidth: "100%",
            px: 3,
            py: "50px",
            width: "100%",
          }}
        >
          <SolutionSection />
        </Container>

        <Footer />
      </Box>
    </React.Fragment>
  );
};
