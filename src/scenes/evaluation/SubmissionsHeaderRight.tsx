import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function SubmissionsHeaderRight() {
  const navigation = useNavigation()

  const saveChanges = () => {
    console.log('Saving changes');
  };

  const generateFinalExamQR = () => {
    console.log('Generating final exam QR');
    navigation.navigate('QRFinalExam', { final: { date: new Date() } });
  }

  return (
    <View style={styles.navButtonsContainer}>
      <TouchableOpacity style={styles.navButton} onPress={saveChanges}>
        <Icon name="qr-code" style={styles.navButtonIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={saveChanges}>
        <Icon name="save" style={styles.navButtonIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navButtonsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  navButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 5,
    opacity: 1,
    marginTop: 5,
  },
  navButtonIcon: {
    fontSize: 20,
  },
});
