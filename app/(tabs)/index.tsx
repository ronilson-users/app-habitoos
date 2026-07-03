import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

    // Imagem Para PROMOÇÃO PAGA
  const PlaceholderImage = require("@/assets/images/partial-react-logo.png");


   // como trabalhar com imagens no expo
  // Dados mockados para favoritos
  const favorites = [
    { id: 1, name: "Arroz Camil 5kg", price: "R$ 99,90" },
    { id: 2, name: "Margarina Qualy 500g", price: "R$ 149,90" },
    { id: 3, name: "Detergemte Ype 500ml", price: "R$ 79,90" },
    { id: 4, name: "Café Mellita Tradiconal 500g", price: "R$ 199,90" },
  ];

  // Dados mockados para sugestões
  const suggestions = [
    { id: 5, name: "Creme Penter Pantene 200ml", price: "R$ 199,90" },
    { id: 6, name: "Lâmina de Barebear Gillete", price: "R$ 249,90" }
 
  ];

  // Dados mockados perto de você

  // usar geolocalização expo
  const perto_voce = [
    { id: 9, name: "Azeite de Oliva Galo", price: "R$ 19,90" },
    { id: 10, name: "Papel Toalha Neve", price: "R$ 24,90" },
    { id: 11, name: "Chá Mate 500g", price: "R$ 29,90" },
  
  ];

  // Função para renderizar em grid (2 colunas)
  const renderProductGrid = ({ item }) => (
    <TouchableOpacity style={styles.productCardGrid}>
      <View style={styles.productImageGrid}>
        <Ionicons name="image-outline" size={40} color="#ccc" />
      </View>
      <Text style={styles.productNameGrid} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.productPriceGrid}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={PlaceholderImage}
          style={styles.bannerImage}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Ofertas Especiais</Text>
          <Text style={styles.bannerSubtitle}>Até 50% de desconto</Text>
        </View>
      </View>

      {/* Campo de Busca - abaixo do banner */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Seção Favoritos - Grid 2 colunas */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>❤️ Favoritos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={favorites}
            renderItem={renderProductGrid}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false}
          />
        </View>

        {/* Seção Sugestões - Grid 2 colunas */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Sugestões para você</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={suggestions}
            renderItem={renderProductGrid}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false}
          />
        </View>

        {/* Seção Perto de Você - Grid 2 colunas */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Bem perto de você</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={perto_voce}
            renderItem={renderProductGrid}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
   
  },
  bannerContainer: {
    width: "100%",
    height: 250, 
 },
  bannerImage: {
    width: "100%",
    height: "100%",
    
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  
  content: {
    padding: 16,
    paddingTop: 0,
    paddingBottom : 100
    // compensar o tabsBar
    
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#007AFF",
    fontSize: 14,
  },
  
  // Estilos do Grid (2 colunas)
  gridRow: {
    justifyContent: "space-between",
  },
  productCardGrid: {
    width: "48%", // Quase metade da tela
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageGrid: {
    width: "100%",
    height: 140, 
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  productNameGrid: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
    minHeight: 40,
    margin: 0
  },
  productPriceGrid: {
    marginLeft :65,
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});