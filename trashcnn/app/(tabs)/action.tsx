// Frontend screen that connects user image input to the backend API in services/api.tsx.
// It handles image picking, camera capture, prediction display, and feedback submission.
import { useEffect, useState } from 'react';
import { Alert, Image, Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { predictImage, submitReview, submitModelResults, TrashType } from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { consumePendingImage, PendingImageData } from '@/services/imageStore';
export default function ImagePickerExample() {
  // Base64 image data ready to send to the backend prediction endpoint
  const [base64Image, setBase64Image] = useState<string | null>(null);

  // History of previously analyzed images shown in the UI
  const [previousImages, setPreviousImages] = useState<
    { uri: string; prediction: string | null; confidence: number | null }[]
  >([]);

  // URI for the currently selected or captured image
  const [image, setImage] = useState<string | null>(null);
  // Controls whether the "wrong prediction" feedback modal is shown
  const [failVisible, setfailVisible] = useState(false);

  // Convert a prediction string into a TrashType enum if valid
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

  // Controls whether the rating / review modal is visible
  const [reviewVisible, setReviewVisible] = useState(false);

  const openReview = () => {
    setReviewVisible(true);
  };

  const closeReview = () => {
    setReviewVisible(false);
  };
  // User-facing message about the current prediction / recommendation
  const [message, setMessage] = useState<string | null>(null);

  // Star rating selected in the review modal
  const [starState, setStarState] = useState(0);
  const handleStarPress = (rating: number) => {
    setStarState(rating);
  };

  // Text input for the review modal
  const [reviewText, setReviewText] = useState('');

  // Trash type selected when the user reports an incorrect prediction
  const [selectedTrashType, setSelectedTrashType] = useState<TrashType | null>(null);

  // Latest backend prediction result from predictImage()
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // Latest backend confidence value from predictImage()
  const [confidence, setConfidence] = useState<number | null>(null);

  const processImageUpload = async (pending: PendingImageData) => {
    setImage(pending.uri);
    setBase64Image(pending.base64);
    setPredictionResult(null);
    setConfidence(null);
    setMessage(null);

    try {
      const result = await predictImage(
        pending.base64,
        pending.fileName,
        pending.width,
        pending.height,
      );

      console.log('Prediction result:', result);
      if (result.error) {
        setPredictionResult('rejected');
        setMessage('Rejection: ' + result.error);
        setConfidence(null);
        setPreviousImages(prev => [
          ...prev,
          { uri: pending.uri, prediction: 'rejected', confidence: null },
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
          uri: pending.uri,
          prediction: result.prediction_result,
          confidence: result.confidence,
        },
      ]);
    } catch (error) {
      console.error('Error predicting image:', error);
    }
  };

  useEffect(() => {
    const pending = consumePendingImage();
    if (pending) {
      processImageUpload(pending);
    }
  }, []);

  // Capture a photo from the camera and send the image to the backend prediction endpoint
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

  // Select an image from the media library and send it to the backend prediction endpoint
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

  // Call the backend prediction API from services/api.tsx
  try {
    const result = await predictImage(
      base64Image,
      asset.fileName ?? 'image.jpg',
      asset.width,
      asset.height,
    );
    console.log('Prediction result:', result);
    // if result is rejected
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Modal
  animationType="fade"
  transparent={true}
  visible={reviewVisible}
  onRequestClose={closeReview}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
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
{/* Submit rating and review text to the backend */}
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
      </View>
    </View>
</Modal>
<Modal
  animationType="fade"
  transparent={true}
  visible={failVisible}
  onRequestClose={closeFail}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
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
      {/* Submit corrected trash type and image data back to the backend for model feedback */}
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
      </View>
    </View>
</Modal>
{/*Action page UI starts here*/}
       <Text style={styles.title}>Future Fusion AI</Text>

  <TouchableOpacity style={styles.imageBubble} onPress={takePhoto}>
    <Text style={styles.bubbleText}>Take Photo</Text>
  </TouchableOpacity>

    <View style={{ height: 20 }} />

  <TouchableOpacity style={styles.imageBubble} onPress={pickImage}>
    <Text style={styles.bubbleText}>Upload from Camera Roll</Text>
  </TouchableOpacity>

  {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
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
</View>

  );
}

// Action style sheet css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF7',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 50,
    width: '100%',
  },
  title:{
    fontSize: 32,
    color: '#1B5A35',
    fontWeight:'800',
    marginBottom: 24,
    textAlign: 'center',
  },
  title2:{
    fontSize:30,
    color: '#2E6D3D',
    fontWeight:'bold',
    marginTop: 20,
  },
  resultTitle:{
    fontSize:30,
    color: '#2A5D31',
    fontWeight:'bold',
    marginBottom:20,
    textAlign: 'center',
  },
  subtitle:{
    fontSize: 20,
    color: '#315C35',
    fontWeight: 'normal',
    marginTop: 5,
    marginBottom:10,
    textAlign: 'center',
  },
  image: {
    width: '95%',
    maxWidth: 360,
    height: 320,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 18,
    backgroundColor: '#F0F7F0',
  },
  imageBubble:{
    width: '100%',
    maxWidth: 380,
    backgroundColor:'#3F7D4A',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
  },
  bubbleText:{
    color:'#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  imageBubble2:{
    width: '100%',
    maxWidth: 380,
    backgroundColor:'#5AAE5F',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
 modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.35)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContent: {
  width: '92%',
  maxWidth: 340,
  borderRadius: 20,
  padding: 22,
  alignItems: 'center',
  backgroundColor: '#F7FFF4',
  overflow: 'hidden',
},
trashButtonsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginVertical: 20,
},
trashButton: {
  backgroundColor: '#66A86D',
  padding: 12,
  margin: 5,
  borderRadius: 12,
  minWidth: 90,
  alignItems: 'center',
},
selectedTrashButton: {
  backgroundColor: '#3F7D4A',
  borderWidth: 2,
  borderColor: '#DFF2E8',
},
trashButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
},
});

// Translate a trash category into a user-friendly bin recommendation message
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