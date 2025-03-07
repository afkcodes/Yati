/* eslint-disable react-native/no-inline-styles */
// components/habit/form/BasicInfoSection.tsx
import {Check} from 'lucide-react-native';
import React from 'react';
import {TextInput} from 'react-native';
import {TextX, TouchableX, ViewX} from '~/components/common';
import SquircleViewContainer from '~/containers/SquircleViewContainer';
import {useTheme} from '~/hooks/ThemeContext';
import {getThemeColor, styleUtils} from '~/styles/theme';
import {COLOR_PALETTE} from '~/utils/constants/habitConstants';

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
  const inputBg = getThemeColor(theme, 'background', 'field');
  const textPrimary = getThemeColor(theme, 'text', 'primary');
  const textPlaceholder = getThemeColor(theme, 'text', 'tertiary');
  const borderColor = getThemeColor(theme, 'border', 'subtle');
  const errorColor = getThemeColor(theme, 'text', 'error');

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
      <SectionLabel title="Name" isRequired />

      <SquircleViewContainer
        borderRadius="sm"
        backgroundColor={inputBg}
        borderColor={error ? errorColor : borderColor}
        borderWidth={error ? 2 : 1}
        height={44}>
        <TextInput
          style={inputStyle}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="What habit do you want to build?"
          placeholderTextColor={textPlaceholder}
          accessibilityLabel="Habit name"
          accessibilityHint="Enter a name for your habit"
          maxLength={50}
        />
      </SquircleViewContainer>

      {error && (
        <TextX fontSize="xs" color="error" marginTop={styleUtils.spacing.xs}>
          {error}
        </TextX>
      )}

      <SectionLabel title="Description" />

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
          maxLength={200}
        />
      </SquircleViewContainer>

      <SectionLabel title="Color" />

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

export const SectionLabel: React.FC<{
  title: string;
  isRequired?: boolean;
}> = ({title, isRequired}) => (
  <ViewX
    flexDirection="row"
    alignItems="center"
    accessibilityLabel={`${title}${isRequired ? ' (required)' : ''}`}>
    <TextX
      fontSize="sm"
      fontWeight="medium"
      color="secondary"
      marginVertical={styleUtils.spacing.sm}>
      {title}
    </TextX>
    {isRequired && (
      <ViewX
        flexDirection="row"
        alignItems="center"
        paddingHorizontal={styleUtils.spacing['2xs']}>
        <TextX fontSize="lg" fontWeight="semibold" color="error">
          *
        </TextX>
      </ViewX>
    )}
  </ViewX>
);

export default BasicInfoSection;
