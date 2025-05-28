import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Navbar from "./components/Navbar";
import { useUserInfo } from "./hooks/useUserInfo";

import { ActivityIndicator } from 'react-native-paper';
import ActorInfo from "./screens/ActorInfo";
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
import UserProfile from './screens/UserProfile';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [routeName, setRouteName] = useState("Login");
  const [isReady, setIsReady] = useState(false);
  const [isModalizeOpen, setIsModalizeOpen] = useState(false);

  const { loading, unauthenticated } = useUserInfo();

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      return true;
    }
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  };

  useEffect(() => {
    checkToken();

    const interval = setInterval(async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token || isTokenExpired(token)) {
        await AsyncStorage.removeItem('authToken');
        setIsAuthenticated(false);
        const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
        if (navigationRef.current && !["Register", "Login"].includes(currentRoute)) {
          navigationRef.navigate("Login");
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (unauthenticated) {
      setIsAuthenticated(false);
      if (navigationRef.current) navigationRef.navigate("Login");
    }
  }, [unauthenticated]);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const currentRoute = navigationRef.getCurrentRoute();
      setRouteName(currentRoute?.name);
    });
    return unsubscribe;
  }, [navigationRef]);

  if (loading || checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1F1D36' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1F1D36' }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>;
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer ref={navigationRef} onReady={() => setIsReady(true)}>
        <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
          <Stack.Screen name="Recommend" component={Recommend} options={{ headerShown: false }} />
          <Stack.Screen name="Film" component={Film} options={{ headerShown: false }} />
          <Stack.Screen name="ActorInfo" component={ActorInfo} options={{ headerShown: false }} />
          <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" options={{ headerShown: false }}>
            {(props) => <Profile {...props} setIsModalizeOpen={setIsModalizeOpen} />}
          </Stack.Screen>
          <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
          <Stack.Screen name="Lists" component={Lists} options={{ headerShown: false }} />
          <Stack.Screen name="ListInfo" component={ListInfo} options={{ headerShown: false }} />
        </Stack.Navigator>

        {!isModalizeOpen &&
          !["Recommend", "Film", "Login", "Register", "Lists", "ListInfo", "ActorInfo"].includes(routeName) && (
            <Navbar currentPage={routeName} />
          )}
      </NavigationContainer>
    </>
  );
}
