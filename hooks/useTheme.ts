import { darkTheme, lightTheme } from '@/constants/theme';
import { useApp } from '@/state/AppProvider';

export function useTheme() {
  const { isDark } = useApp();
  return {
    isDark,
    colors: isDark ? darkTheme : lightTheme,
  };
}
