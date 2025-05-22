import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SectionList,
  Platform,
  TextInput,
  LayoutChangeEvent,
  Dimensions,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { menuDataSource, MenuItem, MenuCategory } from "../../data/menu";

const ORANGE_COLOR = "#FF6600";
const LIGHT_GREY_COLOR = "#F0F0F0";
const MEDIUM_GREY_COLOR = "#A0A0A0";
const DARK_TEXT_COLOR = "#333333";
const SUBTLE_RED_COLOR = "#E91E63";
const BORDER_COLOR = "#E0E0E0";

interface SectionData extends MenuCategory {
  title: string;
  data: MenuItem[];
}

const SkeletonElement = ({ style, width, height, borderRadius = 4 }: { style?: object, width?: number | string, height?: number | string, borderRadius?: number }) => (
  <View style={[{ backgroundColor: LIGHT_GREY_COLOR, borderRadius }, style, width !== undefined ? { width } : {}, height !== undefined ? { height } : {}]} />
);

const SearchBarSkeleton = () => (
  <View style={styles.searchContainer}>
    <SkeletonElement width={20} height={20} borderRadius={10} style={{ marginRight: 8 }} />
    <SkeletonElement height={24} style={{ flex: 1 }} />
  </View>
);

const TabSkeleton = () => (
  <View style={styles.tabItem}>
    <SkeletonElement width={Math.random() * 50 + 70} height={16} borderRadius={4} />
  </View>
);

const TabsRowSkeleton = () => (
  <View style={styles.tabsContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
      {[...Array(5)].map((_, index) => <TabSkeleton key={`tab_skel_${index}`} />)}
    </ScrollView>
  </View>
);

const MenuItemSkeleton = () => (
  <View style={styles.menuItemContainer}>
    <SkeletonElement width={75} height={75} borderRadius={8} style={{ marginRight: 16 }} />
    <View style={styles.menuItemInfo}>
      <SkeletonElement width="70%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonElement width="90%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonElement width="50%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonElement width="30%" height={16} borderRadius={4} />
    </View>
    <View style={styles.menuItemActions}>
      <SkeletonElement width={22} height={22} borderRadius={11} />
      <SkeletonElement width={30} height={30} borderRadius={15} />
    </View>
  </View>
);

const SectionHeaderSkeleton = () => (
  <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 15, backgroundColor: "#FFFFFF" }}>
    <SkeletonElement width="40%" height={20} borderRadius={4} />
  </View>
);


