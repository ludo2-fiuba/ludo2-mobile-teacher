import React, { useState, useRef } from 'react';
import { View, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { preregister as style } from '../../styles';
import { RoundedButton, FormInput } from '../../components';
import FacePictureConfiguration from './face_recognition';

interface PreRegisterProps {
  navigation: any;
}

const PreRegister: React.FC<PreRegisterProps> = ({ navigation }) => {
  const [firstValid, setFirstValid] = useState(false);
  const [secondValid, setSecondValid] = useState(false);

  const firstTextInput = useRef<any>(null);
  const secondTextInput = useRef<any>(null);

  const shouldEnableSignUp = () => {
    return firstValid && secondValid;
  };

  return (
    <View style={style().view}>
      <SafeAreaView style={style().view}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          vertical
          contentContainerStyle={style().scrollView}
        >
          <View>
            <FormInput
              ref={firstTextInput}
              style={style().textInput}
              placeholderColor={style().textInputPlaceholder.color}
              errorStyle={style().errorInInput}
              keyboardType="numeric"
              returnKeyType="next"
              nextField={() => secondTextInput.current}
              placeholder="DNI"
              blurOnSubmit={false}
              onTextChanged={(text: string, isValid: boolean) => setFirstValid(isValid)}
              validation={{
                presence: {
                  allowEmpty: false,
                  message: 'DNI necesario.',
                },
                length: {
                  is: 8,
                  message: 'DNI inválido',
                },
              }}
            />
            <FormInput
              ref={secondTextInput}
              style={style().textInput}
              placeholderColor={style().textInputPlaceholder.color}
              errorStyle={style().errorInInput}
              keyboardType="email-address"
              placeholder="Email"
              onTextChanged={(text: string, isValid: boolean) => setSecondValid(isValid)}
              validation={{
                presence: {
                  allowEmpty: false,
                  message: 'Email necesario.',
                },
                email: {
                  message: 'Email inválido.',
                },
              }}
            />
          </View>
          <RoundedButton
            text="Siguiente"
            enabled={shouldEnableSignUp()}
            style={style().button}
            onPress={() => {
              const dni = firstTextInput.current.state.value;
              const email = secondTextInput.current.state.value;
              const configuration = new FacePictureConfiguration(
                ['Tomate una foto de frente'],
                dni,
                email,
              );

              console.log("Configuration pre-register");
              console.log(configuration);

              navigation.navigate('TakePicture', {
                configuration: configuration.toObject(),
                title: 'Pre-registro',
              });
            }}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PreRegister;
