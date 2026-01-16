import { Tabs } from "expo-router";
import CustomTabBar from "../../component/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="TicketBank" />
      <Tabs.Screen name="CreateTicket" />
      <Tabs.Screen name="TopRanked" />
      <Tabs.Screen name="about" />
    </Tabs>
  );
}
