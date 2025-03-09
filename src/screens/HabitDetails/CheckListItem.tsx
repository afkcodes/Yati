// screens/HabitDetails/CheckListItem.tsx
import {CheckCircle2} from 'lucide-react-native';
import React from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {TouchableX} from '~/components/common';
import {getThemeColor, styleUtils, withAlpha} from '~/styles/theme';

interface ChecklistItem {
  id: string;
  text: string;
  completed?: boolean;
}

interface HabitChecklistItemProps {
  item: ChecklistItem;
  isCompleted: boolean;
  color: string;
  onToggle: (itemId: string) => void;
  theme: 'dark' | 'light';
}

const AnimatedTouchableX = Animated.createAnimatedComponent(TouchableX);

const HabitChecklistItem: React.FC<HabitChecklistItemProps> = React.memo(
  ({item, isCompleted, color, onToggle, theme}) => {
    const textSecondary = getThemeColor(theme, 'text', 'secondary');
    const textPrimary = getThemeColor(theme, 'text', 'primary');
    const fieldColor = getThemeColor(theme, 'background', 'surface');

    // Animated styles for smooth transitions
    const containerStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: withTiming(
          isCompleted ? withAlpha(color, 0.15) : withAlpha(fieldColor, 0.05),
          {duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1)},
        ),
        borderColor: withTiming(
          isCompleted ? withAlpha(color, 0.3) : 'transparent',
          {duration: 300},
        ),
      };
    });

    const checkStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: withTiming(isCompleted ? 1.1 : 1, {
              duration: 300,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
          },
        ],
        color: withTiming(isCompleted ? color : textSecondary, {duration: 300}),
      };
    });

    const textStyle = useAnimatedStyle(() => {
      return {
        color: withTiming(isCompleted ? textPrimary : textSecondary, {
          duration: 300,
        }),
        textDecorationLine: isCompleted ? 'line-through' : 'none',
        opacity: withTiming(isCompleted ? 0.9 : 1, {duration: 300}),
      };
    });

    return (
      <AnimatedTouchableX
        flexDirection="row"
        alignItems="center"
        paddingVertical={styleUtils.spacing.sm}
        paddingHorizontal={styleUtils.spacing.sm}
        marginBottom={styleUtils.spacing.xs}
        borderRadius={styleUtils.borderRadius.md}
        borderWidth={1}
        onPress={() => onToggle(item.id)}
        style={containerStyle}>
        <Animated.View style={checkStyle}>
          <CheckCircle2
            size={20}
            strokeWidth={1.5}
            fill={isCompleted ? color : 'transparent'}
          />
        </Animated.View>
        <Animated.Text
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            {
              fontSize: 14,
              marginLeft: styleUtils.spacing.sm,
              fontFamily: 'Gilroy-Regular',
              flexShrink: 1,
              lineHeight: 20,
            },
            textStyle,
          ]}>
          {item.text}
        </Animated.Text>
      </AnimatedTouchableX>
    );
  },
);

export default HabitChecklistItem;
