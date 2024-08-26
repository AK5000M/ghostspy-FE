import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// send a message
export const sendContactMessage = async (data) => {
  try {
    const response = await fetch(`${apiUrl}/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response; // Return the data directly
  } catch (error) {
    throw new Error("Error sending message");
  }
};
