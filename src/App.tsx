import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  RefreshCw, 
  Coins, 
  BarChart3,
  ExternalLink,
  Activity,
  Star,
  Globe,
  LogOut,
  ChevronRight,
  Lock,
  Flame,
  ArrowDownCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: {
    price: number[];
  };
}

// --- API ---
const fetchCoins = async (currency: string): Promise<Coin[]> => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`
  );
  return data;
};

// --- Components ---

const Sparkline = React.memo(({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length === 0) return null;
  
  const min = useMemo(() => Math.min(...data), [data]);
  const max = useMemo(() => Math.max(...data), [data]);
  const range = (max - min) || 1;
  const width = 200;
  const height = 48;
  
  const points = useMemo(() => {
    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
  }, [data, min, range]);

  return (
    <div className="h-12 w-full overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="none" 
        className="w-full h-full opacity-80"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
});

const CoinCard = React.memo(({ coin, currencySymbol, isFavorite, onToggleFavorite }: { 
  coin: Coin, 
  currencySymbol: string, 
  isFavorite: boolean, 
  onToggleFavorite: (id: string) => void 
}) => {
  return (
    <div className="glass-panel p-5 group hover:border-blue-500/30 transition-all hover:-translate-y-1 duration-300 crypto-card-gradient">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={coin.image} 
              alt={coin.name} 
              className="w-10 h-10 rounded-full bg-white/10 p-1" 
              loading="lazy"
            />
            <button 
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(coin.id);
              }}
              className="absolute -top-1 -right-1 p-1 bg-[#030712] rounded-full border border-white/10 hover:border-amber-500/50 transition-colors"
            >
              <Star className={cn(
                "w-3 h-3", 
                isFavorite ? "text-amber-500 fill-amber-500" : "text-slate-600"
              )} />
            </button>
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{coin.name}</h3>
            <span className="text-xs text-slate-500 uppercase font-mono">{coin.symbol}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block mb-1">Rank #{coin.market_cap_rank}</span>
          <div className={cn(
            "flex items-center justify-end gap-1 text-sm font-medium",
            coin.price_change_percentage_24h_in_currency > 0 ? "text-green-400" : "text-red-400"
          )}>
            {coin.price_change_percentage_24h_in_currency > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(coin.price_change_percentage_24h_in_currency).toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-white mb-1">
          {currencySymbol}{coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
        <div className="flex gap-2">
          <div className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
            coin.price_change_percentage_1h_in_currency > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            1H: {coin.price_change_percentage_1h_in_currency?.toFixed(1)}%
          </div>
          <div className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
            coin.price_change_percentage_7d_in_currency > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            7D: {coin.price_change_percentage_7d_in_currency?.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] text-slate-600 uppercase font-bold mb-2 tracking-widest">7-Day Trend</p>
        <Sparkline 
          data={coin.sparkline_in_7d.price} 
          color={coin.price_change_percentage_7d_in_currency > 0 ? '#4ade80' : '#f87171'} 
        />
      </div>

      <a 
        href={`https://www.coingecko.com/en/coins/${coin.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors py-2 rounded-lg bg-white/5"
      >
        View Details <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
});

