import React from "react";
import { VideoContent } from "../../page-content/video";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Videos = () => {
  return (
    <DashboardLayout>
      <VideoContent />
    </DashboardLayout>
  );
};

export default Videos;
