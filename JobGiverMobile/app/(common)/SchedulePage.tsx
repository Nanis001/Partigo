import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Info, 
  MapPin, 
  ChevronDown, 
  ArrowRight,
  DollarSign
} from 'lucide-react-native';
import { Slider } from '@miblanchard/react-native-slider'; // Optional for the slider

const SchedulePage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(14);
  const [duration, setDuration] = useState(3);

  const dates = [
    { day: 'Mon', date: 14 },
    { day: 'Tue', date: 15 },
    { day: 'Wed', date: 16 },
    { day: 'Thu', date: 17 },
    { day: 'Fri', date: 18 },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* HEADER SECTION */}
      <View className="bg-[#1FA2A6] pt-14 pb-10 px-6 rounded-b-[40px] shadow-lg">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2 rounded-full bg-white/20"
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Schedule Work</Text>
          <TouchableOpacity className="p-2 rounded-full bg-white/20">
            <MoreHorizontal color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* WORKER CARD */}
        <View className="bg-white/10 border border-white/20 p-4 rounded-3xl flex-row items-center">
          <View className="relative">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ff955c461f' }}
              className="w-14 h-14 rounded-full border-2 border-white"
            />
            <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1FA2A6]" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-white font-bold text-lg">Sarah J.</Text>
            <Text className="text-white/80 text-xs">Accepted "Kitchen Cleaning"</Text>
          </View>
          <TouchableOpacity className="bg-white p-3 rounded-full shadow-sm">
            <MessageCircle color="#1FA2A6" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 120 }}
      >
        {/* SELECT DATE */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#1FA2A6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Select Date</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {dates.map((item) => (
              <TouchableOpacity
                key={item.date}
                onPress={() => setSelectedDate(item.date)}
                className={`w-16 h-20 rounded-3xl items-center justify-center mr-3 ${
                  selectedDate === item.date ? 'bg-[#1FA2A6] shadow-md scale-105' : 'bg-[#F4EFEA]'
                }`}
              >
                <Text className={`text-xs ${selectedDate === item.date ? 'text-white/70' : 'text-gray-400'}`}>
                  {item.day}
                </Text>
                <Text className={`text-xl font-bold mt-1 ${selectedDate === item.date ? 'text-white' : 'text-gray-800'}`}>
                  {item.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* START TIME */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Clock size={20} color="#1FA2A6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Start Time</Text>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity className="flex-1 bg-[#F4EFEA] rounded-2xl py-4 px-4 flex-row items-center justify-between">
              <Text className="font-bold text-gray-800">01:00 PM</Text>
              <ChevronDown color="#9CA3AF" size={18} />
            </TouchableOpacity>
            <View className="flex-1 bg-[#F4EFEA] rounded-2xl p-4 flex-row items-center">
              <Info color="#1FA2A6" size={16} />
              <Text className="text-[10px] text-gray-500 ml-2">Available from 8AM</Text>
            </View>
          </View>
        </View>

        {/* DURATION */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Clock size={20} color="#1FA2A6" />
              <Text className="text-lg font-bold text-gray-800 ml-2">Duration</Text>
            </View>
            <Text className="text-[#1FA2A6] font-bold text-xl">{duration} Hrs</Text>
          </View>
          <View className="bg-[#F4EFEA] p-6 rounded-[30px]">
             {/* Note: In a real app, use @miblanchard/react-native-slider or similar */}
             <View className="h-1 bg-gray-300 rounded-full relative">
                <View style={{ width: `${(duration/8)*100}%` }} className="h-1 bg-[#1FA2A6] rounded-full" />
                <View style={{ left: `${(duration/8)*100}%` }} className="w-5 h-5 bg-[#1FA2A6] rounded-full absolute -top-2 -ml-2 border-2 border-white" />
             </View>
             <View className="flex-row justify-between mt-4">
               <Text className="text-xs text-gray-400 font-bold">1 Hr</Text>
               <Text className="text-xs text-gray-400 font-bold">4 Hrs</Text>
               <Text className="text-xs text-gray-400 font-bold">8 Hrs</Text>
             </View>
          </View>
        </View>

        {/* LOCATION */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <MapPin size={20} color="#1FA2A6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Location</Text>
          </View>
          <View className="bg-[#F4EFEA] p-5 rounded-3xl flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-[#1FA2A6]/10 p-2 rounded-xl">
                <MapPin size={20} color="#1FA2A6" />
              </View>
              <View className="ml-3">
                <Text className="font-bold text-gray-800">Home</Text>
                <Text className="text-xs text-gray-500">123 Sunnydale Ave, CA</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text className="text-[#1FA2A6] font-bold text-xs underline">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ESTIMATED TOTAL */}
        <View className="bg-[#FF7A45]/10 border border-[#FF7A45]/20 p-5 rounded-3xl mb-10">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600 font-bold">Estimated Total</Text>
            <Text className="text-2xl font-black text-[#FF7A45]">$45.00</Text>
          </View>
          <View className="flex-row items-center">
            <DollarSign size={14} color="#6B7280" />
            <Text className="text-[10px] text-gray-500 ml-1">Based on $15/hr rate negotiated</Text>
          </View>
        </View>
      </ScrollView>

      {/* CONFIRM BUTTON */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/80">
        <TouchableOpacity 
          onPress={() => Alert.alert("Confirmed!")}
          className="bg-[#1FA2A6] py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-[#1FA2A6]/40"
        >
          <Text className="text-white font-bold text-lg mr-2">Confirm Schedule</Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SchedulePage;