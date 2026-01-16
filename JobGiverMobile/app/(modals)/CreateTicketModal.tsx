import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  FlatList
} from 'react-native';
import { 
  ChevronLeft, 
  CloudUpload, 
  ChevronDown, 
  MapPin, 
  Edit3, 
  Clock,
  XCircle
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const CreateTicketModal = () => {
  const router = useRouter();
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  
  // UI State
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select location');
  const [images, setImages] = useState<string[]>([]);

  // 1. Back Button Functionality
  const handleBack = () => router.back();

  // 2. Image Upload Functionality
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset  => asset.uri);
      setImages([...images, ...newUris]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 3. Location Dropdown Logic
  const locations = [
    { id: 'map', label: 'Select from Map', icon: <MapPin size={18} color="#1FA2A6" /> },
    { id: 'manual', label: 'Write address manually', icon: <Edit3 size={18} color="#1FA2A6" /> },
    { id: 'saved1', label: 'Home: 123 Sunnydale Ave', icon: <Clock size={18} color="#6B7280" /> },
    { id: 'saved2', label: 'Office: 456 Business Hub', icon: <Clock size={18} color="#6B7280" /> },
  ];

  const selectLoc = (label: string) => {
    setSelectedLocation(label);
    setShowLocationOptions(false);
  };

  // 4. Submit Functionality
  const handleSubmit = () => {
    console.log("Submitting Ticket:", { title, description, selectedLocation, images });
    // Redirect to TicketBank (assuming TicketBank is a tab route)
    router.replace('/(tabs)/TicketBank');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View 
        className="bg-[#1FA2A6] pt-14 pb-12 px-6 items-center"
        style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
      >
        <View className="flex-row items-center justify-between w-full mb-4">
          <TouchableOpacity onPress={handleBack} className="p-2 rounded-full bg-white/10">
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="w-10" />
        </View>
        <Text className="text-white text-2xl font-bold tracking-wide">Create your ticket</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 px-8 pt-8" showsVerticalScrollIndicator={false}>
          
          {/* Title */}
          <View className="mb-6">
            <Text className="text-[#2E2E2E] text-[10px] font-bold uppercase tracking-widest ml-1 mb-2">Title</Text>
            <TextInput
              className="w-full bg-[#F4EFEA] rounded-2xl px-5 py-4 text-gray-800 font-medium text-sm"
              placeholder="Brief title of the job"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-[#2E2E2E] text-[10px] font-bold uppercase tracking-widest ml-1 mb-2">Description</Text>
            <TextInput
              className="w-full bg-[#F4EFEA] rounded-2xl px-5 py-4 text-gray-800 font-medium text-sm"
              placeholder="Describe the work needed..."
              multiline numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: 'top' }}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Location Dropdown */}
          <View className="mb-6 z-50">
            <Text className="text-[#2E2E2E] text-[10px] font-bold uppercase tracking-widest ml-1 mb-2">Location</Text>
            <TouchableOpacity 
              onPress={() => setShowLocationOptions(!showLocationOptions)}
              className="w-full bg-[#F4EFEA] rounded-2xl px-5 py-4 flex-row justify-between items-center"
            >
              <Text className="text-gray-800 font-medium text-sm">{selectedLocation}</Text>
              <ChevronDown color="#6B7280" size={20} />
            </TouchableOpacity>

            {showLocationOptions && (
              <View className="bg-white border border-gray-100 rounded-2xl mt-2 shadow-xl overflow-hidden">
                {locations.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    onPress={() => selectLoc(item.label)}
                    className="flex-row items-center px-5 py-4 border-b border-gray-50"
                  >
                    {item.icon}
                    <Text className="ml-3 text-gray-700 text-sm">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Photographs Upload */}
          <View className="mb-6">
            <Text className="text-[#2E2E2E] text-[10px] font-bold uppercase tracking-widest ml-1 mb-2">Photographs</Text>
            <TouchableOpacity 
              onPress={pickImage}
              className="w-full bg-[#F4EFEA] rounded-2xl px-5 py-4 flex-row justify-between items-center border border-dashed border-gray-300"
            >
              <Text className="text-[#9CA3AF] font-medium text-sm">Tap to upload images</Text>
              <CloudUpload color="#2E2E2E" size={20} />
            </TouchableOpacity>

            {/* Image Preview List */}
            {images.length > 0 && (
              <View className="mt-4">
                <FlatList
                  data={images}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View className="mr-3 relative">
                      <Image source={{ uri: item }} className="w-20 h-20 rounded-xl" />
                      <TouchableOpacity 
                        onPress={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-white rounded-full"
                      >
                        <XCircle size={18} color="#FF7A45" />
                      </TouchableOpacity>
                      {index === 2 && images.length > 3 && (
                        <View className="absolute inset-0 bg-black/40 rounded-xl items-center justify-center">
                          <Text className="text-white font-bold">+{images.length - 3}</Text>
                        </View>
                      )}
                    </View>
                  )}
                />
              </View>
            )}
          </View>

          {/* Specific Details */}
          <View className="mb-10">
            <Text className="text-[#2E2E2E] text-[10px] font-bold uppercase tracking-widest ml-1 mb-2">Specific Details</Text>
            <TextInput
              className="w-full bg-[#F4EFEA] rounded-2xl px-5 py-4 text-gray-800 font-medium text-sm"
              placeholder="Any special instructions?"
              value={details}
              onChangeText={setDetails}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FOOTER ACTION */}
      <View className="px-8 pb-10 pt-4 bg-white">
        <TouchableOpacity 
          onPress={handleSubmit}
          className="w-full bg-[#1FA2A6] py-4 rounded-2xl shadow-lg items-center justify-center active:scale-[0.98]"
        >
          <Text className="text-white font-bold text-lg">Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateTicketModal;