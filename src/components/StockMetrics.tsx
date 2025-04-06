
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockData } from '@/lib/stockService';
import { ArrowUp, ArrowDown, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockMetricsProps {
  stockData: StockData | null;
}

const StockMetrics: React.FC<StockMetricsProps> = ({ stockData }) => {
  if (!stockData || stockData.close.length === 0) {
    return null;
  }

  // Get the latest price data
  const currentPrice = stockData.close[stockData.close.length - 1];
  const previousPrice = stockData.close[stockData.close.length - 2];
  
  // Calculate daily change
  const change = currentPrice - previousPrice;
  const changePercentage = (change / previousPrice) * 100;
  
  // Calculate 52-week high and low
  const high52Week = Math.max(...stockData.high);
  const low52Week = Math.min(...stockData.low);
  
  // Calculate market trend based on last 30 days
  const last30Days = stockData.close.slice(-30);
  let upDays = 0;
  
  for (let i = 1; i < last30Days.length; i++) {
    if (last30Days[i] > last30Days[i-1]) {
      upDays++;
    }
  }
  
  const trendPercentage = (upDays / (last30Days.length - 1)) * 100;
  
  // Calculate average volume
  const averageVolume = stockData.volume.reduce((a, b) => a + b, 0) / stockData.volume.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">₹{currentPrice.toFixed(2)}</div>
            <div className={cn(
              "flex items-center",
              changePercentage >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {changePercentage >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(changePercentage).toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {change >= 0 ? '+' : ''}₹{change.toFixed(2)} today
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">52 Week High</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{high52Week.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {((currentPrice / high52Week - 1) * 100).toFixed(2)}% from high
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">52 Week Low</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{low52Week.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +{((currentPrice / low52Week - 1) * 100).toFixed(2)}% from low
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <TrendingUp className={cn(
              "h-5 w-5 mr-2",
              trendPercentage > 50 ? "text-green-600" : "text-red-600"
            )} />
            <span className="text-2xl font-bold">{trendPercentage.toFixed(0)}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {upDays} up days in last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(averageVolume / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            30 day average trading volume
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockMetrics;
