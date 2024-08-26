import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./public/locales/en/common.json";
import esTranslations from "./public/locales/es/common.json";
import prTranslations from "./public/locales/pr/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    es: {
      translation: esTranslations,
    },
    pr: {
      translation: prTranslations,
    },
  },
  lng: "pr", // Default language
  fallbackLng: "pr",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
