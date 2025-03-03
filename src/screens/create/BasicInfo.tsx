/* eslint-disable react-native/no-inline-styles */
import {Check} from 'lucide-react-native';
import React from 'react';
import {TextInput} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import SquircleViewContainer from '~/containers/SquircleViewContainer';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils} from '~/styles/theme';

const COLOR_PALETTE = [
  '#3A5BA0', // Muted Royal Blue (Productivity) - Professional but calming
  '#4C9A68', // Soft Jade Green (Health) - Fresh but not overpowering
  '#A67DB8', // Heather Purple (Mindfulness) - Gentle and soothing
  '#D2A24C', // Warm Gold (Fitness) - Motivating but natural
  '#E08F8F', // Blush Rose (Self-care) - Warm and inviting
  '#E9B44C', // Honey Mustard (Morning) - Energetic yet soft
  '#787B7D', // Stone Gray (Neutral) - Perfectly balanced
  '#BB4D6A', // Deep Rosewood (Urgent tasks) - Attention-grabbing but not harsh
  '#50A5B1', // Muted Aqua (Hydration) - Cool and fresh
  '#C5A880', // Sandstone Beige (Routines) - Earthy and subtle
  '#8473B4', // Soft Amethyst (Learning) - Inspiring but not overwhelming
  '#5E8B64', // Moss Green (Nature) - Deep and grounding
  '#DC7F5A', // Warm Clay (Nutrition) - Earthy and pleasant
  '#715D91', // Dusty Plum (Evening) - Cozy and moody
  '#C56C6A', // Muted Coral (Social) - Friendly but refined
  '#486D55', // Dark Sage (Long-term goals) - Stable and long-lasting
];

interface BasicInfoSectionProps {
  title: string;
  color: string;
  description: string;
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
  onUpdate,
}) => {
  const {theme} = useTheme();
  const inputBg = getThemeColor(theme, 'background', 'field');
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const textPlaceholder = getThemeColor(theme, 'text', 'tertiary');
  const borderColor = getThemeColor(theme, 'border', 'subtle');

  const handleTitleChange = (text: string) => {
    onUpdate({title: text});
  };

  const handleDescriptionChange = (text: string) => {
    onUpdate({description: text});
  };

  const handleColorSelect = (selectedColor: string) => {
    onUpdate({color: selectedColor});
  };

  // Shared input styles
  const inputStyle = {
    color: textPrimary,
    fontSize: 15,
    fontFamily: theme === 'dark' ? 'Gilroy-Medium' : 'Gilroy-Regular',
    paddingHorizontal: styleUtils.spacing.sm,
  };

  return (
    <ViewX marginBottom={styleUtils.spacing.xl}>
      <SectionLabel title="Name" />

      <SquircleViewContainer
        borderRadius="sm"
        backgroundColor={inputBg}
        borderColor={borderColor}
        borderWidth={1}
        height={44}>
        <TextInput
          style={inputStyle}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="What habit do you want to build?"
          placeholderTextColor={textPlaceholder}
          accessibilityLabel="Habit name"
          accessibilityHint="Enter a name for your habit"
        />
      </SquircleViewContainer>

      <SectionLabel title="Description" marginTop={styleUtils.spacing.md} />

      <SquircleViewContainer
        borderRadius="sm"
        backgroundColor={inputBg}
        borderColor={borderColor}
        borderWidth={1}
        height={100}>
        <TextInput
          style={{
            ...inputStyle,
            height: 100,
            paddingTop: styleUtils.spacing.sm,
            paddingBottom: styleUtils.spacing.sm,
            textAlignVertical: 'top',
          }}
          value={description}
          onChangeText={handleDescriptionChange}
          placeholder="Describe your habit (optional)"
          placeholderTextColor={textPlaceholder}
          multiline
          numberOfLines={4}
          accessibilityLabel="Habit description"
          accessibilityHint="Enter an optional description for your habit"
        />
      </SquircleViewContainer>

      <SectionLabel title="Color" marginTop={styleUtils.spacing.md} />

      <ViewX
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
        marginTop={styleUtils.spacing.xs}
        columnGap={12}
        paddingHorizontal={styleUtils.spacing['2xs']}>
        {COLOR_PALETTE.map(paletteColor => {
          const isSelected = paletteColor === color;
          return (
            <TouchableX
              key={paletteColor}
              onPress={() => handleColorSelect(paletteColor)}
              width={32}
              height={32}
              borderRadius={16}
              marginBottom={styleUtils.spacing.sm}
              backgroundColor={paletteColor}
              borderWidth={isSelected ? 2 : 0}
              borderColor={isSelected ? 'white' : 'transparent'}
              justifyContent="center"
              alignItems="center"
              accessibilityLabel={`Select ${paletteColor} color`}
              accessibilityRole="radio"
              accessibilityState={{checked: isSelected}}>
              {isSelected && (
                <ViewX
                  width={20}
                  height={20}
                  borderRadius={10}
                  borderWidth={2}
                  borderColor="white"
                  backgroundColor="transparent"
                  opacity={0.9}
                  justifyContent="center"
                  alignItems="center">
                  <Check size={12} color="white" />
                </ViewX>
              )}
            </TouchableX>
          );
        })}
      </ViewX>
    </ViewX>
  );
};

// Helper component for section labels
interface SectionLabelProps {
  title: string;
  marginTop?: number;
}

const SectionLabel: React.FC<SectionLabelProps> = ({title, marginTop = 0}) => (
  <TextX
    fontSize="sm"
    fontWeight="medium"
    color="secondary"
    marginBottom={styleUtils.spacing.xs}
    marginTop={marginTop}
    accessibilityRole="header">
    {title}
  </TextX>
);

export default BasicInfoSection;
