import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Typography, Button } from "@mui/material";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

import Color from "src/theme/colors";

const MicMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();

  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [audioBufferQueue, setAudioBufferQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const onMicMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId) {
      // Convert the audio buffer code to a Float32Array and enqueue it
      const audioData = new Float32Array(data.audioBufferCode);
      setAudioBufferQueue((prevQueue) => [...prevQueue, audioData]);
    }
  };

  const playAudioBuffer = async (buffer) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;

    try {
      const audioBuffer = audioContext.createBuffer(1, buffer.length, audioContext.sampleRate);
      audioBuffer.copyToChannel(buffer, 0);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      source.connect(audioContext.destination);
      source.start();
      source.onended = () => {
        setIsPlaying(false);
        if (audioBufferQueue.length > 0) {
          setAudioBufferQueue((prevQueue) => prevQueue.slice(1));
        }
      };
      sourceRef.current = source;
    } catch (error) {
      console.error("Error playing audio buffer:", error);
    }
  };

  useEffect(() => {
    if (!isPlaying && audioBufferQueue.length > 0) {
      setIsPlaying(true);
      playAudioBuffer(audioBufferQueue[0]);
    }
  }, [audioBufferQueue, isPlaying]);

  const onPlayAudio = async () => {
    const deviceId = device?.deviceId;
    if (deviceId) {
      await onSocketMonitor(SocketIOPublicEvents.mic_monitor, { deviceId });
      socket.on(`mic-shared-${deviceId}`, onMicMonitorResponse);
      return () => {
        socket.off(`mic-shared-${deviceId}`);
      };
    }
  };

  const onCloseAudio = async () => {
    onClose(false);
    setAudioBufferQueue([]);
    if (sourceRef.current) {
      sourceRef.current.stop();
    }
  };

  const onCloseModal = async () => {
    try {
      onClose(false);
      onCloseAudio();
    } catch (error) {
      console.error("Error closing monitor modal:", error);
    }
  };

  return (
    <MonitorViewer
      initialState={{
        width: 320,
        height: 440,
        x: 50,
        y: -120,
        minWidth: 300,
        minHeight: 400,
        maxWidth: 400,
        maxHeight: 500,
      }}
      onClose={onCloseModal}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "5px",
              py: 2,
            }}
          >
            <Grid className="speaker-container">
              <div className={`speaker ${isPlaying ? "playing" : ""}`}></div>
            </Grid>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", width: "100%" }}>
              <Button
                variant="outlined"
                onClick={onCloseAudio}
                sx={{
                  width: "120px",
                  color: Color.text.primary,
                  border: `solid 2px ${Color.text.secondary}`,
                  "&:hover": {
                    border: `solid 2px ${Color.text.secondary}`,
                  },
                }}
              >
                {t("devicesPage.monitors.mic-close")}
              </Button>

              <Button variant="outlined" onClick={onPlayAudio} sx={{ width: "120px" }}>
                {t("devicesPage.monitors.mic-play")}
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default MicMonitorViewer;
