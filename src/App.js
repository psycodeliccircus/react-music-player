import { useState, useEffect } from "react";
import "./App.css";
import { audios } from "./audioData";

import Player from "./components/Player";

function App() {
  const songs = audios;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(songs[currentIndex]);

  const nextSong = () => {
    if (currentIndex + 1 < songs.length) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  const prevSong = () => {
    if (currentIndex >= 1) {
      setCurrentIndex(currentIndex - 1);
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  return (
    <div className="player-main">
      <Player
        currentSong={currentSong}
        currentIndex={currentIndex}
        nextSong={nextSong}
        prevSong={prevSong}
      />
    </div>
  );
}

export default App;
