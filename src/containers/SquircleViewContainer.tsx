import {SquircleView} from 'expo-squircle-view';
import {DimensionValue} from 'react-native';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor, styleUtils} from '~styles/theme';
import {BorderRadiusSize, Size} from '~types/common.types';
import {BackgroundVariant} from '~types/theme.types';

interface SquircleViewContainerProps {
  children: React.ReactNode;
  borderRadius?: BorderRadiusSize;
  // Padding for all sides
  padding?: Size;
  paddingTop?: Size;
  paddingBottom?: Size;
  paddingLeft?: Size;
  paddingRight?: Size;
  // Margin for all sides
  margin?: Size;
  marginTop?: Size;
  marginBottom?: Size;
  marginLeft?: Size;
  marginRight?: Size;
  variant?: BackgroundVariant;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  height?: DimensionValue;
  width?: DimensionValue;
}

const SquircleViewContainer: React.FC<SquircleViewContainerProps> = ({
  children,
  borderRadius = 'md',
  // Padding props
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  // Margin props
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  variant = 'surface',
  backgroundColor,
  borderColor = 'transparent',
  borderWidth = 0,
  height = 'auto',
  width = 'auto',
}) => {
  const {theme} = useTheme();

  // Resolve padding values (specific sides take precedence over general padding)
  const resolvedPaddingTop = paddingTop
    ? styleUtils.spacing[paddingTop]
    : padding
      ? styleUtils.spacing[padding]
      : 0;
  const resolvedPaddingBottom = paddingBottom
    ? styleUtils.spacing[paddingBottom]
    : padding
      ? styleUtils.spacing[padding]
      : 0;
  const resolvedPaddingLeft = paddingLeft
    ? styleUtils.spacing[paddingLeft]
    : padding
      ? styleUtils.spacing[padding]
      : 0;
  const resolvedPaddingRight = paddingRight
    ? styleUtils.spacing[paddingRight]
    : padding
      ? styleUtils.spacing[padding]
      : 0;

  // Resolve margin values (specific sides take precedence over general margin)
  const resolvedMarginTop = marginTop
    ? styleUtils.spacing[marginTop]
    : margin
      ? styleUtils.spacing[margin]
      : 0;
  const resolvedMarginBottom = marginBottom
    ? styleUtils.spacing[marginBottom]
    : margin
      ? styleUtils.spacing[margin]
      : 0;
  const resolvedMarginLeft = marginLeft
    ? styleUtils.spacing[marginLeft]
    : margin
      ? styleUtils.spacing[margin]
      : 0;
  const resolvedMarginRight = marginRight
    ? styleUtils.spacing[marginRight]
    : margin
      ? styleUtils.spacing[margin]
      : 0;

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
        paddingTop: resolvedPaddingTop,
        paddingBottom: resolvedPaddingBottom,
        paddingLeft: resolvedPaddingLeft,
        paddingRight: resolvedPaddingRight,
        marginTop: resolvedMarginTop,
        marginBottom: resolvedMarginBottom,
        marginLeft: resolvedMarginLeft,
        marginRight: resolvedMarginRight,
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
