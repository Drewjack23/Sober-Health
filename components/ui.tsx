import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, GestureResponderEvent, Platform, Pressable, ScrollView, StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { colors, fonts, gradients, motion, radius, shadow, spacing, typeScale } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { selectionFeedback, successFeedback } from '@/utils/feedback';
import { Text } from './AppText';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function AppScreen({ children, scroll = true, style }: React.PropsWithChildren<{ scroll?: boolean; style?: StyleProp<ViewStyle> }>) {
  const theme = useTheme();
  const content = <View style={[styles.screenContent, style]}>{children}</View>;
  return <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.colors.background }]}>{scroll ? <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}</SafeAreaView>;
}

export function BrandMark({ size = 42 }: { size?: number }) {
  return <LinearGradient colors={gradients.bright} style={[styles.brandMark, { width: size, height: size, borderRadius: Math.max(8, size * 0.22) }]}><Text style={[styles.brandPlus, { fontSize: size * 0.52, lineHeight: size * 0.72 }]}>+</Text></LinearGradient>;
}

export function Header({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const theme = useTheme();
  return <View style={styles.header}><View style={styles.flex}><Text style={[styles.pageTitle, { color: theme.colors.text }]}>{title}</Text>{subtitle ? <Text style={[styles.subtitle, { color: theme.colors.muted }]}>{subtitle}</Text> : null}</View>{right}</View>;
}

export function Card({ children, style, accessibilityLabel, elevated = false }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle>; accessibilityLabel?: string; elevated?: boolean }>) {
  const theme = useTheme();
  return <View accessibilityLabel={accessibilityLabel} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, elevated && shadow, style]}>{children}</View>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  const theme = useTheme();
  return <View style={styles.sectionHeading}><View style={styles.flex}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text></View>{action}</View>;
}

type ButtonProps = React.ComponentProps<typeof Pressable> & { label: string; icon?: keyof typeof Ionicons.glyphMap; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; loading?: boolean };
export function Button({ label, icon, variant = 'primary', loading, disabled, style, onPress, ...props }: ButtonProps) {
  const theme = useTheme();
  const handlePress = (event: GestureResponderEvent) => { successFeedback(); onPress?.(event); };
  const foreground = variant === 'primary' ? colors.white : variant === 'danger' ? colors.coral : theme.colors.text;
  const content = <>{loading ? <ActivityIndicator color={foreground} /> : icon ? <Ionicons name={icon} size={18} color={foreground} /> : null}<Text style={[styles.buttonText, { color: foreground }]}>{label}</Text></>;
  if (variant === 'primary') return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={handlePress} style={(state) => [styles.button, state.pressed && styles.pressed, disabled && styles.disabled, typeof style === 'function' ? style(state) : style]} {...props}><LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonGradient}>{content}</LinearGradient></Pressable>;
  return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={handlePress} style={(state) => [styles.button, styles.buttonPlain, { borderColor: variant === 'danger' ? colors.coral : theme.colors.strongBorder, backgroundColor: variant === 'ghost' ? 'transparent' : theme.colors.surface }, state.pressed && styles.pressed, disabled && styles.disabled, typeof style === 'function' ? style(state) : style]} {...props}>{content}</Pressable>;
}

export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  const theme = useTheme();
  return <View style={styles.field}><Text style={[styles.fieldLabel, { color: theme.colors.text }]}>{label}</Text><TextInput placeholderTextColor={theme.colors.faint} style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: error ? colors.coral : theme.colors.strongBorder, fontFamily: fonts.body }]} {...props} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

