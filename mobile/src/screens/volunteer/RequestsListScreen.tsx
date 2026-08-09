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
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { visitService } from '../../services/visitService'; 
import { TuesdayDatePicker } from '../../components/TuesdayDatePicker';

interface Endereco {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
  complemento?: string;
}

interface Visit {
  id: string | number;
  nomeSolicitante?: string;
  telefoneSolicitante?: string; 
  endereco?: Endereco;          
  pedidoOracao?: string;        
  statusSolicitacao?: string;   
}

export function RequestsListScreen() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [primeiraVisitaDate, setPrimeiraVisitaDate] = useState('');

  async function fetchVisits() {
    try {
      const data = await visitService.listarSolicitacoes();
      
      const pendingVisits = data.filter((v: Visit) => {
        const status = String(v.statusSolicitacao || 'PENDENTE').toUpperCase();
        return status === 'PENDENTE';
      });

      setVisits(pendingVisits);
    } catch (error: any) {
      console.log('Erro ao buscar visitas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchVisits();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVisits();
  }, []);

  function openDetails(visit: Visit) {
    if (processing) return; // Evita abrir se estiver processando
    setSelectedVisit(visit);
    setPrimeiraVisitaDate('');
    setModalVisible(true);
  }

  function closeDetails() {
    if (processing) return;
    setModalVisible(false);
    setSelectedVisit(null);
    setPrimeiraVisitaDate('');
  }

  // Função auxiliar para disparar o WhatsApp
  async function abrirWhatsApp(visit: Visit, dataVisita: string) {
    const telefone = visit.telefoneSolicitante || '';
    const phoneClean = telefone.replace(/\D/g, '');
    const phoneWithCountryCode = phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`;
    const nome = visit.nomeSolicitante || 'Solicitante';

    const message = encodeURIComponent(
      `Olá, ${nome}! Paz e bem! 🙏\n\n` +
      `Sua solicitação de visita foi aceita pela nossa equipe do projeto social. ` +
      `Nossa primeira visita ficou agendada para o dia *${dataVisita}*.\n\n` +
      `Nos vemos em breve!`
    );

    const whatsappUrl = `https://wa.me/${phoneWithCountryCode}?text=${message}`;

    const supported = await Linking.canOpenURL(whatsappUrl);
    if (supported) {
      await Linking.openURL(whatsappUrl);
    } else {
      Alert.alert('Aviso', 'Visita processada, mas não foi possível abrir o WhatsApp automaticamente.');
    }
  }

  async function handleAcceptRequest() {
    if (!selectedVisit || processing) return;
    
    if (!primeiraVisitaDate) {
      Alert.alert('Atenção', 'Por favor, selecione uma terça-feira para a primeira visita.');
      return;
    }

    try {
      setProcessing(true);

      // O backend espera LocalDate (yyyy-MM-dd), não LocalDateTime.
      // Antes estava mandando "T00:00:00" junto e o Spring quebrava a conversão (400).
      await visitService.aceitarComData(Number(selectedVisit.id), primeiraVisitaDate);
      
      // Sucesso total
      closeDetails();
      fetchVisits();
      await abrirWhatsApp(selectedVisit, primeiraVisitaDate);

    } catch (error: any) {
      const statusError = error.response?.status;
      const errorMsg = error.response?.data?.message || '';

      // Se o erro for de duplicidade (já cadastrada no banco), tratamos como sucesso operacional
      if (statusError === 409 || errorMsg.includes('already exists') || errorMsg.includes('unique constraint')) {
        console.log('Visita já estava cadastrada no banco. Sincronizando tela...');
        closeDetails();
        fetchVisits();
        await abrirWhatsApp(selectedVisit, primeiraVisitaDate);
        return;
      }

      console.log('Erro ao aceitar visita:', error.response?.data || error);
      Alert.alert('Erro', errorMsg || 'Não foi possível aceitar a solicitação no momento.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Solicitações Disponíveis</Text>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{visits.length}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Toque em um card para ver os detalhes e agendar.</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EA580C" />
          <Text style={styles.loadingText}>Buscando novas solicitações...</Text>
        </View>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item, index) => String(item.id || index)}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EA580C" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="check-circle" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>Tudo limpo por aqui!</Text>
              <Text style={styles.emptySubText}>Não há novas solicitações no momento.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.7}
              onPress={() => openDetails(item)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.visitorInfo}>
                  <Feather name="user" size={16} color="#EA580C" style={{ marginRight: 6 }} />
                  <Text style={styles.visitorName}>{item.nomeSolicitante || 'Visitante'}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>PENDENTE</Text>
                </View>
              </View>

              <View style={styles.cardDetail}>
                <Feather name="map-pin" size={14} color="#78716C" style={{ marginRight: 6 }} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.endereco ? `${item.endereco.bairro || ''} - ${item.endereco.logradouro || ''}` : 'Endereço não informado'}
                </Text>
              </View>
              
              <View style={styles.viewMoreContainer}>
                <Text style={styles.viewMoreText}>Toque para agendar</Text>
                <Feather name="chevron-right" size={16} color="#A8A29E" />
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* MODAL DE DETALHES E AGENDAMENTO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes e Agendamento</Text>
              <TouchableOpacity onPress={closeDetails} style={styles.closeButton} disabled={processing}>
                <Feather name="x" size={24} color="#57534E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedVisit && (
                <View style={styles.modalBody}>
                  
                  <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Solicitante</Text>
                    <Text style={styles.infoValue}>{selectedVisit.nomeSolicitante || 'Não informado'}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Telefone / Contato</Text>
                    <Text style={styles.infoValue}>{selectedVisit.telefoneSolicitante || 'Não informado'}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <Text style={styles.infoLabel}>Endereço</Text>
                    <Text style={styles.infoValue}>
                      {selectedVisit.endereco 
                        ? `${selectedVisit.endereco.logradouro || ''}, nº ${selectedVisit.endereco.numero || ''} - ${selectedVisit.endereco.bairro || ''} (CEP: ${selectedVisit.endereco.cep || ''})`
                        : 'Endereço não informado'}
                    </Text>
                  </View>

                  {selectedVisit.pedidoOracao && (
                    <View style={styles.infoGroup}>
                      <Text style={styles.infoLabel}>Pedido de Oração / Observações</Text>
                      <Text style={styles.infoValue}>{selectedVisit.pedidoOracao}</Text>
                    </View>
                  )}

                  {/* SELETOR DE TERÇAS-FEIRAS */}
                  <View style={styles.agendamentoBox}>
                    <Text style={styles.agendamentoTitle}>Data da Primeira Visita *</Text>
                    <Text style={styles.agendamentoSub}>Selecione uma terça-feira disponível</Text>
                    
                    <TuesdayDatePicker
                      value={primeiraVisitaDate}
                      onChange={(date) => setPrimeiraVisitaDate(date)}
                    />
                  </View>

                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={closeDetails}
                disabled={processing}
              >
                <Text style={styles.cancelButtonText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.acceptButton, processing && { opacity: 0.7 }]} 
                onPress={handleAcceptRequest}
                disabled={processing}
              >
                {processing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Feather name="message-circle" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.acceptButtonText}>Aceitar & WhatsApp</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFBF7' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F5F5F4' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1C1917', marginRight: 8 },
  badgeCount: { backgroundColor: '#FFEDD5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeCountText: { color: '#C2410C', fontSize: 12, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#78716C' },
  
  listContainer: { padding: 20, paddingBottom: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, color: '#78716C' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#57534E', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#A8A29E', marginTop: 4 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E7E5E4', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  visitorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  visitorName: { fontSize: 16, fontWeight: '700', color: '#1C1917' },
  statusBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase' },
  cardDetail: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  detailText: { fontSize: 14, color: '#57534E', flex: 1 },
  viewMoreContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12, borderTopWidth: 1, borderTopColor: '#F5F5F4', paddingTop: 12 },
  viewMoreText: { fontSize: 13, color: '#EA580C', marginRight: 4, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F4' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1C1917' },
  closeButton: { padding: 4 },
  modalBody: { paddingBottom: 20 },
  infoGroup: { marginBottom: 16 },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#A8A29E', textTransform: 'uppercase', marginBottom: 4 },
  infoValue: { fontSize: 15, color: '#44403C', lineHeight: 22 },
  
  agendamentoBox: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FFEDD5', borderRadius: 16, padding: 16, marginTop: 10, marginBottom: 10 },
  agendamentoTitle: { fontSize: 14, fontWeight: '700', color: '#C2410C', marginBottom: 2 },
  agendamentoSub: { fontSize: 12, color: '#9A3412', marginBottom: 10 },

  modalFooter: { flexDirection: 'row', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F5F5F4' },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  cancelButton: { backgroundColor: '#F5F5F4', marginRight: 12 },
  cancelButtonText: { color: '#57534E', fontWeight: '700', fontSize: 15 },
  acceptButton: { backgroundColor: '#25D366' }, 
  acceptButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 }
});