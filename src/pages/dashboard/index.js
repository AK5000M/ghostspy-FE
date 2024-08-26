import React from "react";
import { DashboardContent } from "../../page-content/dashboard/index";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
