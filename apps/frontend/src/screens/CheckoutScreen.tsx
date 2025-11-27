import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/types';
import { updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { BackIcon } from '../components/common/Icon';
import { getFontSizes } from '../utils/responsive';
import { useToast } from '../context/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const { showToast } = useToast();
  const fontSizes = getFontSizes();

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      // Update inventory in Firestore for each product
      const updatePromises = cartItems.map(async (item) => {
        const productRef = doc(db, 'products', item.product.id);
        await updateDoc(productRef, {
          stock: increment(-item.quantity),
        });
      });

      await Promise.all(updatePromises);

      // Generate order ID
      const orderId = `ORD${Date.now()}`;

      // Clear cart
      clearCart();

      // Navigate to success screen
      navigation.replace('OrderConfirmed', { orderId });
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Order failed. Please try again.', { type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 mb-6">
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: theme.backgroundCard }}
            onPress={() => navigation.goBack()}
            disabled={processing}
          >
            <BackIcon size={24} color={theme.text} />
          </TouchableOpacity>

          <Text
            className="font-poppins-bold"
            style={{ color: theme.heading, fontSize: fontSizes.h2 }}
          >
            Checkout
          </Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: theme.backgroundCard }}
          >
            <Text
              className="font-poppins-bold mb-4"
              style={{ color: theme.heading, fontSize: fontSizes.h3 }}
            >
              Order Summary
            </Text>

            {cartItems.map((item) => (
              <View
                key={item.product.id}
                className="flex-row items-center justify-between mb-3"
              >
                <Text
                  className="flex-1 font-inter"
                  style={{ color: theme.text, fontSize: fontSizes.body }}
                  numberOfLines={1}
                >
                  {item.product.name} × {item.quantity}
                </Text>
                <Text
                  className="font-poppins-semibold ml-4"
                  style={{ color: theme.primary, fontSize: fontSizes.body }}
                >
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View
              className="mt-4 pt-4"
              style={{ borderTopWidth: 1, borderTopColor: theme.border }}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="font-poppins-bold"
                  style={{ color: theme.heading, fontSize: fontSizes.h4 }}
                >
                  Total
                </Text>
                <Text
                  className="font-poppins-bold"
                  style={{ color: theme.primary, fontSize: fontSizes.priceSmall }}
                >
                  ${cartTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Delivery Info Placeholder */}
          <View
            className="rounded-3xl p-6 mb-6"
            style={{ backgroundColor: theme.backgroundCard }}
          >
            <Text
              className="font-poppins-bold mb-3"
              style={{ color: theme.heading, fontSize: fontSizes.h3 }}
            >
              Delivery Information
            </Text>
            <Text
              className="font-inter"
              style={{ color: theme.textSecondary, fontSize: fontSizes.body }}
            >
              📍 Standard delivery (2-3 days)
            </Text>
            <Text
              className="font-inter mt-1"
              style={{ color: theme.textSecondary, fontSize: fontSizes.body }}
            >
              🚚 Free shipping on all orders
            </Text>
          </View>

          <View className="h-24" />
        </ScrollView>

        {/* Place Order Button */}
        <View className="px-6 pb-6 pt-4">
          <TouchableOpacity
            className="py-5 rounded-full items-center justify-center"
            style={{
              backgroundColor: processing ? theme.textLight : theme.primary,
            }}
            onPress={handlePlaceOrder}
            disabled={processing}
            activeOpacity={0.8}
          >
            {processing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className="text-white font-poppins-semibold"
                style={{ fontSize: fontSizes.button }}
              >
                Place Order
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
