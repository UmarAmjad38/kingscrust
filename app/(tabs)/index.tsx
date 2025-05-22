import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import "react-native-gesture-handler";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const promoImg = require("../../assets/images/Home/pop.png");
const exploreImg1 = require("../../assets/images/Home/2.webp");
const exploreImg2 = require("../../assets/images/Home/3.webp");
const exploreImg3 = require("../../assets/images/Home/4.webp");
const exploreImg4 = require("../../assets/images/Home/5.webp");
const exploreImg5 = require("../../assets/images/Home/6.webp");
const exploreImg6 = require("../../assets/images/Home/7.webp");
const sliderImg1 = require("../../assets/images/Home/1.webp");
const sliderImg2 = require("../../assets/images/Home/12.webp");
const sliderImg3 = require("../../assets/images/Home/13.webp");
const sliderImg4 = require("../../assets/images/Home/11.webp");
const bestsellerImg1 = require("../../assets/images/Home/best.png");
const bestsellerImg2 = require("../../assets/images/Home/best5.png");

const sliderData = [
  { id: "1", image: sliderImg1 },
  { id: "2", image: sliderImg2 },
  { id: "3", image: sliderImg3 },
  { id: "4", image: sliderImg4 },
];
const exploreMenuData = [
  { id: "1", title: "Signature", image: exploreImg1 },
  { id: "2", title: "Starters", image: exploreImg2 },
  { id: "3", title: "Turn Up Heat", image: exploreImg3 },
  { id: "4", title: "Local", image: exploreImg4 },
  { id: "5", title: "Scooper", image: exploreImg5 },
  { id: "6", title: "Cheezy", image: exploreImg6 },
];
const bestSellerData = [
  { id: "1", image: bestsellerImg1 },
  { id: "2", image: bestsellerImg2 },
];

const SkeletonElement = ({ style }) => {
  return <View style={[styles.skeletonBase, style]} />;
};

const SwiperSkeleton = () => {
  const itemWidth = screenWidth * 0.95;
  const itemHeight = screenWidth * 0.65;
  return (
    <View style={styles.swiperSectionContainerSkeleton}>
      <View style={styles.slideWrapperSkeleton}>
        <SkeletonElement
          style={[
            styles.skeletonSwiperItem,
            { width: itemWidth, height: itemHeight },
          ]}
        />
      </View>
      <View style={styles.paginationBackgroundSkeleton}>
        <View style={styles.skeletonPaginationContainer}>
          <SkeletonElement
            style={[
              styles.skeletonPaginationDot,
              styles.skeletonPaginationDotActive,
            ]}
          />
          {[...Array(sliderData.length - 1)].map((_, i) => (
            <SkeletonElement key={i} style={styles.skeletonPaginationDot} />
          ))}
        </View>
      </View>
    </View>
  );
};

const ExploreMenuSkeleton = () => {
  return (
    <View>
      <View style={styles.skeletonHeaderContainer}>
        <SkeletonElement style={styles.skeletonTitle} />
        <SkeletonElement style={styles.skeletonViewAll} />
      </View>
      <View style={styles.skeletonMenuGrid}>
        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.skeletonMenuItem}>
            <SkeletonElement style={styles.skeletonMenuItemImage} />
            <SkeletonElement style={styles.skeletonMenuItemText} />
          </View>
        ))}
      </View>
    </View>
  );
};

const BestSellerSkeleton = () => {
  return (
    <View>
      <SkeletonElement
        style={[styles.skeletonTitle, styles.skeletonBestSellerTitle]}
      />
      <View style={styles.skeletonBestSellerGrid}>
        <SkeletonElement style={styles.skeletonBestSellerItem} />
        <SkeletonElement style={styles.skeletonBestSellerItem} />
      </View>
    </View>
  );
};

const ExplorePromoSkeleton = () => {
  return (
    <View>
      <SkeletonElement style={styles.skeletonExplorePromo} />
    </View>
  );
};

