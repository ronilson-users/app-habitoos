// hooks/use-auth.ts
import { useState } from 'react';
import { Alert } from 'react-native';

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
      // TODO: Integração com API
      await new Promise(resolve => setTimeout(resolve, 1200));

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      return true;
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao fazer login.');
      return false;
    } finally {
      setLoading(false);
    }
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
      // TODO: Integração com API
      await new Promise(resolve => setTimeout(resolve, 1200));

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      return true;
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return {
    // States
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,

    // Actions
    signin,
    signup,
    resetFields,
  };
};