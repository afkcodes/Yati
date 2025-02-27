//@ts-nocheck
import {forwardRef, useState} from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {TextX, ViewX} from '~components/common';
import {useTheme} from '~hooks/ThemeContext';
import {styleUtils} from '~styles/theme';
import type {FontSize, FontWeight} from '~types/common.types';
import {getThemeColor} from '~utils/themeUtils';
import SquircleViewContainer from '../../containers/SquircleViewContainer';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  bgColor?: string;
  cornerRadius?: number;
  // Validation props
  validate?: (text: string) => string | null;
  onChangeWithError?: (text: string, error: string | null) => void;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error: externalError,
      fontSize = 'md',
      fontWeight = 'regular',
      containerStyle,
      inputStyle,
      validate,
      onChangeWithError,
      onChangeText,
      bgColor,
      ...restProps
    },
    ref,
  ) => {
    const {theme} = useTheme();
    const [internalError, setInternalError] = useState<string | null>(null);

    // Display external error if provided, otherwise show internal validation error
    const error = externalError || internalError;

    // Get theme colors
    const inputBgColor = bgColor || getThemeColor(theme, 'background', 'input');
    const placeholderColor = getThemeColor(theme, 'text', 'tertiary');
    const textColor = getThemeColor(theme, 'text', 'primary');
    const errorColor = getThemeColor(theme, 'text', 'error');

    // Get cursor/selection color based on validation state
    const caretColor = error
      ? errorColor
      : getThemeColor(theme, 'text', 'accent');

    const handleChangeText = (text: string) => {
      // Call the original onChangeText if provided
      onChangeText?.(text);

      if (validate) {
        // Run validation
        const validationError = validate(text);
        setInternalError(validationError);

        // Call onChangeWithError if provided
        onChangeWithError?.(text, validationError);
      }
    };

    return (
      <ViewX style={[styles.container, containerStyle]}>
        {label && (
          <TextX
            fontSize={fontSize}
            fontWeight={fontWeight}
            style={styles.label}
            color={error ? 'error' : 'primary'}>
            {label}
          </TextX>
        )}

        <SquircleViewContainer
          padding="2xs"
          borderRadius="xs"
          backgroundColor={inputBgColor}
          variant="input">
          <TextInput
            ref={ref}
            placeholderTextColor={placeholderColor}
            selectionColor={caretColor}
            cursorColor={caretColor}
            style={[
              styles.input,
              {
                color: textColor,
              },
              inputStyle,
            ]}
            onChangeText={handleChangeText}
            {...restProps}
          />
        </SquircleViewContainer>

        {error && (
          <TextX fontSize="xs" color="error" style={styles.error}>
            {error}
          </TextX>
        )}
      </ViewX>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: styleUtils.spacing.md,
  },
  label: {
    marginBottom: styleUtils.spacing.xs,
  },
  squircleContainer: {
    width: '100%',
    height: 150,
  },
  input: {
    flex: 1,
    paddingHorizontal: styleUtils.spacing.sm,
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  error: {
    marginTop: styleUtils.spacing.xs,
  },
});

export default Input;
