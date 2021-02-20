import { useReducer, useEffect } from 'react';

interface State {
  currentTime: number;
  paused: boolean;
  oldVolume: number;
  volume: number;
  muted: boolean;
}

interface InitEvent {
  type: 'init';
  state: State;
}

interface PlayPauseEvent {
  type: 'playPause';
  paused: boolean;
}

interface VolumeEvent {
  type: 'volume';
  volume: number;
}

interface SeekEvent {
  type: 'seek';
  currentTime: number;
}

type MediaEvent = InitEvent | PlayPauseEvent | VolumeEvent | SeekEvent;

function mediaReducer(state: State, event: MediaEvent): State {
  switch (event.type) {
    case 'playPause':
      if (event.paused !== state.paused) {
        return {
          ...state,
          paused: event.paused,
        };
      }
      break;
    case 'volume':
      if (event.volume !== state.volume) {
        return {
          ...state,
          oldVolume: state.volume > 0 ? state.volume : state.oldVolume,
          volume: event.volume,
          muted: event.volume === 0,
        };
      }
      break;
    case 'seek':
      return {
        ...state,
        currentTime: event.currentTime,
      };
  }
  return state;
}

function isPaused(el: HTMLMediaElement) {
  return el.paused || el.ended;
}

export function useMediaControls(playerRef: React.RefObject<HTMLMediaElement>) {
  const [state, dispatch] = useReducer(mediaReducer, {
    currentTime: 0,
    paused: true,
    oldVolume: 1,
    volume: 1,
    muted: false,
  });

  function pause() {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  }

  function play() {
    if (playerRef.current) {
      return playerRef.current.play();
    } else {
      return Promise.reject();
    }
  }

  function setVolume(volume: number) {
    if (playerRef.current) {
      if (volume < 0) {
        if (state.volume > 0) {
          volume = 0;
        } else {
          return;
        }
      } else if (volume > 1) {
        volume = 1;
        if (state.volume < 1) {
          volume = 1;
        } else {
          return;
        }
      }
      playerRef.current.volume = volume;

      // no onmuted event, must set on volumechange
      if (volume === 0) {
        playerRef.current.muted = true;
      } else {
        playerRef.current.muted = false;
      }
      dispatch({ type: 'volume', volume });
    }
  }

  function mute() {
    setVolume(0);
  }

  function unmute() {
    setVolume(state.oldVolume);
  }

  function seek(value: number) {
    if (playerRef.current) {
      playerRef.current.currentTime = value;
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
    const player = playerRef.current;
    if (player !== null) {
      dispatch({
        type: 'init',
        state: {
          currentTime: player.currentTime,
          paused: isPaused(player),
          oldVolume: player.volume,
          volume: player.volume,
          muted: player.muted,
        },
      });

      const playPauseHandler = () => {
        dispatch({ type: 'playPause', paused: isPaused(player) });
      };
      const volumeHandler = () => {
        dispatch({ type: 'volume', volume: player.volume });
      };
      const seekHandler = () => {
        dispatch({ type: 'seek', currentTime: player.currentTime });
      };

      player.addEventListener('play', playPauseHandler); // fired by play method or autoplay attribute
      player.addEventListener('playing', playPauseHandler); // fired by resume after being paused due to lack of data
      player.addEventListener('pause', playPauseHandler); // fired by pause method
      player.addEventListener('waiting', playPauseHandler); // fired by pause due to lack of data
      player.addEventListener('volumechange', volumeHandler); // fired by a change of volume
      player.addEventListener('seeked', seekHandler); // fired on seek completed
      player.addEventListener('timeupdate', seekHandler); // fired on currentTime update

      return () => {
        if (player !== null) {
          player.removeEventListener('play', playPauseHandler);
          player.removeEventListener('playing', playPauseHandler);
          player.removeEventListener('pause', playPauseHandler);
          player.removeEventListener('waiting', playPauseHandler);
          player.removeEventListener('volumechange', volumeHandler);
          player.removeEventListener('seeked', seekHandler);
          player.removeEventListener('timeupdate', seekHandler);
        }
      };
    }
  }, [playerRef]);

  return {
    currentTime: state.currentTime,
    mute,
    muted: state.muted,
    unmute,
    pause,
    paused: state.paused,
    play,
    restart,
    seek,
    setVolume,
    stop,
    volume: state.volume,
  };
}