const CustomPagination = ({ data, activeIndex }) => {
  return (
    <View style={styles.paginationBackground}>
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDotBase,
              index === activeIndex
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const itemWidth = screenWidth * 0.95;
  const itemHeight = screenWidth * 0.65;
  const carouselHeight = itemHeight + 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const renderCarouselItem = ({ item }) => {
    const imageSource =
      typeof item.image === "string" ? { uri: item.image } : item.image;

    return (
      <View style={[styles.slideWrapper, { width: itemWidth }]} key={item.id}>
        <View style={[styles.slide, { height: itemHeight }]}>
          <Image
            source={imageSource}
            style={styles.sliderImage}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  };

  const renderExploreMenuItem = (item) => {
    const imageSource =
      typeof item.image === "string" ? { uri: item.image } : item.image;
    return (
      <TouchableOpacity onPress={() => router.push('/(tabs)/menu')} style={styles.menuItem} key={item.id}>
        <View style={styles.menuItemImageContainer}>
          <Image
            source={imageSource}
            style={styles.menuItemImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderBestSellerItem = (item) => {
    const imageSource =
      typeof item.image === "string" ? { uri: item.image } : item.image;
    return (
      <TouchableOpacity onPress={() => router.push('/(tabs)/menu')} style={styles.bestSellerItem} key={item.id}>
        <Image
          source={imageSource}
          style={styles.bestSellerImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.swiperSectionContainer,
            { minHeight: carouselHeight + 27 },
          ]}
        >
          {isLoading ? (
            <SwiperSkeleton />
          ) : (
            <>
              <Carousel
                loop
                width={itemWidth}
                height={carouselHeight}
                autoPlay={true}
                autoPlayInterval={4000}
                data={sliderData}
                scrollAnimationDuration={500}
                onSnapToItem={(index) => setActiveSlide(index)}
                renderItem={renderCarouselItem}
                style={[styles.carouselStyle, { height: carouselHeight }]}
                mode="parallax"
                parallaxScrollingScale={0.95}
                parallaxScrollingOffset={30}
              />
              <CustomPagination data={sliderData} activeIndex={activeSlide} />
            </>
          )}
        </View>

        <View style={styles.section}>
          {isLoading ? (
            <ExploreMenuSkeleton />
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore Menu</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
                  <Text style={styles.viewAllText}>VIEW ALL</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.menuGrid}>
                {exploreMenuData.map(renderExploreMenuItem)}
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          {isLoading ? (
            <BestSellerSkeleton />
          ) : (
            <>
              <Text style={[styles.sectionTitle, styles.bestSellerTitle]}>
                Best Sellers
              </Text>
              <View style={styles.bestSellerGrid}>
                {bestSellerData.map(renderBestSellerItem)}
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          {isLoading ? (
            <ExplorePromoSkeleton />
          ) : (
            <TouchableOpacity onPress={() => router.push('/(tabs)/menu')} style={styles.explorePromoContainer}>
              <Image
                source={promoImg}
                style={styles.explorePromoImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  swiperSectionContainer: {
    marginTop: Platform.OS === "android" ? 5 : 10,
    marginBottom: 10,
    position: "relative",
    alignItems: "center",
  },
  swiperSectionContainerSkeleton: {
    marginTop: Platform.OS === "android" ? 5 : 10,
    marginBottom: 10,
    height: screenWidth * 0.65 + 60,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  carouselStyle: {
    width: screenWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  slideWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  slideWrapperSkeleton: {
    width: screenWidth,
    alignItems: "center",
    justifyContent: "flex-start",
    height: screenWidth * 0.65 + 5,
    paddingTop: 15,
  },
  slide: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sliderImage: {
    width: "100%",
    height: "100%",
  },
  paginationBackground: {
    position: "absolute",
    bottom: 8,
    left: "5%",
    right: "5%",
    height: 30,
    backgroundColor: "#FFDAB9",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  paginationBackgroundSkeleton: {
    position: "absolute",
    bottom: 10,
    left: "5%",
    right: "5%",
    height: 30,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDotBase: {
    marginHorizontal: 5,
  },
  paginationDotActive: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  paginationDotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: screenWidth * 0.025,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: screenWidth * 0.025,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FF6347",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    width: "31%",
    aspectRatio: 0.85,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  menuItemImageContainer: {
    width: "80%",
    aspectRatio: 1,
    marginBottom: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemImage: {
    width: "90%",
    height: "90%",
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#444",
    textAlign: "center",
    marginTop: "auto",
  },
  bestSellerTitle: {
    marginBottom: 15,
    paddingHorizontal: screenWidth * 0.025,
  },
  bestSellerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bestSellerItem: {
    width: "48.5%",
    aspectRatio: 0.57,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#e0e0e0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bestSellerImage: {
    width: "100%",
    height: "100%",
  },
  explorePromoContainer: {
    width: "100%",
    height: screenWidth * 0.55,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
  },
  explorePromoImage: {
    width: "100%",
    height: "100%",
  },

  skeletonBase: { backgroundColor: "#e0e0e0", borderRadius: 4 },
  skeletonSwiperItem: { borderRadius: 18, backgroundColor: "#cccccc" },
  skeletonPaginationContainer: { flexDirection: "row", alignItems: "center" },
  skeletonPaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: "#bdbdbd",
  },
  skeletonPaginationDotActive: { width: 16 },
  skeletonHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: screenWidth * 0.025,
  },
  skeletonTitle: { height: 20, width: "40%" },
  skeletonViewAll: { height: 16, width: "20%" },
  skeletonMenuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skeletonMenuItem: {
    width: "31%",
    aspectRatio: 0.85,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  skeletonMenuItemImage: {
    width: "70%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  skeletonMenuItemText: {
    height: 12,
    width: "70%",
    borderRadius: 4,
    marginTop: "auto",
  },
  skeletonBestSellerTitle: {
    marginBottom: 15,
    width: "50%",
    marginLeft: screenWidth * 0.025,
  },
  skeletonBestSellerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skeletonBestSellerItem: {
    width: "48.5%",
    aspectRatio: 0.8,
    borderRadius: 12,
    marginBottom: 15,
  },
  skeletonExplorePromo: {
    width: "100%",
    height: screenWidth * 0.55,
    borderRadius: 12,
  },
});
