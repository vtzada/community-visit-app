import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { IconButton } from "../../components/IconButton";
import { VisitRequestCard } from "../../components/VisitRequestCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import { EmptyState } from "../../components/EmptyState";
import { colors } from "../../theme/colors";
import { VisitRequestData } from "../../services/visitService";
import { solicitacaoService } from "../../services/solicitacaoService";

const SKELETON_PLACEHOLDERS = [1, 2, 3];

export function ConsultarVisitaScreen() {
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<VisitRequestData[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const podeBuscar = telefone.trim().length > 0 && !loading;

  async function handleBuscar() {
    if (!telefone.trim()) {
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setBuscou(true);
    setErrorMsg(null);

    try {
      const data = await solicitacaoService.consultarPorTelefone(telefone);
      setResultados(data);
    } catch (error) {
      console.log("Erro ao consultar:", error);
      setResultados([]);
      setErrorMsg(
        "Não conseguimos consultar agora. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  function renderContent() {
    if (loading) {
      return (
        <View style={styles.list}>
          {SKELETON_PLACEHOLDERS.map((key) => (
            <SkeletonCard key={key} />
          ))}
        </View>
      );
    }

    if (errorMsg) {
      return (
        <View style={styles.list}>
          <EmptyState icon="wifi-off" message={errorMsg} />
        </View>
      );
    }

    return (
      <FlatList
        data={resultados}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          buscou ? (
            <EmptyState
              icon="info"
              message="Nenhum pedido encontrado para este telefone."
            />
          ) : (
            <EmptyState
              icon="search"
              message="Digite seu telefone acima para consultar o status da sua visita."
            />
          )
        }
        renderItem={({ item, index }) => (
          <VisitRequestCard item={item} index={index} />
        )}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Consultar Minha Visita</Text>
        <Text style={styles.subtitle}>
          Digite seu telefone para ver o status do pedido de oração e visita.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder="Digite seu telefone..."
          placeholderTextColor={colors.placeholder}
          keyboardType="phone-pad"
          returnKeyType="search"
          value={telefone}
          onChangeText={setTelefone}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSubmitEditing={handleBuscar}
        />
        <IconButton
          iconName="search"
          onPress={handleBuscar}
          disabled={!podeBuscar}
          loading={loading}
          accessibilityLabel="Buscar minha visita"
        />
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.white,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  list: {
    padding: 20,
    flexGrow: 1,
  },
});
