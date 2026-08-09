import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { visitService } from "../../services/visitService";

const requestVisitSchema = z.object({
  nomeSolicitante: z.string().min(3, "O nome é obrigatório"),
  telefoneSolicitante: z.string().min(10, "Telefone inválido"),
  pedidoOracao: z.string().optional(),
  endereco: z.object({
    logradouro: z.string().min(2, "Logradouro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Bairro é obrigatório"),
    cep: z.string().min(8, "CEP inválido"),
  }),
});

type VisitFormData = z.infer<typeof requestVisitSchema>;

export function RequestVisitScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitFormData>({
    resolver: zodResolver(requestVisitSchema),
    defaultValues: {
      nomeSolicitante: "",
      telefoneSolicitante: "",
      pedidoOracao: "",
      endereco: {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cep: "",
      },
    },
  });

  async function handleRequestVisit(data: VisitFormData) {
    try {
      setLoading(true);
      console.log(
        "Enviando dados para a API (/solicitacoes):",
        JSON.stringify(data, null, 2),
      );

      await visitService.createVisit(data);

      setLoading(false);
      Alert.alert(
        "Solicitação Enviada com Amor! ❤️",
        "Sua solicitação de visita foi cadastrada com sucesso. Em breve o grupo entrará em contato para agendar.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      setLoading(false);
      console.log("Erro ao enviar solicitação:", error);

      let mensagemErro =
        "Não foi possível enviar a solicitação. Verifique os dados.";
      if (error.response) {
        mensagemErro =
          error.response.data?.message ||
          `Erro no servidor (${error.response.status})`;
      } else if (error.request) {
        mensagemErro =
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
      }

      Alert.alert("Erro no Envio", mensagemErro);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER TEMÁTICO */}
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Feather
              name="heart"
              size={14}
              color="#EA580C"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.badgeText}>
              Projeto Social • Casa Acolhedora
            </Text>
          </View>

          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Solicitar Visita</Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para registarmos seu pedido de oração e comunhão.
          </Text>
        </View>

        {/* CARTÃO 1: DADOS PESSOAIS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Feather name="user-check" size={20} color="#EA580C" />
            <Text style={styles.sectionTitle}>Suas Informações</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <Controller
              control={control}
              name="nomeSolicitante"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.nomeSolicitante && styles.inputWrapperError,
                  ]}
                >
                  <Feather
                    name="user"
                    size={18}
                    color={errors.nomeSolicitante ? "#EF4444" : "#9CA3AF"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Maria da Silva"
                    placeholderTextColor="#A1A1AA"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
            {errors.nomeSolicitante && (
              <Text style={styles.errorText}>
                {errors.nomeSolicitante.message}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone / WhatsApp</Text>
            <Controller
              control={control}
              name="telefoneSolicitante"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    errors.telefoneSolicitante && styles.inputWrapperError,
                  ]}
                >
                  <Feather
                    name="phone"
                    size={18}
                    color={errors.telefoneSolicitante ? "#EF4444" : "#9CA3AF"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#A1A1AA"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="phone-pad"
                  />
                </View>
              )}
            />
            {errors.telefoneSolicitante && (
              <Text style={styles.errorText}>
                {errors.telefoneSolicitante.message}
              </Text>
            )}
          </View>
        </View>

        {/* CARTÃO 2: ENDEREÇO */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Feather name="map-pin" size={20} color="#0284C7" />
            <Text style={styles.sectionTitle}>Onde será a visita?</Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 2, marginRight: 12 }]}>
              <Text style={styles.label}>CEP</Text>
              <Controller
                control={control}
                name="endereco.cep"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.endereco?.cep && styles.inputWrapperError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="00000-000"
                      placeholderTextColor="#A1A1AA"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="numeric"
                    />
                  </View>
                )}
              />
              {errors.endereco?.cep && (
                <Text style={styles.errorText}>
                  {errors.endereco.cep.message}
                </Text>
              )}
            </View>

            <View style={[styles.inputContainer, { flex: 3 }]}>
              <Text style={styles.label}>Bairro</Text>
              <Controller
                control={control}
                name="endereco.bairro"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.endereco?.bairro && styles.inputWrapperError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Nome do bairro"
                      placeholderTextColor="#A1A1AA"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.endereco?.bairro && (
                <Text style={styles.errorText}>
                  {errors.endereco.bairro.message}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 3, marginRight: 12 }]}>
              <Text style={styles.label}>Logradouro</Text>
              <Controller
                control={control}
                name="endereco.logradouro"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.endereco?.logradouro && styles.inputWrapperError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Rua, Av..."
                      placeholderTextColor="#A1A1AA"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.endereco?.logradouro && (
                <Text style={styles.errorText}>
                  {errors.endereco.logradouro.message}
                </Text>
              )}
            </View>

            <View style={[styles.inputContainer, { flex: 1.2 }]}>
              <Text style={styles.label}>Nº</Text>
              <Controller
                control={control}
                name="endereco.numero"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.endereco?.numero && styles.inputWrapperError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      placeholder="Nº"
                      placeholderTextColor="#A1A1AA"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.endereco?.numero && (
                <Text style={styles.errorText}>
                  {errors.endereco.numero.message}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Complemento (Opcional)</Text>
            <Controller
              control={control}
              name="endereco.complemento"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Apto, Bloco, Casa 2..."
                    placeholderTextColor="#A1A1AA"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
            />
          </View>
        </View>

        {/* CARTÃO 3: DETALHES / PEDIDO DE ORAÇÃO */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Feather name="calendar" size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Detalhes Adicionais</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pedido de Oração / Observações</Text>
            <Controller
              control={control}
              name="pedidoOracao"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.textAreaWrapper}>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Sinta-se em paz para compartilhar seu pedido ou observação..."
                    placeholderTextColor="#A1A1AA"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              )}
            />
          </View>
        </View>

        {/* AÇÕES */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handleRequestVisit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Feather
                  name="heart"
                  size={18}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.buttonText}>Confirmar Solicitação</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBF7",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C2410C",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1917",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#57534E",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F5F5F4",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#292524",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#57534E",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E7E5E4",
    borderRadius: 14,
    backgroundColor: "#FAFAF9",
    paddingHorizontal: 14,
  },
  textAreaWrapper: {
    borderWidth: 1.5,
    borderColor: "#E7E5E4",
    borderRadius: 14,
    backgroundColor: "#FAFAF9",
    paddingHorizontal: 14,
    paddingTop: 12,
    height: 110,
  },
  inputWrapperError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1917",
    height: "100%",
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: "#1C1917",
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#EF4444",
    marginTop: 6,
  },
  actionContainer: {
    marginTop: 10,
  },
  button: {
    height: 56,
    backgroundColor: "#EA580C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EA580C",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  backButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  backButtonText: {
    color: "#78716C",
    fontSize: 15,
    fontWeight: "600",
  },
});