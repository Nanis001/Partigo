import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';

const AllReviews = () => {
  const router = useRouter();

  // Mock data for the Star Breakdown
  const stats = [
    { star: 5, count: 85, width: '85%' },
    { star: 4, count: 20, width: '20%' },
    { star: 3, count: 10, width: '10%' },
    { star: 2, count: 5, width: '5%' },
    { star: 1, count: 4, width: '4%' },
  ];

  return (
    <View className="flex-1 bg-white p-6">
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <ArrowLeft color="black" size={24} />
      </TouchableOpacity>

      <Text className="text-2xl font-black mb-6">Ratings and reviews</Text>

      {/* RATING BREAKDOWN (Playstore Style) */}
      <View className="flex-row items-center mb-10">
        <View className="mr-8 items-center">
          <Text className="text-5xl font-black">4.9</Text>
          <View className="flex-row mt-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#FF7A45" color="#FF7A45" />)}
          </View>
          <Text className="text-gray-400 text-xs mt-1">124 ratings</Text>
        </View>

        <View className="flex-1">
          {stats.map((item) => (
            <View key={item.star} className="flex-row items-center mb-1">
              <Text className="text-xs font-bold mr-2 w-2">{item.star}</Text>
              <View className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <View style={{ width: item.width as any }} className="h-full bg-[#1FA2A6]" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ALL REVIEWS LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {[1,2,3,4,5,6].map((i) => (
          <View key={i} className="mb-8 border-b border-gray-50 pb-4">
             <View className="flex-row justify-between mb-2">
                <Text className="font-bold text-gray-800">User {i}</Text>
                <Text className="text-gray-400 text-[10px]">Jan 12, 2026</Text>
             </View>
             <Text className="text-gray-500 text-xs leading-5">
               The service was exceptional. They went above and beyond to clean the hard-to-reach areas.
             </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AllReviews;
