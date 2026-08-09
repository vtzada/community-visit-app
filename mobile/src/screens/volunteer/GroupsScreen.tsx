import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { grupoService } from '../../services/grupoService';

interface Grupo {
  id: string | number;
  nome: string;
  nomeLider?: string;
  membros?: string[];
}

export function GroupsScreen() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [nomeGrupo, setNomeGrupo] = useState('');
  const [membroInput, setMembroInput] = useState('');
  const [membros, setMembros] = useState<string[]>([]);
  const [loadingGrupo, setLoadingGrupo] = useState(false);

  async function fetchGrupos() {
    try {
      const data = await grupoService.listarGrupos();
      setGrupos(data);
    } catch (error) {
      console.log('Erro ao buscar grupos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchGrupos();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGrupos();
  }, []);

  function handleAddMembro() {
    if (!membroInput.trim()) return;
    setMembros([...membros, membroInput.trim()]);
    setMembroInput('');
  }

  function handleRemoveMembro(index: number) {
    setMembros(membros.filter((_, i) => i !== index));
  }

  async function handleCreateGroup() {
    if (!nomeGrupo.trim()) {
      Alert.alert('Atenção', 'Informe o nome do grupo.');
      return;
    }

    try {
      setLoadingGrupo(true);

      await grupoService.criarGrupo({
        nome: nomeGrupo.trim(),
        membros: membros.length > 0 ? membros : undefined,
      });

      setLoadingGrupo(false);
      setNomeGrupo('');
      setMembros([]);
      setMembroInput('');
      Alert.alert('Sucesso! 🎉', 'Grupo criado com sucesso.');
      fetchGrupos();
    } catch (error: any) {
      setLoadingGrupo(false);
      console.log('Erro detalhado ao criar grupo:', error.response?.data || error);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível criar o grupo.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={grupos}
        keyExtractor={(item, index) => String(item.id || index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EA580C" />}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Meus Grupos</Text>
            <Text style={styles.subtitle}>Crie um grupo para poder aceitar visitas.</Text>

            <View style={styles.card}>
              <Text style={styles.inputLabel}>Nome do Grupo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Grupo Esperança"
                placeholderTextColor="#A1A1AA"
                value={nomeGrupo}
                onChangeText={setNomeGrupo}
              />

              <Text style={styles.inputLabel}>Membros da Equipe</Text>
              <View style={styles.membroRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Nome do membro"
                  placeholderTextColor="#A1A1AA"
                  value={membroInput}
                  onChangeText={setMembroInput}
                />
                <TouchableOpacity style={styles.addMembroBtn} onPress={handleAddMembro}>
                  <Feather name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {membros.length > 0 && (
                <View style={styles.membrosListContainer}>
                  {membros.map((membro, index) => (
                    <View key={index} style={styles.membroChip}>
                      <Text style={styles.membroChipText}>{membro}</Text>
                      <TouchableOpacity onPress={() => handleRemoveMembro(index)}>
                        <Feather name="x" size={14} color="#EF4444" style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.confirmBtn} onPress={handleCreateGroup} disabled={loadingGrupo}>
                {loadingGrupo ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.confirmBtnText}>Criar Grupo</Text>}
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Grupos existentes</Text>
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Feather name="users" size={40} color="#D1D5DB" />
              <Text style={styles.emptyText}>Nenhum grupo criado ainda.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.grupoCard}>
            <Text style={styles.grupoNome}>{item.nome}</Text>
            <Text style={styles.grupoLider}>Líder: {item.nomeLider}</Text>
            {item.membros && item.membros.length > 0 && (
              <Text style={styles.grupoMembros}>Membros: {item.membros.join(', ')}</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  listContainer: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#1C1917' },
  subtitle: { fontSize: 13, color: '#78716C', marginTop: 4, marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F5F5F4' },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#57534E', marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: '#E7E5E4', borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 15, backgroundColor: '#FAFAF9', color: '#1C1917', marginBottom: 14 },
  membroRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  addMembroBtn: { backgroundColor: '#EA580C', height: 48, width: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  membrosListContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  membroChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FED7AA' },
  membroChipText: { fontSize: 12, fontWeight: '600', color: '#C2410C' },
  confirmBtn: { backgroundColor: '#EA580C', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1C1917', marginBottom: 12 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  emptyText: { fontSize: 14, fontWeight: '600', color: '#78716C', marginTop: 8 },
  grupoCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E7E5E4' },
  grupoNome: { fontSize: 15, fontWeight: '700', color: '#1C1917' },
  grupoLider: { fontSize: 13, color: '#57534E', marginTop: 2 },
  grupoMembros: { fontSize: 12, color: '#78716C', marginTop: 2 },
});