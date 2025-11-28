import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../theme/ThemeContext';
import { Product, getProductImageSource } from '../../services/productService';
import { HeartIcon, AddIcon } from '../common/Icon';
import { typography } from '../../theme/typography';

interface HorizontalProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
}

export const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  const { theme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  const isOutOfStock = product.stock === 0;

  return (
    <TouchableOpacity
      className="overflow-hidden flex-row mb-4 rounded-3xl"
      style={{
        backgroundColor: theme.cardHighlight,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        height: 140,
        opacity: isOutOfStock ? 0.6 : 1,
      }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image - Left Side */}
      <View
        className="justify-center items-center w-36 h-full"
        style={{ backgroundColor: theme.cardHighlight }}
      >
        <Image
          source={getProductImageSource(product)}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
        />
      </View>

      {/* Product Info - Right Side */}
      <View className="flex-1 justify-between p-4">
        {/* Top Row: Name and Heart */}
        <View className="flex-row justify-between items-start">
          <Text
            style={[typography.h4, { flex: 1, color: theme.text }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Favorite Heart Icon */}
          <TouchableOpacity
            className="justify-center items-center ml-2 w-9 h-9 rounded-full"
            style={{ backgroundColor: isFavorite ? theme.accentRed : 'transparent' }}
            onPress={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            activeOpacity={0.8}
          >
            <HeartIcon
              size={20}
              color={isFavorite ? '#FFFFFF' : theme.accentRed}
              filled={isFavorite}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Row: Price and Add Button */}
        <View className="flex-row justify-between items-end">
          {/* Price */}
          <View className="flex-row items-baseline">
            <Text style={typography.price}>
              $ {product.price.toFixed(1)}
            </Text>
            <Text style={[typography.priceUnit, { marginLeft: 4, color: theme.textSecondary }]}>
              /kg
            </Text>
          </View>

          {/* Add to Cart / Out of Stock */}
          {product.stock === 0 ? (
            <Text style={[typography.caption, { color: theme.textSecondary }]}>
              Out of stock
            </Text>
          ) : (
            <TouchableOpacity
              className="justify-center items-center w-14 h-14 rounded-2xl"
              style={{ backgroundColor: theme.primary }}
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
              activeOpacity={0.8}
            >
              <AddIcon size={28} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
