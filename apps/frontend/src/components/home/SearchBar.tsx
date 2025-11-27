import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { SearchIcon, ScanIcon } from '../common/Icon';

interface SearchBarProps {
  onSearchPress?: () => void;
  onScanPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchPress, onScanPress }) => {
  const { theme } = useTheme();

  return (
    <View className="px-6 mt-4 mb-2">
      <View className="flex-row items-center">
        {/* Search Input */}
        <TouchableOpacity
          className="flex-1 flex-row items-center px-4 py-4 rounded-2xl mr-3"
          style={{ backgroundColor: theme.backgroundCard }}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <SearchIcon size={22} color={theme.primary} />
          <Text
            className="flex-1 text-base font-inter ml-3"
            style={{ color: theme.textLight }}
          >
            Search fresh groceries
          </Text>
        </TouchableOpacity>

        {/* Scan Button */}
        <TouchableOpacity
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: theme.primary }}
          onPress={onScanPress}
          activeOpacity={0.7}
        >
          <ScanIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
