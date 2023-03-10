import React, { useState, useRef, useEffect } from "react";
import AudioWaveform from "./AudioWaveform";
import {
  BiPlayCircle,
  BiPauseCircle,
  BiSkipPreviousCircle,
  BiSkipNextCircle,
  BiVolumeFull,
} from "react-icons/bi";

export default function Player({
  currentSong,
  currentIndex,
  nextSong,
  prevSong,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const storedVolume = localStorage.getItem("volume");
  const defaultVolume = 0.2;
  const [isVolumeChanged, setIsVolumeChanged] = useState(!!storedVolume);
  const [volume, setVolume] = useState(
    storedVolume ? parseFloat(storedVolume) : defaultVolume
  );
  const audioRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    localStorage.setItem("volume", volume);
  }, [volume]);

  useEffect(() => {
    const savedVolume = localStorage.getItem("volume");
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }
  }, []);

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    localStorage.setItem("volume", newVolume);
    setIsVolumeChanged(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleAudioEnded = () => {
      nextSong();
    };

    audioElement.addEventListener("ended", handleAudioEnded);

    return () => {
      audioElement.removeEventListener("ended", handleAudioEnded);
    };
  }, [isPlaying, currentIndex, nextSong]);

  const [isLoading, setIsLoading] = useState(true);

  const handleAudioLoaded = (event) => {
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [currentSong]);

  return (
    <div>
      <audio
        ref={audioRef}
        id="audio-element"
        src={currentSong.music}
        volume={volume}
        onLoadedMetadata={handleAudioLoaded}
        onEnded={nextSong}
      ></audio>

      {isLoading && <div className="loading-indicator spinner"></div>}

      <div className="player-card">
        <AudioWaveform />

        <h2 className="activeSong-name">{currentSong.name}</h2>
        <h4 className="activeArtist-name">{currentSong.creator}</h4>

        <div className="control-icon">
          <BiSkipPreviousCircle
            color="white"
            className="icons"
            size={50}
            onClick={prevSong}
          />

          {isPlaying ? (
            <BiPauseCircle
              color="#1100ff"
              className="icons"
              size={70}
              onClick={togglePlay}
            />
          ) : (
            <BiPlayCircle
              color="#1100ff"
              size={70}
              className="icons"
              onClick={togglePlay}
            />
          )}

          <BiSkipNextCircle
            color="white"
            size={50}
            className="icons"
            onClick={nextSong}
          />

          {isVolumeChanged ? (
            <BiVolumeFull color="#1100ff" className="icons-volume" size={30} />
          ) : (
            <BiVolumeFull color="white" className="icons-volume" size={30} />
          )}
          <div className="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              onBlur={() => setIsVolumeChanged(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
