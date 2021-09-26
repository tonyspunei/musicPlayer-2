import { songsList } from "../data/songs.js";
import PlayInfo from "./play-info.js";
import TrackBar from "./track-bar.js";

const Playlist = ((_) => {
  // DATA / STATE
  const songs = songsList;
  let currentlyPlayingIndex = 0;
  let currentSong = new Audio(songs[currentlyPlayingIndex].url);

  // cache the DOM
  const playlistEl = document.querySelector(".playlist");

  const init = (_) => {
    render();
    listeners();
    PlayInfo.setState({
      songsLength: songs.length,
      isPlaying: !currentSong.paused,
    });
  };

  // Flip func - runs togglePlayPause outside the Playlist module
  const flip = (_) => {
    togglePlayPause();
    render();
  };

  // Change audio Src
  const changeAudioSrc = (_) => {
    currentSong.src = songs[currentlyPlayingIndex].url;
  };

  // Toggle Play or pause
  const togglePlayPause = (_) => {
    return currentSong.paused ? currentSong.play() : currentSong.pause();
  };

  const mainPlay = (clickedIndex) => {
    if (currentlyPlayingIndex === clickedIndex) {
      // toggle play / pause
      togglePlayPause();
    } else {
      // 2. change the currentPlayingIndex to index of the li tag
      currentlyPlayingIndex = clickedIndex;

      // 4. If it's not the same song, then change the src to the new song
      changeAudioSrc();

      // 3. play or pause
      togglePlayPause();
    }

    PlayInfo.setState({
      songsLength: songs.length,
      isPlaying: !currentSong.paused,
    });
  };

  // PlayNext
  const playNext = (_) => {
    if (songs[currentlyPlayingIndex + 1]) {
      currentlyPlayingIndex++;
      changeAudioSrc();
      togglePlayPause();
      render();
    }
  };

  // Eventlisteners
  const listeners = (_) => {
    playlistEl.addEventListener("click", (event) => {
      if (event.target && event.target.matches(".fa")) {
        // 1. get index of what is clicked
        const listElem = event.target.parentElement.parentElement;
        const listElemIndex = [...listElem.parentElement.children].indexOf(
          listElem
        );
        mainPlay(listElemIndex);
        render();
      }
    });

    currentSong.addEventListener("timeupdate", (_) => {
      TrackBar.setState(currentSong);
    });

    currentSong.addEventListener("ended", (_) => {
      // run playnext function
      playNext();
    });
  };

  const render = (_) => {
    let markup = ``;

    const toggleIcon = (itemIndex) => {
      if (currentlyPlayingIndex === itemIndex) {
        return currentSong.paused ? "fa-play" : "fa-pause";
      }
      return "fa-play";
    };

    songs.forEach((songObj, index) => {
      markup += `
        <li class="playlist__song ${
          index === currentlyPlayingIndex ? "playlist__song--active" : ""
        }">
            <!-- Play / Pause Icon -->
            <div class="play-pause">
                <i class="fa ${toggleIcon(index)} pp-icon"></i>
            </div>

            <!-- Song Name & Artist -->
            <div class="playlist__song-details">
                <span class="playlist__song-name">${songObj.title}</span>
                <br />
                <span class="playlist__song-artist">${songObj.artist}</span>
            </div>

            <!-- Song Duration in min:sec -->
            <div class="playlist__song-duration">${songObj.time}</div>
        </li>
      `;
    });

    playlistEl.innerHTML = markup;
  };

  return {
    init,
    flip,
  };
})();

export default Playlist;
