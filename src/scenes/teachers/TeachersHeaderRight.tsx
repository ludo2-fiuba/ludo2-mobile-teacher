import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { TeacherTuple } from '../../models/Teachers';

interface Props {
  staffTeachers: TeacherTuple[];
  commissionId: number;
}

export default function TeachersHeaderRight({ staffTeachers, commissionId }: Props) {
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

  return (
    <View>
      <TouchableOpacity
          style={saveOpacityStyle}
          // disabled={!showSave}
          onPress={() => navigateToTeachersConfiguration()}>
          <Icon style={styles.navButtonIcon} name="settings" />
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
  }
})