import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart, CartItem } from '../context/CartContext';
import { getProductImageSource } from '../services/productService';
import { RootStackParamList } from '../navigation/types';
import { BackIcon, HeartIcon, MinusIcon, AddIcon, Icon } from '../components/common/Icon';
import { getFontSizes } from '../utils/responsive';
import { useToast } from '../context/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const fontSizes = getFontSizes();

  const handleIncrement = (item: CartItem) => {
    if (item.quantity < item.product.stock) {
      updateQuantity(item.product.id, item.quantity + 1);
    } else {
      showToast(`Only ${item.product.stock} items available`, { type: 'error' });
    }
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
      showToast(`${item.product.name} removed from cart`, { type: 'neutral' });
    }
  };

  const handleRemove = (item: CartItem) => {
    removeFromCart(item.product.id);
    showToast(`${item.product.name} removed from cart`, { type: 'neutral' });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', { type: 'error' });
      return;
    }
    navigation.navigate('Checkout');
  };

  if (cartItems.length === 0) {
    return (
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 mb-6">
            <TouchableOpacity
              className="justify-center items-center mb-6 w-16 h-16 rounded-full"
              style={{ backgroundColor: theme.backgroundCard }}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={24} color={theme.text} />
            </TouchableOpacity>

            <Text className="text-4xl font-poppins-bold" style={{ color: theme.heading }}>
              My Bag
            </Text>
          </View>

          {/* Empty State */}
          <View className="flex-1 justify-center items-center px-8">
            <Text className="mb-6 text-8xl">🛍️</Text>
            <Text
              className="mb-3 text-2xl text-center font-poppins-bold"
              style={{ color: theme.heading }}
            >
              Your cart is empty
            </Text>
            <Text
              className="mb-8 text-base text-center font-inter"
              style={{ color: theme.textSecondary }}
            >
              Add some delicious items to get started!
            </Text>
            <TouchableOpacity
              className="px-8 py-4 rounded-full"
              style={{ backgroundColor: theme.primary }}
              onPress={() => navigation.navigate('Home')}
            >
              <Text className="text-base text-white font-poppins-semibold">
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 mb-4">
          <TouchableOpacity
            className="justify-center items-center mb-6 w-16 h-16 rounded-full"
            style={{ backgroundColor: theme.backgroundCard }}
            onPress={() => navigation.goBack()}
          >
            <BackIcon size={24} color={theme.text} />
          </TouchableOpacity>

          <View className="flex-row justify-between items-center">
            <Text
              className="font-poppins-bold"
              style={{ color: theme.heading, fontSize: fontSizes.h2 }}
            >
              My Bag
            </Text>
            <Text
              className="font-poppins-medium"
              style={{ color: theme.textSecondary, fontSize: fontSizes.body }}
            >
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Cart Items */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {cartItems.map((item) => (
            <View
              key={item.product.id}
              className="flex-row p-4 mb-4 rounded-3xl"
              style={{ backgroundColor: theme.backgroundCard }}
            >
              {/* Product Image */}
              <View
                className="justify-center items-center mr-4 w-24 h-24 rounded-2xl"
                style={{ backgroundColor: theme.backgroundMint }}
              >
                <Image
                  source={getProductImageSource(item.product)}
                  style={{ width: 80, height: 80 }}
                  contentFit="contain"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>

              {/* Product Info */}
              <View className="flex-1">
                {/* Name and Delete */}
                <View className="flex-row justify-between items-start mb-2">
                  <Text
                    className="flex-1 font-poppins-semibold"
                    style={{ color: theme.heading, fontSize: fontSizes.h4 }}
                    numberOfLines={1}
                  >
                    {item.product.name}
                  </Text>
                  <TouchableOpacity className="ml-2" onPress={() => handleRemove(item)}>
                    <Text className="text-base">❌</Text>
                  </TouchableOpacity>
                </View>

                {/* Quantity and Price */}
                <Text
                  className="mb-2 font-inter"
                  style={{ color: theme.textSecondary, fontSize: fontSizes.caption }}
                >
                  {item.quantity} kg
                </Text>

                <View className="flex-row justify-between items-center">
                  {/* Price */}
                  <Text
                    className="font-poppins-bold"
                    style={{ color: theme.primary, fontSize: fontSizes.priceSmall }}
                  >
                    $ {(item.product.price * item.quantity).toFixed(1)}
                  </Text>

                  {/* Quantity Controls */}
                  <View className="flex-row items-center">
                    {/* Minus */}
                    <TouchableOpacity
                      className="justify-center items-center w-10 h-10 rounded-xl"
                      style={{ backgroundColor: theme.background }}
                      onPress={() => handleDecrement(item)}
                    >
                      <MinusIcon size={20} color={theme.text} />
                    </TouchableOpacity>

                    {/* Quantity */}
                    <Text
                      className="mx-4 font-poppins-semibold"
                      style={{ color: theme.heading, fontSize: fontSizes.h4 }}
                    >
                      {item.quantity}
                    </Text>

                    {/* Plus */}
                    <TouchableOpacity
                      className="justify-center items-center w-10 h-10 rounded-xl"
                      style={{ backgroundColor: theme.background }}
                      onPress={() => handleIncrement(item)}
                    >
                      <AddIcon size={20} color={theme.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <View className="h-4" />
        </ScrollView>

        {/* Bottom Section: Total and Checkout */}
        <View className="px-6 pt-4 pb-6" style={{ backgroundColor: theme.background }}>
          {/* Total */}
          <View className="flex-row justify-between items-center mb-6">
            <Text
              className="font-poppins-semibold"
              style={{ color: theme.heading, fontSize: fontSizes.h3 }}
            >
              Total
            </Text>
            <Text
              className="font-poppins-bold"
              style={{ color: theme.primary, fontSize: fontSizes.price }}
            >
              $ {cartTotal.toFixed(1)}
            </Text>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            className="justify-center items-center py-5 rounded-full"
            style={{ backgroundColor: theme.primary }}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Text
              className="text-white font-poppins-semibold"
              style={{ fontSize: fontSizes.button }}
            >
              Proceed To Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
