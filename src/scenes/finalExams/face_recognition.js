import {Alert} from 'react-native';
import TakePictureStepConfiguration from '../image_recognition/takePictureStepConfiguration';
import Type from '../image_recognition/takePictureStepConfigurationType';
import {finalRepository} from '../../repositories';

export default class FacePictureConfiguration extends TakePictureStepConfiguration {
  constructor(finalId) {
    super('Verifiquemos tu identidad para poder cerrar el acta.');
    this.finalId = finalId;
  }

  async onDataObtained(image, navigation, disableLoading) {
    makeRequest(() => finalRepository.sendAct(this.finalId, image))
      .then(() => {
        navigation.pop(2);
      })
      .catch(error => {
        if (error instanceof finalRepository.IdentityFail) {
          Alert.alert(
            '¡No sos quien decís ser!',
            'O no hemos podido reconocerte. Intentá de nuevo.',
          );
        } else {
          Alert.alert(
            'Error',
            'Hubo un error inesperado. Intenta nuevamente en unos minutos.',
          );
          navigation.pop();
        }
        disableLoading();
      });
  }

  toObject() {
    return TakePictureStepConfiguration.toObject(this, Type.ActClosing, {
      finalId: this.finalId,
    });
  }

  static fromObject(object) {
    return new FacePictureConfiguration(object.finalId);
  }
}
