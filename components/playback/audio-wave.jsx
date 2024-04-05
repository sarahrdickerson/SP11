"use client";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioWave = ({ isInteractive, url }) => {
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);

  // Initialize with the default URL, and then update if a new URL is received
  const [audioUrl, setAudioUrl] = useState(url);

  useEffect(() => {
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      height: 128,
      waveColor: "#10172a",
      progressColor: "#a2a2a2",
      cursorColor: "#9FB3B7",
      cursorWidth: 2,
      mediaControls: true,
    });
    setWavesurfer(ws);

    ws.on("ready", () => {
      // ws.play() if you want to auto-play
    });

    // Cleanup on unmount
    return () => ws.destroy();
  }, []);

  useEffect(() => {
    if (wavesurfer && audioUrl) {
      wavesurfer.load(audioUrl);
    }
  }, [audioUrl, wavesurfer]);

  useEffect(() => {
    // When the incoming URL prop changes, update the audioUrl state
    if (url) {
      setAudioUrl(url);
    }
  }, [url]);

  const containerStyles = {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  };

  const overlayStyles = isInteractive
    ? {}
    : {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        cursor: "not-allowed",
        background: "rgba(255, 255, 255, 0.5)",
        zIndex: 10,
      };

  return (
    <div className="waveform-container" style={containerStyles}>
      <div id="waveform" ref={waveformRef} />
      <div style={overlayStyles} />
    </div>
  );
};

export default AudioWave;

// // AudioWave.jsx
// import React, { useEffect, useRef, useState } from "react";
// import WaveSurfer from "wavesurfer.js";

// const initialOptions = {
//   container: "#waveform",
//   height: 128,
//   //   width: 600,
//   waveColor: "#10172a",
//   progressColor: "#a2a2a2",
//   cursorColor: "#9FB3B7",
//   cursorWidth: 2,
//   mediaControls: true,
//   // Add other initial options here
//   url: "/audio.wav",
// };

// const containerStyles = {
//   width: "100%", // Take the full width of the parent
//   maxWidth: "600px", // Optional: if you want to limit the size
//   margin: "0 auto", // Center it if needed
// };

// const overlayStyles = {
//   position: "absolute",
//   top: 0,
//   right: 0,
//   bottom: 0,
//   left: 0,
//   cursor: "not-allowed",
//   background: "rgba(255, 255, 255, 0.5)", // Semi-transparent overlay
//   zIndex: 10,
// };

// const AudioWave = ({ isInteractive }) => {
//   const waveformRef = useRef(null);
//   const [wavesurfer, setWavesurfer] = useState(null);
//   const [options, setOptions] = useState(initialOptions);

//   useEffect(() => {
//     const ws = WaveSurfer.create({
//       ...options,
//       container: waveformRef.current,
//     });
//     setWavesurfer(ws);

//     ws.on("ready", () => {
//       // You can auto-play here if you need
//       // ws.play();
//     });

//     return () => ws.destroy();
//   }, []);

//   useEffect(() => {
//     if (wavesurfer) {
//       wavesurfer.setOptions(options);
//     }
//   }, [options, wavesurfer]);

//   return (
//     <div className="waveform-container" style={containerStyles}>
//       <div id="waveform" ref={waveformRef} />
//       {!isInteractive && <div style={overlayStyles} />}
//     </div>
//   );
// };

// const InputField = ({ optionKey, value, handleChange }) => {
//   const handleInput = (e) => {
//     const { value, type, checked } = e.target;
//     handleChange(optionKey, type === "checkbox" ? checked : value);
//   };

//   return (
//     <div>
//       <label>
//         {optionKey}:
//         <input
//           type="text" // Adjust based on the type of input needed
//           value={value}
//           onChange={handleInput}
//         />
//       </label>
//     </div>
//   );
// };

// export default AudioWave;
