import {SquircleView} from 'expo-squircle-view';
import {DimensionValue} from 'react-native';
import {useTheme} from '~hooks/ThemeContext';
import {styleUtils, themes} from '~styles/theme';
import {BorderRadiusSize, Size} from '~types/common.types';

interface SquircleViewContainer {
  children: React.ReactNode;
  borderRadius: BorderRadiusSize;
  padding?: Size;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'transparent';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  height?: DimensionValue;
  width?: DimensionValue;
}

const SquircleViewContainer: React.FC<SquircleViewContainer> = ({
  children,
  padding,
  borderRadius = 'md',
  borderColor = 'transparent',
  borderWidth = 0,
  variant = 'secondary',
  backgroundColor,
  height = 'auto',
  width = 'auto',
}) => {
  const spacing = padding ? styleUtils.spacing[padding] : 0;
  const radius = styleUtils.borderRadius[borderRadius];
  const {theme} = useTheme();
  return (
    <SquircleView
      cornerSmoothing={100}
      backgroundColor={
        backgroundColor ? backgroundColor : themes[theme].background[variant]
      }
      style={{
        padding: spacing,
        borderColor,
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
