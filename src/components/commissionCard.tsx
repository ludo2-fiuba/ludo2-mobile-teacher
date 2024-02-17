import React from 'react';
import { View, Text } from 'react-native';
import { Commission, Subject } from '../models';
import { commissionCard as style } from '../styles';

export interface CommissionCardProps {
  commission: Commission;
}

const CommissionCard: React.FC<CommissionCardProps> = ({ commission }) => {
  return (
    <View style={style().view}>
      <View>
        <Text style={style().subjectName}>{commission.subjectName.split('-')[0]}</Text>
      </View>
      <View style={{}}>
        <Text style={style().catedraName}>{commission.subjectName.split('-')[1].trim()}</Text>
      </View>
      <View style={{}}>
        <Text style={style().teacherName}>
          Profesor a cargo: {commission.chiefTeacher.firstName} {commission.chiefTeacher.lastName}
        </Text>
      </View>
    </View>
  );
};

export default CommissionCard;
