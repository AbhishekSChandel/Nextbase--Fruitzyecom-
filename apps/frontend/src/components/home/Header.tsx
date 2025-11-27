import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CartIcon } from '../common/Icon';
import { getComponentSizes, getFontSizes, getSpacing } from '../../utils/responsive';

interface HeaderProps {
  user: any;
  cartItemCount?: number;
  onCartPress?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cartItemCount = 0,
  onCartPress,
  onLogout,
}) => {
  const { theme } = useTheme();
  const sizes = getComponentSizes();
  const fontSizes = getFontSizes();
  const spacing = getSpacing();

  // Get first letter of user's name for avatar
  const getInitial = () => {
    const displayName = user?.displayName || user?.email || 'U';
    return displayName.charAt(0).toUpperCase();
  };

  // Get username (first name or email prefix)
  const getUsername = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <>
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
        }}
      >
        {/* Left: Avatar with initial */}
        <View
          className="rounded-full items-center justify-center"
          style={{
            width: sizes.avatarSize,
            height: sizes.avatarSize,
            backgroundColor: theme.primary,
          }}
        >
          <Text
            className="text-white font-poppins-bold"
            style={{ fontSize: fontSizes.h4 }}
          >
            {getInitial()}
          </Text>
        </View>

        {/* Center: Username with dropdown indicator */}
        <View className="flex-1 items-center mx-4">
          <View
            className="rounded-full flex-row items-center"
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.sm,
              backgroundColor: theme.backgroundCard,
            }}
          >
            <Text
              className="font-poppins-medium"
              style={{
                fontSize: fontSizes.body,
                color: theme.text,
              }}
            >
              {getUsername()}'s Home
            </Text>
            <Text
              className="ml-2"
              style={{
                fontSize: fontSizes.bodySmall,
                color: theme.textSecondary,
              }}
            >
              ▼
            </Text>
          </View>
        </View>

        {/* Right: Cart icon with badge */}
        <TouchableOpacity
          className="rounded-2xl items-center justify-center relative"
          style={{
            width: sizes.avatarSize,
            height: sizes.avatarSize,
            backgroundColor: theme.backgroundCard,
          }}
          onPress={onCartPress}
        >
          <CartIcon size={sizes.iconLarge} color={theme.textSecondary} />
          {cartItemCount > 0 && (
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
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      {onLogout && (
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xs }}>
          <TouchableOpacity
            className="self-end rounded-full"
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              backgroundColor: theme.accentRed,
            }}
            onPress={onLogout}
          >
            <Text
              className="text-white font-poppins-medium"
              style={{ fontSize: fontSizes.caption }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
