import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { CartIcon } from '../common/Icon';
import { getComponentSizes, getFontSizes, getSpacing } from '../../utils/responsive';
import { UserProfileModal } from './UserProfileModal';

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
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Get first letter of user's name for avatar
  const getInitial = () => {
    // Try to get name from Clerk user object
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const fullName = user?.fullName;
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    
    const name = firstName || lastName || fullName || email || 'U';
    return name.charAt(0).toUpperCase();
  };

  // Get username (first name or email prefix)
  const getUsername = () => {
    // Try Clerk properties first
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.fullName) {
      return user.fullName.split(' ')[0];
    }
    // Fallback to email
    const email = user?.primaryEmailAddress?.emailAddress || user?.email;
    if (email) {
      return email.split('@')[0];
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
        {/* Left: Avatar with initial - Static (non-clickable) */}
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

        {/* Center: Username with dropdown indicator - Clickable */}
        <TouchableOpacity
          className="flex-1 items-center mx-4"
          onPress={() => setShowProfileModal(true)}
          activeOpacity={0.7}
        >
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
        </TouchableOpacity>

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

      {/* User Profile Modal */}
      {onLogout && (
        <UserProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onLogout={onLogout}
        />
      )}
    </>
  );
};
