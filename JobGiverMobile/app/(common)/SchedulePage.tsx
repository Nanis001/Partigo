import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MoveRight,
  X,
  Plus,
  Minus,
  Briefcase,
  Home,
  Trash2,
  Edit2,
  Info,
  Navigation
} from 'lucide-react-native';
import { Slider } from '@miblanchard/react-native-slider';

const { width } = Dimensions.get('window');

// --- CONSTANTS & DATA GENERATORS ---
const START_HOUR_OF_DAY = 8; 

const TIME_SLOTS = Array.from({ length: 25 }, (_, i) => {
  const val = i * 0.5;
  let totalMinutes = val * 60;
  let hour = Math.floor(totalMinutes / 60) + START_HOUR_OF_DAY;
  let mins = Math.floor(totalMinutes % 60);
  const ampm = hour >= 12 ? (hour >= 24 ? "AM" : "PM") : "AM";
  const displayHour = hour > 12 ? (hour > 24 ? hour - 24 : hour - 12) : (hour === 0 ? 12 : hour);
  return { label: `${displayHour}:${mins === 0 ? "00" : "30"} ${ampm}`, value: val };
});

const formatTimeLabel = (val: number) => {
  const slot = TIME_SLOTS.find(s => s.value === val);
  return slot ? slot.label : "00:00";
};

// HELPER: Generates a stable Local YYYY-MM-DD string to avoid Timezone bugs
const formatLocalYMD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDaysInMonth = (monthOffset: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthOffset);
  const month = date.getMonth();
  const year = date.getFullYear();
  const days = [];
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  // Normalize today to start of day for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= lastDay; i++) {
    const currentIterDate = new Date(year, month, i);
    // Compare using timestamps
    if (currentIterDate.setHours(0,0,0,0) >= today.getTime()) {
      days.push({
        // FIX: Use local formatter instead of toISOString
        id: formatLocalYMD(new Date(year, month, i)), 
        dayName: new Date(year, month, i).toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: i,
        monthName: new Date(year, month, i).toLocaleDateString('en-US', { month: 'long' }),
      });
    }
  }
  return days;
};

const INITIAL_ADDRESSES = [
  { id: '1', label: 'Home', fullAddress: 'Flat 402, Sunshine Apts, 123 Sunnydale Ave', type: 'home', house: 'Flat 402', area: 'Sunshine Apts' },
  { id: '2', label: 'Work', fullAddress: 'Tech Park, Building 4, Sector 5', type: 'work', house: 'Building 4', area: 'Tech Park' },
];

