import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  View,
  LayoutChangeEvent,
} from 'react-native';
import RNFS from 'react-native-fs';
// Check if CameraRoll is necessary and add it to the package.jsojn
// import CameraRoll from '@react-native-community/cameraroll';
import { Loading, RoundedButton } from '../../components';
import { Final, FinalStatus } from '../../models';
import { finalRepository } from '../../repositories';
import { getStyleSheet as style } from '../../styles';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// TODO: Check if this is necessary or use another library
// import QRCode from 'react-native-qrcode-svg';
import { StackActions } from '@react-navigation/native';

type QRGeneratorRouteProp = RouteProp<{ params: { final: Final } }, 'params'>;

interface QRGeneratorProps {
  final?: Final;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ final: propFinal }) => {
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrId, setQrId] = useState<string | null>(null);
  const [qrSize, setQrSize] = useState(300);
  const [final, setFinal] = useState<Final | null>(propFinal || null);

  const navigation = useNavigation();
  const route = useRoute<QRGeneratorRouteProp>();

  const fetchData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const fetchedFinal = await finalRepository.getDetail(final!.id);
      setQrId(fetchedFinal.qrId as string);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos obtener la información del final. ' +
        'Volvé a intentar en unos minutos.'
      );
      navigation.goBack();
    }
  }, [loading, final, navigation]);

  useEffect(() => {
    if (route.params?.final) {
      const routerParams: any = route.params
      const final: Final = Final.fromObject(routerParams.final);
      setFinal(final);
    } else {
      setFinal(propFinal || null);
    }
  }, [route.params, propFinal]);

  useEffect(() => {
    if (final) {
      fetchData();
    }
  }, [final, fetchData]);

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setQrSize(Math.min(width, height));
  };

  const svgRef = React.createRef();  // Assume the correct type for your SVG component

  return (
    <View style={style().view} onLayout={handleLayout}>
      {loading && <Loading />}
      {/* Assuming you have imported QRCode */}
      {/* {qrId && (
        <QRCode
          value={qrId}
          size={qrSize}
          getRef={svgRef}
          quietZone={20}
        />
      )} */}
      {!loading && (
        <View style={style().containerView}>
          <RoundedButton
            text="Descargar QR"
            style={style().button}
            enabled={!downloading}
            onPress={async () => {
              if (downloading) return;
              setDownloading(true);
              // Update the below code according to your project's structure and libraries
              await (svgRef.current as any).toDataURL(async (data: string) => {
                try {
                  await RNFS.writeFile(
                    RNFS.CachesDirectoryPath + '/some-name.png',
                    data,
                    'base64'
                  );
                  
                  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
                    throw new MessageError('Necesitamos permisos para guardar el QR en tu teléfono');
                  }
                  
                  // TODO: Fix camera roll error
                  // await CameraRoll.save(
                  //   RNFS.CachesDirectoryPath + '/some-name.png',
                  //   'photo'
                  // );
              
                  setDownloading(false);
                  Alert.alert('QR guardado en la galería.');
                } catch (error) {
                  setDownloading(false);
                  Alert.alert(
                    'Te fallamos',
                    'No pudimos descargar el QR. ' +
                    'Usalo desde el teléfono o pedile al departamento que ' +
                    'te lo pase/imprima. Sino siempre podés volver a ' +
                    'intentar en unos minutos.'
                  );
                }
              });
              
            }}
          />
          <RoundedButton
            text="Finalizar entrega"
            style={style().button}
            enabled={!closing}
            onPress={async () => {
              var finalInstance = final;
              if (finalInstance!.currentStatus() === FinalStatus.SoonToStart) {
                Alert.alert('Bajá esa ansiedad. Todavía ni empezó el final');
                return;
              }
              setClosing(true);
              try {
                await finalRepository.close(finalInstance!.id, '');
                finalInstance!.finalize();
                

                navigation.dispatch(
                  StackActions.replace('FinalExamsList', {
                    final: finalInstance!.toObject(),
                    editable: true,
                  })
                );
                setClosing(false);
              } catch (error) {
                setClosing(false);
                Alert.alert(
                  '¿Qué pasó?',
                  'No sabemos pero no pudimos cerrar el examen. ' +
                  'Volvé a intentar en un minuto o sacale a los alumnos ' +
                  'el acceso al QR.'
                );
              }
            }}
          />

        </View>
      )}
    </View>
  );
};

export default QRGenerator;

export class MessageError extends Error {
  constructor(message: string) {
    super(message);
  }
}
