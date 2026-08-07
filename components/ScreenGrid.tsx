import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { spacing } from '@/constants/theme';

export function ScreenGrid({ children, minWidth = 240 }: React.PropsWithChildren<{ minWidth?: number }>) {
  const { width } = useWindowDimensions();
  const columns = width >= 1024 ? 3 : width >= 680 ? 2 : 1;
  return <View style={styles.grid}>{React.Children.map(children, (child) => <View style={[styles.item, columns === 1 ? styles.full : columns === 2 ? styles.half : { width: `calc(33.333% - ${spacing.md}px)` as unknown as number, minWidth }]}>{child}</View>)}</View>;
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, item: { flexGrow: 1 }, full: { width: '100%' }, half: { width: '47%', minWidth: 260 } });

