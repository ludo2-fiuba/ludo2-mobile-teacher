import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { evaluationCard as style } from '../../styles';
import { Evaluation } from '../../models/Evaluation';
import moment from 'moment';


function getDateStringFormat(date: Date) {
  return moment(date).format(
    'DD/MM/YYYY HH:mm',
  )
} 

interface Props {
  evaluation: Evaluation;
}

const EvaluationsListElement = ({ evaluation }: Props) => {
  return (
    <View style={style().view}>
      <Text style={style().evaluationName}>
        {evaluation.evaluationName} (id: {evaluation.id})
      </Text>
      <Text style={style().startDate}>
        Fecha de inicio: { evaluation && evaluation.startDate ? getDateStringFormat(evaluation.startDate) : "no disponible"}
      </Text>
      <Text style={style().endDate}>
        Fecha de entrega: { evaluation && evaluation.endDate ? getDateStringFormat(evaluation.endDate) : "no disponible"}
      </Text>
      
    </View>
  )
}

export default EvaluationsListElement

const styles = StyleSheet.create({})