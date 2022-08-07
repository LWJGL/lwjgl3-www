import { useEffect, useReducer, useRef } from 'react';
import { styled /*, keyframes*/ } from '~/theme/stitches.config';
import { ZINDEX_MODAL_BACKDROP } from '~/theme';
import { useLocationPending } from '~/components/router';

// const pulseAnimation = keyframes({
//   '0%': {
//     transform: 'translateX(-20vw)',
//   },
//   '25%': {
//     transform: 'translateX(-20vw)',
//   },
//   '75%': {
//     transform: 'translateX(120vw)',
//   },
//   '100%': {
//     transform: 'translateX(120vw)',
//   },
// });

// const ProgressPulse = styled('div', {
//   position: 'absolute',
//   top: 0,
//   left: 0,
//   width: '20vw',
//   height: 3,
//   willChange: 'transform',
//   transformOrigin: 'left',
//   background: `linear-gradient(to right, transparent, $info11 50%, transparent)`,
//   animation: `${pulseAnimation} 2.5s linear 10s both infinite`,
// });

const ProgressContainer = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  zIndex: ZINDEX_MODAL_BACKDROP - 1,
  // background: '$info11',
  pointerEvents: 'none',
  // willChange: 'opacity',
  transition: 'opacity 0.75s 0.25s ease-out',
  '&.fade-out': {
    opacity: 0,
  },
});

const ProgressBar = styled('div', {
  width: '100%',
  height: 3,
  background: '$info9',
  // willChange: 'transform',
  transformOrigin: 'left 2px',
  transition: 'transform 0.2s linear',
});

enum States {
  Idle,
  Delayed,
  Started,
  Stopped,
}

enum Events {
  DelayStart,
  Start,
  Stop,
  Reset,
}

interface EventCommand {
  type: 'event';
  payload: Events;
}

interface ProgressCommand {
  type: 'progress';
  payload: number;
}

type Command = EventCommand | ProgressCommand;

interface State {
  status: States;
  progress: number;
}

function reducer(state: State, action: Command): State {
  if (action.type === 'event') {
    switch (action.payload) {
      case Events.DelayStart:
        if (state.status === States.Idle) {
          return {
            status: States.Delayed,
            progress: 0,
          };
        }
        break;
      case Events.Start:
        if (state.status === States.Delayed) {
          return {
            status: States.Started,
            progress: 1,
          };
        }
        break;
      case Events.Stop:
        if (state.status !== States.Idle && state.status !== States.Stopped) {
          return {
            status: States.Stopped,
            progress: 100,
          };
        }
        break;
      case Events.Reset:
        if (state.status !== States.Idle) {
          return {
            status: States.Idle,
            progress: 0,
          };
        }
        break;
    }
  } else if (action.type === 'progress') {
    return {
      ...state,
      progress: action.payload,
    };
  }
  return state;
}

const PERC_MAX = 99.4;
const DELAY_TIMEOUT = 250;
const FADE_TIMEOUT = 750;

const initialState: State = {
  status: States.Idle,
  progress: 0,
};

export function NavProgress() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isPending = useLocationPending();
  const delayTimeoutId = useRef<number | null>(null);
  const trickleTimeoutId = useRef<number | null>(null);
  const fadeoutTimeoutId = useRef<number | null>(null);

  useEffect(() => {
    if (isPending) {
      if (state.status === States.Idle) {
        dispatch({ type: 'event', payload: Events.DelayStart });
      }
    } else if (state.status === States.Delayed) {
      dispatch({ type: 'event', payload: Events.Reset });
    } else if (state.status === States.Started) {
      dispatch({ type: 'event', payload: Events.Stop });
    }
  }, [isPending, state.status]);

  useEffect(() => {
    switch (state.status) {
      case States.Delayed:
        delayTimeoutId.current = setTimeout(() => {
          dispatch({ type: 'event', payload: Events.Start });
        }, DELAY_TIMEOUT);
        break;
      case States.Stopped:
        fadeoutTimeoutId.current = setTimeout(() => {
          dispatch({ type: 'event', payload: Events.Reset });
        }, FADE_TIMEOUT);
        break;
    }
  }, [state.status]);

  useEffect(() => {
    const progress = state.progress;

    if (progress > 0 && progress < PERC_MAX) {
      let step = 0;
      if (progress < 37) {
        step = 13;
      } else if (progress >= 37 && progress < 59) {
        step = 7;
      } else if (progress >= 59 && progress < 83) {
        step = 3;
      } else {
        step = 0.5;
      }

      trickleTimeoutId.current = setTimeout(() => {
        dispatch({ type: 'progress', payload: progress >= PERC_MAX ? PERC_MAX : progress + step });
      }, 200 + Math.floor(400 * Math.random()));
    }
  }, [state.progress]);

  // Cleanup effect
  useEffect(() => {
    if (delayTimeoutId.current !== null && state.status !== States.Delayed) {
      clearTimeout(delayTimeoutId.current);
      delayTimeoutId.current = null;
    }
    if (trickleTimeoutId.current !== null && state.status !== States.Started) {
      clearTimeout(trickleTimeoutId.current);
      trickleTimeoutId.current = null;
    }
    if (fadeoutTimeoutId.current !== null && state.status !== States.Stopped) {
      clearTimeout(fadeoutTimeoutId.current);
      fadeoutTimeoutId.current = null;
    }
  }, [state.status]);

  return (
    <ProgressContainer
      className={state.status === States.Stopped ? 'fade-out' : ''}
      hidden={state.status < States.Started}
      role="none"
      aria-hidden={true}
    >
      <ProgressBar style={{ transform: `scaleX(${state.progress / 100})` }} />
      {/* <ProgressPulse /> */}
    </ProgressContainer>
  );
}
