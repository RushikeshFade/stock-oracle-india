
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { toast } from 'sonner';

// Import Components
import Header from '@/components/Header';
import StockSearch from '@/components/StockSearch';
import StockChart from '@/components/StockChart';
import StockMetrics from '@/components/StockMetrics';
import PredictionResults from '@/components/PredictionResults';
import ModelMetrics from '@/components/ModelMetrics';
import Footer from '@/components/Footer';

// Import Utils
import { fetchStockData, StockData } from '@/lib/stockService';
import { 
  createLSTMModel, 
  createCNNModel, 
  preprocessData, 
  trainModel, 
  makePrediction 
} from '@/lib/stockModels';

const Index = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<{lstm: number[]; cnn: number[]} | null>(null);
  
  const [modelTrainingProgress, setModelTrainingProgress] = useState({
    lstm: 0,
    cnn: 0
  });
  
  const [modelAccuracy, setModelAccuracy] = useState<{lstm: number; cnn: number} | null>(null);

  // Initialize TensorFlow.js
  useEffect(() => {
    async function initTensorflow() {
      try {
        await tf.ready();
        console.log('TensorFlow.js is ready');
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
        toast.error('Failed to initialize ML models');
      }
    }
    
    initTensorflow();
  }, []);

  // Handle stock selection
  const handleSelectStock = async (symbol: string) => {
    try {
      setIsLoading(true);
      setStockData(null);
      setPredictions(null);
      setModelTrainingProgress({ lstm: 0, cnn: 0 });
      setModelAccuracy(null);
      
      // Fetch stock data
      const data = await fetchStockData(symbol);
      setStockData(data);
      
      // Train models and make predictions
      trainModelsAndPredict(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast.error('Failed to fetch stock data');
      setIsLoading(false);
    }
  };

  // Train models and make predictions
  const trainModelsAndPredict = async (data: StockData) => {
    try {
      // Use closing prices for prediction
      const closePrices = data.close;
      
      // Preprocess data
      const { trainX, trainY, scaler } = preprocessData(closePrices);
      
      // Create models
      const lstmModel = createLSTMModel([trainX[0].length, trainX[0][0].length]);
      const cnnModel = createCNNModel([trainX[0].length, trainX[0][0].length]);
      
      // Train LSTM model
      await trainModel(
        lstmModel,
        trainX,
        trainY,
        10, // Reduced epochs for demo
        32,
      );
      
      // Update progress
      setModelTrainingProgress(prev => ({ ...prev, lstm: 100 }));
      
      // Train CNN model
      await trainModel(
        cnnModel,
        trainX,
        trainY,
        10, // Reduced epochs for demo
        32
      );
      
      // Update progress
      setModelTrainingProgress(prev => ({ ...prev, cnn: 100 }));
      
      // Make predictions (next 5 days)
      const lstmPredictions = makePrediction(lstmModel, closePrices, 60, scaler, 5);
      const cnnPredictions = makePrediction(cnnModel, closePrices, 60, scaler, 5);
      
      // Set predictions
      setPredictions({
        lstm: lstmPredictions,
        cnn: cnnPredictions
      });
      
      // Set model accuracy (mock values for demo)
      setModelAccuracy({
        lstm: 85 + Math.random() * 10,
        cnn: 80 + Math.random() * 15
      });
      
      setIsLoading(false);
      toast.success(`Successfully generated predictions for ${data.symbol}`);
      
    } catch (error) {
      console.error('Error training models:', error);
      toast.error('Error training prediction models');
      setIsLoading(false);
    }
  };

  // Function to simulate training progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isLoading && modelTrainingProgress.lstm < 100) {
      interval = setInterval(() => {
        setModelTrainingProgress(prev => ({
          lstm: Math.min(prev.lstm + 5, 95),
          cnn: Math.min(prev.cnn + 3, 90)
        }));
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, modelTrainingProgress]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <StockSearch onSelectStock={handleSelectStock} isLoading={isLoading} />
              <div className="mt-6">
                <ModelMetrics 
                  modelTrainingProgress={modelTrainingProgress}
                  modelAccuracy={modelAccuracy}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <StockChart stockData={stockData} predictions={predictions} />
            </div>
          </div>
          
          {stockData && (
            <>
              <div className="mt-6">
                <StockMetrics stockData={stockData} />
              </div>
            
              <div className="mt-8">
                <PredictionResults 
                  predictions={predictions} 
                  currentPrice={stockData.close.length > 0 ? stockData.close[stockData.close.length - 1] : null} 
                />
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
