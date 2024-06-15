import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import { useNavigation } from '@react-navigation/native';

interface Props {}

export function SemesterHeaderRight({ }: Props) {
  const navigation = useNavigation();

	const redirectToSemesterEditScreen = () => {
		navigation.navigate('SemesterEditScreen')
	}

  return (
    <View style={styles.navButtonsContainer}>
      <TouchableOpacity style={styles.navButton} onPress={redirectToSemesterEditScreen}>
        <Icon name="edit" style={styles.navButtonIcon} />
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
  }
});
