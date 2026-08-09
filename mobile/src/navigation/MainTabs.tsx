import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { RequestsListScreen } from '../screens/volunteer/RequestsListScreen';
import { MyVisitsScreen } from '../screens/volunteer/MyVisitScreen';
import { GroupsScreen } from '../screens/volunteer/GroupsScreen';
import { ProfileScreen } from '../screens/volunteer/ProfileScreen';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EA580C',
        tabBarInactiveTintColor: '#A8A29E',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopColor: '#F5F5F4',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Solicitacoes"
        component={RequestsListScreen}
        options={{
          title: 'Solicitações',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      
      {/* 2. ADICIONAMOS A NOVA ABA AQUI */}
      <Tab.Screen
        name="MinhasVisitas"
        component={MyVisitsScreen}
        options={{
          title: 'Minhas Visitas',
          tabBarIcon: ({ color, size }) => <Feather name="check-square" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Grupos"
        component={GroupsScreen}
        options={{
          title: 'Grupos',
          tabBarIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}