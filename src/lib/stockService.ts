
import axios from 'axios';
import { toast } from 'sonner';

// List of NSE stock symbols for quick search
export const POPULAR_STOCKS = [
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 
  'ICICIBANK.NS', 'HINDUNILVR.NS', 'SBIN.NS', 'HDFC.NS',
  'BAJFINANCE.NS', 'ITC.NS', 'KOTAKBANK.NS', 'LT.NS',
  'WIPRO.NS', 'AXISBANK.NS', 'SUNPHARMA.NS', 'ONGC.NS',
  'TATAMOTORS.NS', 'NTPC.NS', 'POWERGRID.NS', 'BHARTIARTL.NS'
];

// Interface for stock data
export interface StockData {
  timestamp: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  symbol: string;
  name?: string;
}

// Function to fetch historical stock data
export const fetchStockData = async (symbol: string): Promise<StockData> => {
  try {
    // Using Yahoo Finance API (in a real app, you'd use a proper financial API)
    const period1 = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365; // 1 year ago
    const period2 = Math.floor(Date.now() / 1000);
    const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=${period1}&period2=${period2}&interval=1d&events=history`;
    
    // In a real app, this would go through a backend proxy to avoid CORS
    // For demo purposes, we'll simulate this with a mock response
    console.log(`Fetching stock data for ${symbol}...`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock data as Yahoo Finance has CORS restrictions
    const today = new Date();
    const timestamp: number[] = [];
    const open: number[] = [];
    const high: number[] = [];
    const low: number[] = [];
    const close: number[] = [];
    const volume: number[] = [];
    
    // Generate 365 days of mock data based on the symbol's hash
    // This ensures consistent "random" data for the same symbol
    const symbolHash = [...symbol].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seedValue = symbolHash / 10;
    
    for (let i = 365; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      timestamp.push(date.getTime());
      
      // Generate somewhat realistic looking stock data
      const dayFactor = (Math.sin(i / 30) + Math.cos(i / 65)) * 0.5;
      const volatilityFactor = (symbolHash % 10) / 20 + 0.05;
      
      const basePrice = seedValue * (1 + dayFactor * 0.4);
      const dayVolatility = basePrice * volatilityFactor;
      
      const openPrice = basePrice + (Math.random() - 0.5) * dayVolatility;
      const highPrice = openPrice + Math.random() * dayVolatility;
      const lowPrice = openPrice - Math.random() * dayVolatility;
      const closePrice = lowPrice + Math.random() * (highPrice - lowPrice);
      
      open.push(Number(openPrice.toFixed(2)));
      high.push(Number(highPrice.toFixed(2)));
      low.push(Number(lowPrice.toFixed(2)));
      close.push(Number(closePrice.toFixed(2)));
      volume.push(Math.floor(100000 + Math.random() * 10000000));
    }
    
    // Format the symbol name
    const name = symbol.split('.')[0].replace(/([A-Z])/g, ' $1').trim();
    
    return { timestamp, open, high, low, close, volume, symbol, name };
  } catch (error) {
    toast.error(`Error fetching stock data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};

// Search for stocks by symbol or name
export const searchStocks = async (query: string): Promise<string[]> => {
  if (!query || query.length < 2) return [];
  
  query = query.toUpperCase();
  
  // Filter popular stocks that match the query
  const results = POPULAR_STOCKS.filter(stock => 
    stock.toUpperCase().includes(query) || 
    stock.split('.')[0].replace(/([A-Z])/g, ' $1').trim().toUpperCase().includes(query)
  );
  
  return results;
};
