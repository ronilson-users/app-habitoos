import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type User = {
id: string;
email: string;
};

type AuthContextData = {
user: User | null;
token: string | null;
signin: (user: User, token: string) => Promise<void>;
signout: () => Promise<void>;
loading: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadStorage() {
const storedToken = await SecureStore.getItemAsync('token');
const storedUser = await SecureStore.getItemAsync('user');

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }

  setLoading(false);
}

loadStorage();

}, []);

async function signin(userData: User, userToken: string) {
await SecureStore.setItemAsync('token', userToken);
await SecureStore.setItemAsync('user', JSON.stringify(userData));

setUser(userData);
setToken(userToken);

}

async function signout() {
await SecureStore.deleteItemAsync('token');
await SecureStore.deleteItemAsync('user');

setUser(null);
setToken(null);

}

return (
<AuthContext.Provider
value={{
user,
token,
signin,
signout,
loading,
}}
>
{children}
</AuthContext.Provider>
);
}

export function useAuthContext() {
return useContext(AuthContext);
}