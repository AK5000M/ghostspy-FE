import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const apkBuild = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.post(`${apiUrl}/app/new/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
  } catch (error) {
    console.log("create apk action error", error);
  }
};

export const getApkFile = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (token) {
      const response = await axios.get(`${apiUrl}/app/get-apk/${data}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      return response.data;
    }
  } catch (error) {
    console.log("get apk action error", error);
  }
};
