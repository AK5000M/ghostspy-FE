import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Get Selected Gallery List
export const getGalleryList = async (deviceId, social) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(`${apiUrl}/gallery-list/get/${deviceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Gallery list:", response.data);
      return response.data;
    }
  } catch (error) {
    console.log("selected device action error", error);
  }
};
