import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  Animated, 
  StyleSheet, 
  Dimensions, 
  TouchableWithoutFeedback 
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { COLORS } from "@/Constants/colors";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

// Create an Animated version of BlurView to handle the fade-in
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const tabs = [
  { name: "index", icon: "home", label: "Home" },
  { name: "TicketBank", icon: "receipt", label: "Tickets" },
  { name: "CreateTicket", icon: "add", label: "" }, 
  { name: "TopRanked", icon: "trophy", label: "Top Ranked" },
  { name: "about", icon: "information-circle", label: "About" },
];

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  // Rotation for the + to X
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  // Blur and Overlay Fade
  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Popout visibility
  const popoutOpacity = animation.interpolate({
    inputRange: [0, 0.7, 1], 
    outputRange: [0, 0, 1],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -110], 
  });

  const translateXGeneral = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const translateXSpecific = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  return (
    <>
      {/* 1. ANIMATED BLUR BACKDROP */}
      {expanded && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <AnimatedBlurView
            intensity={30} // Depth of blur
            tint="dark"    // Darkens the background
            style={[
              styles.blurOverlay,
              { opacity: backdropOpacity }
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* 2. TAB BAR CONTAINER */}
      <View style={styles.tabBarContainer}>
        <View style={styles.innerRow}>
          {tabs.map((tab, index) => {
            const isFocused = state.index === index;

            if (tab.name === "CreateTicket") {
              return (
                <View key={tab.name} style={styles.centerButtonContainer}>
                  
                  {/* GENERAL OPTION */}
                  <Animated.View 
                    pointerEvents={expanded ? "auto" : "none"}
                    style={[styles.popoutWrapper, { 
                      transform: [{ translateY }, { translateX: translateXGeneral }],
                      opacity: popoutOpacity 
                  }]}>
                    <Pressable 
                      onPress={() => { toggleMenu();
                        router.push("/CreateTicketModal");
                        }}
                      style={styles.popoutCircle}
                    >
                      <MaterialIcons name="category" size={26} color="white" />
                    </Pressable>
                    <Text style={styles.popoutLabel}>General</Text>
                  </Animated.View>

                  {/* SPECIFIC OPTION */}
                  <Animated.View 
                    pointerEvents={expanded ? "auto" : "none"}
                    style={[styles.popoutWrapper, { 
                      transform: [{ translateY }, { translateX: translateXSpecific }],
                      opacity: popoutOpacity 
                  }]}>
                    <Pressable 
                      onPress={() => { toggleMenu(); }}
                      style={styles.popoutCircle}
                    >
                      <MaterialIcons name="work" size={26} color="white" />
                    </Pressable>
                    <Text style={styles.popoutLabel}>Specific</Text>
                  </Animated.View>

                  {/* MAIN ACTION BUTTON */}
                  <View style={styles.anchor}>
                      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                          <Pressable onPress={toggleMenu} style={styles.mainActionButton}>
                              <Ionicons name="add" size={32} color="white" />
                          </Pressable>
                      </Animated.View>
                  </View>
                </View>
              );
            }

            return (
              <Pressable
                key={tab.name}
                onPress={() => { 
                  if(expanded) toggleMenu(); 
                  navigation.navigate(tab.name); 
                }}
                style={styles.tabItem}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={24}
                  color={isFocused ? COLORS.primaryColor : "#9CA3AF"}
                />
                <Text style={[styles.tabText, { color: isFocused ? COLORS.primaryColor : "#999" }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: height, // Ensures blur covers the full screen above the tab bar
    zIndex: 80,
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 12,
    paddingBottom: 25,
    elevation: 30, // Keep tab bar on top of blur
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  innerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabText: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  anchor: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -45,
    zIndex: 120,
  },
  mainActionButton: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.primaryColor || "#1FA2A6",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    elevation: 15,
  },
  popoutWrapper: {
    position: "absolute",
    alignItems: "center",
    top: -20,
    zIndex: 110,
  },
  popoutCircle: {
    width: 58,
    height: 58,
    backgroundColor: COLORS.primaryColor || "#1FA2A6",
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  popoutLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    color: "#FFFFFF",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  }
});