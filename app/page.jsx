"use client";
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useRouter } from 'next/navigation';


const Dashboard = () => {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState([

  ]);
  const fetchWeatherData = async () => {
    setLoading(true)
    try {
      const response3 = await Axios.get('https://api.openweathermap.org/data/2.5/weather?q=Tokyo,japan&APPID=3274afc2167846f50384a8c08bfcfee1')
      const response1 = await Axios.get('http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3274afc2167846f50384a8c08bfcfee1')
      const response2 = await Axios.get('http://api.openweathermap.org/data/2.5/weather?q=California,usa&APPID=3274afc2167846f50384a8c08bfcfee1')
      // const response2=await Axios.get('https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=3274afc2167846f50384a8c08bfcfee1')
      // const response2=await Axios.get('http://api.openweathermap.org/data/2.5/weather?q=Newyork,usa&APPID=3274afc2167846f50384a8c08bfcfee1')
      // const response3=await Axios.get('http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3274afc2167846f50384a8c08bfcfee1')
      console.log(response1.data)
      console.log(response2.data)
      console.log(response3.data)
      const data = [];
      data.push(response1.data, response2.data, response3.data)
      console.log('WeatherData fetched successfully', data);
      setWeatherData(data)
      console.log('data', data[0].name);
    } catch (error) {
      console.log(error, error.data);
      setWeatherApiStatus(0);
      toast.error("API request failed!", {
        // position: "top-center",  // Prevents it from appearing on the side
        autoClose: true,        // Stays until user closes it
        closeOnClick: true,
        draggable: true,

      });
    }
    setLoading(false)
  }


  const fetchNewsData = async () => {
    setLoading(true)
    try {
      const response = await Axios.get('https://newsdata.io/api/1/news?apikey=pub_77648d2b499bd3e5856aa6b6ec67f53cb3187&q=crypto ')
      console.log('NewsData fetched successfully', response.data);
      setNewsData(response.data.results);

    } catch (error) {
      console.log(error);
      toast.error("API request failed!", {
        // position: "top-center",  // Prevents it from appearing on the side
        autoClose: true, closeOnClick: true, draggable: true,
      });
    }
    setLoading(false)
  }



  const [cryptoData, setCryptoData] = useState([
    { name: 'Bitcoin', symbol: 'BTC', priceUsd: '$83594.78', changePercent24Hr: '+2.3%', volumeUsd24Hr: '$48.2B', marketCap: '$1.2T' },
    { name: 'Ethereum', symbol: 'ETH', priceUsd: '$3,456.21', changePercent24Hr: '+1.7%', volumeUsd24Hr: '$25.1B', marketCap: '$412.8B' },
    { name: 'Solana', symbol: 'SOL', priceUsd: '$142.65', changePercent24Hr: '-0.8%', volumeUsd24Hr: '$4.9B', marketCap: '$58.7B' },
    { name: 'Cardano', symbol: 'ADA', priceUsd: '$0.45', changePercent24Hr: '+0.5%', volumeUsd24Hr: '$1.2B', marketCap: '$15.9B' },
  ]);
  const fetchCryptoData = async () => {
    setLoading(true)
    try {
      const response = await Axios.get('https://rest.coincap.io/v3/assets?apiKey=69065457f65a8a46ad978756616a873eb037e9176648355a6efd2456767db7ca'
        // aa8f8286-5ba8-47eb-8147-830450af37df'
      );
      setCryptoData(response.data.data);
      console.log("CryptoData fetched successfully", response.data);
    } catch (err) {
      console.error("Error fetching Cryptodata:", err);
      // setError(err);
      toast.error("API request failed!", {
        autoClose: true, closeOnClick: false, draggable: true,
      });
    }
    setLoading(false)
  }
  const reloadPage = () => {
    fetchCryptoData();
  }



  // const [updatedCryptoData, setupdatedCryptoData] = useState([]);
  const [liveMessage, setLiveMessage] = useState()
  const [weatherApiStatus, setWeatherApiStatus] = useState(1);
  const [newsApiStatus, setNewsApiStatus] = useState(1);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    fetchWeatherData();
    fetchNewsData();
    fetchCryptoData();

    // Set up auto-refresh for 60 seconds
    const refreshInterval = setInterval(() => {
      console.log("Running scheduled refresh");
      fetchCryptoData();
      fetchWeatherData();
      fetchNewsData();
    }, 60000); // 60 seconds

    // WebSocket setup
    const socket = new WebSocket('wss://ws.coincap.io/prices?assets=ALL');

    socket.onopen = () => {
      console.log("WebSocket connected");
      socket.send("Hello Server!");
      setLiveMessage('Updating in real time');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Only log meaningful updates
      if (Object.keys(data).length > 0) {
        console.log(`WebSocket message received: ${Object.keys(data).length} assets updated`);
      }

      setCryptoData(prevData => {
        const updatedData = [...prevData];
        let hasUpdates = false;

        Object.entries(data).forEach(([assetId, newPriceStr]) => {
          const assetIdLower = assetId.toLowerCase();

          const cryptoIndex = updatedData.findIndex(crypto =>
            (crypto.id && crypto.id.toLowerCase() === assetIdLower) ||
            (crypto.symbol && crypto.symbol.toLowerCase() === assetIdLower)
          );

          if (assetIdLower === 'bitcoin' || assetIdLower === 'ethereum') {
            console.log(`Looking for ${assetId}: found at index ${cryptoIndex}`);
          }

          if (cryptoIndex !== -1) {
            const crypto = updatedData[cryptoIndex];
            const oldPrice = parseFloat(crypto.priceUsd);
            const newPrice = parseFloat(newPriceStr);

            if (!isNaN(newPrice) && oldPrice !== newPrice) {
              updatedData[cryptoIndex] = {
                ...crypto,
                priceUsd: newPriceStr
              };

              if (crypto.symbol === 'BTC' || crypto.id === 'bitcoin') {
                if (newPrice > oldPrice) {
                  toast.success(`Bitcoin price increased to $${newPrice.toFixed(2)}`, {
                    autoClose: 1000, closeOnClick: true, draggable: true
                  });
                } else {
                  toast.error(`Bitcoin price decreased to $${newPrice.toFixed(2)}`, {
                    autoClose: 1000, closeOnClick: true, draggable: true
                  });
                }
              }
              else if (crypto.symbol === 'ETH' || crypto.id === 'ethereum') {
                if (newPrice > oldPrice) {
                  toast.success(`Ethereum price increased to $${newPrice.toFixed(2)}`, {
                    autoClose: 1000, closeOnClick: true, draggable: true
                  });
                } else {
                  toast.error(`Ethereum price decreased to $${newPrice.toFixed(2)}`, {
                    autoClose: 1000, closeOnClick: true, draggable: true
                  });
                }
              }

              hasUpdates = true;
            }
          }
        });

        return hasUpdates ? updatedData : prevData;
      });
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLiveMessage('Connection failed: Try reloading the page');
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setLiveMessage('Connection closed');
    };

    // Clean up function when component unmounts
    return () => {
      clearInterval(refreshInterval); // Clear the interval

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log("WebSocket disconnected");
      }
    };
  }, []); // Empty dependency array - only run on mount


  const [newsData, setNewsData] = useState([
    { title: 'Bitcoin ETF inflows reach new record high this week', source: 'CoinDesk', time: '2 hours ago' },
    { title: 'SEC approves new crypto trading regulations', source: 'Bloomberg', time: '4 hours ago' },
  ]);

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-gray-100 ${loading ? 'opacity-30' : ''}`}>
      {/* Section 1: Left Sidebar - Weather */}
      <aside className="w-full lg:w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-4 lg:min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Weather
          </h1>
          {weatherApiStatus === 0 ? <p className='text-red-500'>Weather API is not responding</p> : <p className='text-green-500'>Weather API is responding</p>}
        </div>
        {weatherData.map((weather, index) => (
          <div onClick={() => {router.push('/city')}} className="space-y-6 mt-9 border-t-* border-black-500" key={index}>
            <h2  className="text-xl text-center font-medium">{weather.name}</h2>
            <div className="flex justify-between items-center">
              {/* <span className="text-xs bg-blue-500 px-2 py-1 rounded">Now</span> */}
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">{weather.main.temp}°C</div>
                <div className="text-lg mt-2">{weather.weather[0].description}</div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-200">Humidity</div>
                <div className="font-medium">{weather.main.humidity}%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-200">Wind</div>
                <div className="font-medium">{weather.wind.speed} m/s</div>
              </div>
            </div>
          </div>
        ))}
        <div />

      </aside>


      {/* Section 2: Main Content - Cryptocurrency Data */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 lg:mb-0">Cryptocurrency Market</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search cryptocurrency..." className="bg-white border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <button onClick={reloadPage} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150">
              Refresh
            </button>
          </div>
        </div>
        <ToastContainer />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Market Cap</p>
                <p className="text-2xl font-bold text-gray-800">$2.41T</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-green-500 flex items-center mt-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              3.2% increase
            </p>
          </div>

          {loading && (
            <div className="opacity-100 fixed inset-0 flex items-center justify-center bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {loading && (
                  <ClipLoader color="#2563eb" size={50} className="mt-4 " />
                )}
              </div>
            </div>
          )}


          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">24h Trading Volume</p>
                <p className="text-2xl font-bold text-gray-800"></p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-500 flex items-center mt-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              5.7% increase
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bitcoin Dominance</p>
                <p className="text-2xl font-bold text-gray-800">48.2%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-red-500 flex items-center mt-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              0.8% decrease
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Cryptocurrencies</p>
                <p className="text-2xl font-bold text-gray-800">{(cryptoData) ? cryptoData.length : 4}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656.126-1.283.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-500 flex items-center mt-4 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              124 new this month
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Top Cryptocurrencies</h3>
            <span className='text-gray-800'>{liveMessage}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price($)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (24h) ($)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap($)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cryptoData && cryptoData.map((crypto) => (
                  <tr key={crypto.symbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                          {crypto.symbol.substring(0, 1)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                          <div className="text-sm text-gray-500">{crypto.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{parseFloat(crypto.priceUsd).toFixed(4)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${crypto.changePercent24Hr > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(crypto.changePercent24Hr) > 0 ? '+' : ''}{parseFloat(crypto.changePercent24Hr).toFixed(4)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(parseFloat(crypto.volumeUsd24Hr) / 1000000000).toFixed(4)}B</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(parseFloat(crypto.marketCapUsd) / 1000000000).toFixed(4)}B</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
            <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">View All Cryptocurrencies →</button>
          </div>
        </div>
      </main>


      {/* Section 3: Right Sidebar - News */}

      <aside className="w-full lg:w-80 bg-white border-l border-gray-200 p-4">
        <div className="sticky top-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Crypto News</h3>
            <span className="text-sm text-gray-500">Updated 5 min ago</span>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {newsData.map((news, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <h4 className="text-base font-medium text-gray-900 mb-2">{news.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{news.source}</span>
                  <span className="text-xs text-gray-400">{news.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="text-base font-medium text-gray-900 mb-2">Subscribe to News</h4>
            <p className="text-sm text-gray-600 mb-4">Get daily updates on cryptocurrency market trends and news.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-l-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition duration-150">
                Subscribe
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-base font-medium text-gray-900 mb-3">Market Sentiment</h4>
            <div className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full mb-2">
              <div className="bg-white h-full w-2 rounded-full" style={{ marginLeft: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Bullish</span>
              <span>Bearish</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Market sentiment is currently 65% bullish based on social media analysis.</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;

