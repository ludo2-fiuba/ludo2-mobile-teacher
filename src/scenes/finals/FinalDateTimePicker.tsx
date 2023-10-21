import React, { useState } from 'react';
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Loading, RoundedButton } from '../../components';
import { Subject } from '../../models';
import { finalRepository } from '../../repositories';
import { getStyleSheet as style } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/es'
moment.locale('es');

interface FinalDateTimePickerProps {
  subject?: Subject;
}


const FinalDateTimePicker: React.FC<FinalDateTimePickerProps> = ({ subject: propSubject }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [creating, setCreating] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const getSubject = () => {
    if (propSubject) {
      return propSubject;
    }

    if (
      route.params &&
      (route.params as any).subject
    ) {
      return Subject.fromObject((route.params as any).subject);
    }

    return null;
  };

  const onDateChange = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const newDate = date ? new Date(date) : new Date();
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      newDate.setHours(19)
      newDate.setMinutes(0)
      newDate.setSeconds(0)

      setDate(newDate);
    }
  };

  const onTimeChange = (event: any, selectedDate: any) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedDate) {
      const newDate = date ? new Date(date) : new Date();
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <View style={style().containerView}>
      <View style={style().dateButtonInputs}>
        <Text style={{ ...style().text, color: 'black', }}>
          Seleccionar Fecha
        </Text>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          onChange={onDateChange}
        />
      )}
      <TouchableOpacity
        style={{
          height: 40,
          margin: 0,
          borderWidth: 1,
          padding: 10,
        }}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {date ? moment(date).format('dddd D MMMM YYYY'): ''}
        </Text>
      </TouchableOpacity>

      <View style={{ ...style().dateButtonInputs, marginTop: 40 }}>
        <Text style={{ ...style().text }}>
          Seleccionar Horario
        </Text>
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="time"
          onChange={onTimeChange}
        />
      )}

      <TouchableOpacity
        style={{
          height: 40,
          margin: 0,
          borderWidth: 1,
          padding: 10,
        }}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>
          {date?.toTimeString().slice(0, 5)}
        </Text>
      </TouchableOpacity>

      <RoundedButton
        text="Crear final"
        style={style().button}
        enabled={date !== null && !creating}
        onPress={() => {
          if (date) {
            setCreating(true);
            finalRepository.create(getSubject(), date)
              .then(() => {
                setCreating(false);
                navigation.goBack();
              })
              .catch(error => {
                setCreating(false);
                Alert.alert(
                  'Te fallamos',
                  'No pudimos crear este final. ' +
                  'Volvé a intentar en unos minutos.',
                );
              });
          } else {
            throw ('Date is null')
          }
        }}
      />
      {creating && <Loading />}
    </View>
  );
};

export default FinalDateTimePicker;