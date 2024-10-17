import React from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getMessageList = async (deviceId) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      const response = await axios.get(`${apiUrl}/smslist/get/${deviceId}`, {
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

export const getAllSMSByPhoneNumber = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      const response = await axios.get(
        `${apiUrl}/sms/getAll/${data?.deviceId}/${data?.phoneNumber}`,
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
