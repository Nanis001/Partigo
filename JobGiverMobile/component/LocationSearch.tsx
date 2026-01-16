import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Keyboard 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface Suggestion {
  id: string;
  title: string;
}

export default function LocationSearch() {
  const [searchQuery, setSearchQuery] = useState('Sunnydale, San Francisco');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredData, setFilteredData] = useState<Suggestion[]>([]);

  const suggestions: Suggestion[] = [
    { id: '1', title: 'Sunnydale, San Francisco' },
    { id: '2', title: 'Downtown, San Francisco' },
    { id: '3', title: 'Mission District, SF' },
  ];

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsFocused(false);
      setFilteredData([]);
    });
    return () => keyboardHideListener.remove();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = suggestions.filter(item => 
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.mainWrapper}>
        {/* The Search Pill */}
        <View style={[styles.searchBarContainer, isFocused && styles.activePill]}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={18} color="#008080" />
          </View>

          <View style={styles.textSection}>
            {!isFocused && <Text style={styles.label}>CURRENT LOCATION</Text>}
            <TextInput
              style={styles.input}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => setIsFocused(true)}
              placeholder="Search location..."
              placeholderTextColor="#A0A0A0"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity style={styles.searchIconSection}>
            <Ionicons name="search" size={22} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        {/* Suggestion Dropdown */}
        {isFocused && filteredData.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="always"
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.suggestionItem} 
                  onPress={() => {
                    setSearchQuery(item.title);
                    Keyboard.dismiss();
                  }}
                >
                  <Ionicons name="time-outline" size={18} color="#A0A0A0" style={{marginRight: 12}} />
                  <Text style={styles.suggestionText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton}>
        <MaterialCommunityIcons name="tune-variant" size={24} color="#2D3436" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Keeps the pill from stretching to the bottom of the screen
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 5000, 
    width: '100%',
  },
  mainWrapper: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    height: 70, // FIXED HEIGHT prevents the "Big Circle" glitch
    alignItems: 'center',
    paddingHorizontal: 15,
    // Shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  activePill: {
    // Optional: Slightly sharpen bottom corners when dropdown is open
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textSection: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0A0A0',
    letterSpacing: 0.5,
    marginBottom: -2,
  },
  input: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    padding: 0,
    height: 24,
  },
  searchIconSection: {
    paddingLeft: 5,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 75,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 10,
    maxHeight: 200,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  suggestionText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  filterButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  }
});