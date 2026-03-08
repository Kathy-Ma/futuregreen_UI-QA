/*lmao i have no idea how this code works*/
import { useState } from 'react';
import { Alert, Button, Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { predictImage } from '@/services/api';

import * as ImagePicker from 'expo-image-picker';
export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const takePhoto = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    if(!cameraResult.granted) {
      Alert.alert('Permission required', 'Permission to access camera is required.');
      return;
    }
    let resultCamera = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      aspect: [4,3],
      quality: 1,
      allowsEditing: true,
      base64: true,
    });
    console.log(resultCamera);
    
    if (!resultCamera.canceled && resultCamera.assets?.length > 0) {
  const asset = resultCamera.assets[0];
  setImage(asset.uri);
  if (!asset.base64) {
    console.error('No base64 data available');
    return;
  }

  const base64Image = asset.base64;

  try {
    const result = await predictImage(
      base64Image,
      asset.fileName ?? 'image.jpg',
      asset.width,
      asset.height,
    );
    console.log('Prediction result:', result);
    setPredictionResult(result.prediction_result);
    setConfidence(result.confidence);
  } catch (error) {
    console.error('Error predicting image:', error);
  }

}
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //if no permission return an error alert
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log(result);
/* i dont know hwat api using*/

    if (!result.canceled && result.assets?.length > 0) {
  const asset = result.assets[0];
  setImage(asset.uri);

  if (!asset.base64) {
    console.error('No base64 data available');
    return;
  }

  const base64Image = asset.base64;

  try {
    const result = await predictImage(
      base64Image,
      asset.fileName ?? 'image.jpg',
      asset.width,
      asset.height,
    );
    console.log('Prediction result:', result);
    setPredictionResult(result.prediction_result);
    setConfidence(result.confidence);
  } catch (error) {
    console.error('Error predicting image:', error);
  }
}
  };
  return (
    
    <View style={styles.container}>
       <Text style={styles.title}>Future Fusion AI</Text>

  <TouchableOpacity style={{backgroundColor: 'lightblue', padding: 6, borderRadius: 11}} onPress={pickImage}>
    <Text style={{fontSize: 18, fontWeight: "600"}}>Upload from Camera Roll</Text>
  </TouchableOpacity>

    <View style={{ height: 20 }} />

  <TouchableOpacity style={{backgroundColor: 'lightblue', padding: 6, borderRadius: 11}} onPress={takePhoto}>
    <Text style={{fontSize: 18, fontWeight: "600"}}>Take Photo</Text>
  </TouchableOpacity>

  {image && <Image source={{ uri: image }} style={styles.image} />}

  {image && <Text style={styles.resultTitle}>Your garbage is {predictionResult || '(analyzing...)'}</Text>}
  {predictionResult && confidence && <Text style={styles.subtitle}>Confidence: {(confidence * 100).toFixed(2)}%</Text>}
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132908',
    alignItems: 'center',
    /*this means everythings starts at the top lmao*/
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  title:{
    fontSize:30,
    color: '#FFFF',
    fontWeight:'bold',
    marginBottom: 60,
  },
  resultTitle:{
    fontSize:30,
    color: '#FFFF',
    fontWeight:'bold',
    marginBottom:20,
  },
  subtitle:{
    fontSize: 20,
    color: '#FFFF',
    fontWeight: 'normal',
    marginTop: 5,
  },
  image: {
    width: 200,
    height: 300,
    marginTop:15,
    marginBottom:15,
  },
});

