import {LinearGradient} from 'expo-linear-gradient';
import {NavigationContext} from 'navigation-react';
import {useContext} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PressableX, TextX, TouchableX, ViewX} from '~components/common';
import MasonryGrid from '~components/common/MasonaryGrid';
import TestimonialCard from '~components/specific/onboarding/TestimonialCard';
import {testimonials} from '~data/testimonials';
import {styleUtils, themes} from '~styles/theme';
import {vs, w} from '~utils/screenUtil';

const {height} = Dimensions.get('window');

const WelcomeScreen = () => {
  const {stateNavigator} = useContext(NavigationContext);
  const renderTestimonial = (item: any) => (
    <TestimonialCard testimonial={item} />
  );

  return (
    <ViewX flex={1} variant="base">
      <MasonryGrid
        data={testimonials}
        renderItem={renderTestimonial}
        numColumns={2}
        scrollDuration={55000}
      />
      <LinearGradient
        colors={['transparent', 'rgba(20, 21, 23, 1)']}
        locations={[0, 0.5]}
        style={styles.overlay}>
        <ViewX
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginVertical={styleUtils.spacing.lg}>
          <TextX fontSize="5xl" fontWeight="title" letterSpacing={12}>
            YATI
          </TextX>
          <TextX
            textAlign="center"
            fontSize="lg"
            fontWeight="semibold"
            color="secondary">
            Strive, Track, Thrive – Your Journey to a Better You.
          </TextX>
        </ViewX>
        <ViewX gap={styleUtils.spacing.lg}>
          <PressableX
            onPress={() => {
              stateNavigator.navigate('tabs');
            }}
            justifyContent="center"
            alignItems="center"
            backgroundColor={themes.dark.background.accent}
            borderRadius={styleUtils.borderRadius.md}
            height={vs(60)}
            width={w(90)}>
            <TextX fontSize="xl" fontWeight="semibold">
              Start Your Journey
            </TextX>
          </PressableX>
          <TouchableX
            justifyContent="center"
            alignItems="center"
            activeOpacity={0.8}>
            <TextX
              fontSize="md"
              fontWeight="semibold"
              color="secondary"
              textDecorationLine="underline">
              Continue as Guest
            </TextX>
          </TouchableX>
        </ViewX>
      </LinearGradient>
    </ViewX>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: vs(60),
  },
});

export default WelcomeScreen;
