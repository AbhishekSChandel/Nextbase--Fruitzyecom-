import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { HorizontalProductCard } from '../components/products/HorizontalProductCard';
import { fetchProducts, Product } from '../services/productService';
import { RootStackParamList } from '../navigation/types';
import { getFontSizes } from '../utils/responsive';
import { BackIcon, SearchIcon, CartIcon, Icon } from '../components/common/Icon';
import { useToast } from '../context/ToastContext';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { addToCart, cartCount } = useCart();
  const fontSizes = getFontSizes();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Mango',
    'Avocado',
    'Sweet Fruit',
    'Grape',
    'Bread',
    'Pineapple',
    'Raw Meat',
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, allProducts]);

  const loadProducts = async () => {
    try {
      const products = await fetchProducts();
      setAllProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 6)]);
    }
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  const handleRemoveRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    showToast(`${product.name} added to your cart`, { type: 'success' });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 16,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    backButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundCard,
    },
    titleContainer: {
      flex: 1,
      marginHorizontal: 16,
    },
    title: {
      fontFamily: 'Poppins_600SemiBold',
      textAlign: 'center',
      color: theme.heading,
      fontSize: fontSizes.h4,
    },
    cartButton: {
      width: 64,
      height: 64,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: theme.backgroundCard,
    },
    badge: {
      position: 'absolute',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      top: 8,
      right: 8,
      width: 20,
      height: 20,
      backgroundColor: theme.accentRed,
    },
    badgeText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins_700Bold',
      fontSize: fontSizes.caption,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 24,
      backgroundColor: theme.backgroundCard,
    },
    searchInput: {
      flex: 1,
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: theme.text,
    },
    recentSearchesContainer: {
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    recentSearchesHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    recentSearchesTitle: {
      fontFamily: 'Poppins_700Bold',
      color: theme.heading,
      fontSize: fontSizes.h3,
    },
    removeButton: {
      fontFamily: 'Poppins_500Medium',
      color: theme.accentRed,
      fontSize: fontSizes.body,
    },
    recentSearchesTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    recentSearchTag: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: theme.backgroundCard,
    },
    recentSearchTagText: {
      fontFamily: 'Poppins_500Medium',
      color: theme.text,
      fontSize: fontSizes.body,
    },
    resultsScrollView: {
      flex: 1,
      paddingHorizontal: 24,
    },
    loadingContainer: {
      paddingVertical: 32,
    },
    resultsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    resultsTitle: {
      fontFamily: 'Poppins_700Bold',
      color: theme.primary,
      fontSize: fontSizes.h2,
    },
    filterButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noResultsContainer: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    noResultsEmoji: {
      fontSize: 48,
      marginBottom: 16,
    },
    noResultsTitle: {
      fontFamily: 'Poppins_600SemiBold',
      textAlign: 'center',
      color: theme.heading,
      fontSize: fontSizes.h3,
    },
    noResultsText: {
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      marginTop: 8,
      color: theme.textSecondary,
      fontSize: fontSizes.body,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Back, Title, and Cart */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={24} color={theme.text} />
            </TouchableOpacity>

            {/* Title - "Search Groceries" */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Search Groceries</Text>
            </View>

            {/* Cart Icon with Badge */}
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <CartIcon size={24} color={theme.textSecondary} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <View style={{ marginRight: 12 }}>
              <SearchIcon size={24} color={theme.primary} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Sweet Fruit"
              placeholderTextColor={theme.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              autoFocus
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Recent Searches or Results */}
        {!searchQuery.trim() && recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            {/* Title Row */}
            <View style={styles.recentSearchesHeader}>
              <Text style={styles.recentSearchesTitle}>Title</Text>
              <TouchableOpacity onPress={handleRemoveRecentSearches}>
                <Text style={styles.removeButton}>remove</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Search Tags */}
            <View style={styles.recentSearchesTags}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchTag}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <Text style={styles.recentSearchTagText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery.trim() && (
          <ScrollView style={styles.resultsScrollView} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : filteredProducts.length > 0 ? (
              <>
                {/* Results Header with Filter Icon */}
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>
                    Found {filteredProducts.length} Result
                    {filteredProducts.length !== 1 ? 's' : ''}
                  </Text>
                  <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => showToast('Filter options coming soon', { type: 'neutral' })}
                  >
                    <Icon
                      name="filter"
                      library="feather"
                      size={24}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {filteredProducts.map((product) => (
                  <HorizontalProductCard
                    key={product.id}
                    product={product}
                    onPress={() => navigation.navigate('ProductDetail', { product })}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={styles.noResultsTitle}>No products found</Text>
                <Text style={styles.noResultsText}>Try searching for something else</Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};
