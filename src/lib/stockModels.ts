
import * as tf from '@tensorflow/tfjs';

// LSTM Model
export const createLSTMModel = (inputShape: number[]): tf.LayersModel => {
  const model = tf.sequential();
  
  // Add LSTM layers
  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: true,
    inputShape: [inputShape[0], inputShape[1]]
  }));
  
  model.add(tf.layers.dropout({ rate: 0.2 }));
  
  model.add(tf.layers.lstm({
    units: 50,
    returnSequences: false
  }));
  
  model.add(tf.layers.dense({ units: 25 }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 1 }));
  
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });
  
  return model;
};

// CNN Model
export const createCNNModel = (inputShape: number[]): tf.LayersModel => {
  const model = tf.sequential();
  
  // Add Conv1D layer
  model.add(tf.layers.conv1d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
    inputShape: [inputShape[0], inputShape[1]]
  }));
  
  model.add(tf.layers.maxPooling1d({ poolSize: 2 }));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({ units: 50, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 1 }));
  
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });
  
  return model;
};

// Function to preprocess data for models
export const preprocessData = (data: number[], timeSteps: number = 60): {
  trainX: number[][][], 
  trainY: number[][], 
  scaler: { min: number, max: number }
} => {
  // Normalize data between 0 and 1
  const min = Math.min(...data);
  const max = Math.max(...data);
  const scaler = { min, max };
  
  const scaledData = data.map(value => (value - min) / (max - min));
  
  const X = [];
  const y = [];
  
  for (let i = 0; i < scaledData.length - timeSteps; i++) {
    X.push(scaledData.slice(i, i + timeSteps));
    y.push(scaledData[i + timeSteps]);
  }
  
  // Convert to 3D tensor [samples, timesteps, features]
  const trainX: number[][][] = X.map(sequence => sequence.map(val => [val]));
  const trainY: number[][] = y.map(val => [val]);
  
  return { trainX, trainY, scaler };
};

// Function to train model with data
export const trainModel = async (
  model: tf.LayersModel,
  trainX: number[][][],
  trainY: number[][],
  epochs: number = 50,
  batchSize: number = 32
): Promise<tf.History> => {
  const xs = tf.tensor3d(trainX);
  const ys = tf.tensor2d(trainY);
  
  const history = await model.fit(xs, ys, {
    epochs,
    batchSize,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, mae = ${logs?.mae.toFixed(4)}`);
      }
    }
  });
  
  xs.dispose();
  ys.dispose();
  
  return history;
};

// Function to make predictions
export const makePrediction = (
  model: tf.LayersModel, 
  data: number[], 
  timeSteps: number = 60,
  scaler: { min: number, max: number },
  futureDays: number = 5
): number[] => {
  // Normalize data
  const scaledData = data.map(value => (value - scaler.min) / (scaler.max - scaler.min));
  
  // Get the last sequence
  let lastSequence = scaledData.slice(-timeSteps);
  let predictions: number[] = [];
  
  // Make predictions for future days
  for (let i = 0; i < futureDays; i++) {
    // Reshape to [1, timeSteps, 1]
    const input = tf.tensor3d([lastSequence.map(val => [val])]);
    
    // Predict
    const prediction = model.predict(input) as tf.Tensor;
    const predictedValue = prediction.dataSync()[0];
    
    // Denormalize
    const denormalizedValue = predictedValue * (scaler.max - scaler.min) + scaler.min;
    predictions.push(denormalizedValue);
    
    // Update sequence by removing first element and adding the prediction
    lastSequence.shift();
    lastSequence.push(predictedValue);
    
    // Cleanup
    input.dispose();
    prediction.dispose();
  }
  
  return predictions;
};
