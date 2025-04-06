
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Stock Oracle</h3>
              <p className="text-sm text-muted-foreground">
                Advanced stock price predictions for Indian markets using state-of-the-art machine learning models.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Technologies</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>TensorFlow.js</li>
                <li>LSTM Neural Networks</li>
                <li>CNN Models</li>
                <li>React + TypeScript</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Important Note</h3>
              <p className="text-sm text-muted-foreground">
                This is a demo application. Predictions should not be used for actual investment decisions.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Data Source</h3>
              <p className="text-sm text-muted-foreground">
                Stock data simulated for demonstration purposes. In a production environment, it would be connected to real financial APIs.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Stock Oracle. This is a demonstration application.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
