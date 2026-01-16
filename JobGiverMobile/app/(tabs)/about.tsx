import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Dimensions
} from 'react-native';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Briefcase, 
  Zap, 
  ShieldCheck, 
  CircleDollarSign,
  Home,
  Search,
  Plus,
  ShoppingBasket,
  User,
  Facebook,
  Info
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const About = () => {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* --- HEADER SECTION --- */}
        <View 
          className="bg-[#1FA2A6] pt-14 pb-16 px-6 items-center"
          style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}
        >
          {/* Top Navigation Row */}
          <View className="flex-row items-center justify-between w-full mb-6">
            <TouchableOpacity className="p-2 rounded-full bg-white/20">
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold">About Us</Text>
            <TouchableOpacity className="p-2 rounded-full bg-white/20">
              <MoreHorizontal color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Logo / App Icon */}
          <View className="bg-white w-24 h-24 rounded-full items-center justify-center shadow-lg mb-4">
            <Briefcase color="#1FA2A6" size={40} strokeWidth={1.5} />
          </View>
          
          <Text className="text-white text-3xl font-bold text-center">PartTimeMatch</Text>
          <Text className="text-white/80 text-sm mt-1 text-center">
            Connecting Talent with Opportunity
          </Text>
        </View>

        {/* --- MAIN CONTENT --- */}
        <View className="px-6 -mt-8">
          
          {/* Mission Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-gray-100">
            <View className="flex-row items-center mb-3">
              <Zap color="#FF7A45" size={20} fill="#FF7A45" />
              <Text className="text-lg font-bold ml-2 text-gray-800">Our Mission</Text>
            </View>
            <Text className="text-gray-500 text-sm leading-6">
              We empower individuals to find meaningful part-time work that fits their schedule, 
              while helping businesses discover reliable local talent instantly.
            </Text>
          </View>

          {/* Statistics Grid */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-[#F4EFEA] rounded-2xl p-5 items-center justify-center">
              <Text className="text-[#FF7A45] text-3xl font-bold">12k+</Text>
              <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">
                Jobs Posted
              </Text>
            </View>
            <View className="flex-1 bg-[#F4EFEA] rounded-2xl p-5 items-center justify-center">
              <Text className="text-[#1FA2A6] text-3xl font-bold">98%</Text>
              <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">
                Success Rate
              </Text>
            </View>
          </View>

          {/* Why Choose Us Section */}
          <Text className="text-lg font-bold mb-4 text-gray-800 ml-1">Why Choose Us?</Text>
          
          {/* Feature 1 */}
          <View className="bg-white rounded-2xl p-4 flex-row items-start mb-4 shadow-sm border border-gray-50">
            <View className="bg-[#1FA2A6]/10 p-3 rounded-full mr-4">
              <ShieldCheck color="#1FA2A6" size={22} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-800 mb-1">Trusted Community</Text>
              <Text className="text-xs text-gray-500 leading-5">
                All users are verified to ensure a safe and secure environment for everyone.
              </Text>
            </View>
          </View>

          {/* Feature 2 */}
          <View className="bg-white rounded-2xl p-4 flex-row items-start mb-8 shadow-sm border border-gray-50">
            <View className="bg-[#FF7A45]/10 p-3 rounded-full mr-4">
              <CircleDollarSign color="#FF7A45" size={22} />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-800 mb-1">Fair Negotiation</Text>
              <Text className="text-xs text-gray-500 leading-5">
                Negotiate payments directly within the app with our transparent bidding system.
              </Text>
            </View>
          </View>

          {/* Help / Support Gradient Card */}
          <View className="bg-[#1FA2A6] rounded-[32px] p-8 mb-8 overflow-hidden relative">
            <View className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
            <View className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full" />
            
            <Text className="text-white text-xl font-bold mb-2">Need Help?</Text>
            <Text className="text-white/90 text-sm mb-6">
              Our support team is available 24/7 to assist with any questions.
            </Text>
            
            <TouchableOpacity className="bg-white rounded-2xl py-4 items-center shadow-md active:bg-gray-50">
              <Text className="text-[#1FA2A6] font-bold">Contact Support</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View className="items-center pb-32">
            <Text className="text-gray-400 text-xs">Version 2.4.0</Text>
            <View className="flex-row mt-4 gap-6">
              <TouchableOpacity><Facebook color="#D1D5DB" size={20} /></TouchableOpacity>
              <TouchableOpacity><Info color="#D1D5DB" size={20} /></TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper Component for Nav Items
const NavIcon = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <TouchableOpacity className="items-center gap-1">
    {icon}
    <Text className={`text-[10px] font-medium ${active ? 'text-[#1FA2A6]' : 'text-gray-400'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default About;