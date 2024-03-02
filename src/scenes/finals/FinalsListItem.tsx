import React from 'react';
import { TouchableOpacity, Alert, View, Text, StyleSheet } from 'react-native';
import { Final, FinalStatus } from '../../models';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { lightModeColors } from '../../styles/colorPalette';


interface FinalsListItemProps {
  final: Final;
  subjectId: number;
}

const FinalsListItem: React.FC<FinalsListItemProps> = ({ final, subjectId }) => {
  const navigation = useNavigation();

  const onPressItem = () => {
    const currentStatus = final.currentStatus();
    if (currentStatus === FinalStatus.Draft || currentStatus === FinalStatus.Rejected) {
      return;
    }
    if (currentStatus === FinalStatus.Future) {
      console.log('Final status: Future');
      Alert.alert('Bajá esa ansiedad, todavía falta.');
    } else if (currentStatus === FinalStatus.Closed) {
      console.log('Final status: Closed', final);
      navigation.navigate('FinalExamSubmissions', {
        final: final.toObject(),
        editable: false,
      });
    } else if (currentStatus === FinalStatus.Grading) {
      console.log('Final status: Grading');
      const finalToBeSent = final.toObject();
      console.log("Final to be sent", finalToBeSent);

      navigation.navigate('FinalExamSubmissions', {
        final: finalToBeSent,
      });
    } else {
      navigation.navigate('FinalExamQR', {
        final: final.toObject(),
      });
    }
  };

  const getStatusText = () => {
    console.log("Final status: ", final.currentStatus());
    
    switch (final.currentStatus()) {
      case FinalStatus.Future:
        return 'Pronto';
      case FinalStatus.SoonToStart:
      case FinalStatus.Open:
        return 'Ver QR';
      case FinalStatus.Grading:
        return 'Poner notas';
      case FinalStatus.Closed:
        return final.act != null ? `Acta cerrada (#${final.act})` : 'Acta cerrada';
      case FinalStatus.Draft:
        return 'Esperando aprobación';
      case FinalStatus.Rejected:
        return 'Rechazado';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity onPress={onPressItem}>
      <View style={styles.view}>
        <Text style={styles.date}>
          {moment(final.date).format('dddd Do MMMM, YYYY')}
        </Text>
        <Text style={styles.hour}>{moment(final.date).format('HH:mm')}</Text>
        <Text style={styles.status}>{getStatusText()}</Text>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  view: {
    backgroundColor: lightModeColors.institutional,
    borderRadius: 10,
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 15,
  },
  date: {
    fontSize: 25,
    color: 'white',
  },
  hour: {
    fontSize: 20,
    paddingVertical: 5,
    color: 'white',
  },
  status: {
    fontSize: 13,
    color: 'white',
  },
});

export default FinalsListItem;