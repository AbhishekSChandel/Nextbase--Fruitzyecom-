import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { typography } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderConfirmed'>;

export const OrderConfirmedScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { theme } = useTheme();

  const handleBrowseHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-8">
          {/* Success Icon */}
          <View
            className="w-32 h-32 rounded-full items-center justify-center mb-8"
            style={{ backgroundColor: theme.backgroundMint }}
          >
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <Text className="text-5xl text-white">✓</Text>
            </View>
          </View>

          {/* Success Title */}
          <Text
            className="text-4xl font-poppins-bold mb-4"
            style={{ color: theme.heading }}
          >
            Success!
          </Text>

          {/* Success Message */}
          <Text
            className="text-base font-inter text-center mb-2"
            style={{ color: theme.textSecondary }}
          >
            You have successfully created your order.
          </Text>

          {/* Order ID */}
          <Text
            className="text-sm font-inter text-center mb-12"
            style={{ color: theme.textLight }}
          >
            Order ID: {orderId}
          </Text>

          {/* Browse Home Button */}
          <TouchableOpacity
            className="w-full py-5 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.primary }}
            onPress={handleBrowseHome}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-poppins-semibold">Browse Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
