import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Get Calls History
export const getAllCallsHistory = async (deviceId) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(`${apiUrl}/calls/getAll/${deviceId}`, {
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
