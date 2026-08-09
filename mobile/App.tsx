import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from './src/screens/SplashScreen';
import { WelcomeScreen } from './src/screens/public/WelcomeScreen';
import { RequestVisitScreen } from './src/screens/public/RequestVisitScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { MainTabs } from './src/navigation/MainTabs';
import { ConsultarVisitaScreen } from './src/screens/public/ConsultVisitScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RequestVisit" component={RequestVisitScreen} />
        <Stack.Screen name="ConsultarVisita" component={ConsultarVisitaScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="VolunteerDashboard" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}