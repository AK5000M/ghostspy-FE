import React from "react";
import { DeviceContent } from "../../page-content/devices/index";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Devices = () => {
  return (
    <DashboardLayout>
      <DeviceContent />
    </DashboardLayout>
  );
};

export default Devices;
