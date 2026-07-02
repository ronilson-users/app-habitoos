// hooks/use-auth.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha e-mail e senha.');
      return false;
    }

    setLoading(true);

    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        // TODO: Salvar token (AsyncStorage / Context / Zustand)
        return true;
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao fazer login.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const signup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return false;
    }

    setLoading(true);

    try {
      const result = await authService.register(email, password);
      
      if (result.success) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        return true;
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    signin,
    signup,
  };
};