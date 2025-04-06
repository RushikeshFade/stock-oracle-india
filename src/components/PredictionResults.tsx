
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PredictionResultsProps {
  predictions: {
    lstm: number[];
    cnn: number[];
  } | null;
  currentPrice: number | null;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ predictions, currentPrice }) => {
  if (!predictions || currentPrice === null) {
    return null;
  }

  // Generate dates for the next 5 days
  const generateFutureDates = (days: number) => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date.toLocaleDateString());
    }
    
    return dates;
  };

  const futureDates = generateFutureDates(predictions.lstm.length);

  // Calculate percentage change
  const calculateChange = (prediction: number) => {
    if (currentPrice === 0) return 0;
    return ((prediction - currentPrice) / currentPrice) * 100;
  };

  // Get badge color based on percentage change
  // Using only valid badge variants: "default", "secondary", "destructive", "outline"
  const getBadgeVariant = (change: number) => {
    if (change > 3) return "default"; // Changed from "success" to "default"
    if (change > 0) return "secondary";
    if (change > -3) return "outline";
    return "destructive";
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Price Predictions for Next 5 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>LSTM Prediction</TableHead>
              <TableHead>CNN Prediction</TableHead>
              <TableHead>Average</TableHead>
              <TableHead className="text-right">Expected Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {futureDates.map((date, index) => {
              const lstmPred = predictions.lstm[index];
              const cnnPred = predictions.cnn[index];
              const avgPred = (lstmPred + cnnPred) / 2;
              const change = calculateChange(avgPred);

              return (
                <TableRow key={date}>
                  <TableCell className="font-medium">{date}</TableCell>
                  <TableCell>₹{lstmPred.toFixed(2)}</TableCell>
                  <TableCell>₹{cnnPred.toFixed(2)}</TableCell>
                  <TableCell>₹{avgPred.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getBadgeVariant(change)}>
                      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>* Predictions are based on historical price patterns</p>
          <p>* These predictions should not be used as financial advice</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResults;
