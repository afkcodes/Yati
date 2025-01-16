import {SquircleView} from 'expo-squircle-view';
import {useTheme} from '~hooks/ThemeContext';
import {styleUtils, themes} from '~styles/theme';
import {BorderRadiusSize, Size} from '~types/common.types';

interface SquircleViewContainer {
  children: React.ReactNode;
  padding: Size;
  borderRadius: BorderRadiusSize;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'transparent';
  backgroundColor?: string;
}

const SquircleViewContainer: React.FC<SquircleViewContainer> = ({
  children,
  padding = 'sm',
  borderRadius = 'md',
  variant = 'secondary',
  backgroundColor,
}) => {
  const spacing = styleUtils.spacing[padding];
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
      }}
      borderRadius={radius}>
      {children}
    </SquircleView>
  );
};

export default SquircleViewContainer;
