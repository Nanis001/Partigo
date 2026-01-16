import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, CheckCircle2, MessageSquare, Clock, MoreVertical } from 'lucide-react-native';

const NOTIF_DATA = [
  { id: 1, title: 'Application Received', msg: 'Alex M. applied for "Home Cleaning"', time: '2m ago', type: 'app', unread: true },
  { id: 2, title: 'Job Completed', msg: 'Your garden is ready!', time: '1h ago', type: 'done', unread: false },
  { id: 3, title: 'Chat Message', msg: 'Sarah: Is the vacuum provided?', time: '3h ago', type: 'msg', unread: true },
];

export default function NotificationPage({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-1 bg-white">
      <View className="bg-[#1FA2A6] pt-12 pb-6 px-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={onBack}><ArrowLeft color="white" size={24} /></TouchableOpacity>
        <Text className="text-white text-lg font-bold">Notifications</Text>
        <TouchableOpacity><MoreVertical color="white" size={20} /></TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-5">
        <Text className="text-gray-400 text-xs font-bold uppercase mb-4">Recent Activity</Text>
        
        {NOTIF_DATA.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            className={`flex-row items-center p-4 rounded-2xl mb-3 ${item.unread ? 'bg-[#F4EFEA]' : 'bg-gray-50'}`}
          >
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4 shadow-sm">
              {item.type === 'app' && <Clock size={18} color="#1FA2A6" />}
              {item.type === 'done' && <CheckCircle2 size={18} color="#22c55e" />}
              {item.type === 'msg' && <MessageSquare size={18} color="#FF7A45" />}
            </View>
            
            <View className="flex-1">
              <Text className="font-bold text-gray-800 text-sm">{item.title}</Text>
              <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>{item.msg}</Text>
            </View>

            <View className="items-end">
              <Text className="text-[10px] text-gray-400">{item.time}</Text>
              {item.unread && <View className="w-2 h-2 bg-[#FF7A45] rounded-full mt-2" />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}