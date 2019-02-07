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

type Event = InitEvent | PlayPauseEvent | VolumeEvent | SeekEvent;

function mediaReducer(state: State, event: Event): State {
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

export function useMediaControls(player: React.RefObject<HTMLMediaElement>) {
  const [state, dispatch] = useReducer(mediaReducer, {
    currentTime: 0,
    paused: true,
    oldVolume: 1,
    volume: 1,
    muted: false,
  });

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

  function setVolume(volume: number) {
    if (player.current) {
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
      player.current.volume = volume;

      // no onmuted event, must set on volumechange
      if (volume === 0) {
        player.current.muted = true;
      } else {
        player.current.muted = false;
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
      dispatch({
        type: 'init',
        state: {
          currentTime: player.current.currentTime,
          paused: isPaused(player.current),
          oldVolume: player.current.volume,
          volume: player.current.volume,
          muted: player.current.muted,
        },
      });

      function playPauseHandler(this: HTMLMediaElement) {
        dispatch({ type: 'playPause', paused: isPaused(this) });
      }
      function volumeHandler(this: HTMLMediaElement) {
        dispatch({ type: 'volume', volume: this.volume });
      }
      function seekHandler(this: HTMLMediaElement) {
        dispatch({ type: 'seek', currentTime: this.currentTime });
      }

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