export function Chip({ label, selected, onPress, icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  const theme = useTheme();
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={() => { selectionFeedback(); onPress?.(); }} style={({ pressed }) => [styles.chip, { borderColor: selected ? colors.purple : theme.colors.border, backgroundColor: selected ? (theme.isDark ? '#29213F' : '#F1EDFC') : 'transparent' }, pressed && styles.pressed]}>{icon ? <Ionicons name={icon} size={15} color={selected ? colors.purple : theme.colors.muted} /> : null}<Text style={[styles.chipText, { color: selected ? (theme.isDark ? '#CBBDF7' : colors.purple) : theme.colors.muted }]}>{label}</Text></Pressable>;
}

export function MetricCard({ label, value, detail, icon, tone = 'purple' }: { label: string; value: string; detail: string; icon: keyof typeof Ionicons.glyphMap; tone?: 'purple' | 'blue' | 'green' | 'amber' }) {
  const theme = useTheme(); const toneColor = { purple: colors.purple, blue: colors.blue, green: colors.success, amber: colors.amber }[tone];
  return <View style={[styles.metricCard, { borderColor: theme.colors.border }]}><View style={styles.metricTop}><Text style={[styles.metricLabel, { color: theme.colors.muted }]}>{label}</Text><Ionicons name={icon} size={17} color={toneColor} /></View><Text style={[styles.metricValue, { color: theme.colors.text }]}>{value}</Text><Text numberOfLines={2} style={[styles.metricDetail, { color: theme.colors.faint }]}>{detail}</Text><View style={[styles.metricRule, { backgroundColor: toneColor }]} /></View>;
}

export function EmptyState({ icon = 'add', title, body, action }: { icon?: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: React.ReactNode }) {
  const theme = useTheme();
  return <View style={[styles.empty, { borderColor: theme.colors.border }]}><View style={styles.emptyLine}><Ionicons name={icon} size={19} color={colors.purple} /><Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{title}</Text></View><Text style={[styles.emptyBody, { color: theme.colors.muted }]}>{body}</Text>{action ? <View style={styles.emptyAction}>{action}</View> : null}</View>;
}

export function ProgressBar({ value, label, detail }: { value: number; label?: string; detail?: string }) {
  const theme = useTheme(); const reduceMotion = useReducedMotionPreference(); const safe = Math.max(0, Math.min(100, value)); const [animated] = useState(() => new Animated.Value(0));
  useEffect(() => { Animated.timing(animated, { toValue: safe, duration: reduceMotion ? 0 : motion.slow, useNativeDriver: false }).start(); }, [animated, reduceMotion, safe]);
  const width = animated.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  return <View style={styles.progressWrap}>{label ? <View style={styles.progressLabels}><Text style={[styles.smallLabel, { color: theme.colors.text }]}>{label}</Text><Text style={styles.progressValue}>{Math.round(safe)}%</Text></View> : null}<View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceSubtle }]}><Animated.View style={[styles.progressFill, { width }]}><LinearGradient colors={gradients.brand} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} /></Animated.View></View>{detail ? <Text style={[styles.detail, { color: theme.colors.muted }]}>{detail}</Text> : null}</View>;
}

export function ProgressRing({ value, size = 112, label }: { value: number; size?: number; label?: string }) {
  const theme = useTheme(); const reduceMotion = useReducedMotionPreference(); const safe = Math.max(0, Math.min(100, value)); const stroke = 8; const radiusValue = (size - stroke) / 2; const circumference = 2 * Math.PI * radiusValue; const [animated] = useState(() => new Animated.Value(0));
  useEffect(() => { Animated.timing(animated, { toValue: safe, duration: reduceMotion ? 0 : motion.slow, useNativeDriver: false }).start(); }, [animated, reduceMotion, safe]);
  const offset = animated.interpolate({ inputRange: [0, 100], outputRange: [circumference, 0] });
  const arcProps = { cx: size / 2, cy: size / 2, r: radiusValue, fill: 'none', stroke: colors.purple, strokeWidth: stroke, strokeDasharray: `${circumference} ${circumference}`, strokeLinecap: 'round' as const, transform: `rotate(-90 ${size / 2} ${size / 2})` };
  return <View style={[styles.ringWrap, { width: size, height: size }]}><Svg width={size} height={size} style={StyleSheet.absoluteFill}><Circle cx={size / 2} cy={size / 2} r={radiusValue} fill="none" stroke={theme.colors.surfaceSubtle} strokeWidth={stroke} />{Platform.OS === 'web' ? <Circle {...arcProps} strokeDashoffset={circumference * (1 - safe / 100)} /> : <AnimatedCircle {...arcProps} strokeDashoffset={offset} />}</Svg><Text style={[styles.ringValue, { color: theme.colors.text }]}>{Math.round(safe)}%</Text>{label ? <Text style={[styles.ringLabel, { color: theme.colors.muted }]}>{label}</Text> : null}</View>;
}

export function MiniLineChart({ values, height = 150, labels }: { values: number[]; height?: number; labels?: string[] }) {
  const theme = useTheme(); const [selected, setSelected] = useState<number | null>(null);
  if (!values.length) return <EmptyState title="Nothing to chart yet" body="Your first check-in will start this trend." />;
  const width = 360; const pad = 18; const min = Math.min(...values); const max = Math.max(...values); const range = max - min || 1;
  const points = values.map((value, index) => ({ x: pad + (index / Math.max(values.length - 1, 1)) * (width - pad * 2), y: pad + (1 - (value - min) / range) * (height - pad * 2) }));
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' '); const area = `${path} L ${points.at(-1)!.x.toFixed(1)} ${height - 4} L ${points[0]!.x.toFixed(1)} ${height - 4} Z`;
  return <View style={styles.chartWrap}>{selected !== null ? <View style={[styles.tooltip, { backgroundColor: theme.colors.text }]}><Text style={[styles.tooltipValue, { color: theme.colors.background }]}>{values[selected]?.toFixed(1)}{labels?.[selected] ? ` · ${labels[selected]}` : ''}</Text></View> : null}<Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} accessibilityLabel="Interactive trend chart"><Defs><SvgGradient id="line" x1="0" y1="0" x2="1" y2="0"><Stop offset="0" stopColor={colors.purple} /><Stop offset="1" stopColor={colors.blue} /></SvgGradient><SvgGradient id="fill" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={colors.purple} stopOpacity="0.16" /><Stop offset="1" stopColor={colors.purple} stopOpacity="0" /></SvgGradient></Defs><Path d={area} fill="url(#fill)" /><Path d={path} fill="none" stroke="url(#line)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />{points.map((point, index) => <Circle key={index} cx={point.x} cy={point.y} r={selected === index ? 5 : 2.2} fill={selected === index ? colors.blue : theme.colors.surface} stroke={colors.purple} strokeWidth={2} />)}</Svg><View style={styles.chartTouchRow}>{values.map((_, index) => <Pressable key={index} accessibilityLabel={`Chart point ${index + 1}, ${values[index]}`} onPress={() => { selectionFeedback(); setSelected(index); }} style={styles.chartTouch} />)}</View></View>;
}

