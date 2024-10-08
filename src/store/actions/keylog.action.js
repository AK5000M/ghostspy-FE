import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getOfflineKeyLogsList = async (data) => {
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
    console.error("get keylogs files action error", error);
  }
};
// export const getOfflineKeyLogsList = async (data) => {
//   try {
//     let token;
//     if (typeof window !== "undefined") {
//       token = localStorage.getItem("token");
//     }
//     if (token) {
//       const response = await axios.get(`${apiUrl}/keylogs/get/${data?.deviceId}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: "json",
//       });
//       return response.data;
//     }
//   } catch (error) {
//     console.error("get keylogs files action error", error);
//   }
// };

export const getOfflineKeylogContents = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      const response = await axios.get(
        `${apiUrl}/keylogs/get/content/${data?.deviceId}/${data?.keylog}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error("get keylogs files action error", error);
  }
};

export const downloadOfflineKeylogsFile = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      const response = await axios.get(
        `${apiUrl}/keylogs/download/${data?.deviceId}/${data?.date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "json",
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error("download keylogs files action error", error);
  }
};

// Remove Keylogs File
export const removeKeyLogsFile = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      const response = await axios.post(`${apiUrl}/keylogs/remove/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "json",
      });

      return response.data;
    }
  } catch (error) {
    console.error("remove keylogs file action error", error);
  }
};
