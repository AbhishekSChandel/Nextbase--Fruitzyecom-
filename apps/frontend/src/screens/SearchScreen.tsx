import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header with Back, Title, and Cart */}
        <View className="px-6 pt-4 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            {/* Back Button */}
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.backgroundCard }}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={24} color={theme.text} />
            </TouchableOpacity>

            {/* Title - "Search Groceries" */}
            <View className="flex-1 mx-4">
              <Text
                className="font-poppins-semibold text-center"
                style={{ color: theme.heading, fontSize: fontSizes.h4 }}
              >
                Search Groceries
              </Text>
            </View>

            {/* Cart Icon with Badge */}
            <TouchableOpacity
              className="w-16 h-16 rounded-2xl items-center justify-center relative"
              style={{ backgroundColor: theme.backgroundCard }}
              onPress={() => navigation.navigate('Cart')}
            >
              <CartIcon size={24} color={theme.textSecondary} />
              {cartCount > 0 && (
                <View
                  className="absolute rounded-full items-center justify-center"
                  style={{
                    top: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    backgroundColor: theme.accentRed,
                  }}
                >
                  <Text
                    className="text-white font-poppins-bold"
                    style={{ fontSize: fontSizes.caption }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View
            className="flex-row items-center px-4 py-4 rounded-3xl"
            style={{ backgroundColor: theme.backgroundCard }}
          >
            <View style={{ marginRight: 12 }}>
              <SearchIcon size={24} color={theme.primary} />
            </View>
            <TextInput
              className="flex-1 font-inter text-base"
              style={{ color: theme.text }}
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
          <View className="px-6 mb-6">
            {/* Title Row */}
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="font-poppins-bold"
                style={{ color: theme.heading, fontSize: fontSizes.h3 }}
              >
                Title
              </Text>
              <TouchableOpacity onPress={handleRemoveRecentSearches}>
                <Text
                  className="font-poppins-medium"
                  style={{ color: theme.accentRed, fontSize: fontSizes.body }}
                >
                  remove
                </Text>
              </TouchableOpacity>
            </View>

            {/* Recent Search Tags */}
            <View className="flex-row flex-wrap">
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  className="px-6 py-3 rounded-full mr-2 mb-2"
                  style={{ backgroundColor: theme.backgroundCard }}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <Text
                    className="font-poppins-medium"
                    style={{ color: theme.text, fontSize: fontSizes.body }}
                  >
                    {search}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery.trim() && (
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {loading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : filteredProducts.length > 0 ? (
              <>
                {/* Results Header with Filter Icon */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text
                    className="font-poppins-bold"
                    style={{ color: theme.primary, fontSize: fontSizes.h2 }}
                  >
                    Found {filteredProducts.length} Result
                    {filteredProducts.length !== 1 ? 's' : ''}
                  </Text>
                  <TouchableOpacity
                    className="w-10 h-10 items-center justify-center"
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
              <View className="py-8 items-center">
                <Text className="text-6xl mb-4">🔍</Text>
                <Text
                  className="font-poppins-semibold text-center"
                  style={{ color: theme.heading, fontSize: fontSizes.h3 }}
                >
                  No products found
                </Text>
                <Text
                  className="font-inter text-center mt-2"
                  style={{ color: theme.textSecondary, fontSize: fontSizes.body }}
                >
                  Try searching for something else
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};
