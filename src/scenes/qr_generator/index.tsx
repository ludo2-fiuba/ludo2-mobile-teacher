import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Platform,
  View,
  LayoutChangeEvent,
} from 'react-native';
import RNFS from 'react-native-fs';
// Check if CameraRoll is necessary and add it to the package.jsojn
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import { Loading, RoundedButton } from '../../components';
import { Final, FinalStatus } from '../../models';
import { finalRepository } from '../../repositories';
import { getStyleSheet as style } from '../../styles';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { StackActions } from '@react-navigation/native';

type QRGeneratorRouteProp = RouteProp<{ params: { final: Final } }, 'params'>;

// Aux function to format the filename
function addDateToSubjectName(dateParam: Date | string, originalFilename: string): string {
  // Parse the date
  const date = new Date(dateParam);
  
  // Format the date as "dd-mm-yy"
  const formattedDate = [
    ('0' + date.getUTCDate()).slice(-2),         // day
    ('0' + (date.getUTCMonth() + 1)).slice(-2),  // month
    date.getUTCFullYear().toString().slice(-2),  // year
  ].join('-');
  
  // Combine the formatted date and original filename
  return `${formattedDate}-${originalFilename}`;
}

function replaceTildes(str: string) : string {
  const accents: { [key: string]: string } = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
  };
  return str.replace(/[áéíóúÁÉÍÓÚ]/g, match => accents[match]);
}

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
    if (final) {
      fetchData();
    }
  }, [final]);

  useEffect(() => {
    if (route.params?.final) {
      const routerParams: any = route.params
      const final: Final = Final.fromObject(routerParams.final);
      setFinal(final);
    } else {
      setFinal(propFinal || null);
    }
  }, [route.params, propFinal]);

  const hasAndroidPermission = async () => {
    const permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await Permissions.check(permission);
    console.log("Has permission:", hasPermission);
    if (hasPermission) return true;
    
    console.log("Requesting permission");
    const status = await Permissions.request(permission);
    return status === 'granted';
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setQrSize(Math.min(width, height));
  };



  const [svgRef, setSvgRef] = useState(React.createRef());  // Assume the correct type for your SVG component

  return (
    <View style={style().view} onLayout={handleLayout}>
      {loading && <Loading />}
      {qrId && (
        <QRCode
          value={qrId}
          size={qrSize}
          getRef={(c) => (setSvgRef(c))}
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
              if (downloading) return;
              setDownloading(true);
              // Update the below code according to your project's structure and libraries
              await (svgRef as any).toDataURL(async (data: string) => {
                try {
                  const subjectName = replaceTildes(final!.subjectName.replaceAll(' ', '-').toLowerCase());
                  const subjectNameWithDate = addDateToSubjectName(final!.date, subjectName)
                  const path = (RNFS.CachesDirectoryPath + '/' + subjectNameWithDate + '.png')
                  
                  await RNFS.writeFile(
                    path,
                    data,
                    'base64'
                  );
                  
                  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
                    throw new MessageError('Necesitamos permisos para guardar el QR en tu teléfono');
                  }
                  
                  await CameraRoll.save(
                    path,
                    {type: 'photo', album: '/QrExams'}
                  );
              
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
                console.log("error", error);
                
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
