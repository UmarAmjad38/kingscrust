import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { menuDataSource, MenuItem } from '../data/menu';

const ORANGE_COLOR = '#F15B25';
const DARK_TEXT_COLOR = '#212529';
const MEDIUM_GREY_COLOR = '#6C757D';
const LIGHT_GREY_COLOR = '#F8F9FA';
const BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#E9ECEF';
const SKELETON_LIGHT_GREY = '#E0E0E0';
const SUBTLE_RED_COLOR = '#E91E63';

const SkeletonElement = ({ style, width, height, borderRadius = 4 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: SKELETON_LIGHT_GREY, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const FavoriteItemSkeleton = () => (
  <View style={styles.itemContainer}>
    <SkeletonElement width={80} height={80} borderRadius={8} style={{ marginRight: 15 }} />
    <View style={{ flex: 1 }}>
      <SkeletonElement width="70%" height={18} style={{ marginBottom: 6 }} />
      <SkeletonElement width="90%" height={14} style={{ marginBottom: 4 }} />
      <SkeletonElement width="40%" height={16} />
    </View>
    <SkeletonElement width={24} height={24} borderRadius={12} />
  </View>
);

const MyFavoritesScreenSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      <SkeletonElement width={30} height={30} borderRadius={15} />
      <SkeletonElement width="50%" height={24} style={{ marginLeft: 15 }} />
    </View>
    <FlatList
      data={[1, 2, 3, 4]}
      renderItem={() => <FavoriteItemSkeleton />}
      keyExtractor={(item) => `skel_fav_${item}`}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  </View>
);

export default function MyFavoritesScreen() {
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const allItems = useMemo(() => menuDataSource.flatMap(category => category.items), []);

  useEffect(() => {
    setIsLoading(true);
    const fetchedFavorites = allItems.filter((_, index) => index % 2 === 0);
    setFavorites(fetchedFavorites);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [allItems]);

  const toggleFavoriteStatus = (itemId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId));
  };

  const navigateToDetail = (item: MenuItem) => {
    router.push({ pathname: '/DetailScreen', params: { item: JSON.stringify(item) } });
  };

  const renderFavoriteItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToDetail(item)}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.itemPrice}>PKR {item.price.toLocaleString()}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavoriteStatus(item.id)} style={styles.favIconContainer}>
        <Ionicons name="heart" size={24} color={SUBTLE_RED_COLOR} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <MyFavoritesScreenSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DARK_TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={70} color={MEDIUM_GREY_COLOR} />
          <Text style={styles.emptyText}>No Favorites Yet</Text>
          <Text style={styles.emptySubText}>Tap the heart on items you love to save them here.</Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.exploreButtonText}>EXPLORE MENU</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: BACKGROUND_COLOR,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_GREY_COLOR,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    marginBottom: 6,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: ORANGE_COLOR,
  },
  favIconContainer: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: BORDER_COLOR,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_TEXT_COLOR,
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: MEDIUM_GREY_COLOR,
    textAlign: 'center',
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: ORANGE_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
});