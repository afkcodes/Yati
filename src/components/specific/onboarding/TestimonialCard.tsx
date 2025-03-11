/* eslint-disable react-native/no-inline-styles */
import {LinearGradient} from 'expo-linear-gradient';
import {Quote} from 'lucide-react-native';
import {Image, StyleSheet} from 'react-native';
import {themes} from '~styles/theme';
import {s, vs} from '~utils/screenUtil';
import TextX from '../../common/TextX';
import ViewX from '../../common/ViewX';

interface UserHabit {
  id: string;
  name: string;
  streak: string;
  habit: string;
  quote: string;
  avatar: string;
}

const TestimonialCard = ({testimonial}: {testimonial: UserHabit}) => {
  return (
    <ViewX
      paddingHorizontal={s(8)}
      paddingVertical={vs(14)}
      margin={vs(4)}
      width="100%">
      <ViewX
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom={vs(10)}>
        <ViewX
          flexDirection="row"
          alignItems="center"
          flex={1}
          marginRight={s(8)}>
          <LinearGradient
            colors={['#a78bfa', '#8b5cf6']}
            style={styles.avatarContainer}>
            <Image
              source={{uri: testimonial.avatar}}
              style={{height: 40, width: 40, borderRadius: 1000}}
            />
          </LinearGradient>
          <ViewX marginLeft={s(12)} flex={1}>
            <TextX fontSize="xs">{testimonial.name}</TextX>
            <TextX color="accent" fontSize="xs" fontStyle="italic">
              {testimonial.streak} {testimonial.habit} streak
            </TextX>
          </ViewX>
        </ViewX>
        <Quote
          size={12}
          color={themes.dark.text.accent}
          style={{opacity: 0.9}}
          fill={themes.dark.text.accent}
        />
      </ViewX>

      <TextX fontSize="xs" lineHeight={vs(18)} marginBottom={vs(8)}>
        "{testimonial.quote}"
      </TextX>
    </ViewX>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});

export default TestimonialCard;
