import React, { useState, useRef } from 'react';
import { 
  View, Text, Image, ScrollView, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, StatusBar, Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, MoreVertical, Phone, Video, PlusCircle, 
  Smile, Send, CheckCheck, X, Reply as ReplyIcon
} from 'lucide-react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import EmojiPicker, { EmojiType } from 'rn-emoji-keyboard';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

// --- TYPES ---
interface ChatMessage {
  id: number;
  type: 'me' | 'worker' | 'service';
  text: string;
  time: string;
  price?: string; // Optional: only for service offers
  replyTo?: {     // Optional: for swiped replies
    text: string;
    sender: string;
  } | null;
}

const ChatScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { showActionSheetWithOptions } = useActionSheet();
  
  // --- STATE ---
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      id: 1, 
      type: 'worker', 
      text: "Hi! I'm on my way now. Should be there in about 15 minutes.", 
      time: '1:45 PM',
      replyTo: null 
    },
    { 
      id: 2, 
      type: 'me', 
      text: "Great, thanks for letting me know! The gate code is 4589.", 
      time: '1:46 PM',
      replyTo: null 
    },
    { 
      id: 3, 
      type: 'service', 
      text: "I noticed you requested extra cleaning for the oven. I can add that for $20?", 
      time: '1:48 PM', 
      price: '$20.00',
      replyTo: null 
    },
  ]);

  // --- HANDLERS ---
  const handleSend = () => {
    if (message.trim().length === 0) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      type: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replyTo: replyTo ? { 
        text: replyTo.text, 
        sender: replyTo.type === 'me' ? 'You' : 'Sarah' 
      } : null,
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
    setReplyTo(null);
  };

  const openPlusMenu = () => {
    const options = ['Camera', 'Gallery', 'Document', 'Location', 'Audio', 'Contact', 'Cancel'];
    showActionSheetWithOptions({ options, cancelButtonIndex: 6 }, (i) => {
      if (i !== undefined && i !== 6) Alert.alert("Option", options[i]);
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <StatusBar barStyle="light-content" />

        {/* HEADER SECTION */}
        <View className="bg-[#1FA2A6] pt-14 pb-6 px-6 rounded-b-[30px]">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl">Chat with Worker</Text>
            <TouchableOpacity>
              <MoreVertical color="white" size={24} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between">
            <TouchableOpacity 
              onPress={() => router.push('/(modals)/WorkerProfile')}
              className="flex-row items-center flex-1"
            >
              <View className="relative">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ff955c461f' }} 
                  className="w-14 h-14 rounded-full border-2 border-white" 
                />
                <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-[#1FA2A6] rounded-full" />
              </View>
              <View className="ml-3">
                <Text className="text-white font-bold text-lg">Sarah Jenkins</Text>
                <Text className="text-white/80 text-xs">Professional Cleaner • 4.9 ★</Text>
              </View>
            </TouchableOpacity>

            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-white/20 p-3 rounded-full">
                <Phone color="white" size={20} />
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/20 p-3 rounded-full">
                <Video color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <ScrollView 
            ref={scrollViewRef}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {/* CURRENT JOB CARD */}
            <View className="px-6 py-4">
              <View className="bg-[#F4EFEA] p-4 rounded-3xl border border-gray-100 shadow-sm">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Job</Text>
                    <Text className="text-[#1FA2A6] font-bold text-base">Home Cleaning - 2 Bedroom</Text>
                    <Text className="text-gray-400 text-xs mt-0.5">Today, 2:00 PM - 5:00 PM</Text>
                  </View>
                  <View className="gap-2">
                    <TouchableOpacity className="bg-white px-4 py-2 rounded-xl border border-gray-200">
                      <Text className="text-xs font-bold text-gray-700">Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-[#FF7A45]/10 px-4 py-2 rounded-xl">
                      <Text className="text-xs font-bold text-[#FF7A45]">Negotiate</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* MESSAGES LIST */}
            <View className="px-6">
              {chatHistory.map((item) => (
                <Swipeable
                  key={item.id}
                  renderLeftActions={() => (
                    <View className="justify-center px-6"><ReplyIcon color="#1FA2A6" size={20}/></View>
                  )}
                  onSwipeableWillOpen={() => setReplyTo(item)}
                >
                  <View className={`mb-6 ${item.type === 'me' ? 'items-end' : 'flex-row items-end'}`}>
                    {item.type !== 'me' && (
                      <Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ff955c461f' }} className="w-8 h-8 rounded-full mr-2" />
                    )}
                    <View className={`max-w-[80%] ${item.type === 'service' ? 'max-w-[85%]' : ''}`}>
                      <View className={`p-4 rounded-3xl ${item.type === 'me' ? 'bg-[#1FA2A6] rounded-br-none' : 'bg-[#F4EFEA] rounded-bl-none'}`}>
                        {item.replyTo && (
                          <View className="bg-black/5 border-l-4 border-[#1FA2A6] p-2 mb-2 rounded-r-md">
                            <Text className="text-[10px] font-bold text-[#1FA2A6]">{item.replyTo.sender}</Text>
                            <Text className="text-xs text-gray-500" numberOfLines={1}>{item.replyTo.text}</Text>
                          </View>
                        )}
                        <Text className={`${item.type === 'me' ? 'text-white' : 'text-gray-800'} text-sm leading-5`}>{item.text}</Text>
                        
                        {item.type === 'service' && (
                          <View className="bg-white p-3 rounded-2xl border border-gray-50 mt-3">
                            <View className="flex-row justify-between items-center mb-3">
                              <Text className="text-[10px] font-black text-gray-400 tracking-tighter">ADDITIONAL SERVICE</Text>
                              <Text className="text-sm font-black text-[#1FA2A6]">{item.price}</Text>
                            </View>
                            <View className="flex-row gap-2">
                              <TouchableOpacity onPress={() => Alert.alert("Accepted")} className="flex-1 bg-[#1FA2A6] py-2 rounded-xl items-center"><Text className="text-white font-bold text-xs">Accept</Text></TouchableOpacity>
                              <TouchableOpacity onPress={() => Alert.alert("Declined")} className="flex-1 bg-gray-100 py-2 rounded-xl items-center"><Text className="text-gray-500 font-bold text-xs">Decline</Text></TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>
                      <View className={`flex-row mt-1 items-center ${item.type === 'me' ? 'justify-end' : ''}`}>
                        <Text className="text-[9px] text-gray-400 mr-1">{item.time}</Text>
                        {item.type === 'me' && <CheckCheck size={12} color="#1FA2A6" />}
                      </View>
                    </View>
                  </View>
                </Swipeable>
              ))}
            </View>
          </ScrollView>

          {/* REPLY & INPUT AREA */}
          <View className="bg-white border-t border-gray-50">
            {replyTo && (
              <Animated.View entering={FadeInDown} exiting={FadeOutDown} className="px-6 py-2 bg-gray-50 flex-row items-center">
                <View className="flex-1 border-l-4 border-[#1FA2A6] pl-3">
                  <Text className="text-[#1FA2A6] font-bold text-xs">{replyTo.type === 'me' ? 'You' : 'Sarah'}</Text>
                  <Text className="text-gray-500 text-xs" numberOfLines={1}>{replyTo.text}</Text>
                </View>
                <TouchableOpacity onPress={() => setReplyTo(null)}><X size={18} color="#9CA3AF" /></TouchableOpacity>
              </Animated.View>
            )}
            <View className="p-4 flex-row items-center gap-3 pb-8">
              <TouchableOpacity onPress={openPlusMenu}><PlusCircle color="#9CA3AF" size={28} /></TouchableOpacity>
              <View className="flex-1 bg-[#F4EFEA] rounded-full px-4 py-1.5 flex-row items-center">
                <TextInput 
                  placeholder="Type a message..." 
                  className="flex-1 py-2 text-sm" 
                  value={message} 
                  onChangeText={setMessage}
                  multiline
                />
                <TouchableOpacity onPress={() => setIsEmojiPickerOpen(true)}><Smile color="#9CA3AF" size={22} /></TouchableOpacity>
              </View>
              <TouchableOpacity 
                onFocus={() => setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200)}
                onPress={handleSend}
                className={`p-3 rounded-full ${message.trim() ? 'bg-[#1FA2A6]' : 'bg-gray-300'}`}
              >
                <Send color="white" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        <EmojiPicker
          onEmojiSelected={(e: EmojiType) => setMessage(prev => prev + e.emoji)}
          open={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ChatScreen;