// screens/HabitDetails/DetailItem.tsx
import React from 'react';
import {DimensionValue, StyleSheet} from 'react-native';
import {TextX, ViewX} from '~/components/common';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';

interface DetailItemProps {
  label: string;
  value: string;
  width?: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
  variant?: 'standard' | 'card' | 'accent';
}

const DetailItem: React.FC<DetailItemProps> = React.memo(
  ({label, value, width = '48%', icon, accentColor, variant = 'standard'}) => {
    const {theme} = useTheme();
    const surfaceColor = getThemeColor(theme, 'background', 'surface');
    const bgColor = getThemeColor(theme, 'background', 'base');
    const borderColor = getThemeColor(theme, 'border', 'subtle');
    const textPrimary = getThemeColor(theme, 'text', 'primary');
    const textSecondary = getThemeColor(theme, 'text', 'secondary');

    // Determine background color based on variant
    let backgroundColor = 'transparent';
    let padding = styleUtils.spacing[0];
    let borderWidth = 0;
    let borderRadius = styleUtils.borderRadius.none;
    let valueColor = 'primary';
    let labelColor = 'secondary';

    if (variant === 'card') {
      backgroundColor = surfaceColor;
      padding = styleUtils.spacing.md;
      borderWidth = StyleSheet.hairlineWidth;
      borderRadius = styleUtils.borderRadius.md;
    } else if (variant === 'accent' && accentColor) {
      backgroundColor = withAlpha(accentColor, 0.1);
      padding = styleUtils.spacing.sm;
      borderRadius = styleUtils.borderRadius.sm;
      valueColor = accentColor ? 'primary' : 'primary';
      labelColor = 'secondary';
    }

    return (
      <ViewX
        width={width as DimensionValue}
        marginBottom={styleUtils.spacing.md}
        backgroundColor={backgroundColor}
        padding={padding}
        borderWidth={borderWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}>
        <ViewX flexDirection="row" alignItems="center">
          {icon && <ViewX marginRight={styleUtils.spacing.xs}>{icon}</ViewX>}
          <TextX
            fontSize="xs"
            color={labelColor}
            fontWeight="semibold"
            textTransform="uppercase">
            {label}
          </TextX>
        </ViewX>

        <TextX
          fontSize={variant === 'card' ? 'xl' : 'sm'}
          fontWeight={variant === 'card' ? 'bold' : 'medium'}
          color={valueColor}
          marginTop={styleUtils.spacing['2xs']}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={
            accentColor && variant === 'accent'
              ? {color: accentColor}
              : undefined
          }>
          {value}
        </TextX>
      </ViewX>
    );
  },
);

export default DetailItem;
