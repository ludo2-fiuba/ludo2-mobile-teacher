import React, {Component} from 'react';
import {Platform, Alert, SafeAreaView} from 'react-native';
import NativeDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {getStyleSheet as style} from '../styles';

export interface DateTimePickerProps {
  date: Date;
  minimumDate: Date;
  mode: string;
  onDateChosen: (Date) => Promise<void>;
  onCancelled: () => Promise<void>;
}

/// Doesn't support countdown
export default class DateTimePicker extends Component<DateTimePickerProps> {
  constructor(props) {
    super(props);
    var mode = props.mode;
    if (Platform.OS == 'android' && mode == 'datetime') {
      mode = 'date';
    }
    this.state = {
      date: props.date,
      time: props.date,
      mode: mode,
      show: true,
    };
  }

  public static defaultProps = {
    date: new Date(),
    minimumDate: new Date(),
    mode: 'date',
    onDateChosen: date => {
      Alert.alert('Date chosen', `${date}`);
    },
    onCancelled: () => {},
  };

  isTwoSteps() {
    const {mode} = this.props;
    return Platform.OS == 'android' && mode == 'datetime';
  }

  getPickerDate() {
    const {mode, date, time} = this.state;
    if (mode == 'time') {
      return time;
    }
    return date;
  }

  getResultDate() {
    const {date, time} = this.state;

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    );
  }

  async onChange(event, date) {
    const {onDateChosen, onCancelled} = this.props;
    if (event.type == 'dismiss' || date === undefined) {
      await onCancelled();
      return;
    } else if (event.type == 'set') {
      this.changeDate(date, async shouldEnd => {
        if (shouldEnd) {
          await onDateChosen(this.getResultDate());
        }
      });
      return;
    }
    this.changeDate(date, async shouldEnd => {
      if (shouldEnd) {
        await onDateChosen(this.getResultDate());
      }
    });
  }

  changeDate(selectedDate, onChanged) {
    const {mode, date, time} = this.state;
    var currentDate = date;
    var currentTime = time;
    var currentMode = mode;
    var shouldEnd = true;
    var shouldShow = true;
    if (this.isTwoSteps()) {
      if (mode == 'date') {
        currentDate = selectedDate || date;
        currentTime = time;
        currentMode = 'time';
        shouldEnd = false;
      } else if (mode == 'time') {
        currentDate = date;
        currentTime = selectedDate || time;
        shouldShow = false;
      }
    } else {
      currentDate = selectedDate || date;
      currentTime = selectedDate || time;
    }

    this.setState(
      {
        date: currentDate,
        time: currentTime,
        mode: currentMode,
        show: shouldShow,
      },
      () => onChanged(shouldEnd),
    );
  }

  render() {
    const {mode, show} = this.state;
    const {minimumDate} = this.props;

    return (
      <SafeAreaView>
        {show && (
          <NativeDateTimePicker
            value={this.getPickerDate()}
            minimumDate={minimumDate}
            mode={mode}
            onChange={async (event, selectedDate) =>
              await this.onChange(event, selectedDate)
            }
          />
        )}
      </SafeAreaView>
    );
  }
}
