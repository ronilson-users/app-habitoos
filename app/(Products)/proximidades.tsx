import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';

type Categoria =
  | 'Laticínios'
  | 'Bebidas'
  | 'Limpeza'
  | 'Higiene'
  | 'Mercearia'
  | 'Carnes'
  | 'Hortifruti';

type Produto = {
  id: string;
  nome: string;
  marca: string;
  categoria: Categoria;
  preco: number;
};

type Mercado = {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  produtos: Produto[];
};

type UsuarioPreferencias = {
  categoriasFavoritas: Categoria[];
  marcasFavoritas: string[];
  raioKm: number;
};

const PRODUTOS_BASE: Produto[] = [
  { id: 'p1', nome: 'Leite Integral 1L', marca: 'Nestlé', categoria: 'Laticínios', preco: 5.99 },
  { id: 'p2', nome: 'Refrigerante Cola 2L', marca: 'Coca-Cola', categoria: 'Bebidas', preco: 8.49 },
  { id: 'p3', nome: 'Sabão em Pó 1kg', marca: 'OMO', categoria: 'Limpeza', preco: 14.9 },
  { id: 'p4', nome: 'Shampoo 400ml', marca: 'Pantene', categoria: 'Higiene', preco: 18.75 },
  { id: 'p5', nome: 'Arroz Tipo 1 5kg', marca: 'Camil', categoria: 'Mercearia', preco: 24.99 },
  { id: 'p6', nome: 'Café Torrado 500g', marca: '3 Corações', categoria: 'Mercearia', preco: 16.5 },
  { id: 'p7', nome: 'Iogurte Natural', marca: 'Danone', categoria: 'Laticínios', preco: 4.99 },
  { id: 'p8', nome: 'Sabonete Unidade', marca: 'Dove', categoria: 'Higiene', preco: 3.79 },
  { id: 'p9', nome: 'Detergente 500ml', marca: 'Ypê', categoria: 'Limpeza', preco: 2.89 },
  { id: 'p10', nome: 'Suco Integral 1L', marca: 'Del Valle', categoria: 'Bebidas', preco: 9.99 },
];

const PREFERENCIAS_USUARIO: UsuarioPreferencias = {
  categoriasFavoritas: ['Laticínios', 'Mercearia', 'Bebidas'],
  marcasFavoritas: ['Nestlé', 'Coca-Cola', 'Danone', '3 Corações'],
  raioKm: 8,
};

// Simulação de mercados próximos (normalmente viria da API)
function gerarMercadosMock(userLat: number, userLng: number): Mercado[] {
  return [
    {
      id: 'm1',
      nome: 'SuperMercado União',
      latitude: userLat + 0.02,
      longitude: userLng + 0.015,
      produtos: [PRODUTOS_BASE[0], PRODUTOS_BASE[1], PRODUTOS_BASE[4], PRODUTOS_BASE[6], PRODUTOS_BASE[9]],
    },
    {
      id: 'm2',
      nome: 'Hiper Atacadão Central',
      latitude: userLat + 0.045,
      longitude: userLng - 0.01,
      produtos: [PRODUTOS_BASE[2], PRODUTOS_BASE[3], PRODUTOS_BASE[5], PRODUTOS_BASE[8]],
    },
    {
      id: 'm3',
      nome: 'Mercado Bom Preço',
      latitude: userLat - 0.015,
      longitude: userLng + 0.018,
      produtos: [PRODUTOS_BASE[0], PRODUTOS_BASE[5], PRODUTOS_BASE[7], PRODUTOS_BASE[9]],
    },
    {
      id: 'm4',
      nome: 'Super Rede Max',
      latitude: userLat + 0.08,
      longitude: userLng + 0.06,
      produtos: [PRODUTOS_BASE[1], PRODUTOS_BASE[2], PRODUTOS_BASE[4], PRODUTOS_BASE[6]],
    },
  ];
}

// Distância em KM (fórmula de Haversine)
function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type ProdutoRecomendado = Produto & {
  mercado: string;
  distanciaKm: number;
  score: number;
};

