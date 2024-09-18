import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getKeyLogs = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(`${apiUrl}/keylogs/get/${data?.deviceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "json",
      });

      return response.data;
    }
  } catch (error) {
    console.error("get apk action error", error);
  }
};
