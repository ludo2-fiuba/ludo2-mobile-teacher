import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {RoundedButton} from '../../components';
import {preregisterDone as style} from '../../styles';

export default class PreRegisterLastInstructions extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={style().view}>
        <SafeAreaView style={style().view}>
          <ScrollView vertical containerViewStyle={style().scrollView}>
            <Text style={style().text}>
              ¡Ya has quedado registrado en nuestro sistema!
            </Text>
            <Text style={style().text}>
              Al tener tu cuenta del SIU Guaraní con perfil de Docente activado,
              vas a poder loguearte en esta app con la misma contraseña que usás
              en ese sistema.
            </Text>
          </ScrollView>
          <RoundedButton
            text="Listo"
            style={style().button}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Landing'}],
              })
            }
          />
        </SafeAreaView>
      </View>
    );
  }
}
