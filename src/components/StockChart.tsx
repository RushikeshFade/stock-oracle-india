
import React, { useEffect, useMemo, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, ComposedChart
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StockData } from '@/lib/stockService';

interface ChartProps {
  stockData: StockData | null;
  predictions: {
    lstm: number[];
    cnn: number[];
  } | null;
}

interface DataPoint {
  date: string;
  close: number;
  lstm?: number;
  cnn?: number;
}

const StockChart: React.FC<ChartProps> = ({ stockData, predictions }) => {
  const [activeTab, setActiveTab] = useState<string>("1m");

  const formatData = useMemo(() => {
    if (!stockData) return [];

    const data: DataPoint[] = stockData.close.map((close, index) => {
      return {
        date: new Date(stockData.timestamp[index]).toLocaleDateString(),
        close
      };
    });

    // Add prediction data if available
    if (predictions && data.length > 0) {
      const lastDate = new Date(stockData.timestamp[stockData.timestamp.length - 1]);
      
      predictions.lstm.forEach((pred, i) => {
        const predDate = new Date(lastDate);
        predDate.setDate(lastDate.getDate() + i + 1);
        data.push({
          date: predDate.toLocaleDateString(),
          close: stockData.close[stockData.close.length - 1],
          lstm: pred,
          cnn: predictions.cnn[i]
        });
      });
    }

    return data;
  }, [stockData, predictions]);

  const getTimeRangeData = (range: string) => {
    if (!formatData.length) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(range) {
      case "1w":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1m":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
      default:
        return formatData;
    }
    
    const cutoffTime = cutoffDate.getTime();
    
    return formatData.filter(d => {
      const dataDate = new Date(d.date);
      return dataDate.getTime() >= cutoffTime || d.lstm !== undefined;
    });
  };

  const displayData = getTimeRangeData(activeTab);

  if (!stockData) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center shadow-md">
        <CardContent>
          <p className="text-muted-foreground">Select a stock to view chart</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>
          {stockData.name || stockData.symbol} Stock Price
        </CardTitle>
        <CardDescription>
          Historical price chart with ML predictions
        </CardDescription>
        <Tabs defaultValue="1m" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="1w">1W</TabsTrigger>
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="3m">3M</TabsTrigger>
            <TabsTrigger value="6m">6M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={displayData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" 
                tickFormatter={(val) => {
                  // Show fewer ticks for better readability
                  const date = new Date(val);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value, name) => {
                  const formattedValue = Number(value).toFixed(2);
                  switch(name) {
                    case 'close': return [`₹${formattedValue}`, 'Actual Price'];
                    case 'lstm': return [`₹${formattedValue}`, 'LSTM Prediction'];
                    case 'cnn': return [`₹${formattedValue}`, 'CNN Prediction'];
                    default: return [formattedValue, name];
                  }
                }} 
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#276749"
                strokeWidth={2}
                dot={false}
                name="Actual Price"
              />
              {predictions && (
                <>
                  <Line
                    type="monotone"
                    dataKey="lstm"
                    stroke="#1A365D"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    activeDot={{ r: 6 }}
                    name="LSTM Prediction"
                  />
                  <Line
                    type="monotone"
                    dataKey="cnn"
                    stroke="#D69E2E"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    activeDot={{ r: 6 }}
                    name="CNN Prediction"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
