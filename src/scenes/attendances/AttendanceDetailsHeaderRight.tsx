import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from '../../components/MaterialIcon';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectSemesterData } from '../../features/semesterSlice';
import { Semester } from '../../models/Semester';


export function AttendanceDetailsHeaderRight() {
	const navigation = useNavigation()
  const dispatch = useAppDispatch();
  const semesterData = useAppSelector(selectSemesterData) as Semester
  	
	const navigateToQrScreen = () => {
		navigation.navigate('SemesterAttendanceQR', {});
	}

  return (
    <View style={styles.navButtonsContainer}>
      <TouchableOpacity style={styles.navButton} onPress={navigateToQrScreen}>
        <MaterialIcon name="qrcode" fontSize={24} color='gray' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navButtonsContainer: {
    flexDirection: 'row',
    marginRight: 15,
  },
  navButton: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
