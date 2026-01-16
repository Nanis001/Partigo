import React from "react";
import { 
  View, 
  Dimensions, 
  StyleSheet, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ScrollView,
  ImageBackground
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LocationSearch from "@/component/LocationSearch";
import WorkerCard, { CARD_WIDTH } from "@/component/WorkerCard";

/** * UNCOMMENT the lines below only after running:
 * npx expo run:android 
 * (Standard Expo Go does not support native maps)
 */
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"; 
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const MOCK_WORKERS = [
  { id: '1', name: 'Sarah M.', role: 'Cleaner', rating: '4.9', bio: 'Expert in deep cleaning and organizing. 5 years of experience.', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '2', name: 'James L.', role: 'Plumber', rating: '4.7', bio: 'Available for emergency repairs and installations.', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '3', name: 'Emma R.', role: 'Gardener', rating: '5.0', bio: 'Passionate about landscape design and organic gardening.', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

export default function Home() {

  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* 1. BACKGROUND LAYER (Map or Mock Image) */}
      <View style={StyleSheet.absoluteFillObject}>
        {/* Using ImageBackground to avoid native module crashes in Expo Go */}
        <ImageBackground
          source={{ uri: "https://api.maptiler.com/maps/basic-v2/static/0,0,1/1000x1000.png?key=get_your_own_key" }} // Replace with a clean map screenshot URL
          style={styles.mapMock}
          resizeMode="cover"
        >
          {/* If you switch to MapView later, it goes here
          <MapView style={StyleSheet.absoluteFillObject} provider={PROVIDER_GOOGLE} /> */}
        </ImageBackground>
      </View>

      {/* 2. UI OVERLAY LAYER */}
      <SafeAreaView style={styles.overlayContainer} pointerEvents="box-none">
        
        {/* Top Section: Search Bar */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.topSection} pointerEvents="box-none">
            <LocationSearch />
          </View>
        </TouchableWithoutFeedback>

        {/* Bottom Section: Worker Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 20} // Matches card width + gap
            decelerationRate="fast"
            contentContainerStyle={styles.scrollViewContent}
          >
             {/* Inside your Home component's ScrollView: */}
          {MOCK_WORKERS.map((item) => (
            <WorkerCard 
              key={item.id} 
              worker={item} 
              onPress={() => {
                router.push({
                  pathname: "/WorkerProfile", // Ensure this matches your file name (about.tsx)
                  params: { 
                    id: item.id,
                    name: item.name,
                    role: item.role,
                    img: item.img,
                    rating: item.rating
                  }
                });
              }}
            />
          ))}
          </ScrollView>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  mapMock: {
    width: '100%',
    height: '100%',
    opacity: 0.5, // Dims the map to make the UI pop
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    // pointerEvents="box-none" allows us to touch the map "through" this view
  },
  topSection: {
    flex: 1,
    zIndex: 5000, // Keeps search dropdown on top
  },
  carouselContainer: {
    position: 'absolute',
    bottom: 110, // Adjust based on your Tab Bar height
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollViewContent: {
    // This padding centers the first card on the screenF
    paddingHorizontal: (width - CARD_WIDTH) / 2 - 10,
    paddingBottom: 20,
  },
});