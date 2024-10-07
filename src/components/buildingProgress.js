import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: "10px",
  },
  progressBar: {
    width: "100%",
    height: "20px",
    borderRadius: "50px",
  },
  progressText: {
    fontWeight: "bold",
    color: "#564FEE",
  },
});

export const LinearDeterminate = ({ loading }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;

    if (loading) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            return 100;
          }
          const diff = Math.random() * 1;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);
    } else if (!loading && progress < 100) {
      // Reset progress when loading is false, or handle differently if needed
      setProgress(0);
    }

    return () => {
      clearInterval(timer); // Clean up the timer
    };
  }, [loading]);

  return (
    <div className={classes.root}>
      <Typography variant="body1" className={classes.progressText}>
        {`${Math.round(progress)}% ${t("buildAPKPage.complete")}`}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        className={classes.progressBar}
        color="secondary"
      />
    </div>
  );
};
