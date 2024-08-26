import React from "react";
import { useTranslation } from "react-i18next";

const Content = ({ selectedCategory }) => {
  const { t } = useTranslation();

  if (!selectedCategory) {
    return <div>{t("general.selectCategory")}</div>;
  }

  return (
    <div>
      <h1>{t(`categories.${selectedCategory.id}.title`)}</h1>
      <ul>
        {t(`categories.${selectedCategory.id}.content`, { returnObjects: true }).map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>
    </div>
  );
};

export default Content;
