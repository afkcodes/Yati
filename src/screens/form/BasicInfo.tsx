// screens/form/BasicInfo.tsx
import {Check} from 'lucide-react-native';
import React, {useState} from 'react';
import {Animated, Easing, StyleSheet, TextInput} from 'react-native';
import {TextX, TouchableX, ViewX} from '~components/common';
import SquircleViewContainer from '~containers/SquircleViewContainer';
import {useTheme} from '~hooks/ThemeContext';
import {getThemeColor} from '~styles/theme';
import {COLOR_PALETTE} from '~utils/constants/habitConstants';
import {s, vs} from '~utils/screenUtil';

interface BasicInfoSectionProps {
  title: string;
  color: string;
  description: string;
  error?: string;
  onUpdate: (data: {
    title?: string;
    color?: string;
    description?: string;
  }) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  color,
  description,
  error,
  onUpdate,
}) => {
  const {theme} = useTheme();
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [colorAnimation] = useState(new Animated.Value(1));

  // Theme colors
  const inputBg = getThemeColor(theme, 'background', 'field');
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const textPlaceholder = getThemeColor(theme, 'text', 'tertiary');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const accentColor = getThemeColor(theme, 'text', 'accent');
  const errorColor = getThemeColor(theme, 'text', 'error');

  const handleTitleChange = (text: string) => {
    onUpdate({title: text});
  };

  const handleDescriptionChange = (text: string) => {
    onUpdate({description: text});
  };

  const handleColorSelect = (selectedColor: string) => {
    // Animate color selection
    Animated.sequence([
      Animated.timing(colorAnimation, {
        toValue: 1.2,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(colorAnimation, {
        toValue: 1,
        duration: 150,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    onUpdate({color: selectedColor});
  };

  // Calculate derived styles
  const titleBorderColor = error
    ? errorColor
    : titleFocused
      ? accentColor
      : borderColor;

  const descBorderColor = descFocused ? accentColor : borderColor;

  return (
    <ViewX>
      {/* Title Input */}
      <SectionLabel title="Name" isRequired />

      <SquircleViewContainer
        borderRadius="md"
        backgroundColor={inputBg}
        borderColor={titleBorderColor}
        borderWidth={error || titleFocused ? 2 : 1}
        height={vs(56)}>
        <TextInput
          style={[styles.input, {color: textPrimary}, styles.titleInput]}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="What habit do you want to build?"
          placeholderTextColor={textPlaceholder}
          onFocus={() => setTitleFocused(true)}
          onBlur={() => setTitleFocused(false)}
          accessibilityLabel="Habit name"
          accessibilityHint="Enter a name for your habit"
          maxLength={50}
          selectionColor={accentColor}
        />
      </SquircleViewContainer>

      {error && (
        <TextX
          fontSize="xs"
          color="error"
          marginTop={vs(6)}
          marginBottom={vs(8)}
          marginLeft={s(4)}>
          {error}
        </TextX>
      )}

      {/* Additional spacing between title and description */}
      <ViewX height={vs(24)} />

      {/* Description Input */}
      <SectionLabel
        title="Description"
        caption="Help yourself remember why this habit matters to you"
      />

      <SquircleViewContainer
        borderRadius="md"
        backgroundColor={inputBg}
        borderColor={descBorderColor}
        borderWidth={descFocused ? 2 : 1}
        height={vs(120)}>
        <TextInput
          style={[styles.input, {color: textPrimary}, styles.descriptionInput]}
          value={description}
          onChangeText={handleDescriptionChange}
          placeholder="Describe your habit (optional)"
          placeholderTextColor={textPlaceholder}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          onFocus={() => setDescFocused(true)}
          onBlur={() => setDescFocused(false)}
          accessibilityLabel="Habit description"
          accessibilityHint="Enter an optional description for your habit"
          maxLength={200}
          selectionColor={accentColor}
        />
      </SquircleViewContainer>

      {/* Additional spacing between description and color */}
      <ViewX height={vs(28)} />

      {/* Color Selection */}
      <SectionLabel
        title="Color"
        caption="Give your habit a distinct identity"
      />

      <ViewX style={styles.colorGridContainer}>
        <ViewX style={styles.colorGrid}>
          {COLOR_PALETTE.map(paletteColor => {
            const isSelected = paletteColor === color;

            // Animated style for selected color
            const animatedStyle = isSelected
              ? {
                  transform: [{scale: colorAnimation}],
                }
              : undefined;

            return (
              <TouchableX
                key={paletteColor}
                onPress={() => handleColorSelect(paletteColor)}
                width={s(32)}
                height={s(32)}
                borderRadius={s(24)}
                marginRight={s(12)}
                marginBottom={vs(12)}
                backgroundColor={paletteColor}
                borderWidth={isSelected ? 2 : 0}
                borderColor={isSelected ? 'white' : 'transparent'}
                justifyContent="center"
                alignItems="center"
                accessibilityLabel={`Select ${paletteColor} color`}
                accessibilityRole="radio"
                accessibilityState={{checked: isSelected}}>
                {isSelected && (
                  <Animated.View style={[styles.checkCircle, animatedStyle]}>
                    <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </Animated.View>
                )}
              </TouchableX>
            );
          })}
        </ViewX>
      </ViewX>

      {/* Bottom padding for section */}
      <ViewX height={vs(12)} />
    </ViewX>
  );
};

// Enhanced section label component
export const SectionLabel: React.FC<{
  title: string;
  isRequired?: boolean;
  caption?: string;
}> = ({title, isRequired, caption}) => {
  return (
    <ViewX
      marginBottom={vs(12)}
      accessibilityLabel={`${title}${isRequired ? ' (required)' : ''}`}>
      <ViewX flexDirection="row" alignItems="center">
        <TextX fontSize="sm" fontWeight="semibold" color="secondary">
          {title}
        </TextX>
        {isRequired && (
          <TextX
            fontSize="md"
            fontWeight="bold"
            color="accent"
            marginLeft={s(4)}>
            *
          </TextX>
        )}
      </ViewX>

      {caption && (
        <TextX fontSize="xs" color="tertiary" marginTop={vs(4)}>
          {caption}
        </TextX>
      )}
    </ViewX>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 0,
    paddingHorizontal: s(16),
    flex: 1,
  },
  titleInput: {
    fontSize: s(16),
    fontWeight: '500',
  },
  descriptionInput: {
    fontSize: s(15),
    paddingTop: vs(16),
    paddingBottom: vs(16),
    textAlignVertical: 'top',
  },
  colorGridContainer: {
    marginTop: vs(8),
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: vs(8),
    marginRight: -s(12), // Offset the marginRight on color items
  },
  checkCircle: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BasicInfoSection;
