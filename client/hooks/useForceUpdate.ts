import { useState } from 'react';
export const useForceUpdate = () => useState<undefined>(undefined)[1];
