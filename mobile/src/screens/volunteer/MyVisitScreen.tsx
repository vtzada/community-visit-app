import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Linking,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { visitService } from '../../services/visitService';

interface Endereco {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
  complemento?: string;
}

interface Solicitacao {
  id?: number;
  nomeSolicitante?: string;
  telefoneSolicitante?: string;
  pedidoOracao?: string;
  endereco?: Endereco;
}

interface Visita {
  id: string | number;
  statusVisita?: string;
  status?: string; 
  dataHoraVisita?: string;
  solicitacao?: Solicitacao;
}

export function MyVisitsScreen() {
  const [allVisits, setAllVisits] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'AGENDADA' | 'REALIZADA'>('AGENDADA');
  
  const [selectedVisit, setSelectedVisit] = useState<Visita | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Estados novos para o fluxo de remarcação
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');

  async function fetchMyVisits() {
    try {
      const data = await visitService.listarVisitas();
      setAllVisits(data);
    } catch (error: any) {
      console.log('Erro ao buscar minhas visitas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchMyVisits();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyVisits();
  }, []);

  function openDetails(visit: Visita) {
    setSelectedVisit(visit);
    setModalVisible(true);
    setIsRescheduling(false); // Garante que abra na tela de detalhes padrão
    setNewDate('');
  }

  function closeDetails() {
    setModalVisible(false);
    setSelectedVisit(null);
    setIsRescheduling(false);
    setNewDate('');
  }

  async function handleConcluirVisita() {
    if (!selectedVisit) return;
    try {
      setProcessing(true);
      await visitService.concluirVisita(selectedVisit.id);
      Alert.alert('Sucesso! 🌟', 'Visita marcada como realizada com sucesso!');
      closeDetails();
      fetchMyVisits();
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível concluir a visita.');
    } finally {
      setProcessing(false);
    }
  }

  // NOVA FUNÇÃO: Validar e enviar a remarcação
  async function handleSubmitRemarcacao() {
    if (!selectedVisit) return;

    // Validação básica do formato DD/MM/AAAA
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(newDate)) {
      Alert.alert('Data Inválida', 'Por favor, digite a data no formato DD/MM/AAAA (ex: 25/12/2026)');
      return;
    }

    // Converte de DD/MM/AAAA para YYYY-MM-DD para o backend
    const [dia, mes, ano] = newDate.split('/');
    const formattedDate = `${ano}-${mes}-${dia}`;

    try {
      setProcessing(true);
      await visitService.remarcarVisita(Number(selectedVisit.id), formattedDate);
      Alert.alert('Sucesso! 🗓️', 'Sua visita foi remarcada.');
      closeDetails();
      fetchMyVisits();
    } catch (error: any) {
      console.log('Erro ao remarcar:', error.response?.data || error);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível remarcar a visita.');
    } finally {
      setProcessing(false);
    }
  }

  // Máscara simples para o input de data (DD/MM/AAAA)
  function handleDateChange(text: string) {
    let formattedText = text.replace(/\D/g, '');
    if (formattedText.length > 2) formattedText = formattedText.replace(/^(\d{2})(\d)/, '$1/$2');
    if (formattedText.length > 5) formattedText = formattedText.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setNewDate(formattedText.substring(0, 10));
  }

  function handleOpenWhatsApp() {
    const telefone = selectedVisit?.solicitacao?.telefoneSolicitante;
    const nome = selectedVisit?.solicitacao?.nomeSolicitante || 'amigo(a)';

    if (!telefone) {
      Alert.alert('Aviso', 'Esta solicitação não possui um número de telefone cadastrado.');
      return;
    }

    let apenasNumeros = telefone.replace(/\D/g, '');
    if (!apenasNumeros.startsWith('55')) apenasNumeros = '55' + apenasNumeros;

    const mensagem = `Olá, ${nome}! A paz do Senhor! Somos do grupo de visitas da igreja. Passando para avisar que já estamos a caminho! 🚗✨`;
    const url = `https://wa.me/${apenasNumeros}?text=${encodeURIComponent(mensagem)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    });
  }

  const filteredVisits = allVisits.filter(v => {
    const status = String(v.statusVisita || v.status || 'AGENDADA').toUpperCase();
    return status === activeTab;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Minhas Visitas</Text>
        <Text style={styles.subtitle}>Gerencie as visitas aceitas pelo seu grupo.</Text>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'AGENDADA' && styles.activeTab]}
            onPress={() => setActiveTab('AGENDADA')}
          >
            <Text style={[styles.tabText, activeTab === 'AGENDADA' && styles.activeTabText]}>A Fazer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'REALIZADA' && styles.activeTab]}
            onPress={() => setActiveTab('REALIZADA')}
          >
            <Text style={[styles.tabText, activeTab === 'REALIZADA' && styles.activeTabText]}>Histórico</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EA580C" />
          <Text style={styles.loadingText}>Carregando visitas...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVisits}
          keyExtractor={(item, index) => String(item.id || index)}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EA580C" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name={activeTab === 'AGENDADA' ? "calendar" : "check-circle"} size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                {activeTab === 'AGENDADA' ? 'Nenhuma visita pendente' : 'Nenhuma visita concluída'}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const sol = item.solicitacao || {};
            const isCompleted = activeTab === 'REALIZADA';

            return (
              <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => openDetails(item)}>
                <View style={styles.cardHeader}>
                  <View style={styles.visitorInfo}>
                    <Feather name="user" size={16} color={isCompleted ? "#16A34A" : "#EA580C"} style={{ marginRight: 6 }} />
                    <Text style={styles.visitorName}>{sol.nomeSolicitante || 'Visitante'}</Text>
                  </View>
                  <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted]}>
                    <Text style={[styles.statusText, isCompleted && styles.statusTextCompleted]}>
                      {isCompleted ? 'CONCLUÍDA' : 'AGENDADA'}
                    </Text>
                  </View>
                </View>

                {item.dataHoraVisita && (
                  <View style={styles.cardDetail}>
                    <Feather name="clock" size={14} color="#78716C" style={{ marginRight: 6 }} />
                    <Text style={styles.detailText}>Data/Hora: {item.dataHoraVisita.replace('T', ' às ')}</Text>
                  </View>
                )}
                
                <View style={styles.viewMoreContainer}>
                  <Text style={styles.viewMoreText}>Ver detalhes</Text>
                  <Feather name="chevron-right" size={16} color="#A8A29E" />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeDetails}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isRescheduling ? 'Remarcar Visita' : 'Detalhes da Visita'}
              </Text>
              <TouchableOpacity onPress={closeDetails} style={styles.closeButton}>
                <Feather name="x" size={24} color="#57534E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedVisit && !isRescheduling && (
                <View style={styles.modalBody}>
                  <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Solicitante</Text>
                    <Text style={styles.infoValue}>{selectedVisit.solicitacao?.nomeSolicitante || 'Não informado'}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Telefone / Contato</Text>
                    <View style={styles.phoneRow}>
                      <Text style={[styles.infoValue, { flex: 1 }]}>
                        {selectedVisit.solicitacao?.telefoneSolicitante || 'Não informado'}
                      </Text>
                      {selectedVisit.solicitacao?.telefoneSolicitante && activeTab === 'AGENDADA' && (
                        <TouchableOpacity style={styles.whatsappBtn} onPress={handleOpenWhatsApp} activeOpacity={0.8}>
                          <Feather name="message-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                          <Text style={styles.whatsappBtnText}>Avisar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Endereço</Text>
                    <Text style={styles.infoValue}>
                      {selectedVisit.solicitacao?.endereco 
                        ? `${selectedVisit.solicitacao.endereco.logradouro || ''}, nº ${selectedVisit.solicitacao.endereco.numero || ''} - ${selectedVisit.solicitacao.endereco.bairro || ''}`
                        : 'Endereço não informado'}
                    </Text>
                  </View>

                  {selectedVisit.solicitacao?.pedidoOracao && (
                    <View style={styles.infoGroup}>
                      <Text style={styles.infoLabel}>Pedido de Oração</Text>
                      <Text style={styles.infoValue}>{selectedVisit.solicitacao.pedidoOracao}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* TELA DE REMARCAÇÃO DENTRO DO MODAL */}
              {selectedVisit && isRescheduling && (
                <View style={styles.modalBody}>
                  <Text style={styles.infoValue}>
                    Digite a nova data para visitar {selectedVisit.solicitacao?.nomeSolicitante}:
                  </Text>
                  
                  <View style={styles.inputContainer}>
                    <Feather name="calendar" size={20} color="#A8A29E" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.dateInput}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#A8A29E"
                      keyboardType="numeric"
                      maxLength={10}
                      value={newDate}
                      onChangeText={handleDateChange}
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              {/* BOTÕES QUANDO NÃO ESTÁ REMARCANDO */}
              {!isRescheduling && (
                <>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton, activeTab === 'REALIZADA' && { marginRight: 0 }]} 
                    onPress={closeDetails}
                    disabled={processing}
                  >
                    <Text style={styles.cancelButtonText}>Voltar</Text>
                  </TouchableOpacity>

                  {activeTab === 'AGENDADA' && (
                    <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
                      {/* BOTÃO DE REMARCAR */}
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.rescheduleButton]} 
                        onPress={() => setIsRescheduling(true)}
                        disabled={processing}
                      >
                        <Feather name="calendar" size={16} color="#EA580C" />
                      </TouchableOpacity>

                      {/* BOTÃO DE CONCLUIR */}
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.successButton]} 
                        onPress={handleConcluirVisita}
                        disabled={processing}
                      >
                        {processing ? (
                          <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                          <>
                            <Feather name="check-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                            <Text style={styles.successButtonText}>Concluir</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              {/* BOTÕES DURANTE A REMARCAÇÃO */}
              {isRescheduling && (
                <>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton, { marginRight: 12 }]} 
                    onPress={() => { setIsRescheduling(false); setNewDate(''); }}
                    disabled={processing}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalButton, styles.successButton]} 
                    onPress={handleSubmitRemarcacao}
                    disabled={processing}
                  >
                    {processing ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.successButtonText}>Confirmar</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  header: { paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F5F5F4' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1C1917', marginBottom: 2 },
  subtitle: { fontSize: 13, color: '#78716C', marginBottom: 16 },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#F5F5F4', borderRadius: 8, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#78716C' },
  activeTabText: { color: '#EA580C' },
  listContainer: { padding: 20, paddingBottom: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#78716C' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#57534E', marginTop: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E7E5E4', elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  visitorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  visitorName: { fontSize: 16, fontWeight: '700', color: '#1C1917' },
  statusBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#D97706' },
  statusBadgeCompleted: { backgroundColor: '#DCFCE7' },
  statusTextCompleted: { color: '#16A34A' },
  cardDetail: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  detailText: { fontSize: 14, color: '#57534E', flex: 1 },
  viewMoreContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12, borderTopWidth: 1, borderTopColor: '#F5F5F4', paddingTop: 12 },
  viewMoreText: { fontSize: 13, color: '#A8A29E', marginRight: 4, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F4' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1C1917' },
  closeButton: { padding: 4 },
  modalBody: { paddingBottom: 20 },
  infoGroup: { marginBottom: 16 },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#A8A29E', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 15, color: '#44403C', lineHeight: 22 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  whatsappBtn: { backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  whatsappBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  
  // ESTILOS DO INPUT DE REMARCAÇÃO
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E7E5E4', borderRadius: 12, paddingHorizontal: 16, marginTop: 16, backgroundColor: '#FDFBF7' },
  dateInput: { flex: 1, height: 50, fontSize: 16, color: '#1C1917' },

  modalFooter: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F5F5F4' },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  cancelButton: { backgroundColor: '#F5F5F4' },
  cancelButtonText: { color: '#57534E', fontWeight: '700', fontSize: 15 },
  successButton: { backgroundColor: '#16A34A', flex: 2 },
  successButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  rescheduleButton: { backgroundColor: '#FFEDD5', flex: 0.6, marginRight: 8, borderWidth: 1, borderColor: '#FED7AA' }
});