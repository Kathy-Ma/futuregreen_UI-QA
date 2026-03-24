import { useState } from 'react';
import { Alert, Image, Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, ImageBackground, ScrollView} from 'react-native';
import { predictImage, submitReview, submitModelResults, TrashType } from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
export default function ImagePickerExample() {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [previousImages, setPreviousImages] = useState<
  { uri: string; prediction: string | null; confidence: number | null }[]
>([]);
  const [image, setImage] = useState<string | null>(null);
  const [failVisible, setfailVisible] = useState(false);
  const toTrashType = (value: string | null): TrashType | null => {
  if (!value) return null;

  const normalized = value.toLowerCase();

  if (Object.values(TrashType).includes(normalized as TrashType)) {
    return normalized as TrashType;
  }

  return null;
};
  const openFail = () => {
    setfailVisible(true);
  };
  const closeFail = () => {
    setfailVisible(false);
  };
  const [reviewVisible, setReviewVisible] = useState(false);
  const openReview = () => {
  setReviewVisible(true);
};

const closeReview = () => {
  setReviewVisible(false);
};
  const [message, setMessage] = useState<string | null>(null);
  const [starState, setStarState] = useState(0);
  const handleStarPress = (rating: number) => {
  setStarState(rating);
};
  const [reviewText, setReviewText] = useState('');
  const [selectedTrashType, setSelectedTrashType] = useState<TrashType | null>(null);
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
  setBase64Image(base64Image);

  setPredictionResult(null);
  setConfidence(null);
  setMessage(null);

  try {
    const result = await predictImage(
      base64Image,
      asset.fileName ?? 'image.jpg',
      asset.width,
      asset.height,
    );
    console.log('Prediction result:', result);
    if (result.error) {
      setPredictionResult("rejected");
      setMessage("Rejection: " + result.error);
      setConfidence(null);
      setPreviousImages(prev => [
        ...prev,
        {
          uri: asset.uri,
          prediction: "rejected",
          confidence: null,
        },
      ]);
      return;
    }
    const msg = binCheck(result.prediction_result);
    setMessage(msg);
    setPredictionResult(result.prediction_result);
    setConfidence(result.confidence);
    setPreviousImages(prev => [
  ...prev,
  {
    uri: asset.uri,
    prediction: result.prediction_result,
    confidence: result.confidence,
  },
]);
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

    if (!result.canceled && result.assets?.length > 0) {
  const asset = result.assets[0];
  setImage(asset.uri);

  if (!asset.base64) {
    console.error('No base64 data available');
    return;
  }

  const base64Image = asset.base64;
  setBase64Image(base64Image);

  setPredictionResult(null);
  setConfidence(null);
  setMessage(null);

  try {
    const result = await predictImage(
      base64Image,
      asset.fileName ?? 'image.jpg',
      asset.width,
      asset.height,
    );
    console.log('Prediction result:', result);
    if (result.error) {
      setPredictionResult("rejected");
      setMessage("Rejection: " + result.error);
      setConfidence(null);
      setPreviousImages(prev => [
        ...prev,
        {
          uri: asset.uri,
          prediction: "rejected",
          confidence: null,
        },
      ]);
      return;
    }
    const msg = binCheck(result.prediction_result);
    setMessage(msg);
    setPredictionResult(result.prediction_result);
    setConfidence(result.confidence);
    setPreviousImages(prev => [
  ...prev,
  {
    uri: asset.uri,
    prediction: result.prediction_result,
    confidence: result.confidence,
  },
]);
  } catch (error) {
    console.error('Error predicting image:', error);
  }
}
  };
  return (
    <ImageBackground
    source={require('@/assets/UIQAimages/background.png')}
    style={styles.container}
    resizeMode="cover"
    >
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 50 }}>
        
        <Modal
  animationType="fade"
  transparent={true}
  visible={reviewVisible}
  onRequestClose={closeReview}
