import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="flex-row items-center px-6 py-3 rounded-full"
      style={{ backgroundColor: theme.backgroundCard }}
    >
      <View
        className="w-12 h-6 rounded-full items-center flex-row px-1"
        style={{ backgroundColor: theme.border }}
      >
        <View
          className={`w-5 h-5 rounded-full ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
          style={{ backgroundColor: theme.primary }}
        />
      </View>
      <Text className="ml-3 text-base font-poppins-medium" style={{ color: theme.text }}>
        {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </Text>
    </TouchableOpacity>
  );
};
