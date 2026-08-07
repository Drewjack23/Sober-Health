import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { colors, radius, typeScale } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { Meal } from '@/types/models';
import { selectionFeedback } from '@/utils/feedback';

const destinations = [
  { id: 'recipes', label: 'Recipes', icon: 'restaurant-outline', href: '/(tabs)/nutrition' },
  { id: 'favorites', label: 'Favorites', icon: 'heart-outline', href: '/favorites' },
  { id: 'plan', label: 'Weekly plan', icon: 'calendar-outline', href: '/meal-plan' },
  { id: 'grocery', label: 'Grocery list', icon: 'basket-outline', href: '/grocery-list' },
] as const;

export function NutritionNav({ current }: { current: 'recipes' | 'favorites' | 'plan' | 'grocery' }) {
  const theme = useTheme();
  return <View style={[styles.nav, { borderColor: theme.colors.border }]}>{destinations.map((item) => { const active = current === item.id; return <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => { selectionFeedback(); router.push(item.href as never); }} style={({ pressed }) => [styles.navItem, active && { backgroundColor: theme.isDark ? '#29213F' : '#F1EDFC' }, pressed && styles.pressed]}><Ionicons name={item.icon} size={17} color={active ? colors.purple : theme.colors.muted} /><Text style={[styles.navLabel, { color: active ? (theme.isDark ? '#CBBDF7' : colors.purple) : theme.colors.muted }]}>{item.label}</Text></Pressable>; })}</View>;
}

export function RecipeImage({ meal, height = 164 }: { meal: Meal; height?: number }) {
  const theme = useTheme();
  return <View style={[styles.imageFrame, { height, backgroundColor: theme.colors.surfaceSubtle }]}><Image source={{ uri: meal.image }} accessibilityLabel={`${meal.title} prepared meal`} resizeMode="cover" style={StyleSheet.absoluteFill} /><View style={styles.imageShade} /><View style={styles.imageBadge}><Text style={styles.imageBadgeText}>{meal.category}</Text></View></View>;
}

export function RecipeCard({ meal, saved, onSave }: { meal: Meal; saved: boolean; onSave: () => void }) {
  const theme = useTheme(); const { width } = useWindowDimensions();
  return <View style={[styles.recipeCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, width >= 720 && styles.recipeCardWide]}><Pressable accessibilityRole="button" accessibilityLabel={`Open ${meal.title} recipe`} onPress={() => { selectionFeedback(); router.push(`/recipe/${meal.id}` as never); }} style={({ pressed }) => [pressed && styles.pressed]}><RecipeImage meal={meal} /><View style={styles.recipeCopy}><Text numberOfLines={2} style={[styles.recipeTitle, { color: theme.colors.text }]}>{meal.title}</Text><Text numberOfLines={2} style={[styles.recipeDescription, { color: theme.colors.muted }]}>{meal.description}</Text><View style={styles.recipeMeta}><Text style={[styles.metaStrong, { color: theme.colors.text }]}>{meal.protein}g protein</Text><Text style={[styles.meta, { color: theme.colors.faint }]}>{meal.calories} cal · {meal.time} min</Text></View></View></Pressable><Pressable accessibilityLabel={`${saved ? 'Remove from' : 'Add to'} favorites`} onPress={() => { selectionFeedback(); onSave(); }} style={[styles.favorite, { backgroundColor: theme.colors.surface }]}><Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? colors.coral : theme.colors.muted} /></Pressable></View>;
}

const styles = StyleSheet.create({
  nav: { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, navItem: { minHeight: 38, borderRadius: radius.md, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 6 }, navLabel: { ...typeScale.label, fontWeight: '600' }, pressed: { opacity: .76 },
  imageFrame: { position: 'relative', overflow: 'hidden' }, imageShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(8, 12, 20, .12)' }, imageBadge: { position: 'absolute', left: 12, top: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: 'rgba(11, 15, 25, .78)' }, imageBadgeText: { color: colors.white, ...typeScale.caption, fontWeight: '600' },
  recipeCard: { width: '100%', borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden', position: 'relative' }, recipeCardWide: { width: 'calc(50% - 8px)' as never }, recipeCopy: { padding: 15 }, recipeTitle: { ...typeScale.bodyLarge, fontWeight: '700' }, recipeDescription: { ...typeScale.body, marginTop: 4 }, recipeMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 11 }, metaStrong: { ...typeScale.label, fontWeight: '600' }, meta: { ...typeScale.label }, favorite: { position: 'absolute', right: 10, top: 10, width: 38, height: 38, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
