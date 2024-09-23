import { alpha } from "@mui/material/styles";

const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.3),
    alpha50: alpha(color.main, 0.5),
  };
};

export const neutral = {
  50: "#F8F9FA",
  100: "#F3F4F6",
  200: "#E5E7EB",
  300: "#D2D6DB",
  400: "#9DA4AE",
  500: "#6C737F",
  600: "#4D5761",
  700: "#2F3746",
  800: "#212631",
  900: "#111927",
};

export const theme = {
  lightest: "#F5F7FF",
  light: "#EBEEFE",
  main: "#564FEE",
  // dark: "#1dcf1a",
  darkest: "#312E81",
  contrastText: "#FFFFFF",
  title: "",
  gray1: "#b9bac1",
};

export const background = {
  main: "#0f1535",
  main_gray01: "#0f15357d",
  secondary: "#0f1535",
  purple: "#564FEE",
  purple_light: "#5e57f7",
  purple_gray: "#4841db",
  purple_opacity: "#4841db40",
  green_gray01: "#63A113",
  red_gray01: "#cc0a3b",
  red_gray02: "#e82052",
  yellow_gray01: "#f7971e",
  border: "rgb(255 255 255 / 15%)",
};

export const text = {
  primary: "#e6ecf0",
  secondary: "#a7acb1",
  purple: "#564FEE",
  purple_light: "#5e57f7",
  purple_gray: "#4841db",
  red_gray01: "#ee0979",
  red_gray02: "#e82052",
  yellow_gray01: "#f7971e",
};

export const indigo = withAlphas(theme);

export const success = withAlphas({
  lightest: "#F0FDF9",
  light: "#3FC79A",
  main: "#10B981",
  dark: "#0B815A",
  darkest: "#134E48",
  contrastText: "#FFFFFF",
});

export const info = withAlphas({
  lightest: "#ECFDFF",
  light: "#CFF9FE",
  main: "#06AED4",
  dark: "#0E7090",
  darkest: "#164C63",
  contrastText: "#FFFFFF",
});

export const warning = withAlphas({
  lightest: "#FFFAEB",
  light: "#FEF0C7",
  main: "#F79009",
  dark: "#B54708",
  darkest: "#7A2E0E",
  contrastText: "#FFFFFF",
});

export const error = withAlphas({
  lightest: "#FEF3F2",
  light: "#FEE4E2",
  main: "#F04438",
  dark: "#B42318",
  darkest: "#7A271A",
  contrastText: "#FFFFFF",
});

const Color = {
  theme,
  background,
  text,
};

export default Color;
