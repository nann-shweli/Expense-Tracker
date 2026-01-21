import { useDispatch, useSelector } from 'react-redux';
import { Appearance } from 'react-native';

import { AppDispatch, RootState } from '../redux/store';
import { setTheme as setAppTheme } from '../redux/slice/appSlice';

import { useCallback } from 'react';
import { dark } from '../theme/dark';
import { light } from '../theme/light';


export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { theme } = useSelector((state: RootState) => state.app);
  const isSystemTheme = theme === 'system';
  const currentTheme = isSystemTheme ? Appearance.getColorScheme() : theme;
  console.log("hello..",currentTheme)

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'dark':
        return dark;
      case 'light':
      default:
        return light;
    }
  };

  const setTheme = useCallback(
    (mode: any) => {
      dispatch(setAppTheme(mode));
    },
    [dispatch],
  );

  return {
    currentTheme,
    themeColors: getThemeColors(),
    setTheme,
    isSystemTheme,
  };
};
