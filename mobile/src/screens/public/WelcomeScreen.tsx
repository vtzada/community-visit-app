import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ChurchBadge } from '../../components/ChurchBadge';
import { AppButton } from '../../components/AppButton';
import { TextLink } from "../../components/TextLink";
import { colors } from '../../theme/colors';

type RootStackParamList = {
  RequestVisit: undefined;
  Login: undefined;
  ConsultarVisita: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <ChurchBadge label="Igreja Submissão ao Eterno" />
        </Animated.View>

        <Animated.Image
          entering={FadeIn.delay(200).duration(600)}
          source={require('../../assets/logo_acolhedora.png')}
          style={[styles.logo, isSmallScreen && styles.logoSmall]}
          resizeMode="contain"
        />

        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.title}>Seja bem-vindo(a)!</Text>
          <Text style={styles.subtitle}>
            Nosso projeto social nasceu do coração da igreja para cuidar de você e da sua
            família. Como deseja prosseguir?
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.buttonsWrapper}
        >
          <AppButton
            label="Solicitar uma Visita"
            iconName="calendar"
            variant="primary"
            onPress={() => navigation.navigate('RequestVisit')}
          />
          <AppButton
            label="Área do Voluntário (Entrar)"
            iconName="user"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <TextLink
            label="Já solicitei uma visita — consultar status"
            onPress={() => navigation.navigate('ConsultarVisita')}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  logoSmall: {
    width: 110,
    height: 110,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 22,
    paddingHorizontal: 5,
  },
  buttonsWrapper: {
    width: '100%',
    gap: 14,
  },
});