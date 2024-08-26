import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// send a bot feedback
export const sendBotFeedback = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }
    if (!token) {
      throw new Error("Token not found in local storage");
    }

    const response = await fetch(`${apiUrl}/chat/feedback/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    throw new Error("Error sending message");
  }
};

// send user message
export const sendChatMessage = async (data) => {
  try {
    let token;
    if (typeof window !== "undefined") {
      // Check if running on the client side
      token = localStorage.getItem("token");
    }
    if (!token) {
      throw new Error("Token not found in local storage");
    }

    const response = await fetch(`${apiUrl}/chat/message/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    throw new Error("Error sending message");
  }
};
