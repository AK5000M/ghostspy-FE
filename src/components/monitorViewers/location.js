import React, { useState, useEffect } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import MonitorViewer from "../monitorViewer";

const style = {
  display: "flex",
  justifyContent: "center",
  borderRadius: "8px",
  border: "solid 1px #564FEE",
  background: "#212631",
  padding: "30px 20px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
};

const containerStyle = {
  width: "100%",
  height: "500px",
};

const LocationMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();
  const { onSocketMonitor, onSocketCloseMonitor } = useSocketFunctions();
  const { socket } = useSocket();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("");
  const [hovered, setHovered] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Add your API key here
  });

  useEffect(() => {
    init();
  }, []);

  const onLocationMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId) {
      setLatitude(parseFloat(data?.lat));
      setLongitude(parseFloat(data?.lng));
    }
  };

  const init = async () => {
    const deviceId = device?.deviceId;

    try {
      if (deviceId) {
        await onSocketMonitor(SocketIOPublicEvents.location_monitor, {
          deviceId,
        });

        // Receive the location from server
        socket.on(`location-shared-${deviceId}`, onLocationMonitorResponse);

        return () => {
          socket.off(`location-shared-${deviceId}`);
        };
      }
    } catch (error) {
      console.error("Error monitoring device:", error);
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      getLocationAddress(latitude, longitude);
    }
  }, [latitude, longitude]);

  // Address from location
  const getLocationAddress = async (latitude, longitude) => {
    try {
      if (latitude !== null && longitude !== null) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        if (data.address) {
          const fullAddress =
            (data.address?.house_number ?? "") +
            " " +
            (data.address?.road ?? "") +
            " " +
            (data.address?.suburb ?? "") +
            " " +
            (data.address?.city ?? "") +
            " " +
            (data.address?.postcode ?? "") +
            " " +
            (data.address?.state ?? "") +
            " " +
            (data.address?.country ?? "");
          setAddress(fullAddress);
        } else {
          setAddress("Address not found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Close location
  const onCloseModal = async () => {
    try {
      setLatitude(null);
      setLongitude(null);

      onClose(false);
    } catch (error) {
      console.log("close monitor modal error", error);
    }
  };

  return (
    <MonitorViewer
      initialState={{
        width: 700,
        height: 600,
        x: 50,
        y: -120,
        minWidth: 400,
        minHeight: 300,
        maxWidth: 900,
        maxHeight: 800,
      }}
      onClose={onCloseModal}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography component="h2" style={{ color: "#564FEE", marginBottom: "16px" }}>
            {monitor?.title}
          </Typography>

          <React.Fragment>
            {latitude === null && longitude === null && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  color: "white",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#564FEE",
                    width: "30px",
                    height: "30px",
                    borderRadius: "5px",
                  }}
                >
                  <CircularProgress style={{ color: "white" }} size={20} />
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "5px",
              }}
            >
              {isLoaded && latitude !== null && longitude !== null && (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat: latitude, lng: longitude }}
                  zoom={10}
                >
                  <Marker position={{ lat: latitude, lng: longitude }} />
                </GoogleMap>
              )}
              <div style={{ width: "100%" }}>
                <Typography
                  component="h2"
                  style={{ color: "#564FEE", fontSize: "12px", textAlign: "start" }}
                >
                  {address}
                </Typography>
              </div>
            </div>
          </React.Fragment>
        </div>
      </div>
    </MonitorViewer>
  );
};

export default LocationMonitorViewer;
