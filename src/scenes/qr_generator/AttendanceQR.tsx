import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, View, Platform, LayoutChangeEvent } from 'react-native';
import RNFS from 'react-native-fs';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { Loading, RoundedButton } from '../../components';
import { getStyleSheet as style } from '../../styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Semester } from '../../models/Semester';
import { QRAttendance } from '../../models/QRAttendance';
import { makeRequest } from '../../networking/makeRequest';
import { QRAttendanceRepository } from '../../repositories';

interface RouteParams {
  semester: Semester;
}

const SemesterAttendanceQR: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [qrSize, setQrSize] = useState<number>(300);
  const [qrValue, setQrValue] = useState<string>('');
  const svgRef = useRef<any>(null);

  const navigation = useNavigation()
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const semesterId = routeParams.semester.id;

  const fetchData = useCallback(async (isRefreshing: boolean = false) => {
    if (loading) {
      return;
    }
    try {
      const qrAttendanceData: QRAttendance = await makeRequest(() => QRAttendanceRepository.generateAttendanceQR(semesterId), navigation);
      setQrValue(qrAttendanceData.qrid)
    } catch (error) {
      console.log("Error", error);

      Alert.alert(
        '¿Qué pasó?',
        'No sabemos pero no pudimos buscar tus comisiones. ' +
        'Volvé a intentar en unos minutos.',
      );
    }
  }, [loading]);

  async function downloadQR() {
    if (downloading) return;
    setDownloading(true);

    await svgRef.current?.toDataURL(async (data: string) => {
      try {
        const path = `${RNFS.CachesDirectoryPath}/${semesterId}.png`;
        await RNFS.writeFile(path, data, 'base64');
        await CameraRoll.save(path, { type: 'photo', album: 'QrCodes' });
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
  };

  useEffect(() => {
    fetchData();
  }, [semesterId]); // Re-fetch when semesterId changes

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setQrSize(Math.min(width, height));
  };

  return (
    <View style={style().view} onLayout={handleLayout}>
      {loading && <Loading />}
      {qrValue && (
        <QRCode
          value={qrValue}
          size={qrSize}
          getRef={(c) => (svgRef.current = c)}
          quietZone={20}
        />
      )}
      <View style={style().containerView}>
        <RoundedButton
          text="Descargar QR"
          style={style().button}
          enabled={!downloading && !!qrValue} // Ensure QR code is loaded
          onPress={downloadQR}
        />
      </View>
    </View>
  );
}

export default SemesterAttendanceQR;
