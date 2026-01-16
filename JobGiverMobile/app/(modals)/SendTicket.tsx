import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, Circle, FileText, Send } from 'lucide-react-native';

const SendTicket = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // Worker's name
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  // Dummy Ticket Bank data
  const ticketBank = [
    { id: '1', title: 'Deep Kitchen Cleaning', date: 'Jan 12, 2026', type: 'Residential' },
    { id: '2', title: 'Window Washing (Full House)', date: 'Jan 10, 2026', type: 'Residential' },
    { id: '3', title: 'Office Carpet Shampoo', date: 'Jan 05, 2026', type: 'Commercial' },
    { id: '4', title: 'Post-Party Cleanup', date: 'Dec 28, 2025', type: 'One-time' },
  ];

  const toggleTicket = (id: string) => {
    if (selectedTickets.includes(id)) {
      setSelectedTickets(selectedTickets.filter(tid => tid !== id));
    } else {
      setSelectedTickets([...selectedTickets, id]);
    }
  };

  const handleSend = () => {
    console.log(`Sending tickets ${selectedTickets} to ${name}`);
    // Add your logic to send tickets to backend here
    router.back();
  };

  return (
    <View className="flex-1 bg-[#F9F6F2]">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-6 pt-14 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#333" size={24} />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-xl font-black text-gray-800">Select Tickets</Text>
          <Text className="text-gray-400 text-xs">Sending to {name}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-500 text-sm mb-6 font-medium uppercase tracking-widest">
          Your Ticket Bank
        </Text>

        {ticketBank.map((ticket) => {
          const isSelected = selectedTickets.includes(ticket.id);
          return (
            <TouchableOpacity 
              key={ticket.id}
              onPress={() => toggleTicket(ticket.id)}
              activeOpacity={0.7}
              className={`flex-row items-center p-5 rounded-3xl mb-4 border-2 shadow-sm ${
                isSelected ? 'bg-white border-[#1FA2A6]' : 'bg-white border-transparent'
              }`}
            >
              <View className={`p-3 rounded-2xl mr-4 ${isSelected ? 'bg-[#E0F2F2]' : 'bg-gray-50'}`}>
                <FileText size={24} color={isSelected ? '#1FA2A6' : '#9CA3AF'} />
              </View>
              
              <View className="flex-1">
                <Text className="font-bold text-gray-800 text-base">{ticket.title}</Text>
                <Text className="text-gray-400 text-xs mt-1">{ticket.date} • {ticket.type}</Text>
              </View>

              {isSelected ? (
                <CheckCircle2 size={24} color="#1FA2A6" fill="#E0F2F2" />
              ) : (
                <Circle size={24} color="#D1D5DB" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Fixed Bottom Send Button */}
      <View className="p-6 bg-white border-t border-gray-100 pb-10">
        <TouchableOpacity 
          onPress={handleSend}
          disabled={selectedTickets.length === 0}
          className={`flex-row justify-center items-center py-5 rounded-3xl shadow-lg ${
            selectedTickets.length > 0 ? 'bg-[#1FA2A6]' : 'bg-gray-300'
          }`}
        >
          <Send size={20} color="white" className="mr-2" />
          <Text className="text-white font-black text-lg">
            Send {selectedTickets.length > 0 ? `(${selectedTickets.length}) ` : ''}Tickets
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendTicket;