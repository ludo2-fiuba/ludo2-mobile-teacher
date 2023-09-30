
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const CameraTest = () => {
  const device = useCameraDevice('back')
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    async function askPermissions() {
      const cameraPermission = await Camera.requestCameraPermission()
      const microphonePermission = await Camera.requestMicrophonePermission()

      if (cameraPermission === 'granted' && microphonePermission === 'granted') {
        setPermissionsGranted(true);
      }
    }
    askPermissions()
  }, [])

  if (!permissionsGranted) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Requesting Permissions...</Text></View>
  }

  if (device == null) return <View><Text> Nope </Text></View>

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
};


export default CameraTest;