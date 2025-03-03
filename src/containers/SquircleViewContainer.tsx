import {SquircleView} from 'expo-squircle-view';
import {DimensionValue} from 'react-native';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor, styleUtils} from '~styles/theme';
import {BorderRadiusSize, Size} from '~types/common.types';
import {BackgroundVariant} from '~types/theme.types';

interface SquircleViewContainerProps {
  children: React.ReactNode;
  borderRadius?: BorderRadiusSize;
  padding?: Size;
  variant?: BackgroundVariant;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  height?: DimensionValue;
  width?: DimensionValue;
}

const SquircleViewContainer: React.FC<SquircleViewContainerProps> = ({
  children,
  padding,
  borderRadius = 'md',
  borderColor = 'transparent',
  borderWidth = 0,
  variant = 'surface', // Changed default to match theme background variant
  backgroundColor,
  height = 'auto',
  width = 'auto',
}) => {
  const {theme} = useTheme();
  const spacing = padding ? styleUtils.spacing[padding] : 0;
  const radius = styleUtils.borderRadius[borderRadius];

  // Use background category for all variants except transparent
  const bgColorCategory =
    variant === 'transparent' ? 'transparent' : 'background';
  const resolvedBackgroundColor = backgroundColor
    ? backgroundColor
    : getThemeColor(theme, bgColorCategory, variant);

  return (
    <SquircleView
      cornerSmoothing={100}
      backgroundColor={resolvedBackgroundColor}
      style={{
        padding: spacing,
        borderColor: borderColor,
        borderWidth,
        height,
        width,
      }}
      borderRadius={radius}>
      {children}
    </SquircleView>
  );
};

export default SquircleViewContainer;
