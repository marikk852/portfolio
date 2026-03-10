'use client';

import { createContext, useContext, useRef, useEffect, type ReactNode } from 'react';
import type Lenis from 'lenis';

export const LenisContext = createContext<React.MutableRefObject<Lenis | null> | null>(null);

export function useLenisRef() {
  return useContext(LenisContext);
}
