import React from "react";
import AudioSpectrum from "react-audio-spectrum";

function AudioWaveform() {
  return (
    <div className="audio-waveform">
      <AudioSpectrum
        id="audio-canvas"
        height={110}
        width={442}
        audioId={"audio-element"}
        capColor={"#ffffff"}
        capHeight={2}
        meterWidth={6}
        meterCount={442}
        meterColor={[
          { stop: 0, color: "#002266" },
          { stop: 0.5, color: "#0044cc" },
          { stop: 1, color: "#001d57" },
        ]}
        gap={7}
      />
    </div>
  );
}

export default AudioWaveform;
