import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import Film from "./screens/Film";
import Home from "./screens/Home";
import ListInfo from './screens/ListInfo';
import Lists from "./screens/Lists";
import Login from "./screens/Login";
import Notifications from "./screens/Notifications";
import Profile from "./screens/Profile";
import Recommend from "./screens/Recommend";
import Register from "./screens/Register";
import Search from "./screens/Search";

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [routeName, setRouteName] = useState("Login");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error recuperant el token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const currentRoute = navigationRef.getCurrentRoute();
      setRouteName(currentRoute?.name);
    });

    return unsubscribe;
  }, [navigationRef]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Recommend"
            component={Recommend}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Film"
            component={Film}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Notifications"
            component={Notifications}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Lists"
            component={Lists}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListInfo"
            component={ListInfo}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        {routeName !== 'Recommend' && routeName !== 'Film' && routeName !== "Login" && routeName !== "Register" && routeName !== "Lists" && routeName !== "ListInfo" && <Navbar currentPage={routeName} />}
      </NavigationContainer>
    </>
  );
}
