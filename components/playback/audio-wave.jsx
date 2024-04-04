// AudioWave.jsx
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const initialOptions = {
  container: "#waveform",
  height: 128,
  width: 600,
  waveColor: "#10172a",
  progressColor: "#a2a2a2",
  cursorColor: "#9FB3B7",
  cursorWidth: 2,
  mediaControls: true,
  // Add other initial options here
  url: "/audio.wav",
};

const AudioWave = ({ isInteractive }) => {
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [options, setOptions] = useState(initialOptions);

  useEffect(() => {
    const ws = WaveSurfer.create({
      ...options,
      container: waveformRef.current,
    });
    setWavesurfer(ws);

    ws.on("ready", () => {
      // You can auto-play here if you need
      // ws.play();
    });

    return () => ws.destroy();
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setOptions(options);
    }
  }, [options, wavesurfer]);

  return (
    <div className="waveform-container" style={{ position: "relative" }}>
      <div id="waveform" ref={waveformRef} />
      {!isInteractive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            cursor: "not-allowed",
            zIndex: 10, // Make sure this is above the waveform's z-index
          }}
        />
      )}
    </div>
  );
};

const InputField = ({ optionKey, value, handleChange }) => {
  const handleInput = (e) => {
    const { value, type, checked } = e.target;
    handleChange(optionKey, type === "checkbox" ? checked : value);
  };

  return (
    <div>
      <label>
        {optionKey}:
        <input
          type="text" // Adjust based on the type of input needed
          value={value}
          onChange={handleInput}
        />
      </label>
    </div>
  );
};

export default AudioWave;
