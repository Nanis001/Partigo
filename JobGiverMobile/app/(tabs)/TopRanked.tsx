import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { 
  ArrowLeft, Star, Award, Filter, 
  Zap, ShieldCheck, Target, Crown 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getInitials } from '../../utils/helperFunctions';

// 1. Enhanced Mock Data with Images & IDs
const TOP_WORKERS = [
  { id: '1', name: 'Alex M.', role: 'Elite Tasker', rating: 4.9, jobs: 124, points: 2850, badge: 'fastest', level: 1, img: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Sarah J.', role: 'Cleaning Expert', rating: 4.8, jobs: 98, points: 2420, badge: 'reliable', level: 2, img: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Mike R.', role: 'Pet Specialist', rating: 4.7, jobs: 85, points: 2100, badge: 'expert', level: 3, img: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Emma W.', role: 'Gardener', rating: 4.9, jobs: 76, points: 1950, badge: 'reliable', level: 4, img: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'David K.', role: 'Handyman', rating: 4.6, jobs: 62, points: 1800, badge: 'fastest', level: 5, img: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: '6', name: 'Linda P.', role: 'Office Assist', rating: 4.5, jobs: 58, points: 1720, badge: 'expert', level: 6, img: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { id: '7', name: 'Chris B.', role: 'Car Detailer', rating: 4.7, jobs: 54, points: 1650, badge: 'fastest', level: 7, img: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: '8', name: 'Anna S.', role: 'Delivery Pro', rating: 4.8, jobs: 49, points: 1580, badge: 'reliable', level: 8, img: 'https://randomuser.me/api/portraits/women/8.jpg' },
  { id: '9', name: 'John D.', role: 'Tech Support', rating: 4.4, jobs: 42, points: 1400, badge: 'expert', level: 9, img: 'https://randomuser.me/api/portraits/men/9.jpg' },
  { id: '10', name: 'Maria L.', role: 'Event Help', rating: 4.6, jobs: 38, points: 1250, badge: 'fastest', level: 10, img: 'https://randomuser.me/api/portraits/women/10.jpg' },
];

const BadgeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'fastest': return <View className="bg-blue-100 p-1 rounded-md"><Zap size={12} color="#3b82f6" /></View>;
    case 'reliable': return <View className="bg-green-100 p-1 rounded-md"><ShieldCheck size={12} color="#22c55e" /></View>;
    case 'expert': return <View className="bg-purple-100 p-1 rounded-md"><Target size={12} color="#a855f7" /></View>;
    default: return null;
  }
};


