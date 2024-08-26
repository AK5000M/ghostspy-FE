import React from "react";
import { ProfileContent } from "../../page-content/profile";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Profile = () => {
  return (
    <DashboardLayout>
      <ProfileContent />
    </DashboardLayout>
  );
};

export default Profile;
