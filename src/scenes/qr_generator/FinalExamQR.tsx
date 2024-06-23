import React, { useState } from 'react';
import {
  Alert,
  View,
  LayoutChangeEvent,
} from 'react-native';
import RNFS from 'react-native-fs';
// Check if CameraRoll is necessary and add it to the package.jsojn
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { RoundedButton } from '../../components';
import { Final } from '../../models';
import { finalRepository } from '../../repositories';
import { getStyleSheet as style } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { calculateFinalCurrentStatus } from '../../models/Final';
import { FinalStatus } from '../../models/FinalStatus';
import { getQrFinalExamStringFromQrId } from '../../utils/qrCodeStringFactory';

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

function replaceTildes(str: string): string {
  const accents: { [key: string]: string } = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
  };
  return str.replace(/[áéíóúÁÉÍÓÚ]/g, match => accents[match]);
}

interface FinalExamQRRouteProps {
  final: Final;
}

const FinalExamQR: React.FC = () => {
  const [closing, setClosing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [qrSize, setQrSize] = useState(300);

  const navigation = useNavigation();

  const route = useRoute();
  const final = (route.params as FinalExamQRRouteProps).final;
  const qrValue = getQrFinalExamStringFromQrId(final.qrid);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setQrSize(Math.min(width, height));
  };

  const downloadQR = async () => {
    if (downloading) return;
    setDownloading(true);
    // Update the below code according to your project's structure and libraries
    await (svgRef as any).toDataURL(async (data: string) => {
      try {
        const subjectName = replaceTildes(final!.subject.name.replaceAll(' ', '-').toLowerCase());
        const subjectNameWithDate = addDateToSubjectName(final!.date, subjectName)
        const path = (RNFS.CachesDirectoryPath + '/' + subjectNameWithDate + '.png')
        await RNFS.writeFile(path, data, 'base64');
        await CameraRoll.save(path, { type: 'photo', album: '/QrExams' });
        Alert.alert('Éxito', 'QR guardado en la galería.');
      } catch (error) {
        console.log("error", error);
        Alert.alert(
          'Te fallamos',
          'No pudimos descargar el QR. ' +
          'Usalo desde el teléfono o pedile al departamento que ' +
          'te lo pase/imprima. Sino siempre podés volver a ' +
          'intentar en unos minutos.'
        );
      } finally {
        setDownloading(false);
      }
    });
  }

  const [svgRef, setSvgRef] = useState(React.createRef());  // Assume the correct type for your SVG component

  return (
    <View style={style().view} onLayout={handleLayout}>
      <QRCode
        value={qrValue}
        size={qrSize}
        getRef={(c) => (setSvgRef(c))}
        quietZone={20}
      />
      <View style={style().containerView}>
        <RoundedButton
          text="Descargar QR"
          style={style().button}
          enabled={!downloading}
          onPress={() => { downloadQR() }}
        />
        <View style={{ marginTop: 10 }}>
          <RoundedButton
            text="Finalizar entrega"
            style={{ ...style().button }}
            enabled={!closing}
            onPress={async () => {
              const finalCurrentStatus = calculateFinalCurrentStatus(final)
              if (finalCurrentStatus === FinalStatus.SoonToStart) {
                Alert.alert('Bajá esa ansiedad. Todavía ni empezó el final');
                return;
              }
              setClosing(true);
              try {
                console.log("FINAL", final);

                await finalRepository.close(final.id, '');

                navigation.goBack()
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
      </View>
    </View>
  );
};

export default FinalExamQR;

export class MessageError extends Error {
  constructor(message: string) {
    super(message);
  }
}
