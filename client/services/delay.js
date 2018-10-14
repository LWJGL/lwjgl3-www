// @flow
export const delay = (duration: number): Promise<void> => new Promise(resolve => setTimeout(resolve, duration));