>
  <View style={styles.modalOverlay}>
    <ImageBackground
  source={require('@/assets/UIQAimages/popupBackground.png')}
  style={styles.modalContent}
  resizeMode="cover"
>
      <Text style={styles.title2}>How'd we do?</Text>
<View style={{ flexDirection: "row", justifyContent: "center", marginTop:20, marginBottom:20,}}>
  {[1, 2, 3, 4, 5].map((star) => (
    <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
      <Image
        source={
          starState >= star
            ? require('@/assets/UIQAimages/fullstar.png')
            : require('@/assets/UIQAimages/emptystar.png')
        }
        resizeMode="contain"
        style={{ width: 40, height: 40, marginHorizontal: 5 }}
      />
    </TouchableOpacity>
  ))}
</View>
  <TextInput
  style={styles.subtitle}
  placeholder="Write your feedback..."
  placeholderTextColor="#ccc"
  value={reviewText}
  onChangeText={setReviewText}
  multiline
/>
<TouchableOpacity style={styles.imageBubble2} onPress={async () => {
  try {
    await submitReview(starState, reviewText);
    Alert.alert("Thanks for your feedback");
    closeReview();
  } catch (err) {
    console.error(err);
    Alert.alert("Failed to submit review");
  }
}}>
      <Text style={styles.bubbleText}>Submit Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.imageBubble2} onPress={closeReview}>
      <Text style={styles.bubbleText}>close</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
</Modal>
<Modal
  animationType="fade"
  transparent={true}
  visible={failVisible}
  onRequestClose={closeFail}
>
  <View style={styles.modalOverlay}>
    <ImageBackground
  source={require('@/assets/UIQAimages/popupBackground.png')}
  style={styles.modalContent}
  resizeMode="cover"
>
      <Text style={styles.title2}>What trash was it?</Text>
      <ScrollView contentContainerStyle={styles.trashButtonsContainer}>
        {Object.values(TrashType).map((type) => {
          const icons: Record<TrashType, string> = {
            cardboard: '📦',
            glass: '🥤',
            metal: '🥫',
            paper: '📄',
            plastic: '🧴',
            trash: '🗑️',
            organic: '🍎',
            rejected: '❌',
          };
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.trashButton,
                selectedTrashType === type && styles.selectedTrashButton,
              ]}
              onPress={() => setSelectedTrashType(type as TrashType)}
            >
              <Text style={styles.trashButtonText}>{icons[type as TrashType]} {type}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
<TouchableOpacity style={styles.imageBubble2} onPress={async () => {
  try {
    const predicted = toTrashType(predictionResult);
    const actual = selectedTrashType;

    if (!predicted || !actual) {
      Alert.alert("Please select a trash type");
      return;
    }
    if (!base64Image) {
  Alert.alert("No image data available");
  return;
}
    await submitModelResults(predicted, actual,base64Image );
    Alert.alert("Thanks for your feedback");
    setSelectedTrashType(null);
    closeFail();
  } catch (err) {
    console.error(err);
    Alert.alert("Failed to submit feedback");
  }
}}>
      <Text style={styles.bubbleText}>Submit feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.imageBubble2} onPress={() => {
        setSelectedTrashType(null);
        closeFail();
      }}>
      <Text style={styles.bubbleText}>close</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
