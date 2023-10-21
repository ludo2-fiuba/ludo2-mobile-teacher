import React, {Component} from 'react';
import {View, Text} from 'react-native';
import moment from 'moment';
import {Commission, Subject} from '../models';
import {commissionCard as style} from '../styles';

export interface CommissionCardProps {
  commission: Commission;
}

export default class CommissionCard extends Component<CommissionCardProps> {
  public static defaultProps = {
    commission: new Commission(
      0,
      'commission',
      new Subject('00.00', 'Materia', 'Profesor'),
      new Date(),
    ),
  };

  render() {
    const {commission} = this.props;
    return (
      <View style={style().view}>
        <Text style={style().name}>{commission.subject.name}</Text>
        <Text style={style().status}>
          {commission.isOpen() ? 'Active' : 'Closed'}
        </Text>
        <Text style={style().date}>
          {moment(commission.term).format('MMMM, YYYY')}
        </Text>
      </View>
    );
  }
}
