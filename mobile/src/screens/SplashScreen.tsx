import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

export function SplashScreen() {
  const navigation = useNavigation<any>();

  // Valor compartilhado para controlar a escala da logo
  const scale = useSharedValue(1);

  useEffect(() => {
    // Configura a animação de pulsação infinita (cresce e diminui)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // -1 significa repetição infinita
      true  // true para reverter suavemente
    );

    // Timer simulando o carregamento da aplicação
const timer = setTimeout(() => {
  navigation.replace('Welcome'); // Vai para a tela de escolha
}, 2500);

    return () => clearTimeout(timer);
  }, [navigation, scale]);

  // Estilo animado aplicado à logo
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../assets/logo.png')} 
        style={[styles.logo, animatedLogoStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});