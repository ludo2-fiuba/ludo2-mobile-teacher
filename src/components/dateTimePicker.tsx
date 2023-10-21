import React, { useState, useCallback } from 'react';
import { Platform, Alert, SafeAreaView } from 'react-native';
import NativeDateTimePicker from '@react-native-community/datetimepicker';
import { getStyleSheet as style } from '../styles';

export interface DateTimePickerProps {
  date?: Date;
  minimumDate: Date;
  mode: string;
  onDateChosen: (date: Date) => void;
  onCancelled: () => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date: propDate,
  minimumDate,
  mode: propMode,
  onDateChosen,
  onCancelled,
}) => {
  const changeInModeNeeded = Platform.OS === 'android' && propMode === 'datetime';
  const [date, setDate] = useState(propDate || new Date());
  const [time, setTime] = useState(propDate || new Date());
  const [mode, setMode] = useState(changeInModeNeeded ? 'date' : propMode);
  const [show, setShow] = useState(true);

  const isTwoSteps = useCallback(
    () => Platform.OS === 'android' && propMode === 'datetime',
    [propMode],
  );

  const getPickerDate = useCallback(
    () => (mode === 'time' ? time : date),
    [mode, time, date],
  );

  const getResultDate = useCallback(
    () => new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    ),
    [date, time],
  );

  const onChange = useCallback(
    async (event: any, selectedDate: Date) => {
      if (event.type === 'dismiss' || selectedDate === undefined) {
        await onCancelled();
        return;
      }
      changeDate(selectedDate, async (shouldEnd: boolean) => {
        if (shouldEnd) {
          await onDateChosen(getResultDate());
        }
      });
    },
    [onDateChosen, onCancelled, getResultDate],
  );

  const changeDate = useCallback(
    (selectedDate: Date, onChanged: any) => {
      let currentDate = date;
      let currentTime = time;
      let currentMode = mode;
      let shouldEnd = true;
      let shouldShow = true;

      if (isTwoSteps()) {
        if (mode === 'date') {
          currentDate = selectedDate || date;
          currentTime = time;
          currentMode = 'time';
          shouldEnd = false;
        } else if (mode === 'time') {
          currentDate = date;
          currentTime = selectedDate || time;
          shouldShow = false;
        }
      } else {
        currentDate = selectedDate || date;
        currentTime = selectedDate || time;
      }

      setDate(currentDate);
      setTime(currentTime);
      setMode(currentMode);
      setShow(shouldShow);
      onChanged(shouldEnd);
    },
    [date, time, mode, isTwoSteps],
  );

  return (
    <SafeAreaView>
      {show && (
        <NativeDateTimePicker
          value={getPickerDate()}
          minimumDate={minimumDate}
          mode={mode as any}
          onChange={onChange as any}
        />
      )}
    </SafeAreaView>
  );
};

DateTimePicker.defaultProps = {
  date: new Date(),
  minimumDate: new Date(),
  mode: 'date',
  onDateChosen: (date) => {
    Alert.alert('Date chosen', `${date}`);
    return Promise.resolve();
  },
  onCancelled: () => Promise.resolve(),
};

export default DateTimePicker;
