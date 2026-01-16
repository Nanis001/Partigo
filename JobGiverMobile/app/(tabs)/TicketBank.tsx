import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Bell, Search, MapPin, Send, Plus, X, 
  Calendar, MessageCircle 
} from 'lucide-react-native';

// --- DATA INTERFACES ---
interface Applicant {
  id: string;
  name: string;
  image: string;
}

interface TicketItem {
  id: number;
  title: string;
  location: string;
  status: string;
  type: 'active' | 'applied' | 'scheduled' | 'completed';
  applicants?: Applicant[];
  scheduledWith?: string;
}

const TICKET_DATA: Record<string, TicketItem[]> = {
  'All Tickets': [
    { id: 1, title: 'Home Cleaning', location: 'Sunnydale, 2.5km away', status: 'Active', type: 'active' },
    { 
      id: 4, 
      title: 'Grocery Delivery', 
      location: 'North Side', 
      status: 'Applied', 
      type: 'applied',
      applicants: [
        { id: 'a', name: 'Alex', image: 'https://i.pravatar.cc/150?u=a' },
        { id: 'b', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=s' },
        { id: 'c', name: 'Mike', image: 'https://i.pravatar.cc/150?u=m' },
      ]
    },
    { id: 8, title: 'Car Wash', location: 'Downtown', status: 'Scheduled', type: 'scheduled', scheduledWith: 'Sarah Jenkins' }
  ],
  'Applied': [
    { 
      id: 4, 
      title: 'Grocery Delivery', 
      location: 'North Side', 
      status: '3 Applied', 
      type: 'applied',
      applicants: [
        { id: 'a', name: 'Alex', image: 'https://i.pravatar.cc/150?u=a' },
        { id: 'b', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=s' },
        { id: 'c', name: 'Mike', image: 'https://i.pravatar.cc/150?u=m' },
      ]
    }
  ],
};

export default function TicketBank() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<keyof typeof TICKET_DATA>('All Tickets');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = useMemo(() => {
    const data = TICKET_DATA[activeFilter] || [];
    return data.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeFilter, searchQuery]);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#1FA2A6] pt-12 pb-8 px-6 rounded-b-[32px] shadow-lg">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-white/10"><ArrowLeft color="white" size={24} /></TouchableOpacity>
          <Text className="text-white text-xl font-semibold">Ticket Bank</Text>
          <Bell color="white" size={24} />
        </View>
        <View className="bg-white rounded-xl flex-row items-center px-4 py-1">
          <Search color="#9CA3AF" size={20} />
          <TextInput placeholder="Search tickets..." className="flex-1 h-12 ml-2" value={searchQuery} onChangeText={setSearchQuery} />
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        {/* Category Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-6">
          {Object.keys(TICKET_DATA).map((filter) => (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setActiveFilter(filter as any)}
              className={`px-6 py-2 rounded-full mr-3 ${activeFilter === filter ? 'bg-[#1FA2A6]' : 'bg-white border border-gray-100'}`}
            >
              <Text className={`${activeFilter === filter ? 'text-white' : 'text-gray-600'}`}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="space-y-4 pb-32">
          {filteredTickets.map((ticket) => (
            <View key={ticket.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4">
              <View className="flex-row justify-between">
                <View>
                  <Text className="font-bold text-lg text-gray-800">{ticket.title}</Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#6B7280" />
                    <Text className="text-xs text-gray-500 ml-1">{ticket.location}</Text>
                  </View>
                </View>
                <View className="bg-orange-50 px-3 py-1 rounded-full h-6">
                  <Text className="text-[10px] font-bold text-[#FF7A45] uppercase">{ticket.status}</Text>
                </View>
              </View>

              {/* APPLICANT STACK UI */}
              {ticket.type === 'applied' && (
                <View className="flex-row items-center mt-4 mb-2">
                  <View className="flex-row">
                    {ticket.applicants?.map((person, index) => (
                      <Image 
                        key={person.id} 
                        source={{ uri: person.image }} 
                        className="w-8 h-8 rounded-full border-2 border-white"
                        style={{ marginLeft: index === 0 ? 0 : -12 }}
                      />
                    ))}
                  </View>
                  <Text className="text-[10px] text-gray-400 ml-3 font-medium">
                    +{ticket.applicants?.length} Workers applied
                  </Text>
                </View>
              )}

              {/* ACTION BUTTONS */}
              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity 
                  onPress={() => router.push({ pathname: '/(modals)/ticketDetails', params: { id: ticket.id } })}
                  className="flex-1 py-3 bg-[#F4EFEA] rounded-xl items-center"
                >
                  <Text className="text-[#1FA2A6] font-bold text-sm">View Details</Text>
                </TouchableOpacity>

                {ticket.type === 'applied' ? (
                  <TouchableOpacity 
                    onPress={() => router.push({ pathname: '/(common)/SchedulePage', params: { id: ticket.id } })}
                    className="flex-1 py-3 bg-[#FF7A45] rounded-xl items-center flex-row justify-center"
                  >
                    <Calendar size={14} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-sm">Schedule</Text>
                  </TouchableOpacity>
                ) : ticket.type === 'scheduled' ? (
                  <TouchableOpacity 
                    onPress={() => router.push('/(common)/ChatScreen')}
                    className="flex-1 py-3 bg-[#1FA2A6] rounded-xl items-center flex-row justify-center"
                  >
                    <MessageCircle size={14} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-sm">Chat</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity className="flex-1 py-3 bg-[#1FA2A6] rounded-xl items-center flex-row justify-center">
                    <Text className="text-white font-bold text-sm mr-2">Send</Text>
                    <Send size={14} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}