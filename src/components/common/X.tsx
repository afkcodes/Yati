import {Plus, X} from 'lucide-react-native'; // Assuming you're using lucide icons
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Expandable from './AnimatedContainer';

const App = () => {
  // Your trigger component
  const triggerButton = (
    <View style={styles.triggerButton}>
      <Plus size={24} color="#FFF" />
    </View>
  );

  // Your expanded content with close button
  const expandedContent = ({onClose}) => (
    <View style={styles.expandedContent}>
      {/* Header with close button */}
      <View style={styles.header}>
        <Text style={styles.title}>Create New</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#000" />
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text>Your content goes here</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Expandable trigger={triggerButton}>{expandedContent}</Expandable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  triggerButton: {
    width: 56,
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
});

export default App;
