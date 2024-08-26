import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Get QR code for device add
export const getQRCode = async (userId) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }
    if (!token) {
      throw new Error("Token not found in local storage");
    }

    const response = await axios.get(`${apiUrl}/user/generate-qr/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response; // Return the data directly
  } catch (error) {
    console.error("Error fetching qrcode");
  }
};