</Modal>
       <Text style={styles.title}>Future Fusion AI</Text>

  <TouchableOpacity style={styles.imageBubble} onPress={pickImage}>
    <Text style={styles.bubbleText}>Upload from Camera Roll</Text>
  </TouchableOpacity>

    <View style={{ height: 20 }} />

  <TouchableOpacity style={styles.imageBubble} onPress={takePhoto}>
    <Text style={styles.bubbleText}>Take Photo</Text>
  </TouchableOpacity>

  {image && <Image source={{ uri: image }} style={styles.image} />}
  {image && <Text style={styles.resultTitle}>Your garbage is {predictionResult || '(analyzing...)'}</Text>}
  {predictionResult && confidence && <Text style={styles.subtitle}>Confidence: {(confidence * 100).toFixed(2)}%</Text>}
  {message && <Text style={styles.subtitle}>{message}</Text>}
  {previousImages.length != 0 ? (
 <TouchableOpacity style={styles.imageBubble2} onPress={openReview}>
  <Text style={styles.bubbleText}>How'd we do?</Text>
</TouchableOpacity>
  ):null}
  {previousImages.length != 0? (
  <TouchableOpacity style={styles.imageBubble} onPress={openFail}>
  <Text style={styles.bubbleText}>Did we get it wrong?</Text>
  </TouchableOpacity>
  ):null}
<Text style={styles.title2}>Previous Images</Text>
  <ScrollView horizontal style={{ marginTop: 20 }}>
  {previousImages.length == 0 ? (
    <Text style={styles.subtitle}>Nothing here yet</Text>
  ) : (
    previousImages.map((item, index) => (
      <View key={index} style={{ marginRight: 10, alignItems: 'center' }}>
        <Image source={{ uri: item.uri }} style={{ width: 100, height: 150 }} />
        <Text style={{ color: '#FFF', fontSize: 12 }}>{item.prediction}</Text>
        {item.confidence !== null && (
          <Text style={{ color: '#FFF', fontSize: 12 }}>
            {(item.confidence * 100).toFixed(2)}%
          </Text>
        )}
      </View>
    ))
  )}
</ScrollView>
  </ScrollView>
</ImageBackground>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132908',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  title:{
    fontSize:30,
    color: '#FFFF',
    fontWeight:'bold',
    marginBottom: 60,
  },
  title2:{
    fontSize:30,
    color: '#FFFF',
    fontWeight:'bold',
    marginTop: 20,
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
    marginBottom:10,
    textAlign: 'center',
  },
  image: {
    width: 200, 
    height: 300,
    marginTop:15,
    marginBottom:15,
  },
  imageBubble:{
    backgroundColor:'#4ca626',
    padding: 6,
    borderRadius: 11,
  },
  bubbleText:{
    color:'#FFFF',
    fontSize: 18,
    fontWeight: "600",
  },
  imageBubble2:{
    backgroundColor:'#4ca626',
    padding:6,
    borderRadius: 11,
    marginBottom:20,
  },
 modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContent: {
  width: 300,
  borderRadius: 10,
  padding: 20,
  alignItems: 'center',
  overflow: 'hidden',
},
trashButtonsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginVertical: 20,
},
trashButton: {
  backgroundColor: '#4ca626',
  padding: 10,
  margin: 5,
  borderRadius: 10,
  minWidth: 80,
  alignItems: 'center',
},
selectedTrashButton: {
  backgroundColor: '#2e7d1a',
  borderWidth: 2,
  borderColor: '#fff',
},
trashButtonText: {
  color: '#FFFF',
  fontSize: 16,
  fontWeight: '600',
},
});
function binCheck (trashtype: string){
  let message = null
  if (trashtype=="metal"){
    message = "This goes in the recycling bin, remember to remove any food or liquids inside"
  }
  else if (trashtype=="paper"){
    message = "This goes in the recycling bin, remember to remove any contents inside"
  }
  else if (trashtype=="cardboard"){
    message = "This goes in the recycling bin, please flatten and remove any food residue"
  }
  else if (trashtype=="glass"){
    message = "This goes in the recycling bin, please remove any liquids inside and remove the lid if it is present"
  }
  else if (trashtype=="plastic"){
    message = "This goes in the recycling bin, please remove any food residue"
  }
  else if (trashtype=="trash"){
    message = "This goes in the garbage bin"
  }
  else if (trashtype=="organic"){
    message = "This goes in the organics (green) bin, make sure all packaging is removed"
  }
  return message
}