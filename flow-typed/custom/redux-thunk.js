import type { Middleware, Dispatch } from 'redux';

declare module 'redux-thunk' {
  declare type ThunkAction<R, S, E> = (dispatch: Dispatch<S>, getState: () => S, extraArgument: E) => R;

  declare var thunk: Middleware<*, *>;

  declare export default thunk
}
