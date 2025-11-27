import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Header } from '../components/home/Header';
import { SearchBar } from '../components/home/SearchBar';
import { AdCarousel } from '../components/home/AdCarousel';
import { HorizontalProductCard } from '../components/products/HorizontalProductCard';
import { fetchProducts, Product } from '../services/productService';
import { db } from '../services/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { RootStackParamList } from '../navigation/types';
import { getFontSizes, getSpacing } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface HomeScreenProps extends Props {
  user: any;
  onSignOut: () => void;
  isGuestMode?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onSignOut,
  isGuestMode = false,
  navigation,
}) => {
  const { theme } = useTheme();
  const { addToCart, cartCount } = useCart();
  const { showToast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fontSizes = getFontSizes();
  const spacing = getSpacing();
  const [resetting, setResetting] = useState(false);

  const getInitial = () => {
    const name = user?.displayName || user?.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  // Priority products to show first (in order)
  const PRIORITY_PRODUCTS = ['mango', 'strawberry', 'blueberries'];
  const INITIAL_LOAD_COUNT = 3;
  const LOAD_MORE_COUNT = 3;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await fetchProducts();

      // Sort products: priority items first, then others
      const sortedProducts = sortProductsByPriority(fetchedProducts);
      setAllProducts(sortedProducts);

      // Initially show only first 3 (priority products)
      setDisplayedProducts(sortedProducts.slice(0, INITIAL_LOAD_COUNT));
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const sortProductsByPriority = (products: Product[]): Product[] => {
    const priorityProducts: Product[] = [];
    const otherProducts: Product[] = [];

    // First, add priority products in order
    PRIORITY_PRODUCTS.forEach((priorityId) => {
      const product = products.find((p) => p.id === priorityId);
      if (product) {
        priorityProducts.push(product);
      }
    });

    // Then add remaining products
    products.forEach((product) => {
      if (!PRIORITY_PRODUCTS.includes(product.id)) {
        otherProducts.push(product);
      }
    });

    return [...priorityProducts, ...otherProducts];
  };

  const handleLoadMore = () => {
    if (loadingMore || displayedProducts.length >= allProducts.length) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const nextProducts = allProducts.slice(0, currentLength + LOAD_MORE_COUNT);
      setDisplayedProducts(nextProducts);
      setLoadingMore(false);
    }, 500); // Simulate loading delay
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom) {
      handleLoadMore();
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      showToast(`${product.name} is out of stock`, { type: 'error' });
      return;
    }
    addToCart(product, 1);
    showToast(`${product.name} added to your cart`, { type: 'success' });
  };

  const handleResetStock = async () => {
    try {
      setResetting(true);
      const snapshot = await getDocs(collection(db, 'products'));
      const updates = snapshot.docs.map((d) => {
        const data = d.data() as any;
        const baseline = data.initialStock ?? data.stock ?? 25;
        return updateDoc(doc(db, 'products', d.id), {
          initialStock: baseline,
          stock: baseline,
        });
      });
      await Promise.all(updates);
      showToast('refresh: stock reset to original', { type: 'success' });
    } catch (error) {
      console.error('Error resetting stock:', error);
      showToast('Failed to refresh stock', { type: 'error' });
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: theme.background }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text
          className="mt-4 text-base font-inter"
          style={{ color: theme.textSecondary }}
        >
          Loading products...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: theme.background }}
      >
        <Text className="mb-4 text-4xl">😔</Text>
        <Text
          className="mb-2 text-xl text-center font-poppins-semibold"
          style={{ color: theme.heading }}
        >
          {error}
        </Text>
        <Text
          className="text-base text-center font-inter"
          style={{ color: theme.textSecondary }}
        >
          Please check your connection and try again
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {/* Header */}
          <Header
            user={user}
            cartItemCount={cartCount}
            onLogout={onSignOut}
            onCartPress={() => navigation.navigate('Cart')}
          />

          {/* Greeting - Matching Figma */}
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.sm }}>
            <Text
              className="font-poppins-bold"
              style={{
                fontSize: fontSizes.h1,
                color: theme.heading,
                lineHeight: fontSizes.h1 * 1.2,
              }}
            >
              Hey {isGuestMode ? 'Guest' : getInitial()} 👋
            </Text>
            <Text
              className="font-inter"
              style={{
                fontSize: fontSizes.body,
                color: theme.textSecondary,
                marginTop: spacing.xs,
              }}
            >
              Find fresh groceries you want
            </Text>
          </View>

          {/* Search Bar */}
          <SearchBar
            onSearchPress={() => navigation.navigate('Search')}
            onScanPress={() => showToast('Scanner coming soon', { type: 'neutral' })}
          />

          {/* Advertisement Carousel */}
          <AdCarousel />

          {/* Products Section - Matching Figma */}
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md }}>
            <Text
              className="font-poppins-bold"
              style={{
                fontSize: fontSizes.h2,
                color: theme.heading,
                marginBottom: spacing.md,
              }}
            >
              Popular
            </Text>

            <View style={{ alignItems: 'flex-start', marginBottom: spacing.sm }}>
              <TouchableOpacity
                onPress={handleResetStock}
                disabled={resetting}
                activeOpacity={0.7}
              >
                <Text
                  className="font-inter"
                  style={{
                    fontSize: fontSizes.caption,
                    color: theme.textSecondary,
                    opacity: resetting ? 0.6 : 1,
                  }}
                >
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>

            {/* Product List - Lazy Loaded */}
            {displayedProducts.map((product) => (
              <HorizontalProductCard
                key={product.id}
                product={product}
                onPress={() => navigation.navigate('ProductDetail', { product })}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}

            {/* Loading More Indicator */}
            {loadingMore && (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color={theme.primary} />
                <Text
                  className="mt-2 font-inter"
                  style={{ fontSize: fontSizes.bodySmall, color: theme.textSecondary }}
                >
                  Loading more products...
                </Text>
              </View>
            )}

            {/* End of List Message */}
            {!loadingMore &&
              displayedProducts.length >= allProducts.length &&
              allProducts.length > INITIAL_LOAD_COUNT && (
                <View className="items-center py-6">
                  <Text
                    className="text-center font-inter"
                    style={{ fontSize: fontSizes.bodySmall, color: theme.textSecondary }}
                  >
                    ✨ You've seen all products! ✨
                  </Text>
                </View>
              )}
          </View>

          {/* Spacer at bottom */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
