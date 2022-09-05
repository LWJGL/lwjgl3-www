import create from 'zustand';
import { redux } from 'zustand/middleware';
import { config } from './config';
import { reducer } from './reducer';

export const useStore = create(redux(reducer, config));

export function useDispatch() {
  return useStore((state) => state.dispatch);
}
