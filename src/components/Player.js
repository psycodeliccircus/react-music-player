import React, { useState, useRef, useEffect } from "react";
import AudioWaveform from "./AudioWaveform";
import {
  BiPlayCircle,
  BiPauseCircle,
  BiSkipPreviousCircle,
  BiSkipNextCircle,
  BiVolumeFull,
} from "react-icons/bi";

function useAudioPlayer(currentSong, currentIndex, nextSong, prevSong) {
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

  return {
    isPlaying,
    togglePlay,
    volume,
    handleVolumeChange,
    isVolumeChanged,
    audioRef,
    isLoading,
    handleAudioLoaded,
  };
}

export default function Player({
  currentSong,
  currentIndex,
  nextSong,
  prevSong,
}) {
  const {
    isPlaying,
    togglePlay,
    volume,
    handleVolumeChange,
    isVolumeChanged,
    audioRef,
    isLoading,
    handleAudioLoaded,
  } = useAudioPlayer(currentSong, currentIndex, nextSong, prevSong);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime1, setCurrentTime1] = useState(0);
  const [duration1, setDuration1] = useState(0);

  const handleTimeUpdate = (event) => {
    setCurrentTime1(event.target.currentTime);
    setDuration1(event.target.duration);

    // Obter o tempo atual e a duração total do elemento de áudio ou vídeo
    const currentTime = event.target.currentTime;
    const duration = event.target.duration;

    // Converter o tempo atual e a duração total em minutos e segundos
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);

    // Formatar o tempo atual e a duração total no formato 00:00
    const currentTimeFormatted = `${currentMinutes
      .toString()
      .padStart(2, "0")}:${currentSeconds.toString().padStart(2, "0")}`;
    const durationFormatted = `${durationMinutes
      .toString()
      .padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;

    // Atualizar os estados com o tempo atual e a duração total formatados
    setCurrentTime(currentTimeFormatted);
    setDuration(durationFormatted);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case " ":
        event.preventDefault();
        togglePlay();
        break;
      case "ArrowLeft":
        event.preventDefault();
        prevSong();
        break;
      case "ArrowRight":
        event.preventDefault();
        nextSong();
        break;
      default:
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <audio
        ref={audioRef}
        id="audio-element"
        src={currentSong.music}
        volume={volume}
        onLoadedMetadata={handleAudioLoaded}
        onEnded={nextSong}
        onTimeUpdate={handleTimeUpdate}
      ></audio>

      {isLoading && <div className="loading-indicator spinner"></div>}

      <div className="player-card">
        <AudioWaveform />

        <h2 className="activeSong-name">{currentSong.name}</h2>
        <h4 className="activeArtist-name">{currentSong.creator}</h4>

        <div className="control-icon">
          <div className="song-timeline">
            <div className="time-display">
              {currentTime} / {duration}
            </div>
            <input
              type="range"
              min={0}
              max={duration1.toFixed(0)}
              step="any"
              value={currentTime1.toFixed(0)}
              className="song-range-slider"
              onChange={(event) =>
                (audioRef.current.currentTime = event.target.value)
              }
            />
          </div>
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
            <BiVolumeFull color="#1100ff" className="icons" size={50} />
          ) : (
            ""
          )}

          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={volume}
            className="volume-slider"
            onChange={handleVolumeChange}
            style={{ display: isVolumeChanged ? "" : "none" }}
          />
        </div>
      </div>
    </div>
  );
}
