import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Get Devices List by User Id
export const getDevicesList = async (userId) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (!token) {
      throw new Error("Token not found in local storage");
    }
    const response = await axios.get(`${apiUrl}/device/get/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the data directly
  } catch (error) {
    throw new Error("Error fetching devices");
  }
};

// Get Selected Device information
export const getSelectedDeviceInformation = async (deviceId) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(`${apiUrl}/device/getInfo/${deviceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
  } catch (error) {
    console.log("selected device action error", error);
  }
};

// Update Device Name
export const updateDeviceName = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.post(`${apiUrl}/device/update/deviceName`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
  } catch (error) {
    console.log("remove device action error", error);
  }
};

// Remove Device
export const removeDevice = async (deviceId) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.delete(`${apiUrl}/device/delete/${deviceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
  } catch (error) {
    console.log("remove device action error", error);
  }
};
