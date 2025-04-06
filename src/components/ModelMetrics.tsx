
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ModelMetricsProps {
  modelTrainingProgress: {
    lstm: number;
    cnn: number;
  };
  modelAccuracy: {
    lstm: number;
    cnn: number;
  } | null;
}

const ModelMetrics: React.FC<ModelMetricsProps> = ({ modelTrainingProgress, modelAccuracy }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>ML Model Metrics</CardTitle>
        <CardDescription>
          Model training status and performance metrics
        </CardDescription>
        <Tabs defaultValue="training">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="training">Training Progress</TabsTrigger>
            <TabsTrigger value="accuracy" disabled={!modelAccuracy}>Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="training">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">LSTM Model</span>
                  <span className="text-sm text-muted-foreground">
                    {modelTrainingProgress.lstm}%
                  </span>
                </div>
                <Progress value={modelTrainingProgress.lstm} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CNN Model</span>
                  <span className="text-sm text-muted-foreground">
                    {modelTrainingProgress.cnn}%
                  </span>
                </div>
                <Progress value={modelTrainingProgress.cnn} className="h-2" />
              </div>
              {modelTrainingProgress.lstm < 100 && (
                <p className="text-sm text-muted-foreground animate-pulse-subtle">
                  Training models on historical data...
                </p>
              )}
              {modelTrainingProgress.lstm === 100 && modelTrainingProgress.cnn === 100 && (
                <p className="text-sm text-green-600">
                  Models trained successfully!
                </p>
              )}
            </CardContent>
          </TabsContent>
          <TabsContent value="accuracy">
            <CardContent className="space-y-4">
              {modelAccuracy && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">LSTM Model Accuracy</p>
                      <div className="text-2xl font-bold">{modelAccuracy.lstm.toFixed(2)}%</div>
                      <Progress value={modelAccuracy.lstm} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">CNN Model Accuracy</p>
                      <div className="text-2xl font-bold">{modelAccuracy.cnn.toFixed(2)}%</div>
                      <Progress value={modelAccuracy.cnn} className="h-2" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      These metrics represent model performance on validation data.
                      Higher values indicate better prediction accuracy.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default ModelMetrics;
