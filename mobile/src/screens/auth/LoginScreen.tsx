import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator, 
  Alert,
  Image 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../services/authService';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  async function handleLogin(data: LoginFormData) {
    try {
      setLoading(true);
      console.log('1. Autenticando via authService...');

      const responseData = await authService.login({
        email: data.email,
        password: data.senha,
      });

      console.log('2. Sucesso no login:', responseData);

      // Separando o token e pegando o restante das propriedades como dados do usuário (nome, role, etc.)
      const { token, ...userData } = responseData;

      if (token) {
        await AsyncStorage.setItem('@CasaAcolhedora:token', token);
      }
      
      if (Object.keys(userData).length > 0) {
        await AsyncStorage.setItem('@CasaAcolhedora:user', JSON.stringify(userData));
      }

      setLoading(false);
      Alert.alert('Bem-vindo(a)! 🙏', `Login realizado com sucesso, ${userData.nome || 'Voluntário'}!`);
      
      navigation.replace('VolunteerDashboard');

    } catch (error: any) {
      setLoading(false);
      console.log('3. Erro no login:', error);

      let mensagemErro = 'Verifique suas credenciais e tente novamente.';
      if (error.response) {
        mensagemErro = error.response.data?.message || `Erro no servidor (${error.response.status})`;
      } else if (error.request) {
        mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      }

      Alert.alert('Erro no Acesso', mensagemErro);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        
        {/* BOTÃO DE VOLTAR */}
        <TouchableOpacity 
          style={styles.backIconButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={22} color="#57534E" />
        </TouchableOpacity>

        {/* CABEÇALHO / LOGO */}
        <View style={styles.header}>
          <View style={styles.churchBadge}>
            <Feather name="shield" size={13} color="#1D4ED8" style={{ marginRight: 6 }} />
            <Text style={styles.churchBadgeText}>Área Restrita • Voluntários</Text>
          </View>

          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Acesse sua conta</Text>
          <Text style={styles.subtitle}>Entre para gerenciar os agendamentos e o cuidado com a comunidade.</Text>
        </View>

        {/* FORMULÁRIO DE LOGIN */}
        <View style={styles.card}>

          {/* E-MAIL */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail de Voluntário</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
                  <Feather name="mail" size={18} color={errors.email ? "#EF4444" : "#9CA3AF"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="seu.email@igreja.com"
                    placeholderTextColor="#A1A1AA"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          {/* SENHA */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[styles.inputWrapper, errors.senha && styles.inputWrapperError]}>
                  <Feather name="lock" size={18} color={errors.senha ? "#EF4444" : "#9CA3AF"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Sua senha secreta"
                    placeholderTextColor="#A1A1AA"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}
          </View>

          {/* BOTÃO ENTRAR */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit(handleLogin)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Feather name="log-in" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Entrar no Sistema</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>

        {/* AJUDA / SUPORTE */}
        <View style={styles.footerInfo}>
          <Feather name="help-circle" size={14} color="#78716C" style={{ marginRight: 6 }} />
          <Text style={styles.footerText}>Esqueceu sua senha? Fale com o líder do projeto.</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  backIconButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F4',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  churchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  churchBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1917',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#57534E',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F4',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#57534E',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E7E5E4',
    borderRadius: 14,
    backgroundColor: '#FAFAF9',
    paddingHorizontal: 14,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1917',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#EF4444',
    marginTop: 6,
  },
  button: {
    height: 56,
    backgroundColor: '#EA580C',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#78716C',
    fontWeight: '500',
  },
});