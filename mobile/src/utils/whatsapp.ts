import { Alert, Linking } from 'react-native';
import { normalizePhone } from './phone';

export async function openWhatsApp(phone: string, message: string): Promise<boolean> {
  const phoneWithCountryCode = normalizePhone(phone);
  const url = `https://wa.me/${phoneWithCountryCode}?text=${encodeURIComponent(message)}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    }
  } catch {
    // fall through
  }

  Alert.alert('Aviso', 'Não foi possível abrir o WhatsApp automaticamente.');
  return false;
}

export function buildAcceptMessage(nome: string, dataVisita: string): string {
  return (
    `Olá, ${nome}! Paz e bem!\n\n` +
    `Sua solicitação de visita foi aceita pela nossa equipe do projeto social. ` +
    `Nossa primeira visita ficou agendada para o dia *${dataVisita}*.\n\n` +
    `Nos vemos em breve!`
  );
}

export function buildOnTheWayMessage(nome: string): string {
  return (
    `Olá, ${nome}! A paz do Senhor! Somos do grupo de visitas da igreja. ` +
    `Passando para avisar que já estamos a caminho!`
  );
}
