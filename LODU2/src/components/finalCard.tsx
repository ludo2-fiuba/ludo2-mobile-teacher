import React, {Component} from 'react';
import {View, Text} from 'react-native';
import moment from 'moment';
import {Final, FinalStatus} from '../models';
import {finalCard as style} from '../styles';

export interface FinalCardProps {
  final: Final;
}

export default class FinalCard extends Component<FinalCardProps> {
  public static defaultProps = {
    final: new Final(0, 'materia', new Date(), null, null),
  };

  render() {
    const {final} = this.props;
    return (
      <View style={style().view}>
        <Text style={style().date}>
          {moment(final.date).format('dddd Do MMMM, YYYY')}
        </Text>
        <Text style={style().hour}>{moment(final.date).format('HH:mm')}</Text>
        <Text style={style().status}>
          {final.currentStatus() == FinalStatus.Future && 'Pronto'}
          {(final.currentStatus() == FinalStatus.SoonToStart ||
            final.currentStatus() == FinalStatus.Open) &&
            'Ver QR'}
          {final.currentStatus() == FinalStatus.Grading && 'Poner notas'}
          {final.currentStatus() == FinalStatus.Closed &&
            final.act != null &&
            `Acta cerrada (#${final.act})`}
          {final.currentStatus() == FinalStatus.Closed &&
            final.act == null &&
            'Acta cerrada)'}
          {final.currentStatus() == FinalStatus.Draft && 'Esperando aprobación'}
          {final.currentStatus() == FinalStatus.Rejected && 'Rechazado'}
        </Text>
      </View>
    );
  }
}
