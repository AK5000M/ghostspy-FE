import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Tooltip } from "@mui/material";
import { useSocketFunctions } from "../../utils/socket";
import { SocketIOPublicEvents } from "../../sections/settings/setting-socket";
import { useSocket } from "../../hooks/use-socket";
import MonitorViewer from "../monitorViewer";

import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";

import Color from "src/theme/colors";

const MicMonitorViewer = ({ monitor, device, onClose }) => {
  const { t } = useTranslation();

  const { onSocketMonitor } = useSocketFunctions();
  const { socket } = useSocket();
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onMicMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId) {
      playAudioAction(data.audioCode);
    }
  };

  const playAudioAction = async (audioBufferData) => {
    // Check if AudioContext already exists
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    // Resume the AudioContext in case it is suspended
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // Assuming the incoming audioBufferData is PCM Int16Array
    const audioData = new Uint16Array(audioBufferData);

    // Create an empty AudioBuffer to hold the audio data
    const buffer = audioContext.createBuffer(1, audioData.length, 16000);
    const channelData = buffer.getChannelData(0);

    // Convert PCM data (Int16) to Float32
    for (let i = 0; i < audioData.length; i++) {
      let l = audioData[i] % 256;
      let h = (audioData[i] - l) / 256;

      if (l >= 128) l = l - 255;
      channelData[i] = (l * 256 + h) / 32768;
    }

    // Create a buffer source and connect it to the destination (speakers)
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    source.connect(audioContext.destination);
    source.start();

    // Save the source for stopping audio later
    sourceRef.current = source;
  };

  // on Play action of Audio
  const onPlayAudio = async () => {
    const deviceId = device?.deviceId;
    setIsPlaying(true);
    if (deviceId) {
      await onSocketMonitor(SocketIOPublicEvents.mic_monitor, { deviceId });
      socket.on(`mic-shared-${deviceId}`, onMicMonitorResponse);
      return () => {
        socket.off(`mic-shared-${deviceId}`);
      };
    }
  };

  // Stop Audio
  const onStopAudio = () => {
    setIsPlaying(false);

    // Stop current audio playback
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }

    const deviceId = device?.deviceId;

    // Stop receiving audio data from the socket
    if (deviceId) {
      socket.off(`mic-shared-${deviceId}`);
    }
  };

  const onCloseModal = () => {
    onClose(false);
    onStopAudio();
  };

  return (
    <MonitorViewer
      initialState={{
        width: 340,
        height: 400,
        x: 50,
        y: -120,
        minWidth: 300,
        minHeight: 340,
        maxWidth: 400,
        maxHeight: 460,
      }}
      type="mic"
      onClose={onCloseModal}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundImage: `linear-gradient(rgb(29 29 195 / 78%), rgb(19 19 20 / 81%)), url(/assets/background/06320.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
            }}
          >
            <Grid className="speaker-container">
              <div className={`speaker ${isPlaying ? "playing" : ""}`}></div>
            </Grid>

            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {isPlaying ? (
                <Tooltip title={t("devicesPage.monitors.mic-stop")} placement="top">
                  <PauseOutlinedIcon
                    onClick={onStopAudio}
                    sx={{
                      width: "120px",
                      color: Color.background.purple,
                      border: `solid 1px ${Color.background.purple}`,
                      fontSize: "46px",
                      borderRadius: "25px",
                      cursor: "pointer",
                      "&:hover": {
                        color: Color.text.purple_light,
                        backgroundColor: Color.background.purple_opacity,
                      },
                    }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={t("devicesPage.monitors.mic-play")} placement="top">
                  <PlayArrowOutlinedIcon
                    onClick={onPlayAudio}
                    sx={{
                      width: "120px",
                      color: Color.background.purple,
                      border: `solid 1px ${Color.background.purple}`,
                      fontSize: "46px",
                      borderRadius: "25px",
                      cursor: "pointer",
                      "&:hover": {
                        color: Color.text.purple_light,
                        backgroundColor: Color.background.purple_opacity,
                      },
                    }}
                  />
                </Tooltip>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </MonitorViewer>
  );
};

export default MicMonitorViewer;
