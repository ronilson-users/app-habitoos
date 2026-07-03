// app/(auth)/signup.tsx (versão com service)
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ApiService } from '@/services/api';

import { SignupForm, SignupData } from '@/components/auth/SignupForm';

export default function SignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignup(data: SignupData) {   
    // Validações
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (data.password !== data.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (data.password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

   

    setLoading(true);

    try {
      const response = await ApiService.post('/users/register', {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      Alert.alert(
        'Conta criada! 🎉',
        'Sua conta foi criada com sucesso. Faça login para começar.',
        [
          {
            text: 'Fazer login',
            onPress: () => router.replace('/(auth)/signin'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro no cadastro',
        error.message || 'Não foi possível criar sua conta. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <StatusBar style="auto" />

        <View style={styles.header}>
          <Text style={styles.title}>Minha Logo</Text>
          <Text style={styles.subtitle}>Crie sua conta gratuitamente</Text>
        </View>

        <SignupForm
          loading={loading}
          onSubmit={handleSignup}
          onSignin={() => router.replace('/(auth)/signin')}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#828282',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});