// --- MAIN COMPONENT ---
export default function SchedulePage() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [monthOffset, setMonthOffset] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  
  // FIX: Initialize with stable local ID
  const [selectedDateIds, setSelectedDateIds] = useState<string[]>([formatLocalYMD(new Date())]);
  
  const [timeRange, setTimeRange] = useState([1, 4]);
  const [showManualTimeModal, setShowManualTimeModal] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState(0);
  
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState('1');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddrDetails, setNewAddrDetails] = useState({ house: '', area: '', label: 'Home' });

  // --- COMPUTED VALUES ---
  const monthDates = useMemo(() => getDaysInMonth(monthOffset), [monthOffset]);
  const currentMonthName = monthDates[0]?.monthName || "Select Month";
  const displayDates = isExpanded ? monthDates : monthDates.slice(0, 4);
  
  const duration = timeRange[1] - timeRange[0];
  const startTime = formatTimeLabel(timeRange[0]);
  const endTime = formatTimeLabel(timeRange[1]);
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  
  const hourlyRate = 15;
  const subtotal = duration * hourlyRate * selectedDateIds.length;
  const platformFee = 2.50;
  const finalPrice = Math.max(0, subtotal + priceAdjustment + platformFee);

  // --- ACTIONS ---
  
  // FIX: Updated logic to reliably handle multi-select toggling
  const toggleDate = (id: string) => {
    setSelectedDateIds(prev => {
      // If date is already selected
      if (prev.includes(id)) {
        // Prevent deselecting if it's the only date selected (optional UX choice, keeps at least 1)
        if (prev.length === 1) return prev; 
        return prev.filter(d => d !== id);
      } 
      // If date is not selected, add it
      else {
        return [...prev, id];
      }
    });
  };

  const handleSaveAddress = () => {
    if(!newAddrDetails.house || !newAddrDetails.area) return;
    const addrData = {
        label: newAddrDetails.label,
        fullAddress: `${newAddrDetails.house}, ${newAddrDetails.area}`,
        type: newAddrDetails.label.toLowerCase(),
        house: newAddrDetails.house,
        area: newAddrDetails.area
    };

    if (editingAddressId) {
        setAddresses(addresses.map(a => a.id === editingAddressId ? { ...a, ...addrData } : a));
        setEditingAddressId(null);
    } else {
        const newId = Math.random().toString();
        setAddresses([...addresses, { id: newId, ...addrData }]);
        setSelectedAddressId(newId);
    }
    setIsAddingAddress(false);
    setNewAddrDetails({ house: '', area: '', label: 'Home' });
  };

  const deleteAddress = (id: string) => {
    const filtered = addresses.filter(a => a.id !== id);
    setAddresses(filtered);
    if (selectedAddressId === id && filtered.length > 0) setSelectedAddressId(filtered[0].id);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* --- STICKY HEADER --- */}
      <View className="bg-[#1FA2A6] pt-14 pb-10 px-6 rounded-b-[40px] shadow-xl">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-white/10">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Booking Details</Text>
          <TouchableOpacity className="p-2">
            <MoreHorizontal color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View className="bg-white/15 border border-white/20 p-4 rounded-[28px] flex-row items-center">
          <TouchableOpacity onPress={() => router.push('/(modals)/WorkerProfile')} className="flex-row items-center flex-1">
            <View className="relative">
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }} className="w-14 h-14 rounded-full border-2 border-white" />
              <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white font-bold text-lg">Sarah Jenkins</Text>
              <View className="flex-row items-center">
                <Text className="text-white/80 text-xs mr-2">Cleaning Pro</Text>
                <View className="bg-white/20 px-2 py-[1px] rounded-md"><Text className="text-white text-[10px] font-bold">4.9 ★</Text></View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(common)/ChatScreen')} className="bg-white p-3 rounded-full shadow-lg">
            <MessageCircle color="#1FA2A6" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        
        {/* --- DATE SELECTION SECTION --- */}
        <View className="px-6 pt-8 mb-10">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setMonthOffset(prev => prev > 0 ? prev - 1 : 0)} className="mr-2 p-1">
                <ChevronLeft size={24} color={monthOffset === 0 ? "#E5E7EB" : "#1FA2A6"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowMonthDropdown(!showMonthDropdown)} className="flex-row items-center bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                <Calendar size={18} color="#1FA2A6" />
                <Text className="text-lg font-bold text-gray-800 ml-2">{currentMonthName}</Text>
                <ChevronDown size={16} color="#1FA2A6" className="ml-1" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMonthOffset(prev => prev + 1)} className="ml-2 p-1">
                <ChevronRight size={24} color="#1FA2A6" />
              </TouchableOpacity>
            </View>
            <View className="bg-[#1FA2A6]/10 px-3 py-1 rounded-lg">
              <Text className="text-[#1FA2A6] text-[10px] font-extrabold uppercase">{selectedDateIds.length} Days</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-start">
            {displayDates.map((item) => {
              const isActive = selectedDateIds.includes(item.id);
              return (
                <TouchableOpacity 
                  key={item.id} 
                  onPress={() => toggleDate(item.id)} 
                  className={`w-[18%] aspect-[4/5] rounded-2xl items-center justify-center m-[1%] border ${isActive ? 'bg-[#1FA2A6] border-[#1FA2A6] shadow-md shadow-[#1FA2A6]/30' : 'bg-[#F4EFEA] border-transparent'}`}
                >
                  <Text className={`text-[10px] font-bold uppercase mb-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>{item.dayName}</Text>
                  <Text className={`text-xl font-black ${isActive ? 'text-white' : 'text-gray-800'}`}>{item.dayNumber}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} className="w-[18%] aspect-[4/5] rounded-2xl items-center justify-center m-[1%] bg-white border border-dashed border-[#1FA2A6]/40">
              {isExpanded ? <ChevronUp color="#1FA2A6" size={24} /> : <ChevronDown color="#1FA2A6" size={24} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* --- WORK WINDOW SLIDER --- */}
        <View className="px-6 mb-10">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center"><Clock size={22} color="#1FA2A6" /><Text className="text-xl font-bold text-gray-800 ml-2">Work Window</Text></View>
            <TouchableOpacity onPress={() => setShowManualTimeModal(true)} className="flex-row items-center bg-[#1FA2A6] px-3 py-1.5 rounded-full">
              <Text className="text-white font-bold text-xs mr-1">{duration}h</Text>
              <Edit2 size={10} color="white" />
            </TouchableOpacity>
          </View>

          <View className="bg-[#F8F9FA] rounded-[40px] p-8 border border-gray-100 shadow-sm">
            <View className="flex-row items-center justify-between mb-10">
                <TouchableOpacity onPress={() => setShowManualTimeModal(true)} className="w-28">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Check-in</Text>
                    <Text className="text-2xl font-black text-gray-800">{startTime}</Text>
                </TouchableOpacity>
                <View className="bg-[#1FA2A6]/10 p-2 rounded-full"><MoveRight color="#1FA2A6" size={20} /></View>
                <TouchableOpacity onPress={() => setShowManualTimeModal(true)} className="w-28 items-end">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Checkout</Text>
                    <Text className="text-2xl font-black text-gray-800">{endTime}</Text>
                </TouchableOpacity>
            </View>
            <Slider
                value={timeRange}
                onValueChange={(val: any) => { if (val[1] > val[0]) setTimeRange(val); }}
                minimumValue={0} maximumValue={12} step={0.5}
                minimumTrackTintColor="#1FA2A6" maximumTrackTintColor="#E5E7EB"
                renderThumbComponent={() => <View className="w-8 h-8 bg-white border-[6px] border-[#1FA2A6] rounded-full shadow-md" />}
            />
             <View className="flex-row justify-between mt-4">
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">08:00 AM</Text>
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">08:00 PM</Text>
              </View>
          </View>
        </View>

        {/* --- ADDRESS MANAGEMENT --- */}
        <View className="px-6 mb-10">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center"><MapPin size={22} color="#1FA2A6" /><Text className="text-xl font-bold text-gray-800 ml-2">Service Location</Text></View>
            <TouchableOpacity onPress={() => setShowAddressModal(true)} className="p-1"><Plus size={24} color="#1FA2A6" /></TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={() => setShowAddressModal(true)} 
            className="bg-white p-5 rounded-[30px] flex-row items-center border border-gray-100 shadow-sm active:bg-gray-50"
          >
            <View className="bg-[#F4EFEA] p-4 rounded-2xl mr-4">
              {selectedAddress?.type === 'work' ? <Briefcase size={22} color="#1FA2A6" /> : <Home size={22} color="#1FA2A6" />}
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-800 text-lg mb-1">{selectedAddress?.label}</Text>
              <Text className="text-gray-500 text-xs leading-4" numberOfLines={2}>{selectedAddress?.fullAddress}</Text>
            </View>
            <View className="ml-3"><ChevronRight size={20} color="#D1D5DB" /></View>
          </TouchableOpacity>
        </View>

        {/* --- ADVANCED PRICING --- */}
        <View className="px-6 mb-10">
            <View className="bg-gray-900 rounded-[40px] p-7 shadow-2xl overflow-hidden">
                <View className="flex-row justify-between items-start mb-6">
                    <View>
                        <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Final Price</Text>
                        <Text className="text-white text-4xl font-black">${finalPrice.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row items-center bg-white/10 rounded-full p-1 border border-white/10">
                        <TouchableOpacity onPress={() => setPriceAdjustment(p => p - 5)} className="w-10 h-10 items-center justify-center rounded-full bg-white/10"><Minus size={18} color="white" /></TouchableOpacity>
                        <View className="px-3"><Text className="text-white font-bold">Offer</Text></View>
                        <TouchableOpacity onPress={() => setPriceAdjustment(p => p + 5)} className="w-10 h-10 items-center justify-center rounded-full bg-[#1FA2A6]"><Plus size={18} color="white" /></TouchableOpacity>
                    </View>
                </View>

                <View className="border-t border-white/10 pt-4 space-y-2">
                    <View className="flex-row justify-between"><Text className="text-white/40 text-xs">Standard Service ({selectedDateIds.length} days)</Text><Text className="text-white/80 text-xs">${subtotal}</Text></View>
                    <View className="flex-row justify-between mt-1"><Text className="text-white/40 text-xs">Platform & Insurance</Text><Text className="text-white/80 text-xs">$2.50</Text></View>
                    {priceAdjustment !== 0 && (
                        <View className="flex-row justify-between mt-1"><Text className="text-white/40 text-xs">Adjustment</Text><Text className={priceAdjustment > 0 ? "text-green-400 text-xs" : "text-red-400 text-xs"}>{priceAdjustment > 0 ? '+' : ''}${priceAdjustment}</Text></View>
                    )}
                </View>
            </View>
        </View>
      </ScrollView>

      {/* --- CONFIRMATION DOCK --- */}
      <View className="absolute bottom-0 left-0 right-0 p-8 bg-white/95 border-t border-gray-50">
        <TouchableOpacity className="bg-[#1FA2A6] h-16 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-[#1FA2A6]/40">
          <Text className="text-white font-black text-lg mr-3">Confirm Appointment</Text>
          <ArrowRight color="white" size={22} strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* --- BLINKIT STYLE ADDRESS MODAL --- */}
      <Modal visible={showAddressModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="bg-white rounded-t-[45px] h-[85%]">
            <View className="p-8 border-b border-gray-50 flex-row justify-between items-center">
               <Text className="text-2xl font-black text-gray-800">{isAddingAddress ? "Address Details" : "Saved Addresses"}</Text>
               <TouchableOpacity onPress={() => { setShowAddressModal(false); setIsAddingAddress(false); setEditingAddressId(null); }} className="bg-gray-100 p-2.5 rounded-full"><X size={22} color="#374151" /></TouchableOpacity>
            </View>

            {isAddingAddress ? (
                <ScrollView className="p-8">
                    <View className="mb-6">
                        <Text className="text-gray-400 font-bold mb-3 ml-1 text-[10px] uppercase tracking-tighter">Flat / House No.</Text>
                        <TextInput className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-gray-800 font-bold" placeholder="e.g. 402, Apex Tower" value={newAddrDetails.house} onChangeText={(t) => setNewAddrDetails({...newAddrDetails, house: t})}/>
                    </View>
                    <View className="mb-6">
                        <Text className="text-gray-400 font-bold mb-3 ml-1 text-[10px] uppercase tracking-tighter">Landmark / Locality</Text>
                        <TextInput className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-gray-800 font-bold" placeholder="e.g. Opposite Central Mall" value={newAddrDetails.area} onChangeText={(t) => setNewAddrDetails({...newAddrDetails, area: t})}/>
                    </View>
                    <Text className="text-gray-400 font-bold mb-4 ml-1 text-[10px] uppercase">Label As</Text>
                    <View className="flex-row mb-10">
                        {['Home', 'Work', 'Other'].map(label => (
                            <TouchableOpacity key={label} onPress={() => setNewAddrDetails({...newAddrDetails, label})} className={`mr-3 px-8 py-4 rounded-2xl border-2 ${newAddrDetails.label === label ? 'bg-[#1FA2A6] border-[#1FA2A6]' : 'bg-white border-gray-100'}`}>
                                <Text className={`font-black ${newAddrDetails.label === label ? 'text-white' : 'text-gray-400'}`}>{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity onPress={handleSaveAddress} className="bg-[#1FA2A6] py-5 rounded-[24px] items-center shadow-lg"><Text className="text-white font-black text-lg">Save & Use This Address</Text></TouchableOpacity>
                </ScrollView>
            ) : (
                <View className="flex-1">
                    <ScrollView className="p-6">
                        <TouchableOpacity className="flex-row items-center bg-blue-50 p-4 rounded-2xl mb-6 border border-blue-100">
                            <Navigation size={18} color="#2563EB" className="mr-3" />
                            <Text className="text-blue-700 font-bold">Use Current Location</Text>
                        </TouchableOpacity>
                        {addresses.map((addr) => (
                            <TouchableOpacity key={addr.id} onPress={() => setSelectedAddressId(addr.id)} className={`bg-white p-6 rounded-[32px] mb-4 flex-row items-center border-2 ${selectedAddressId === addr.id ? 'border-[#1FA2A6] bg-[#1FA2A6]/5' : 'border-gray-50'}`}>
                                <View className={`p-4 rounded-2xl mr-4 ${selectedAddressId === addr.id ? 'bg-[#1FA2A6]' : 'bg-gray-100'}`}>
                                    {addr.type === 'work' ? <Briefcase size={22} color={selectedAddressId === addr.id ? 'white' : 'gray'} /> : <Home size={22} color={selectedAddressId === addr.id ? 'white' : 'gray'} />}
                                </View>
                                <View className="flex-1">
                                    <Text className="font-black text-xl text-gray-800 mb-1">{addr.label}</Text>
                                    <Text className="text-gray-400 text-xs font-medium" numberOfLines={1}>{addr.fullAddress}</Text>
                                </View>
                                <View className="flex-row ml-2 items-center">
                                    <TouchableOpacity onPress={() => {setNewAddrDetails({house: addr.house, area: addr.area, label: addr.label}); setEditingAddressId(addr.id); setIsAddingAddress(true);}} className="p-2 mr-1"><Edit2 size={18} color="#1FA2A6" /></TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteAddress(addr.id)} className="p-2"><Trash2 size={18} color="#EF4444" /></TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <View className="p-8 bg-white border-t border-gray-50">
                        <TouchableOpacity onPress={() => { setIsAddingAddress(true); setEditingAddressId(null); }} className="flex-row items-center justify-center bg-gray-50 py-5 rounded-[24px] border border-dashed border-gray-300 mb-3">
                            <Plus color="#1FA2A6" size={22} /><Text className="text-[#1FA2A6] font-black ml-2 text-lg">Add New Address</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowAddressModal(false)} className="bg-[#1FA2A6] py-5 rounded-[24px] items-center shadow-xl"><Text className="text-white font-black text-lg">Apply Selection</Text></TouchableOpacity>
                    </View>
                </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* --- TIME PICKER MODAL --- */}
      <Modal visible={showManualTimeModal} transparent animationType="fade">
        <View className="flex-1 bg-black/70 justify-center px-8">
            <View className="bg-white rounded-[40px] p-8 shadow-2xl">
                <Text className="text-center font-black text-2xl text-gray-800 mb-8">Set Times</Text>
                <View className="flex-row justify-between h-72 mb-8">
                    <View className="flex-1 mr-3"><Text className="text-center text-gray-400 font-bold mb-3 text-[10px] uppercase">Start</Text><ScrollView className="bg-gray-50 rounded-3xl" showsVerticalScrollIndicator={false}>{TIME_SLOTS.map(t => (<TouchableOpacity key={`s-${t.label}`} onPress={() => setTimeRange([t.value, Math.max(t.value + 0.5, timeRange[1])])} className={`py-4 rounded-2xl ${timeRange[0] === t.value ? 'bg-[#1FA2A6]' : ''}`}><Text className={`text-center font-black ${timeRange[0] === t.value ? 'text-white' : 'text-gray-400'}`}>{t.label}</Text></TouchableOpacity>))}</ScrollView></View>
                    <View className="flex-1 ml-3"><Text className="text-center text-gray-400 font-bold mb-3 text-[10px] uppercase">End</Text><ScrollView className="bg-gray-50 rounded-3xl" showsVerticalScrollIndicator={false}>{TIME_SLOTS.map(t => (<TouchableOpacity key={`e-${t.label}`} onPress={() => { if(t.value > timeRange[0]) setTimeRange([timeRange[0], t.value]); }} className={`py-4 rounded-2xl ${timeRange[1] === t.value ? 'bg-[#1FA2A6]' : ''}`}><Text className={`text-center font-black ${timeRange[1] === t.value ? 'text-white' : 'text-gray-400'}`}>{t.label}</Text></TouchableOpacity>))}</ScrollView></View>
                </View>
                <TouchableOpacity onPress={() => setShowManualTimeModal(false)} className="bg-[#1FA2A6] py-5 rounded-[24px] shadow-lg"><Text className="text-center text-white font-black text-lg">Apply Time Window</Text></TouchableOpacity>
            </View>
        </View>
      </Modal>
    </View>
  );
}