// app/(auth)/signin.tsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ApiService } from '@/services/api';

import { SigninForm } from '@/components/auth/SigninForm';

export default function SigninScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin(email: string, password: string) {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await ApiService.post('/users/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      // A estrutura pode variar - ajuste conforme seu backend
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      if (!token) {
        throw new Error('Token não recebido do servidor');
      }

      await SecureStore.setItemAsync('token', token);
      if (user) {
        await SecureStore.setItemAsync('user', JSON.stringify(user));
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Erro no login',
        error.message || 'Verifique suas credenciais e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Minha Logo</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>
      </View>

      <SigninForm
        loading={loading}
        onSubmit={handleLogin}
        onSignup={() => router.push("/(auth)/signup")}
        onForgotPassword={() => router.push("/(auth)/forgot-password")}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#828282",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});