import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, Heart, Share2, Star, MessageCircle, 
  Send, Search, ShoppingCart, User, Home, Plus, ChevronLeft, ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get("window");

const WorkerProfile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // --- 1. DYNAMIC CALENDAR LOGIC (1 Month) ---
  const getDaysInMonth = () => {
    const now = new Date();
    const days = [];
    const date = new Date(now.getFullYear(), now.getMonth(), 1);
    while (date.getMonth() === now.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
  const monthDays = getDaysInMonth();

  // --- 2. REVIEW DATA ---
  const reviews = [
    { id: '1', name: 'Michael Chen', text: 'Sarah did an amazing job! My apartment has never looked this clean.', rating: 5, date: '2 days ago' },
    { id: '2', name: 'Emma Wilson', text: 'Very professional and punctual. Highly recommended for deep cleaning.', rating: 4, date: '1 week ago' },
    { id: '3', name: 'John Doe', text: 'Great service, but arrived 10 mins late. Work was flawless though.', rating: 5, date: '2 weeks ago' },
  ];

  return (
    <View className="flex-1 bg-[#F9F6F2]">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* HEADER SECTION */}
        <View className="p-4">
          <View className="bg-[#E8A355] rounded-[40px] h-[300px] w-full overflow-hidden relative border-4 border-white shadow-sm">
            <Image source={{ uri: 'https://img.freepik.com/free-vector/professional-cleaner-concept-illustration_114360-10118.jpg' }} className="w-full h-full" resizeMode="cover" />
            <View className="absolute bottom-[-10] left-0 right-0 items-center">
               <View className="border-4 border-white rounded-full shadow-lg">
                <Image source={{ uri: params.img as string }} className="w-20 h-20 rounded-full" />
               </View>
            </View>
          </View>
        </View>

        {/* PROFILE INFO */}
        <View className="mt-6 items-center px-6">
          <Text className="text-2xl font-black text-gray-800">{params.name}</Text>
          <Text className="text-[#1FA2A6] font-bold text-xs uppercase">{params.role}</Text>
        </View>

        {/* INTERACTIVE BUTTONS */}
        <View className="flex-row px-6 mt-8 gap-4">
          <TouchableOpacity 
            onPress={() => router.push('/(common)/ChatScreen')} // 👈 Redirects to Chat
            className="flex-1 bg-white border border-gray-100 py-4 rounded-2xl flex-row justify-center items-center shadow-sm"
          >
            <MessageCircle size={20} color="#1FA2A6" className="mr-2" />
            <Text className="font-bold text-[#1FA2A6]">Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(modals)/SendTicket')} // 👈 Opens existing Tickets
            className="flex-1 bg-[#1FA2A6] py-4 rounded-2xl flex-row justify-center items-center shadow-md"
          >
            <Send size={20} color="white" className="mr-2" />
            <Text className="font-bold text-white">Send Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* HORIZONTAL REVIEWS CAROUSEL */}
        <View className="px-6 mt-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black text-gray-800">Reviews ({reviews.length})</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/(common)/DetailedReviews', params: { id: params.id } })}>
              <Text className="text-[#1FA2A6] text-xs font-bold">See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList 
            data={reviews}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width: width - 48 }} className="bg-white p-5 rounded-[25px] shadow-sm border border-gray-50 mr-4">
                <View className="flex-row justify-between">
                  <Text className="font-bold text-gray-800">{item.name}</Text>
                  <View className="flex-row">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} size={12} fill="#FF7A45" color="#FF7A45" />)}
                  </View>
                </View>
                <Text className="text-gray-500 text-xs mt-2 leading-5 italic">"{item.text}"</Text>
              </View>
            )}
            />
        </View>

        {/* 1-MONTH AVAILABILITY CALENDAR */}
        <View className="px-6 mt-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-black text-gray-800">Availability</Text>
            <View className="flex-row gap-2">
              <ChevronLeft size={20} color="#CCC" />
              <ChevronRight size={20} color="#1FA2A6" />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {monthDays.map((dateObj, idx) => {
              const d = dateObj.getDate();
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const isSelected = selectedDate === d;
              return (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => setSelectedDate(d)}
                  className={`items-center justify-center mr-3 w-14 py-4 rounded-2xl border ${isSelected ? 'bg-[#1FA2A6] border-[#1FA2A6]' : 'bg-white border-gray-100'}`}
                >
                  <Text className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{dayName}</Text>
                  <Text className={`text-sm font-black mt-1 ${isSelected ? 'text-white' : 'text-gray-800'}`}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
};

export default WorkerProfile;
