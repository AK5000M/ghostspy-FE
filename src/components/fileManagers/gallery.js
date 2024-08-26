import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Typography, CircularProgress } from "@mui/material";

import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocketFunctions } from "src/utils/socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

const GalleryManager = ({ label, device, onClose }) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const { onSocketManager, onGetGalleryEvent } = useSocketFunctions();

  const [getListLoading, setGetListLoading] = useState(false);
  const [getImageLoading, setGetImageLoading] = useState(false);
  const [galleryData, setGalleryData] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    init();
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

  // Close the monitor modal
  const onCloseModal = async () => {
    try {
      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  return (
    <MonitorViewer
      initialState={{
        width: 360,
        height: 720,
        x: 100,
        y: -120,
        minWidth: 180,
        minHeight: 360,
        maxWidth: 360,
        maxHeight: 720,
      }}
      onClose={onCloseModal}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: "100%",
            marginTop: "20px",
          }}
        >
          {/* Left Part: Image Names */}
          <div
            style={{
              flexBasis: "30%",
              overflowY: "auto",
              backgroundColor: "rgb(28, 37, 54)",
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
                  backgroundColor: "#00000069",
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
            ) : (
              <div>
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
                        color: selectedImageId === image.imageId ? "#564FEE" : "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedImage || selectedImage.imageId !== image.imageId) {
                          e.currentTarget.style.backgroundColor = "rgba(29, 191, 26, 0.1)";
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

          {/* Right Part: Display Selected Image */}
          <div
            style={{
              flexBasis: "70%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
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
                  backgroundColor: "#00000069",
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
        </div>
      </div>
    </MonitorViewer>
  );
};

export default GalleryManager;
