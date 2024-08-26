import React from "react";
import { List, ListItem, ListItemText, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

const Sidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useTranslation();

  return (
    <List>
      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          <ListItem
            button
            selected={selectedCategory.id === category.id}
            onClick={() => onSelectCategory(category)}
          >
            <ListItemText primary={t(`categories.${category.id}.title`)} />
          </ListItem>
          {index < categories.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default Sidebar;
