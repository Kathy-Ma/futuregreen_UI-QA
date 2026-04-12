// Settings screen showing troubleshooting notes, platform hints, and UI documentation links.
import { Image } from 'expo-image';
import { useState} from 'react'
import { StyleSheet } from 'react-native';
import { submitReview } from '@/services/api';
import { View, TouchableOpacity, Modal,TextInput,ImageBackground, Text, Alert } from 'react-native'
import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function TabTwoScreen() {
  const [reviewVisible, setReviewVisible] = useState(false);
  
    const openReview = () => {
      setReviewVisible(true);
    };
  
    const closeReview = () => {
      setReviewVisible(false);
    };
      const [starState, setStarState] = useState(0);
  const handleStarPress = (rating: number) => {
    setStarState(rating);
  };
   const [reviewText, setReviewText] = useState('');
  return (
    <>
    // Setting page UI starts here
    <ParallaxScrollView
      // Settings page uses a parallax header image and collapsible content panels
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#1d4724' }}
      headerImage={
         <Image
           source={require('@/assets/UIQAimages/bkg2.jpg')}
           style={{ height: 300, width: 400}}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
          }}>
          Settings
        </ThemedText>
      </ThemedView>
      <Collapsible title="Troubleshooting">
        <ThemedText>
        Ensure there is only one object, fully in frame. As well, check that your image has an appropriate resolution. Finally, make sure the background is solid with no visible distractions.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Leave a Review">
       <TouchableOpacity style={styles.imageBubble2} onPress={openReview}>
        <Text style={styles.bubbleText}>How'd we do?</Text>
      </TouchableOpacity>
      </Collapsible>
    </ParallaxScrollView>
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
                </ImageBackground>
              </View>
          </Modal>
          </>
  );
}

// Settings style sheet css
const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#4ca626',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,

  },
  heading:{
    fontSize: 10,
    color: '#FFFF',
    fontWeight:'normal',
    marginBottom: 50,

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
    fontSize:25,
    color: '#FFFF',
    fontWeight:'bold',
    marginBottom:20,
  },
  subtitle:{
    fontSize: 20,
    color: '#FFFF',
    fontWeight: 'normal',
    marginTop: 5,
    marginBottom:20,
    textAlign: 'center',
  },
  subtitle2:{
    fontSize: 16,
    color: '#ffffffa6',
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
    marginBottom:5,

  },
  bubbleText:{
    color:'#FFFF',
    fontSize: 18,
    fontWeight: "600",
    padding: 7,
    backgroundColor:'#4ca626',
    borderRadius: 11,
    marginRight: 150,
    marginLeft: 10,

  },
  imageBubble2:{
    backgroundColor:'132908',
    padding:5,
    borderRadius: 11,
    marginBottom:25,
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