export default function ProximidadesScreen() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [mercados, setMercados] = useState<Mercado[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErro(null);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErro('Permissão de localização negada.');
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation(pos.coords);

        const mercadosMock = gerarMercadosMock(pos.coords.latitude, pos.coords.longitude);
        setMercados(mercadosMock);
      } catch (e) {
        setErro('Não foi possível obter sua localização.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recomendados: ProdutoRecomendado[] = useMemo(() => {
    if (!location || mercados.length === 0) return [];

    const lista: ProdutoRecomendado[] = [];

    for (const mercado of mercados) {
      const distancia = calcularDistanciaKm(
        location.latitude,
        location.longitude,
        mercado.latitude,
        mercado.longitude
      );

      if (distancia > PREFERENCIAS_USUARIO.raioKm) continue;

      for (const produto of mercado.produtos) {
        let score = 0;

        // Peso por categoria favorita
        if (PREFERENCIAS_USUARIO.categoriasFavoritas.includes(produto.categoria)) score += 5;

        // Peso por marca favorita
        if (PREFERENCIAS_USUARIO.marcasFavoritas.includes(produto.marca)) score += 4;

        // Quanto mais perto, maior score
        score += Math.max(0, 10 - distancia);

        // Preço menor ajuda no score
        score += Math.max(0, 20 - produto.preco) * 0.2;

        lista.push({
          ...produto,
          mercado: mercado.nome,
          distanciaKm: Number(distancia.toFixed(2)),
          score: Number(score.toFixed(2)),
        });
      }
    }

    // Ordena do mais relevante para o menos relevante
    return lista.sort((a, b) => b.score - a.score);
  }, [location, mercados]);

  const [mostrarSomenteFavoritos, setMostrarSomenteFavoritos] = useState(false);

  const listaFinal = useMemo(() => {
    if (!mostrarSomenteFavoritos) return recomendados;

    return recomendados.filter(
      (p) =>
        PREFERENCIAS_USUARIO.categoriasFavoritas.includes(p.categoria) ||
        PREFERENCIAS_USUARIO.marcasFavoritas.includes(p.marca)
    );
  }, [recomendados, mostrarSomenteFavoritos]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Carregando localização e ofertas...</Text>
      </SafeAreaView>
    );
  }

  if (erro) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{erro}</Text>
        <Text style={styles.infoText}>
          Ative a localização para receber produtos próximos e personalizados.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produtos próximos para você</Text>
        <Text style={styles.subtitle}>
          Baseado na sua localização + interesses
        </Text>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            mostrarSomenteFavoritos && styles.filterButtonActive,
          ]}
          onPress={() => setMostrarSomenteFavoritos((prev) => !prev)}
        >
          <Text
            style={[
              styles.filterButtonText,
              mostrarSomenteFavoritos && styles.filterButtonTextActive,
            ]}
          >
            {mostrarSomenteFavoritos ? 'Mostrando favoritos' : 'Mostrar só favoritos'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listaFinal}
        keyExtractor={(item) => `${item.id}-${item.mercado}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.infoText}>
            Nenhum produto encontrado dentro do raio de {PREFERENCIAS_USUARIO.raioKm} km.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
            </View>

            <Text style={styles.meta}>
              Marca: <Text style={styles.bold}>{item.marca}</Text> • Categoria:{' '}
              <Text style={styles.bold}>{item.categoria}</Text>
            </Text>

            <Text style={styles.meta}>
              Mercado: <Text style={styles.bold}>{item.mercado}</Text> • Distância:{' '}
              <Text style={styles.bold}>{item.distanciaKm} km</Text>
            </Text>

            <Text style={styles.score}>Relevância: {item.score}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 4, fontSize: 14, color: '#6B7280' },
  filterRow: { paddingHorizontal: 16, paddingBottom: 8 },
  filterButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  filterButtonActive: { backgroundColor: '#2563EB' },
  filterButtonText: { color: '#111827', fontWeight: '600' },
  filterButtonTextActive: { color: '#FFFFFF' },
  listContent: { padding: 16, paddingTop: 8, gap: 10 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  productName: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  price: { fontSize: 16, fontWeight: '700', color: '#059669' },
  meta: { fontSize: 13, color: '#4B5563', marginTop: 2 },
  bold: { fontWeight: '700', color: '#111827' },
  score: { marginTop: 8, fontSize: 13, fontWeight: '700', color: '#7C3AED' },
  infoText: { marginTop: 10, color: '#6B7280', textAlign: 'center' },
  errorText: { color: '#DC2626', fontSize: 16, fontWeight: '700', textAlign: 'center' },
});