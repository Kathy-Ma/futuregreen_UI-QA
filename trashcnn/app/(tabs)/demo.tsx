/*lmao i have no idea how this code works*/
import { useState } from 'react';
import { Alert, Button, Image, Text, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library.
    // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
    // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
    // so the app users aren't surprised by a system dialog after picking a video.
    // See "Invoke permissions for videos" sub section for more details.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
/* i dont know hwat api using*/
    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImage(localUri);
      
      //ok i can maybe explain the rest of the code but i have NO IDEA what this does this sohuld send to api
      // const filename = localUri.split('/').pop();
      // const match = /\.(\w+)$/.exec(filename || '');
      // const type = match ? 'image/$(match[1]}' : 'image';

      // const formData = new FormData();
      // formData.append('file', {uri: localUri, name: filename, type} as any);
      // try {
      //   const response = await fetch('BACKEND GOES HERE', {
      //     method: 'POST',
      //     body: formData,
      //     headers: {
      //       'Contend-Type': 'multipart/form-data',
      //     },
      //   });
      //   const data = await response.json();
      //   console.log('Server response', data);
      //   //some type of function to take the garbage type into a text form to display
      //   console.log('Server response:', data);
      //   Alert.alert('Upload success', JSON.stringify(data));
      // } catch (error){
      //   console.error('Upload error:', error);
      //   Alert.alert('Something went wrong', 'please try again later');   
      // }
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Future Fusion AI</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Text style={styles.title}>Your garbage is (blank)</Text>}
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

