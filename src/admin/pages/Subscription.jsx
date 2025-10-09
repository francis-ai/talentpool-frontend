// src/pages/admin/ManageSubscriptions.jsx
import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import ManagePlans from "../components/ManageSubscription";
import UserSubscriptions from "../components/UserSubscription";

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className="p-4 bg-white rounded-xl shadow-md"
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function ManageSubscriptions() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box className="w-full">
      {/* Tabs Header */}
      <Box className="bg-gray-100 rounded-t-xl shadow-sm border-b border-gray-300">
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            label={
              <Typography className="font-semibold text-sm md:text-base">
                Manage Plans
              </Typography>
            }
          />
          <Tab
            label={
              <Typography className="font-semibold text-sm md:text-base">
                User Subscriptions
              </Typography>
            }
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box className="mt-4">
        <TabPanel value={tabIndex} index={0}>
          <ManagePlans />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <UserSubscriptions />
        </TabPanel>
      </Box>
    </Box>
  );
}
