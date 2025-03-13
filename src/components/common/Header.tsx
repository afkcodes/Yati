// components/common/Header.tsx
import {ArrowLeft} from 'lucide-react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextX, TouchableX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';
import {s, vs} from '~/utils/screenUtil';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

/**
 * A reusable header component for screens
 */
const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightElement,
}) => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  // Get theme colors
  const textColor = getThemeColor(theme, 'text', 'primary');
  const surfaceColor = getThemeColor(theme, 'background', 'surface');
  const borderColor = getThemeColor(theme, 'border', 'subtle');

  // Size constants
  const ICON_SIZE = 22;
  const BUTTON_PADDING = s(8);
  const BUTTON_SIZE = ICON_SIZE + BUTTON_PADDING * 2; // Icon + padding on all sides

  // Set header content height based on button size plus vertical padding
  const headerContentHeight = BUTTON_SIZE + vs(16); // Button size + some extra padding

  return (
    <ViewX
      paddingTop={insets.top}
      backgroundColor={withAlpha(surfaceColor, 0.97)}
      borderBottomWidth={StyleSheet.hairlineWidth}
      borderBottomColor={withAlpha(borderColor, 0.3)}
      style={styles.headerShadow}>
      <ViewX
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={s(16)}
        paddingVertical={vs(8)}
        height={headerContentHeight}>
        {/* Left side - Back button or spacer */}
        {showBackButton ? (
          <TouchableX
            padding={BUTTON_PADDING}
            borderRadius={styleUtils.borderRadius.full}
            onPress={onBackPress}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            backgroundColor={withAlpha(textColor, 0.07)}
            activeOpacity={0.7}>
            <ArrowLeft size={ICON_SIZE} color={textColor} strokeWidth={2.5} />
          </TouchableX>
        ) : (
          <ViewX width={BUTTON_SIZE} height={BUTTON_SIZE} />
        )}

        {/* Title */}
        <TextX fontSize="lg" fontWeight="bold" color="primary">
          {title}
        </TextX>

        {/* Right side - Custom element or spacer */}
        {rightElement || <ViewX width={BUTTON_SIZE} height={BUTTON_SIZE} />}
      </ViewX>
    </ViewX>
  );
};

const styles = StyleSheet.create({
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
});

export default Header;
