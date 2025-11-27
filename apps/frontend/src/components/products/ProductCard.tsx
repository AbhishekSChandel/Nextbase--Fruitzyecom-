import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Product } from '../../services/productService';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      className="overflow-hidden mb-4 rounded-3xl"
      style={{
        backgroundColor: theme.backgroundCard,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View
        className="overflow-hidden justify-center items-center w-full h-32"
        style={{ backgroundColor: theme.backgroundMint }}
      >
        <Image
          source={{ uri: product.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          {/* Product Name */}
          <Text
            className="flex-1 text-base font-poppins-semibold"
            style={{ color: theme.heading }}
            numberOfLines={1}
          >
            {product.name}
          </Text>

          {/* Favorite Heart Icon */}
          <TouchableOpacity className="justify-center items-center ml-2 w-8 h-8 rounded-full">
            <Text className="text-lg">🤍</Text>
          </TouchableOpacity>
        </View>

        {/* Price and Add Button Row */}
        <View className="flex-row justify-between items-center mt-2">
          {/* Price */}
          <View>
            <Text className="text-2xl font-poppins-bold" style={{ color: theme.primary }}>
              $ {product.price.toFixed(2)}
            </Text>
            <Text className="text-xs font-inter" style={{ color: theme.textSecondary }}>
              /kg
            </Text>
          </View>
          {product.stock === 0 ? (
            <View
              className="px-3 py-2 rounded-2xl"
              style={{ backgroundColor: theme.border }}
            >
              <Text className="font-inter" style={{ color: theme.textSecondary }}>
                Out of stock
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              className="justify-center items-center w-12 h-12 rounded-2xl"
              style={{ backgroundColor: theme.primary }}
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
              activeOpacity={0.8}
            >
              <Text className="text-2xl font-bold text-white">+</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stock indicator */}
        {product.stock === 0 ? (
          <View className="mt-2">
            <Text className="text-xs font-inter" style={{ color: theme.textSecondary }}>
              Out of stock
            </Text>
          </View>
        ) : (
          product.stock < 10 && (
            <View className="mt-2">
              <Text className="text-xs font-inter" style={{ color: theme.accentOrange }}>
                Only {product.stock} left in stock!
              </Text>
            </View>
          )
        )}
      </View>
    </TouchableOpacity>
  );
};
