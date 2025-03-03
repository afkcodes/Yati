import {ChevronDown} from 'lucide-react-native';
import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useState,
} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import SquircleViewContainer from '~containers/SquircleViewContainer';
import {styleUtils, themes} from '~styles/theme';
import {w} from '~utils/screenUtil';
import TouchableX from './TouchableX';
import ViewX from './ViewX';

// Types
interface CollapsibleContextType {
  isExpanded: boolean;
  isAnimating: boolean;
  onPress: () => void;
  progress: Animated.SharedValue<number>;
  setContentHeight: (height: number) => void;
  contentHeight: number;
}

interface CollapsibleProps {
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

interface CollapsibleHeaderProps {
  children: React.ReactNode;
}

interface CollapsibleContentProps {
  children: React.ReactNode;
}

// Animation config
const animationConfig: WithTimingConfig = {
  duration: 300,
};

// Context
const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

// Hook for child components to consume context
const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      'Collapsible compound components cannot be rendered outside the Collapsible component',
    );
  }
  return context;
};

// Create animated chevron component
const AnimatedChevron = Animated.createAnimatedComponent(ChevronDown);

// Main Component
const CollapsibleComponent = memo(
  ({children, initiallyExpanded = false}: CollapsibleProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(initiallyExpanded);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const progress = useSharedValue<number>(initiallyExpanded ? 1 : 0);

    const onAnimationComplete = useCallback(() => {
      setIsAnimating(false);
    }, []);

    const onPress = useCallback(() => {
      if (isAnimating) {
        return;
      }

      setIsAnimating(true);
      setIsExpanded(prev => !prev);

      progress.value = withTiming(isExpanded ? 0 : 1, animationConfig, () => {
        runOnJS(onAnimationComplete)();
      });
    }, [isExpanded, isAnimating, progress, onAnimationComplete]);

    const contextValue = {
      isExpanded,
      isAnimating,
      onPress,
      progress,
      setContentHeight,
      contentHeight,
    };

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <SquircleViewContainer
          borderRadius="md"
          variant="transparent"
          borderColor={
            isExpanded ? themes.dark.background.accent : 'transparent'
          }
          borderWidth={isExpanded ? 2 : 0}>
          {children}
        </SquircleViewContainer>
      </CollapsibleContext.Provider>
    );
  },
);

// Header Component
const Header = memo(({children}: CollapsibleHeaderProps) => {
  const {onPress, isAnimating, progress} = useCollapsible();

  const chevronStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          rotate: `${interpolate(
            progress.value,
            [0, 1],
            [0, 180],
            Extrapolation.CLAMP,
          )}deg`,
        },
      ],
    }),
    [],
  );

  return (
    <TouchableX
      onPress={onPress}
      flexDirection="row"
      alignItems="center"
      paddingHorizontal={styleUtils.spacing.xs}
      activeOpacity={0.7}
      disabled={isAnimating}>
      <ViewX width={w(80)}>{children}</ViewX>
      <ViewX width={w(20)}>
        <AnimatedChevron
          size={24}
          color={themes.dark.text.secondary}
          style={chevronStyle}
        />
      </ViewX>
    </TouchableX>
  );
});

// Content Component
const Content = memo(({children}: CollapsibleContentProps) => {
  const {progress, contentHeight, setContentHeight} = useCollapsible();

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setContentHeight(event.nativeEvent.layout.height);
    },
    [setContentHeight],
  );

  const contentStyle = useAnimatedStyle(
    () => ({
      height: interpolate(
        progress.value,
        [0, 1],
        [0, contentHeight],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        progress.value,
        [0, 0.5, 1],
        [0, 0.7, 1],
        Extrapolation.CLAMP,
      ),
    }),
    [contentHeight],
  );

  return (
    <Animated.View style={[styles.content, contentStyle]}>
      <View style={styles.measureContainer} onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  );
});

// Set display names
CollapsibleComponent.displayName = 'Collapsible';
Header.displayName = 'Collapsible.Header';
Content.displayName = 'Collapsible.Content';

// Compose the compound component
const Collapsible = Object.assign(CollapsibleComponent, {
  Header,
  Content,
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: '#fff',
    marginVertical: 4,
    overflow: 'hidden',
    borderWidth: 1,
    // borderColor: '#e1e1e1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  content: {
    overflow: 'hidden',
  },
  measureContainer: {
    position: 'absolute',
    width: '100%',
    padding: 16,
  },
});

export default Collapsible;
