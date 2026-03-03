/*lmao i have no idea how this code works*/
import { useState } from 'react';
import { Alert, Button, Image, Text, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-quick-base64'
export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
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
  const base64Image = asset.base64;

  try {
    const response = await fetch('backend goes here', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    const data = await response.json();
    console.log('Server response:', data);
    Alert.alert('Result', JSON.stringify(data));
  } catch (error) {
    console.error(error);
    Alert.alert('Upload failed', 'Try again.');
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
  const base64Image = asset.base64;

  try {
    const response = await fetch('backend goes here', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    const data = await response.json();
    console.log('Server response:', data);
    Alert.alert('Result', JSON.stringify(data));
  } catch (error) {
    console.error(error);
    Alert.alert('Upload failed', 'Try again.');
  }
}
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Future Fusion AI</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="or take a photo with your camera" onPress={takePhoto}/>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Text style={styles.title}>Your garbage is {garbageType || '(analyzing...)'}</Text>}
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
    paddingTop: 60,
  },
  title:{
    fontSize:30,
    color: '#FFFF',
    fontWeight:'bold',
    marginBottom: 100,
  },
  image: {
    width: 200,
    height: 300,
  },
});

