import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { getProductImageSource } from '../services/productService';
import { RootStackParamList } from '../navigation/types';
import {
  BackIcon,
  CartIcon,
  HeartIcon,
  TruckIcon,
  StarIcon,
  MinusIcon,
  AddIcon,
} from '../components/common/Icon';
import { getFontSizes } from '../utils/responsive';
import { useToast } from '../context/ToastContext';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const { theme } = useTheme();
  const { addToCart, getCartItem, cartCount } = useCart();
  const { showToast } = useToast();
  const fontSizes = getFontSizes();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = getCartItem(product.id);
  const currentCartQuantity = cartItem?.quantity || 0;

  const handleAddToBag = () => {
    if (quantity + currentCartQuantity > product.stock) {
      showToast(
        `Only ${product.stock} items available. You already have ${currentCartQuantity} in cart.`,
        { type: 'error' }
      );
      return;
    }

    addToCart(product, quantity);
    showToast(`${quantity} x ${product.name} added to your cart`, {
      type: 'success',
    });
  };

  const incrementQuantity = () => {
    if (quantity + currentCartQuantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      showToast(`Only ${product.stock} items available`, { type: 'error' });
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-4">
            {/* Back Button */}
            <TouchableOpacity
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.backgroundCard }}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={24} color={theme.text} />
            </TouchableOpacity>

            {/* Cart Icon with Badge */}
            <TouchableOpacity
              className="w-16 h-16 rounded-2xl items-center justify-center relative"
              style={{ backgroundColor: theme.backgroundCard }}
              onPress={() => navigation.navigate('Cart')}
            >
              <CartIcon size={26} color={theme.textSecondary} />
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

          {/* Product Image */}
          <View className="items-center py-8">
            <Image
              source={getProductImageSource(product)}
              style={{ width: 300, height: 300 }}
              contentFit="contain"
              transition={300}
              cachePolicy="memory-disk"
            />

            {/* Favorite Button */}
            <TouchableOpacity
              className="absolute bottom-12 right-12 w-16 h-16 rounded-full items-center justify-center"
              style={{
                backgroundColor: isFavorite ? theme.accentRed : theme.backgroundCard,
              }}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.8}
            >
              <HeartIcon
                size={28}
                color={isFavorite ? '#FFFFFF' : theme.accentRed}
                filled={isFavorite}
              />
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View className="px-6">
            {/* Free Shipping Badge */}
            <View className="flex-row items-center mb-4">
              <TruckIcon size={22} color={theme.primary} />
              <Text
                className="font-poppins-medium ml-2"
                style={{ color: theme.primary, fontSize: fontSizes.body }}
              >
                Free shipping
              </Text>
            </View>

            {/* Product Name */}
            <Text
              className="font-poppins-bold mb-4"
              style={{ color: theme.heading, fontSize: fontSizes.h2 }}
            >
              {product.name}
            </Text>

            {/* Rating and Category */}
            <View className="flex-row items-center mb-6">
              {/* Rating */}
              <View
                className="flex-row items-center px-4 py-2 rounded-full mr-3"
                style={{ backgroundColor: theme.backgroundCard }}
              >
                <StarIcon size={16} color="#FFB800" filled />
                <Text
                  className="font-poppins-semibold ml-1"
                  style={{ color: theme.text, fontSize: fontSizes.body }}
                >
                  4.7
                </Text>
              </View>

              {/* Category */}
              <View
                className="flex-row items-center px-4 py-2 rounded-full"
                style={{ backgroundColor: theme.backgroundMint }}
              >
                <Text style={{ fontSize: fontSizes.body }}>🥭</Text>
                <Text
                  className="font-poppins-medium"
                  style={{ color: theme.heading, fontSize: fontSizes.body }}
                >
                  Fruits
                </Text>
              </View>

              {/* Price */}
              <View className="flex-1 items-end">
                <View className="flex-row items-baseline">
                  <Text style={typography.price}>
                    $ {product.price.toFixed(1)}
                  </Text>
                  <Text style={[typography.priceUnit, { marginLeft: 4, color: theme.textSecondary }]}>
                    /kg
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text style={[typography.h3, { marginBottom: 12, color: theme.text }]}>
              Description
            </Text>
            <Text style={[typography.bodySecondary, { marginBottom: 24, lineHeight: 24, color: theme.textSecondary }]}>
              {product.description}
            </Text>

            {/* Stock Info */}
            {product.stock < 10 && (
              <View className="mb-4">
                <Text style={[typography.bodySmall, { color: theme.accentOrange }]}>
                  ⚠️ Only {product.stock} left in stock!
                </Text>
              </View>
            )}

            {/* Quantity and Add to Bag */}
            <View className="flex-row items-center mb-8">
              {/* Quantity Selector */}
              <View className="flex-row items-center mr-4">
                {/* Minus Button */}
                <TouchableOpacity
                  className="w-14 h-14 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: theme.backgroundCard }}
                  onPress={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusIcon
                    size={24}
                    color={quantity <= 1 ? theme.textLight : theme.text}
                  />
                </TouchableOpacity>

                {/* Quantity Display */}
                <Text
                  className="text-2xl font-poppins-bold mx-6"
                  style={{ color: theme.heading }}
                >
                  {quantity}
                </Text>

                {/* Plus Button */}
                <TouchableOpacity
                  className="w-14 h-14 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: theme.backgroundCard }}
                  onPress={incrementQuantity}
                >
                  <AddIcon size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>

              {/* Add to Bag Button */}
              <TouchableOpacity
                className="flex-1 py-5 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.primary }}
                onPress={handleAddToBag}
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-poppins-semibold">
                  Add to bag
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
