import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/AppText';
import { NutritionNav, RecipeCard } from '@/components/NutritionUI';
import { AppScreen, Button, EmptyState, Header, SectionTitle } from '@/components/ui';
import { typeScale } from '@/constants/theme';
import { meals } from '@/data/catalog';
import { useTheme } from '@/hooks/useTheme';
import { useApp } from '@/state/AppProvider';

export default function FavoritesScreen() {
  const theme = useTheme(); const { data, toggleSavedMeal, addBowlToGrocery, logBowl } = useApp(); const favorites = meals.filter((meal) => data.savedMeals.includes(meal.id));
  return <AppScreen><Header title="My Favorites" subtitle="The recipes and bowls you want to come back to." /><NutritionNav current="favorites" />
    {favorites.length ? <View><SectionTitle eyebrow="SAVED RECIPES" title={`${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`} /><View style={styles.grid}>{favorites.map((meal) => <RecipeCard key={meal.id} meal={meal} saved onSave={() => toggleSavedMeal(meal.id)} />)}</View></View> : <EmptyState icon="heart-outline" title="No favorite recipes yet" body="Save recipes you enjoy and recommendations will gradually learn your preferences." action={<Button label="Discover recipes" onPress={() => router.push('/(tabs)/nutrition')} />} />}
    <View><SectionTitle eyebrow="CUSTOM BOWLS" title={`${data.savedBowls.length} saved`} />{data.savedBowls.length ? data.savedBowls.map((bowl) => <View key={bowl.id} style={[styles.bowl, { borderColor: theme.colors.border }]}><View style={styles.flex}><Text style={[styles.bowlTitle, { color: theme.colors.text }]}>{bowl.title}</Text><Text style={[styles.bowlMeta, { color: theme.colors.muted }]}>{bowl.calories} cal · {bowl.protein}g protein · {bowl.carbs}g carbs</Text></View><View style={styles.actions}><Button label="Groceries" icon="basket-outline" variant="secondary" onPress={() => addBowlToGrocery(bowl.title, bowl.selection)} /><Button label="Log" icon="checkmark" variant="ghost" onPress={() => logBowl(bowl.title)} /></View></View>) : <View style={[styles.emptyBowl, { borderColor: theme.colors.border }]}><Text style={[styles.bowlMeta, { color: theme.colors.muted }]}>Create a bowl with exactly the ingredients you like.</Text><Button label="Build a bowl" icon="layers-outline" variant="secondary" onPress={() => router.push('/build-bowl')} /></View>}</View>
  </AppScreen>;
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 }, bowl: { borderTopWidth: 1, paddingVertical: 14, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }, flex: { flex: 1, minWidth: 200 }, bowlTitle: { ...typeScale.bodyLarge, fontWeight: '700' }, bowlMeta: { ...typeScale.body, marginTop: 2 }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, emptyBowl: { borderTopWidth: 1, paddingVertical: 18, gap: 12, alignItems: 'flex-start' } });
