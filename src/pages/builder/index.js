import React from "react";
import { BuilderAPKContent } from "../../page-content/builder/index";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const BuilderAPK = () => {
  return (
    <DashboardLayout>
      <BuilderAPKContent />
    </DashboardLayout>
  );
};

export default BuilderAPK;
