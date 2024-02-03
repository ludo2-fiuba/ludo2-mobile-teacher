import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Teacher, TeacherTuple } from '../../models/Teachers';

interface Props {
  staffTeachers: TeacherTuple[];
  allTeachers: Teacher[];
  commissionId: number;
}

export default function TeachersHeaderRight({ staffTeachers, allTeachers, commissionId }: Props) {
  const navigation = useNavigation();

  const saveOpacityStyle = {
    ...styles.navButton,
    opacity: 1,
    // opacity: showSave ? 1 : 0.5,
  };

  const navigateToTeachersConfiguration = () => {
    navigation.navigate('TeachersConfiguration', {
      staffTeachers: staffTeachers,
      commissionId: commissionId,
    });
  }

  const addNewTeacherToCommission = () => {
    console.log("Add new teacher to commission");
    navigation.navigate('AddTeachersConfigurationList', {
      staffTeachers: staffTeachers,
      allTeachers: allTeachers,
      commissionId: commissionId,
    })
  }


  return (
    <View style={styles.iconsContainer}>
      <TouchableOpacity
        style={saveOpacityStyle}
        // disabled={!showSave}
        onPress={() => addNewTeacherToCommission()}>
        <Icon style={styles.navButtonIcon} name="add" />
      </TouchableOpacity>
      <TouchableOpacity
        style={saveOpacityStyle}
        // disabled={!showSave}
        onPress={() => navigateToTeachersConfiguration()}>
        <Icon style={styles.navButtonIcon} name="edit" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonIcon: {
    fontSize: 25,
    marginRight: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})