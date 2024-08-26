import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQAccordion = ({ faqItems }) => {
  const { t } = useTranslation();
  return (
    <Box>
      {faqItems.map((item, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: "#111927",
            mb: 2,
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "#1c2638",
            },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ color: "white", fontSize: "18px", py: 1 }}>
              {t(item.question)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ color: "#f1f1f1", fontWeight: 300 }}>{t(item.answer)}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQAccordion;
