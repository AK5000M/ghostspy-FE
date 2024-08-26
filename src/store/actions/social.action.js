import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Get Selected Social Client List
export const getWhatsappClientList = async (deviceId, social) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(`${apiUrl}/whatsapp-client-list/get/${deviceId}/${social}`, {
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

// Get Selected Social Message List
export const getWhatsappClientMessages = async (user) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const identifier = user?.userName ? user.userName : user.phoneNumber;
      const response = await axios.get(
        `${apiUrl}/whatsapp-client-message/get/${user?.deviceId}/${user?.socialName}/${identifier}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    }
  } catch (error) {
    console.log("selected device action error", error);
  }
};

// Get Selected Instagram Client List
export const getInstagramClientList = async (deviceId, social) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(
        `${apiUrl}/instagram-client-list/get/${deviceId}/${social}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    }
  } catch (error) {
    console.log("selected device action error", error);
  }
};

// Get Selected Social Message List
export const getInstagramClientMessages = async (user) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(
        `${apiUrl}/instagram-client-message/get/${user?.deviceId}/${user?.socialName}/${user?.userName}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.log("selected device action error", error);
  }
};
