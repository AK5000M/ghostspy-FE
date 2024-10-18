import React, { useState, useEffect, useRef } from "react";
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
  const [audioBufferQueue, setAudioBufferQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const onMicMonitorResponse = (data) => {
    const deviceId = device?.deviceId;
    if (deviceId === data.deviceId) {
      // Convert the audio buffer code to a Float32Array and enqueue it
      const audioData = new Float32Array(data.byteCode);
      console.log("audio data=>", { audioData });
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

  // on Play action of Audio
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

  // on Stop action of Audio
  const onStopAudio = () => {
    setIsPlaying(false);
    setAudioBufferQueue([]);
    if (sourceRef.current) {
      sourceRef.current.stop();
    }
  };

  // const onCloseAudio = async () => {
  //   onClose(false);
  //   setAudioBufferQueue([]);
  //   if (sourceRef.current) {
  //     sourceRef.current.stop();
  //   }
  // };

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
