import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RoundedButton } from '../../components'
import { finalExamSubmissions as style } from '../../styles';
import { Final, Student } from '../../models';
import { finalRepository } from '../../repositories';
import { useNavigation } from '@react-navigation/native';
import FacePictureConfiguration from './face_recognition';

interface Props {
  final: Final
}

const FinalExamSubmissionsListFooter = ({ final }: Props) => {
  const navigation = useNavigation()

  const closeAct = async () => {
    const configuration = new FacePictureConfiguration(final.id);

    navigation.navigate('TakePicture', {
      configuration: configuration.toObject(),
    });

  }

  return (
    <View style={style().listHeaderFooter}>

      <View style={{ marginTop: 10 }}>
        <RoundedButton 
          onPress={closeAct}
          text="Cerrar el Acta"
          style={style().button}
        />
      </View>
    </View>
  )
}

export default FinalExamSubmissionsListFooter


const styles = StyleSheet.create({});
