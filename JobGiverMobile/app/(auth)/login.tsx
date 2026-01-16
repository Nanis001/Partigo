import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function Login() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <Link href="/register">Go to Register</Link>
      <Button title="Login" onPress={() => {}} />
    </View>
  );
}