import React from 'react';
import AuthenticatedComponent from '../authenticatedComponent';
import {View, Text, Alert} from 'react-native';
import {DateTimePicker, RoundedButton, Loading} from '../../components';
import {getStyleSheet as style} from '../../styles';
import {finalRepository} from '../../repositories';
import {FinalStatus, Final, Subject} from '../../models';
import moment from 'moment';

export default class FinalDateTimePicker extends AuthenticatedComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      creating: false,
    };
  }

  getSubject() {
    if (this.subject) {
      return this.subject;
    }
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.subject
    ) {
      this.subject = Subject.fromObject(this.props.route.params.subject);
    } else {
      this.subject = this.props.subject;
    }
    return this.subject;
  }

  render() {
    const {navigation} = this.props;
    const {date, creating} = this.state;
    return (
      <View style={style().containerView}>
        <DateTimePicker
          mode="datetime"
          minimumDate={new Date()}
          onDateChosen={date => {
            this.setState({date});
          }}
          onCancelled={() => {
            navigation.pop();
          }}
        />
        <Text style={style().text}>
          {date !== null ? moment(date).format('dddd Do MMMM, YYYY HH:mm') : ''}
        </Text>
        <RoundedButton
          text="Crear final"
          style={style().button}
          enabled={date !== null && !creating}
          onPress={() => {
            this.setState({creating: true});
            this.request(() => finalRepository.create(this.getSubject(), date))
              .then(() => {
                this.setState({creating: false});
                navigation.pop();
              })
              .catch(error => {
                this.setState({creating: false});
                Alert.alert(
                  'Te fallamos',
                  'No pudimos crear este final. ' +
                    'Volvé a intentar en unos minutos.',
                );
              });
          }}
        />
        {creating && <Loading />}
      </View>
    );
  }
}
