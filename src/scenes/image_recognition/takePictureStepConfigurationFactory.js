import RegisterFacePictureConfiguration from '../preregister/face_recognition';
import CloseActFacePictureConfiguration from '../finalExams/face_recognition';
import TakePictureStepConfiguration from './takePictureStepConfiguration';

import Type from './takePictureStepConfigurationType';

export default class TakePictureStepConfigurationFactory {
  static fromObject(object) {
    if (object.type === Type.RegisterFace) {
      return RegisterFacePictureConfiguration.fromObject(object);
    } else if (object.type === Type.ActClosing) {
      return CloseActFacePictureConfiguration.fromObject(object);
    }
    return TakePictureStepConfiguration.fromObject(object);
  }
}