export default function App() {
  const [search, setSearch] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [activeTab, setActiveTab] = useState<'all' | 'gainers' | 'losers' | 'favorites'>('all');
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('crypto-user');
  });
  const [userNameInput, setUserNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(16);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('crypto-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { data: coins, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['coins', currency],
    queryFn: () => fetchCoins(currency),
    refetchInterval: 60000,
  });

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (userNameInput.trim() && passwordInput.trim()) {
      setUser(userNameInput);
      localStorage.setItem('crypto-user', userNameInput);
    }
  }, [userNameInput, passwordInput]);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('crypto-user');
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      localStorage.setItem('crypto-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    
    return coins.filter(coin => {
      const matchesSearch = coin.name.toLowerCase().includes(search.toLowerCase()) ||
                           coin.symbol.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeTab === 'favorites' ? favorites.includes(coin.id) : true;
      return matchesSearch && matchesTab;
    }).sort((a, b) => {
      if (activeTab === 'gainers') {
        return b.price_change_percentage_24h_in_currency - a.price_change_percentage_24h_in_currency;
      }
      if (activeTab === 'losers') {
        return a.price_change_percentage_24h_in_currency - b.price_change_percentage_24h_in_currency;
      }
      return 0;
    });
  }, [coins, search, activeTab, favorites]);

  const currencySymbol = currency === 'usd' ? '$' : '₹';

  const [isSignUp, setIsSignUp] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#030712]">
        <div className="max-w-md w-full glass-panel p-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
            <Coins className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">CryptoPulse</h1>
          <p className="text-slate-400 mb-8 text-sm">
            {isSignUp ? "Create your account to start tracking." : "Welcome back! Please sign in to continue."}
          </p>
          
          <div className="flex bg-white/5 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setIsSignUp(false)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                !isSignUp ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsSignUp(true)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                isSignUp ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 glass-panel bg-white/5 outline-none focus:border-blue-500/50 transition-all text-base"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name"
                className="w-full px-4 py-3 glass-panel bg-white/5 outline-none focus:border-blue-500/50 transition-all text-base"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-3 glass-panel bg-white/5 outline-none focus:border-blue-500/50 transition-all text-base"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
            >
              {isSignUp ? "Create Account" : "Sign In to Dashboard"} 
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            CNA Lab Project | v1.2.0
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Welcome back, <span className="text-blue-400 capitalize">{user}</span>
            </h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              Portfolio Overview <button onClick={handleLogout} className="hover:text-red-400 transition-colors flex items-center gap-1 ml-2 text-xs border border-white/5 px-2 py-0.5 rounded-full"><LogOut className="w-3 h-3" /> Log Out</button>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 glass-panel p-1">
            <button 
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-4 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-wider",
                activeTab === 'all' ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"
              )}
            >
              All Assets
            </button>
            <button 
              onClick={() => setActiveTab('gainers')}
              className={cn(
                "px-4 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2",
                activeTab === 'gainers' ? "bg-green-600 text-white" : "text-slate-500 hover:text-white"
              )}
            >
              <Flame className="w-3 h-3" />
              Gainers
            </button>
            <button 
              onClick={() => setActiveTab('losers')}
              className={cn(
                "px-4 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2",
                activeTab === 'losers' ? "bg-red-600 text-white" : "text-slate-500 hover:text-white"
              )}
            >
              <ArrowDownCircle className="w-3 h-3" />
              Losers
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={cn(
                "px-4 py-2 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2",
                activeTab === 'favorites' ? "bg-amber-500 text-black" : "text-slate-500 hover:text-white"
              )}
            >
              <Star className={cn("w-3 h-3", activeTab === 'favorites' && "fill-current")} />
              Watchlist
            </button>
          </div>

          <div className="flex items-center gap-2 glass-panel p-1">
            <Globe className="w-4 h-4 text-slate-500 ml-2" />
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none pr-2 cursor-pointer"
            >
              <option value="usd" className="bg-[#030712]">USD</option>
              <option value="inr" className="bg-[#030712]">INR</option>
            </select>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-11 pr-4 py-3 w-full md:w-48 glass-panel outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isFetching}
            className="glass-button p-3 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-5 h-5", isFetching && "animate-spin")} />
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Active Coins</p>
            <p className="text-2xl font-bold">{coins?.length || 0}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Market Cap Rank</p>
            <p className="text-2xl font-bold">Top 100</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Market Status</p>
            <p className="text-2xl font-bold uppercase tracking-tight">Global Live</p>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 animate-pulse">Fetching market data...</p>
        </div>
      ) : isError ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-red-400 font-medium">Failed to load market data.</p>
          <button onClick={() => refetch()} className="text-blue-400 hover:underline mt-2">Try again</button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCoins?.slice(0, visibleCount).map((coin) => (
              <CoinCard 
                key={coin.id}
                coin={coin}
                currencySymbol={currencySymbol}
                isFavorite={favorites.includes(coin.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          
          {filteredCoins && visibleCount < filteredCoins.length && (
            <div className="flex justify-center pb-12">
              <button 
                onClick={() => setVisibleCount(prev => prev + 16)}
                className="group flex flex-col items-center gap-4 hover:opacity-80 transition-all"
              >
                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold uppercase tracking-widest flex items-center gap-3 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                  Load More Assets
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-slate-600 text-xs font-mono">
                  Showing {visibleCount} of {filteredCoins.length} coins
                </p>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-24 py-8 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm">
          Built with React & Tailwind CSS for CNA Lab. Data via CoinGecko API.
        </p>
      </footer>
    </div>
  );
}