const MenuScreen = () => {
  const [isLoading, setIsLoading] = useState(true);

  const originalSections: SectionData[] = useMemo(
    () =>
      menuDataSource.map((cat) => ({
        ...cat,
        title: cat.category,
        data: cat.items,
      })),
    []
  );

  const [activeCategory, setActiveCategory] = useState<string>(
    originalSections[0]?.title || ""
  );
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [tabLayouts, setTabLayouts] = useState<
    Record<string, { x: number; width: number }>
  >({});
  const [displayedSections, setDisplayedSections] =
    useState<SectionData[]>(originalSections);

  const sectionListRef = useRef<SectionList<MenuItem, SectionData>>(null);
  const tabScrollRef = useRef<ScrollView>(null);
  const isTabPressRef = useRef(false);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (originalSections.length > 0 && !activeCategory) {
        setActiveCategory(originalSections[0].title);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [originalSections, activeCategory]);


  useEffect(() => {
    if (isLoading) return;
    if (searchQuery.trim() === "") {
      setDisplayedSections(originalSections);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = originalSections
      .map((section) => ({
        ...section,
        data: section.data.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerCaseQuery) ||
            item.description.toLowerCase().includes(lowerCaseQuery)
        ),
      }))
      .filter((section) => section.data.length > 0);

    setDisplayedSections(filtered);
  }, [searchQuery, originalSections, isLoading]);

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleNavigateToDetail = (item: MenuItem) => {
    Keyboard.dismiss();
    const itemWithFavStatus = { ...item, isFavorite: !!favorites[item.id] };
    router.push({
      pathname: "/DetailScreen",
      params: { item: JSON.stringify(itemWithFavStatus) },
    });
  };

  const handleTabPress = (categoryTitle: string) => {
    const sectionIndexInDisplayed = displayedSections.findIndex(
      (s) => s.title === categoryTitle
    );

    if (sectionListRef.current && sectionIndexInDisplayed !== -1) {
      isTabPressRef.current = true;
      setActiveCategory(categoryTitle);
      sectionListRef.current.scrollToLocation({
        sectionIndex: sectionIndexInDisplayed,
        itemIndex: 0,
        viewOffset: 0,
        animated: true,
      });
      setTimeout(() => {
        isTabPressRef.current = false;
      }, 1000);
    } else if (sectionIndexInDisplayed === -1 && searchQuery.trim() !== "") {
      setSearchQuery("");
      const originalIndex = originalSections.findIndex(
        (s) => s.title === categoryTitle
      );
      if (originalIndex !== -1) {
        setTimeout(() => {
          setActiveCategory(categoryTitle);
          sectionListRef.current?.scrollToLocation({
            sectionIndex: originalIndex,
            itemIndex: 0,
            viewOffset: 0,
            animated: true,
          });
        }, 100);
      }
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.menuItemContainer}
      onPress={() => handleNavigateToDetail(item)}
    >
      <Image source={item.image} style={styles.menuItemImage} />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.menuItemPrice}>
          PKR {item.price.toLocaleString()}
        </Text>
      </View>
      <View style={styles.menuItemActions}>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={styles.favIconContainerTop}
        >
          <Ionicons
            name={favorites[item.id] ? "heart" : "heart-outline"}
            size={22}
            color={favorites[item.id] ? SUBTLE_RED_COLOR : MEDIUM_GREY_COLOR}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNavigateToDetail(item)}
          style={styles.addIconContainer}
        >
          <Ionicons name="add" size={26} color={ORANGE_COLOR} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: SectionData }) => {
    if (section.data.length === 0) return null;
    return <Text style={styles.categoryTitle}>{section.title}</Text>;
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      if (isLoading || isTabPressRef.current || displayedSections.length === 0) return;

      const firstVisibleSectionItem = viewableItems.find(
        (item) =>
          item.isViewable && item.section && item.section.data.length > 0
      );

      if (firstVisibleSectionItem && firstVisibleSectionItem.section) {
        const newActiveCategory = firstVisibleSectionItem.section.title;
        if (newActiveCategory !== activeCategory) {
          setActiveCategory(newActiveCategory);
          const layout = tabLayouts[newActiveCategory];
          if (layout && tabScrollRef.current) {
            const tabX = layout.x;
            const tabWidth = layout.width;
            const screenWidth = Platform.OS === "web" ? (tabScrollRef.current as any)?.clientWidth || Dimensions.get("window").width : Dimensions.get("window").width;
            const screenCenter = screenWidth / 2;

            let scrollToX = tabX - screenCenter + tabWidth / 2;
            scrollToX = Math.max(0, scrollToX);

            tabScrollRef.current.scrollTo({ x: scrollToX, animated: true });
          }
        }
      }
    },
    [activeCategory, tabLayouts, displayedSections, isLoading]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 10,
    minimumViewTime: 100,
    sectionVisibleThreshold: 0.1,
  };

  const handleTabLayout = (event: LayoutChangeEvent, category: string) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [category]: { x, width } }));
  };

  const tabBarHeight = Platform.OS === "ios" ? 90 : 70;

  const skeletonListData = useMemo(() => {
    return Array(4)
      .fill(null)
      .map((_, sectionIndex) => ({
        title: `skeleton_section_${sectionIndex}`,
        data: Array(3)
          .fill(null)
          .map((__, itemIndex) => ({
            id: `skeleton_item_${sectionIndex}_${itemIndex}`,
          })),
      }));
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SearchBarSkeleton />
        <TabsRowSkeleton />
        <SectionList
          sections={skeletonListData as any}
          renderItem={() => <MenuItemSkeleton />}
          renderSectionHeader={() => <SectionHeaderSkeleton />}
          keyExtractor={(item: any) => item.id}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={MEDIUM_GREY_COLOR}
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search for dishes..."
          placeholderTextColor={MEDIUM_GREY_COLOR}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearSearchButton}
          >
            <Ionicons name="close-circle" size={20} color={MEDIUM_GREY_COLOR} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {originalSections.map((section) => (
            <TouchableOpacity
              key={section.title}
              style={styles.tabItem}
              onPress={() => handleTabPress(section.title)}
              onLayout={(event) => handleTabLayout(event, section.title)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeCategory === section.title &&
                    searchQuery.trim() === "" &&
                    styles.activeTabText,
                  activeCategory === section.title &&
                    displayedSections.some((s) => s.title === section.title) &&
                    styles.activeTabText,
                ]}
                numberOfLines={1}
              >
                {section.title}
              </Text>
              {activeCategory === section.title &&
                displayedSections.some((s) => s.title === section.title) && (
                  <View style={styles.activeIndicator} />
                )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <SectionList
        ref={sectionListRef}
        sections={displayedSections}
        renderItem={renderMenuItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item, index) => item.id + index}
        stickySectionHeadersEnabled={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              {searchQuery.trim() !== ""
                ? `No results for "${searchQuery}"`
                : "No menu items available."}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_GREY_COLOR,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    height: Platform.OS === "ios" ? 44 : 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: DARK_TEXT_COLOR,
    height: Platform.OS === "ios" ? 44 : 48,
  },
  clearSearchButton: {
    paddingLeft: 8,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: "#FFFFFF",
  },
  tabsScrollContent: {
    paddingVertical: 0,
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 12,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    minHeight: 48,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3.5,
    backgroundColor: ORANGE_COLOR,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabText: {
    fontSize: 14.5,
    color: MEDIUM_GREY_COLOR,
    fontWeight: "600",
  },
  activeTabText: {
    color: ORANGE_COLOR,
    fontWeight: "bold",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: DARK_TEXT_COLOR,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  menuItemContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY_COLOR,
    alignItems: "center",
  },
  menuItemImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 16,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  menuItemName: {
    fontSize: 17,
    fontWeight: "bold",
    color: DARK_TEXT_COLOR,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: MEDIUM_GREY_COLOR,
    lineHeight: 18,
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: DARK_TEXT_COLOR,
  },
  menuItemActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 75,
    paddingLeft: 10,
  },
  favIconContainerTop: {
    padding: 4,
  },
  addIconContainer: {
    backgroundColor: LIGHT_GREY_COLOR,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 70,
    minHeight: Dimensions.get('window').height / 2,
  },
  emptyListText: {
    fontSize: 16,
    color: MEDIUM_GREY_COLOR,
    textAlign: "center",
  },
});

export default MenuScreen;