import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: string;
  crtEffect: boolean;
  scanlineIntensity: number;
  audioVolume: number;
  keyMappings: Record<string, string>;
  setTheme: (theme: string) => void;
  toggleCRT: () => void;
  setScanlineIntensity: (intensity: number) => void;
  setAudioVolume: (volume: number) => void;
  setKeyMapping: (key: string, value: string) => void;
}

const defaultKeyMappings = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  a: 'KeyZ',
  b: 'KeyX',
  start: 'Enter',
  select: 'ShiftLeft',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'classic-xp',
      crtEffect: true,
      scanlineIntensity: 0.5,
      audioVolume: 0.8,
      keyMappings: defaultKeyMappings,

      setTheme: (theme) => set({ theme }),
      toggleCRT: () => set((state) => ({ crtEffect: !state.crtEffect })),
      setScanlineIntensity: (intensity) => set({ scanlineIntensity: intensity }),
      setAudioVolume: (volume) => set({ audioVolume: volume }),
      setKeyMapping: (key, value) =>
        set((state) => ({
          keyMappings: { ...state.keyMappings, [key]: value },
        })),
    }),
    {
      name: 'zerver-settings',
    }
  )
);
