import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { getFontSizes, getSpacing } from '../../utils/responsive';

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
  user,
  onLogout,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const fontSizes = getFontSizes();
  const spacing = getSpacing();

  const getInitial = () => {
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const fullName = user?.fullName;
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    const name = firstName || lastName || fullName || email || 'U';
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    return email?.split('@')[0] || 'User';
  };

  const getEmail = () => {
    return user?.primaryEmailAddress?.emailAddress || user?.email || 'No email';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-start"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <Pressable
          className="rounded-b-3xl"
          style={{
            backgroundColor: theme.background,
            marginTop: 0,
            paddingTop: spacing.xl * 2,
            paddingBottom: spacing.xl,
            paddingHorizontal: spacing.lg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* User Avatar and Info */}
            <View className="items-center mb-6">
              <View
                className="rounded-full items-center justify-center mb-4"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: theme.primary,
                }}
              >
                <Text
                  className="text-white font-poppins-bold"
                  style={{ fontSize: fontSizes.h1 }}
                >
                  {getInitial()}
                </Text>
              </View>
              
              <Text
                className="font-poppins-bold text-center"
                style={{ fontSize: fontSizes.h3, color: theme.heading }}
              >
                {getDisplayName()}
              </Text>
              
              <Text
                className="font-inter text-center mt-1"
                style={{ fontSize: fontSizes.body, color: theme.textSecondary }}
              >
                {getEmail()}
              </Text>
            </View>

            {/* Theme Toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
              className="flex-row items-center justify-between py-4 px-4 rounded-2xl mb-3"
              style={{ backgroundColor: theme.backgroundCard }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text style={{ fontSize: fontSizes.h3, marginRight: spacing.md }}>
                  {isDark ? '🌙' : '☀️'}
                </Text>
                <Text
                  className="font-poppins-medium"
                  style={{ fontSize: fontSizes.body, color: theme.text }}
                >
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              
              <View
                className="w-12 h-6 rounded-full items-center flex-row px-1"
                style={{ backgroundColor: isDark ? theme.primary : theme.border }}
              >
                <View
                  className="w-5 h-5 rounded-full"
                  style={{
                    backgroundColor: isDark ? '#FFFFFF' : theme.primary,
                    transform: [{ translateX: isDark ? 20 : 0 }],
                  }}
                />
              </View>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={() => {
                onClose();
                onLogout();
              }}
              className="flex-row items-center justify-center py-4 px-4 rounded-2xl"
              style={{ backgroundColor: theme.accentRed }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: fontSizes.h4, marginRight: spacing.sm }}>
                🚪
              </Text>
              <Text
                className="text-white font-poppins-semibold"
                style={{ fontSize: fontSizes.body }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

