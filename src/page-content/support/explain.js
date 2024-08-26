import React, { useState } from "react";
import { Typography, Box, Grid, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

const ExplainContent = () => {
  const { t } = useTranslation();
  const categories = t("categories", { returnObjects: true });
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(categories)[0]);

  const onSelectCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
  };

  return (
    <Grid container spacing={3} sx={{ display: "flex", gap: "40px" }}>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xl: "fit-content", sm: "100%", xs: "100%" },
        }}
      >
        <Typography variant="h6" sx={{ color: "white", fontWeight: 400 }}>
          Categories in this section
        </Typography>
        <List sx={{ py: 2, borderRadius: "5px", width: "100%" }}>
          {Object.keys(categories).map((categoryKey, index) => (
            <React.Fragment key={categoryKey}>
              <ListItem
                className="category-list"
                button
                selected={selectedCategory === categoryKey}
                onClick={() => onSelectCategory(categoryKey)}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#564FEE30",
                  },
                }}
              >
                <ListItemText
                  className="category-option"
                  primary={t(`categories.${categoryKey}.title`)}
                />
              </ListItem>
              {index < Object.keys(categories).length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Grid>

      <Grid sx={{ flex: { xl: 1, md: "initial" } }}>
        <Typography variant="h5" sx={{ color: "white", mb: 3, fontWeight: 400 }}>
          {t(`categories.${selectedCategory}.title`)}
        </Typography>
        <Box component="div">
          <Typography
            component="ul"
            variant="body1"
            sx={{ listStyleType: "none", padding: 0, color: "#f1f1f1" }}
          >
            {t(`categories.${selectedCategory}.content`, { returnObjects: true }).map(
              (item, index) => (
                <Typography
                  component="li"
                  key={index}
                  variant="body1"
                  sx={{ fontWeight: 300, fontSize: "15px", lineHeight: "35px" }}
                >
                  {item}
                </Typography>
              )
            )}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ExplainContent;
