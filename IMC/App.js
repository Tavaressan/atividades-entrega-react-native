import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

export default function App() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBmi = () => {
    if (weight && height !== "") {
      const bmiResult = parseFloat(weight.replace(",", ".")) / (parseFloat(height.replace(",", ".")) * parseFloat(height.replace(",", ".")));
      setResult(bmiResult);
      
      if (bmiResult < 18.5) {
        setCategory('UNDERWEIGHT');
      } else if (bmiResult >= 18.5 && bmiResult < 24.9) {
        setCategory('NORMAL');
      } else if(bmiResult >= 25 && bmiResult < 29.9){
        setCategory("OVERWEIGHT")
      }
      else if(bmiResult >= 30 && bmiResult <= 39.9){
        setCategory('OBESE!');
      }
      else{
        setCategory("SEVERE OBESITY!!!")
      }
    } else {
      alert('Please, fill in the weight and height.');
    }
  };

  return (
    <View style={styles.app}>
      <Text style={styles.title}>BMI Calculator</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Height (m)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      <View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={calculateBmi}
        >
          <Text style={styles.buttonText}>Calculate BMI</Text>
        </Pressable>
      </View>

      <View>
        {result !== null && (
          <Text style={styles.resultText}>Result: {result.toFixed(2)}</Text>
        )}
      </View>

      {result !== null && category && (
        <View>
          <Text style={styles.resultText}>Category: {category}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: '#fdf5e6',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#a7c7e7',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#b2d8d8',
    borderWidth: 2,
    width: 280,
    height: 50,
    borderRadius: 10,
    color: '#333333',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#89cff0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 30,
  },
  buttonPressed: {
    backgroundColor: '#77b5d9',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 22,
    color: '#555555',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#b2d8b2',
  },
});