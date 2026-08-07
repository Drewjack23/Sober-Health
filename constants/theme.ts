import { Platform } from 'react-native';

export const colors = {
  purple: '#6D3EEB',
  brightPurple: '#8054F2',
  blue: '#2864DC',
  electricBlue: '#3578F6',
  softBlue: '#EAF1FF',
  navy: '#0B0F19',
  navyCard: '#121824',
  white: '#FFFFFF',
  canvas: '#F5F6F8',
  text: '#111827',
  muted: '#667085',
  border: '#E1E4EA',
  success: '#16836B',
  successSoft: '#E8F5F1',
  amber: '#A76107',
  amberSoft: '#FFF5E1',
  coral: '#B84A5F',
  coralSoft: '#FBECEF',
} as const;

export const lightTheme = {
  background: '#F5F6F8',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0F2F5',
  surfaceElevated: '#FFFFFF',
  text: '#111827',
  muted: '#667085',
  faint: '#98A2B3',
  border: '#E1E4EA',
  strongBorder: '#CDD2DC',
} as const;

export const darkTheme = {
  background: '#0B0F19',
  surface: '#121824',
  surfaceSubtle: '#171E2C',
  surfaceElevated: '#1B2231',
  text: '#F4F6FA',
  muted: '#A0A8B8',
  faint: '#737D91',
  border: '#252D3C',
  strongBorder: '#354052',
} as const;

export const gradients = {
  brand: [colors.purple, colors.blue] as const,
  bright: [colors.brightPurple, colors.electricBlue] as const,
  dark: ['#17132C', colors.navy] as const,
};

export const fonts = {
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  display: 'Manrope_700Bold',
  displayStrong: 'Manrope_800ExtraBold',
} as const;

export const typeScale = {
  caption: { fontSize: 11, lineHeight: 16 },
  label: { fontSize: 12, lineHeight: 17 },
  body: { fontSize: 14, lineHeight: 21 },
  bodyLarge: { fontSize: 16, lineHeight: 24 },
  section: { fontSize: 19, lineHeight: 25 },
  title: { fontSize: 27, lineHeight: 34 },
  display: { fontSize: 34, lineHeight: 40 },
  metric: { fontSize: 28, lineHeight: 34 },
} as const;

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { xs: 4, sm: 6, md: 9, lg: 12, xl: 16, pill: 999 } as const;
export const border = { hairline: 1, strong: 1.5 } as const;
export const motion = { fast: 120, standard: 220, slow: 360 } as const;

export const shadow = Platform.select({
  web: { boxShadow: '0 3px 14px rgba(16, 24, 40, 0.055)' },
  default: { shadowColor: '#101828', shadowOpacity: 0.055, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
});

