import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmitRating: (rating: number) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ 
  isVisible, 
  onClose, 
  onSubmitRating 
}) => {
  const [rating, setRating] = useState(0);

  const handleRatingSubmit = () => {
    onSubmitRating(rating);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Rate this Movie</Text>
          <AirbnbRating
            count={5}
            reviews={['Terrible', 'Bad', 'Good', 'Very Good', 'Excellent']}
            defaultRating={0}
            size={30}
            onFinishRating={setRating}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleRatingSubmit}
            >
              <Text style={styles.textStyle}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10
  },
  cancelButton: {
    backgroundColor: '#f44336'
  },
  submitButton: {
    backgroundColor: '#4CAF50'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
