import React from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";

const CustomRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#564FEE",
  },
  "& .MuiRating-iconEmpty": {
    color: "white",
  },
  "& .MuiRating-iconHover": {
    color: "#564FEE",
  },
});

const FeedbackForm = ({
  showReview,
  feedbackGiven,
  feedback,
  feedbackOptions,
  handleFeedbackChange,
  rating,
  handleRatingChange,
  onSubmitFeedback,
  t,
}) => (
  <>
    {showReview && !feedbackGiven && (
      <Box
        sx={{
          mt: 2,
          textAlign: "center",
          pt: 2,
          pb: 2,
          px: 1,
          textAlign: "center",
          backgroundColor: "#111927",
          borderRadius: "5px",
        }}
      >
        <Typography sx={{ color: "white", mb: 2 }}>{t("userFeedback.description")}</Typography>
        <FormControl variant="outlined" sx={{ minWidth: 120, width: "85%", mb: 2 }}>
          <InputLabel id="feedback-label">{t("Select")}</InputLabel>
          <Select
            labelId="feedback-label"
            id="feedback-select"
            value={feedback}
            onChange={handleFeedbackChange}
            label={t("Feedback")}
            fullWidth
            className="feedback-selection"
          >
            {feedbackOptions.map((feedbackOption, index) => (
              <MenuItem key={index} value={feedbackOption}>
                {t(feedbackOption)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    )}
    {feedbackGiven && (
      <Box
        sx={{
          pt: 2,
          pb: 2,
          mt: 2,
          textAlign: "center",
          backgroundColor: "#111927",
          borderRadius: "5px",
        }}
      >
        <Typography sx={{ color: "#564FEE", mb: 1 }}>{t("userFeedback.rate-title")}</Typography>
        <CustomRating
          name="user-rating"
          value={rating}
          onChange={handleRatingChange}
          sx={{ color: "#564FEE" }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: "none", borderRadius: "5px", width: "75%" }}
          onClick={onSubmitFeedback}
        >
          {t("userFeedback.action")}
        </Button>
      </Box>
    )}
  </>
);

export default FeedbackForm;
