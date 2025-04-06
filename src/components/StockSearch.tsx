
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { searchStocks, POPULAR_STOCKS } from '@/lib/stockService';
import { Search } from 'lucide-react';

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
  isLoading: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock, isLoading }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const searchHandler = async () => {
      if (query.length >= 2) {
        const matchedStocks = await searchStocks(query);
        setResults(matchedStocks);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };

    searchHandler();
  }, [query]);

  const handleSelectStock = (symbol: string) => {
    setQuery(symbol);
    setShowDropdown(false);
    onSelectStock(symbol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query && !isLoading) {
      onSelectStock(query.includes('.NS') ? query : `${query}.NS`);
    }
  };

  return (
    <Card className="p-4 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="stock-search" className="text-sm font-medium">
            Enter Indian Stock Symbol
          </label>
          <div className="relative">
            <Input
              id="stock-search"
              type="text"
              placeholder="e.g., RELIANCE.NS, TCS.NS"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="pr-10"
              disabled={isLoading}
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        {showDropdown && results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            {results.map((stock) => (
              <button
                key={stock}
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleSelectStock(stock)}
              >
                {stock}
              </button>
            ))}
          </div>
        )}

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Predict Stock Prices'}
          </Button>
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">Popular Stocks:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_STOCKS.slice(0, 6).map((stock) => (
              <Button
                key={stock}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectStock(stock)}
                disabled={isLoading}
              >
                {stock.split('.')[0]}
              </Button>
            ))}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default StockSearch;
