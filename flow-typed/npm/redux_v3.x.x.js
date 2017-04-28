// flow-typed signature: be5c67dd3a3b03c564a448bdbb011a8f
// flow-typed version: 358375125e/redux_v3.x.x/flow_>=v0.33.x

declare module 'redux' {

  /*

    S = State
    A = Action

  */

  declare export type Dispatch<A: { type: $Subtype<string> }> = (action: A) => A;

  declare export type MiddlewareAPI<S, A> = {
    dispatch: Dispatch<A>;
    getState(): S;
  };

  declare export type Store<S, A> = {
    // rewrite MiddlewareAPI members in order to get nicer error messages (intersections produce long messages)
    dispatch: Dispatch<A>;
    getState(): S;
    subscribe(listener: () => void): () => void;
    replaceReducer(nextReducer: Reducer<S, A>): void
  };

  declare export type Reducer<S, A> = (state: S, action: A) => S;

  declare export type CombinedReducer<S, A> = (state: $Shape<S> & {} | void, action: A) => S;

  declare export type Middleware<S, A> =
    (api: MiddlewareAPI<S, A>) =>
      (next: Dispatch<A>) => Dispatch<A>;

  declare export type StoreCreator<S, A> = {
    (reducer: Reducer<S, A>, enhancer?: StoreEnhancer<S, A>): Store<S, A>;
    (reducer: Reducer<S, A>, preloadedState: S, enhancer?: StoreEnhancer<S, A>): Store<S, A>;
  };

  declare export type StoreEnhancer<S, A> = (next: StoreCreator<S, A>) => StoreCreator<S, A>;

  declare export function createStore<S, A>(reducer: Reducer<S, A>, enhancer?: StoreEnhancer<S, A>): Store<S, A>;
  declare export function createStore<S, A>(reducer: Reducer<S, A>, preloadedState: S, enhancer?: StoreEnhancer<S, A>): Store<S, A>;

  declare export function applyMiddleware<S, A>(...middlewares: Array<Middleware<S, A>>): StoreEnhancer<S, A>;

  declare export type ActionCreator<A, B> = (...args: Array<B>) => A;
  declare export type ActionCreators<K, A> = { [key: K]: ActionCreator<A, any> };

  declare export function bindActionCreators<A, C: ActionCreator<A, any>>(actionCreator: C, dispatch: Dispatch<A>): C;
  declare export function bindActionCreators<A, K, C: ActionCreators<K, A>>(actionCreators: C, dispatch: Dispatch<A>): C;

  declare export function combineReducers<O: Object, A>(reducers: O): CombinedReducer<$ObjMap<O, <S>(r: Reducer<S, any>) => S>, A>;

  declare export function compose<S, A>(...fns: Array<StoreEnhancer<S, A>>): StoreEnhancer<S, A>;

}
