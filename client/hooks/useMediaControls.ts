import { useState, useEffect } from 'react';

export function useMediaControls(player: React.RefObject<HTMLMediaElement>) {
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [oldVolume, setOldVolume] = useState(0);
  const [paused, setPaused] = useState(false);
  const [volume, setNewVolume] = useState(0);

  function pause() {
    if (player.current) {
      player.current.pause();
    }
  }

  function play() {
    if (player.current) {
      return player.current.play();
    } else {
      return Promise.reject();
    }
  }

  function setVolume(value: number) {
    if (player.current) {
      setOldVolume(player.current.volume);
      player.current.volume = value;

      // no onmuted event, must set on volumechange
      if (value === 0) {
        player.current.muted = true;
      } else {
        player.current.muted = false;
      }
      setMuted(player.current.muted);
    }
  }

  function mute() {
    setVolume(0);
  }

  function unmute() {
    setVolume(oldVolume);
  }

  function seek(value: number) {
    if (player.current) {
      player.current.currentTime = value;
    }
  }

  function stop() {
    pause();
    seek(0);
  }

  function restart() {
    seek(0);
    return play();
  }

  useEffect(() => {
    if (player.current !== null) {
      function isPaused(el: HTMLMediaElement) {
        return el.paused || el.ended;
      }
      function playPauseHandler(this: HTMLMediaElement) {
        setPaused(isPaused(this));
      }
      function volumeHandler(this: HTMLMediaElement) {
        setNewVolume(this.volume);
      }
      function seekHandler(this: HTMLMediaElement) {
        setCurrentTime(this.currentTime);
      }

      setCurrentTime(player.current.currentTime);
      setMuted(player.current.muted);
      setPaused(isPaused(player.current));
      setOldVolume(player.current.volume);
      setNewVolume(player.current.volume);

      player.current.addEventListener('play', playPauseHandler); // fired by play method or autoplay attribute
      player.current.addEventListener('playing', playPauseHandler); // fired by resume after being paused due to lack of data
      player.current.addEventListener('pause', playPauseHandler); // fired by pause method
      player.current.addEventListener('waiting', playPauseHandler); // fired by pause due to lack of data
      player.current.addEventListener('volumechange', volumeHandler); // fired by a change of volume
      player.current.addEventListener('seeked', seekHandler); // fired on seek completed
      player.current.addEventListener('timeupdate', seekHandler); // fired on currentTime update

      return () => {
        if (player.current !== null) {
          player.current.removeEventListener('play', playPauseHandler);
          player.current.removeEventListener('playing', playPauseHandler);
          player.current.removeEventListener('pause', playPauseHandler);
          player.current.removeEventListener('waiting', playPauseHandler);
          player.current.removeEventListener('volumechange', volumeHandler);
          player.current.removeEventListener('seeked', seekHandler);
          player.current.removeEventListener('timeupdate', seekHandler);
        }
      };
    }
  }, [player.current]);

  return {
    currentTime,
    mute,
    muted,
    unmute,
    pause,
    paused,
    play,
    restart,
    seek,
    setVolume: setVolume,
    stop,
    volume,
  };
}
