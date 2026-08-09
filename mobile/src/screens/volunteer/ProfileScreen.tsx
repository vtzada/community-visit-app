import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<{ nome?: string; role?: string } | null>(null);

  useEffect(() => {
    (async () => {
      const userJSON = await AsyncStorage.getItem('@CasaAcolhedora:user');
      if (userJSON) setUser(JSON.parse(userJSON));
    })();
  }, []);

  async function handleLogout() {
    Alert.alert('Encerrar Sessão', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@CasaAcolhedora:token');
          await AsyncStorage.removeItem('@CasaAcolhedora:user');
          navigation.replace('Login');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={28} color="#EA580C" />
        </View>
        <Text style={styles.nome}>{user?.nome || 'Voluntário(a)'}</Text>
        <Text style={styles.role}>{user?.role === 'ADMIN' ? 'Administrador' : 'Voluntário'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7', padding: 20 },
  header: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFEDD5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  nome: { fontSize: 20, fontWeight: '800', color: '#1C1917' },
  role: { fontSize: 13, color: '#78716C', marginTop: 4 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', height: 50, borderRadius: 14 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
});