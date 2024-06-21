import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RoundedButton } from '../../components'
import { finalExamSubmissions as style } from '../../styles';
import { Final, Student } from '../../models';
import { finalRepository } from '../../repositories';

interface Props {
  final: Final
}

const FinalExamSubmissionsListFooter = ({ final }: Props) => {

  const closeAct = () => {
    console.log("Closing act");
    return finalRepository.sendAct(final.id, 'image')
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
