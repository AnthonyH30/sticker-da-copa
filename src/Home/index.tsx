import { useState, useEffect, useRef } from 'react';
import { Image, SafeAreaView, ScrollView, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';
import { Camera, CameraType } from 'expo-camera';

export function Home() {
  const [photo, setPhoto] = useState<null | string>(null)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);

  const cameraRef = useRef<Camera>(null);
  const screenShotRef = useRef(null)

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhoto(photo.uri);
  }

  async function shareScreenShot() {
    const screenShot = await captureRef(screenShotRef);
    await Sharing.shareAsync('file://' + screenShot)
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(response => setHasCameraPermission(response.granted))
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

            {
              hasCameraPermission && !photo ? <Camera
              style={styles.camera}
              type={CameraType.front}
              ref={cameraRef}
              /> :
              <Image
              source={{ uri: photo ? photo : 'https://filestore.community.support.microsoft.com/api/images/3e6bf7b7-bc3f-4d37-be8c-fe208ea98130?upload=true' }}
              style={styles.camera} 
              onLoad={shareScreenShot}
              />
            }

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <Button style={styles.btn} title="Compartilhar" onPress={handleTakePicture}/>

        <TouchableOpacity style={styles.btn} onPress={() => setPhoto(null)}>
            <Text style={styles.retry}>Nova foto</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}