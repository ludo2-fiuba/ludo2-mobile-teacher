import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { RoundedButton } from '../../components';
import { preregisterDone as style } from '../../styles';
import MaterialIcon from '../../components/MaterialIcon';

interface PreRegisterLastInstructionsProps {
  navigation: any;
}

const PreRegisterLastInstructions: React.FC<PreRegisterLastInstructionsProps> = ({ navigation }) => {
  return (
    <View style={style().view}>
      <ScrollView contentContainerStyle={style().scrollView}>
        <MaterialIcon name='check-circle' fontSize={96} color='green' />
        <Text style={style().text}>
          ¡Ya has quedado registrado en nuestro sistema!
        </Text>
        <Text style={[style().text, { fontSize: 20 }]}>
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
            routes: [{ name: 'Landing' }],
          })
        }
      />
    </View>
  );
};

export default PreRegisterLastInstructions;
