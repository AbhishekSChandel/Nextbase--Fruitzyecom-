import React from 'react';
import { Image, ImageProps } from 'expo-image';
import { StyleProp, ImageStyle } from 'react-native';

interface OptimizedImageProps {
  source: string | { uri: string };
  style?: StyleProp<ImageStyle>;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  placeholderContentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  transition?: number;
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
}

/**
 * Optimized Image Component using expo-image
 *
 * Benefits:
 * - Automatic caching (disk + memory)
 * - Better performance than React Native Image
 * - Smooth transitions with placeholders
 * - Memory efficient
 * - Supports blurhash placeholders
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  contentFit = 'cover',
  placeholder,
  placeholderContentFit = 'cover',
  transition = 300,
  cachePolicy = 'memory-disk',
}) => {
  // Normalize source to URI format
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <Image
      source={imageSource}
      style={style}
      contentFit={contentFit}
      placeholder={placeholder}
      placeholderContentFit={placeholderContentFit}
      transition={transition}
      cachePolicy={cachePolicy}
    />
  );
};
