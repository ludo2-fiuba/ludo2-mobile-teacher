import React from 'react';
import { Alert, PermissionsAndroid, Platform, View } from 'react-native';
import RNFS from 'react-native-fs';
import QRCode from 'react-native-qrcode-svg';
import { Loading, RoundedButton } from '../../components';
import { Final, FinalStatus } from '../../models';
import { finalRepository } from '../../repositories';
import { getStyleSheet as style } from '../../styles';
import AuthenticatedComponent from '../authenticatedComponent';

export default class QRGenerator extends AuthenticatedComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      closing: false,
      downloading: false,
      qrId: null,
      qrSize: 300,
    };
    this.final = null;
  }

  getFinal() {
    if (this.final) {
      return this.final;
    }
    if (
      this.props.route &&
      this.props.route.params &&
      this.props.route.params.final
    ) {
      this.final = Final.fromObject(this.props.route.params.final);
    } else {
      this.final = this.props.final;
    }
    return this.final;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    if (this.state.loading) {
      return;
    }
    this.setState({loading: true});
    this.request(() => finalRepository.getDetail(this.getFinal().id))
      .then(async final => {
        this.setState({loading: false, qrId: final.qrId});
      })
      .catch(error => {
        this.setState({loading: false});
        Alert.alert(
          '¿Qué pasó?',
          'No sabemos pero no pudimos obtener la información del final. ' +
            'Volvé a intentar en unos minutos.',
        );
        this.props.navigation.goBack();
      });
  }

  async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  render() {
    const {loading, closing, downloading, qrId, qrSize} = this.state;
    const {navigation} = this.props;
    return (
      <View
        style={style().view}
        onLayout={event => {
          const {width, height} = event.nativeEvent.layout;
          this.setState({qrSize: Math.min(width, height)});
        }}>
        {loading && <Loading />}
        {qrId && (
          <QRCode
            value={qrId}
            size={qrSize}
            getRef={c => (this.svg = c)}
            quietZone={20}
          />
        )}
        {!loading && (
          <View style={style().containerView}>
            <RoundedButton
              text="Descargar QR"
              style={style().button}
              enabled={!downloading}
              onPress={async () => {
                if (this.state.downloading) {
                  return;
                }
                this.setState({downloading: true});
                await this.svg.toDataURL(async data => {
                  await RNFS.writeFile(
                    RNFS.CachesDirectoryPath + '/some-name.png',
                    data,
                    'base64',
                  )
                    .then(async success => {
                      if (
                        Platform.OS === 'android' &&
                        !(await this.hasAndroidPermission())
                      ) {
                        return Promise.reject(
                          MeesageError(
                            'Necesitamos permisos para guardar el QR en tu teléfono',
                          ),
                        );
                      }
                      return CameraRoll.save(
                        RNFS.CachesDirectoryPath + '/some-name.png',
                        'photo',
                      );
                    })
                    .then(() => {
                      this.setState({downloading: false});
                      Alert.alert('QR guardado en la galería.');
                    })
                    .catch(error => {
                      this.setState({downloading: false});
                      Alert.alert(
                        'Te fallamos',
                        'No pudimos descargar el QR. ' +
                          'Usalo desde el teléfono o pedile al departamento que ' +
                          'te lo pase/imprima. Sino siempre podés volver a ' +
                          'intentar en unos minutos.',
                      );
                    });
                });
              }}
            />
            <RoundedButton
              text="Finalizar entrega"
              style={style().button}
              enabled={!closing}
              onPress={async () => {
                var final = this.getFinal();
                if (final.currentStatus() === FinalStatus.SoonToStart) {
                  Alert.alert('Bajá esa ansiedad. Todavía ni empezó el final');
                  return;
                }
                this.setState({closing: true});
                await this.request(() => finalRepository.close(final.id))
                  .then(async () => {
                    final.finalize();
                    await navigation.replace('FinalExamsList', {
                      final: final.toObject(),
                      editable: true,
                    });
                    this.setState({closing: false});
                  })
                  .catch(error => {
                    this.setState({closing: false});
                    Alert.alert(
                      '¿Qué pasó?',
                      'No sabemos pero no pudimos cerrar el examen. ' +
                        'Volvé a intentar en un minuto o sacale a los alumnos ' +
                        'el acceso al QR.',
                    );
                  });
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

export class MeesageError extends Error {
  constructor(message) {
    super(message);
  }
}
