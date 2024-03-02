import { View, Text } from 'react-native'
import React from 'react'
import { RoundedButton } from '../../components'
import {finalExamSubmissions as style} from '../../styles';


const FinalExamSubmissionsListFooter = () => {
  return (
    <View style={style().listHeaderFooter}>
      <RoundedButton
        text="Agregar alumno"
        style={style().button}
      />

      <View style={{ marginTop: 10 }}>
        <RoundedButton
          text="Cerrar el Acta"
          style={style().button}
        />
      </View>
    </View>
  )
}

export default FinalExamSubmissionsListFooter