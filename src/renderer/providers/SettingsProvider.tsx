import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { ThemeProviderProps } from '@primer/react';
import { settingsTable } from '../indexed-db';

type SettingsState = {
  HOTKEY: string;
  SETUP_COMPLETE: boolean;
  THEME: ThemeProviderProps['colorMode'];
};

type SettingsMutators = {
  setTheme: (THEME: ThemeProviderProps['colorMode']) => Promise<void>;
};

type SettingsContextType = SettingsState & SettingsMutators;

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export default function SettingsProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [settingsState, setSettingsState] = useState<SettingsState>();

  useEffect(() => {
    const load = async () => {
      let settings: Partial<SettingsState> = {};
      await settingsTable.each(
        (item) => (settings = { ...settings, [item.key]: item.value })
      );
      setSettingsState(settings as SettingsState);
    };
    load();
  }, []);

  const setTheme = useCallback(
    async (THEME: ThemeProviderProps['colorMode']) => {
      await settingsTable.update('THEME', { value: THEME });
      setSettingsState({ ...settingsState, THEME });
    },
    []
  );

  if (!settingsState) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{ ...settingsState, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}
