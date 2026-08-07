import React from 'react';
import { StyleSheet, Text as NativeText, TextProps } from 'react-native';
import { fonts } from '@/constants/theme';

function familyFor(weight: TextProps['style']) {
  const value = StyleSheet.flatten(weight)?.fontWeight;
  if (value === 'bold' || Number(value) >= 800) return fonts.displayStrong;
  if (Number(value) >= 700) return fonts.display;
  if (Number(value) >= 600) return fonts.semibold;
  if (Number(value) >= 500) return fonts.medium;
  return fonts.body;
}

export function Text({ style, ...props }: TextProps) {
  return <NativeText style={[style, { fontFamily: familyFor(style), fontWeight: 'normal' }]} {...props} />;
}