export function Skeleton({ width = '100%', height = 16 }: { width?: number | `${number}%`; height?: number }) { const theme = useTheme(); return <View style={[styles.skeleton, { width, height, backgroundColor: theme.colors.surfaceSubtle }]} />; }
export function LoadingScreen() { return <View style={[styles.loading, { backgroundColor: colors.navy }]}><BrandMark size={56} /><ActivityIndicator style={{ marginTop: spacing.xl }} color="#B8A0FF" /></View>; }

function useReducedMotionPreference() {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => { AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion); const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion); return () => subscription.remove(); }, []);
  return reduceMotion;
}

const styles = StyleSheet.create({
  safe: { flex: 1 }, scroll: { flexGrow: 1 }, screenContent: { width: '100%', maxWidth: 1160, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 104, gap: 20 }, flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.xs, paddingBottom: spacing.xs }, pageTitle: { ...typeScale.title, fontWeight: '800', letterSpacing: -0.55 }, subtitle: { ...typeScale.body, marginTop: 2 },
  brandMark: { alignItems: 'center', justifyContent: 'center' }, brandPlus: { color: colors.white, fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg }, sectionHeading: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg, gap: spacing.md }, eyebrow: { color: colors.purple, ...typeScale.caption, letterSpacing: 1.35, textTransform: 'uppercase', fontWeight: '600', marginBottom: 2 }, sectionTitle: { ...typeScale.section, fontWeight: '700', letterSpacing: -0.25 },
  button: { minHeight: 48, borderRadius: radius.md, overflow: 'hidden', justifyContent: 'center' }, buttonGradient: { minHeight: 48, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, buttonPlain: { paddingHorizontal: 17, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, buttonText: { ...typeScale.body, fontWeight: '600' }, pressed: { opacity: 0.8, transform: [{ scale: 0.985 }] }, disabled: { opacity: 0.45 },
  field: { gap: 6 }, fieldLabel: { ...typeScale.label, fontWeight: '600' }, input: { minHeight: 50, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 14, fontSize: 15 }, error: { color: colors.coral, ...typeScale.label },
  chip: { minHeight: 38, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, chipText: { ...typeScale.label, fontWeight: '600' },
  metricCard: { flexGrow: 1, flexBasis: 150, minWidth: 145, borderTopWidth: 1, paddingTop: 13, paddingBottom: 4, position: 'relative' }, metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, metricLabel: { ...typeScale.label, fontWeight: '500' }, metricValue: { ...typeScale.metric, fontWeight: '700', letterSpacing: -0.6, marginTop: 7 }, metricDetail: { ...typeScale.caption, marginTop: 2 }, metricRule: { position: 'absolute', height: 2, width: 32, top: -1, left: 0 },
  empty: { borderTopWidth: 1, paddingVertical: spacing.xl }, emptyLine: { flexDirection: 'row', alignItems: 'center', gap: 8 }, emptyTitle: { ...typeScale.bodyLarge, fontWeight: '600' }, emptyBody: { ...typeScale.body, maxWidth: 420, marginTop: 6 }, emptyAction: { marginTop: spacing.lg, alignSelf: 'flex-start' },
  progressWrap: { gap: 7 }, progressLabels: { flexDirection: 'row', justifyContent: 'space-between' }, smallLabel: { ...typeScale.label, fontWeight: '600' }, progressValue: { color: colors.purple, ...typeScale.label, fontWeight: '600' }, progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 3, overflow: 'hidden' }, detail: { ...typeScale.caption },
  ringWrap: { alignItems: 'center', justifyContent: 'center' }, ringValue: { fontSize: 23, lineHeight: 28, fontWeight: '700' }, ringLabel: { ...typeScale.caption, marginTop: -1 }, chartWrap: { position: 'relative' }, chartTouchRow: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row' }, chartTouch: { flex: 1 }, tooltip: { position: 'absolute', top: -2, right: 4, zIndex: 2, paddingHorizontal: 8, paddingVertical: 5, borderRadius: radius.sm }, tooltipValue: { ...typeScale.caption, fontWeight: '600' },
  skeleton: { borderRadius: radius.sm }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