export default function TopRanked({ onBack }: { onBack: () => void }) {
  const router = useRouter();

  // Navigation Logic
  const handleProfilePress = (worker: any) => {
    router.push({
      pathname: "/WorkerProfile", // This should point to your WorkerProfile file
      params: { 
        id: worker.id,
        name: worker.name,
        role: worker.role,
        img: worker.img,
        rating: worker.rating.toString()
      }
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* HEADER SECTION */}
      <View className="bg-[#1FA2A6] pt-14 pb-24 px-6 rounded-b-[40px] shadow-lg">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={onBack} className="p-2 rounded-full bg-white/10 active:opacity-60">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold tracking-tight">Top Ranked</Text>
          <TouchableOpacity className="p-2 rounded-full bg-white/10 active:opacity-60">
            <Crown color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* THE PODIUM (Top 3) */}
      <View className="flex-row justify-center items-end px-5 -mt-16 mb-8">
        {/* Podium Rank 2 (Sarah J.) */}
        <TouchableOpacity 
          onPress={() => handleProfilePress(TOP_WORKERS[1])}
          className="items-center mx-2 active:scale-95"
        >
          <View className="w-16 h-16 rounded-full border-2 border-gray-200 bg-white items-center justify-center p-1 shadow-md">
            <View className="w-full h-full rounded-full bg-gray-50 items-center justify-center">
              <Text className="text-gray-400 font-bold">{getInitials(TOP_WORKERS[1].name)}</Text>
            </View>
          </View>
          <Text className="text-gray-800 font-bold mt-2 text-xs">{TOP_WORKERS[1].name}</Text>
        
        </TouchableOpacity>

        {/* Podium Rank 1 (Alex M.) */}
        <TouchableOpacity 
          onPress={() => handleProfilePress(TOP_WORKERS[0])}
          className="items-center mx-2 active:scale-95"
        >
          <Award size={24} color="#ff8f45" className="mb-1" />
          <View className="w-24 h-24 rounded-full border-4 border-[#4bff45] bg-white items-center justify-center p-1 shadow-xl">
            <View className="w-full h-full rounded-full bg-orange-50 items-center justify-center">
              <Text className="text-[#FF7A45] font-bold text-lg">{getInitials(TOP_WORKERS[0].name)}</Text>
            </View>
          </View>
          <Text className="text-gray-800 font-bold mt-3 text-sm">{TOP_WORKERS[0].name}</Text>
          
        </TouchableOpacity>

        {/* Podium Rank 3 (Mike R.) */}
        <TouchableOpacity 
          onPress={() => handleProfilePress(TOP_WORKERS[2])}
          className="items-center mx-2 active:scale-95"
        >
          <View className="w-16 h-16 rounded-full border-2 border-orange-200 bg-white items-center justify-center p-1 shadow-md">
            <View className="w-full h-full rounded-full bg-orange-50 items-center justify-center">
              <Text className="text-orange-300 font-bold">{getInitials(TOP_WORKERS[2].name)}</Text>
            </View>
          </View>
          <Text className="text-gray-800 font-bold mt-2 text-xs">{TOP_WORKERS[2].name}</Text>
          
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE LIST */}
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row justify-between items-center mb-4 px-2">
          <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Worker Rankings</Text>
          <TouchableOpacity className="flex-row items-center bg-gray-200/50 px-3 py-1.5 rounded-full">
            <Filter size={12} color="#6B7280" />
            <Text className="text-gray-500 text-[10px] ml-1 font-bold">Monthly</Text>
          </TouchableOpacity>
        </View>

        {TOP_WORKERS.slice(3).map((worker) => (
          <TouchableOpacity 
            key={worker.id} 
            onPress={() => handleProfilePress(worker)}
            className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-gray-100 shadow-sm active:opacity-80 active:scale-[0.98]"
          >
            <Text className="text-gray-300 font-black w-6 text-center text-xs">{worker.level}</Text>
            
            <View className="w-11 h-11 rounded-full bg-[#F4EFEA] items-center justify-center mx-3 border border-gray-50">
              <Text className="text-[#1FA2A6] font-bold text-xs">{getInitials(worker.name)}</Text>
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-gray-800 font-bold text-sm mr-2">{worker.name}</Text>
                <BadgeIcon type={worker.badge} />
              </View>
              <Text className="text-gray-400 text-[10px] mt-0.5">{worker.role}</Text>
            </View>

            <View className="items-end">
              <View className="flex-row items-center mb-1">
                <Star size={10} color="#FF7A45" fill="#FF7A45" />
                <Text className="text-gray-800 font-bold text-xs ml-1">{worker.rating}</Text>
              </View>
              
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FLOATING SELF RANK CARD */}
      <View className="absolute bottom-6 left-5 right-5 bg-white rounded-3xl p-4 shadow-2xl border border-gray-100 flex-row items-center">
         <View className="w-10 h-10 rounded-full bg-[#1FA2A6] items-center justify-center mr-3 shadow-inner">
            <Text className="text-white font-bold text-xs">42</Text>
         </View>
         <View className="flex-1">
            <Text className="text-gray-800 font-bold text-xs">Your Current Rank</Text>
            <Text className="text-gray-500 text-[10px]">1,020 pts • <Text className="text-[#FF7A45] font-bold">Top 5%</Text></Text>
         </View>
         <TouchableOpacity className="bg-[#1FA2A6] px-5 py-2.5 rounded-xl active:opacity-90">
            <Text className="text-white font-bold text-[10px]">Level Up</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}