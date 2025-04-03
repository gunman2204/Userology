"use client";
// import city from '../page'
import React, { useEffect, useState} from 'react'
import { Suspense } from 'react';
import {useRouter} from "next/navigation"
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import CitySearch from "../components/CitySearch";
// const City = () => {

//     
//     return <div cityName={cityName}>{cityName}</div>;
// }
// const temp=()=>{
//     const cityName=City().props.cityName
//     console.log(cityName);
    
//     return(
//     <Suspense cityName={cityName}>
//         <City/>
//     </Suspense>
//     )
// }
export function CityPage(){
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <CitySearch />
      </Suspense>
    );
  }

const CityWeatherPage = ({city}) => {
    const router = useRouter();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [forecast, setForecast] = useState(null);
    // const [cityName,setCityName]=useState('London')   
    // const {} =router.query;
    // console.log(cityName);
    // const searchParams = useSearchParams();
    const cityName = 'London';
    
    


    useEffect(() => {
        console.log(router.query);
        
        if (router.query?.name) {
          setCityName(router.query.name);
        }
      }, []);
    // Fetch current weather data
    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                // Get current weather
                const weatherResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=3274afc2167846f50384a8c08bfcfee1&units=metric`
                );
                setWeatherData(weatherResponse.data);

                // Get coordinates for forecast
                const { lat, lon } = weatherResponse.data.coord;

                // Get 5-day forecast
                const forecastResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=3274afc2167846f50384a8c08bfcfee1&units=metric`
                );

                // Process forecast data to get daily forecasts
                const dailyForecasts = processForecastData(forecastResponse.data.list);
                setForecast(dailyForecasts);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching weather data:", err);
                setError("Failed to fetch weather data. Please try again later.");
                setLoading(false);
            }
        };

        fetchWeather();
    }, [cityName]);


    const processForecastData = (forecastList) => {
        const dailyData = {};

        forecastList.forEach(item => {
            // Get date without time
            const date = item.dt_txt.split(' ')[0];


            if (!dailyData[date] || item.dt_txt.includes('12:00')) {
                dailyData[date] = item;
            }
        });

        return Object.values(dailyData).slice(0, 5); // Return next 5 days
    };


    const getWeatherIcon = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    // Format timestamp to readable date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };


    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };


    const getTemperatureColor = (temp) => {
        if (temp <= 0) return 'from-blue-800 to-blue-500'; // Very cold
        if (temp <= 10) return 'from-blue-600 to-blue-300'; // Cold
        if (temp <= 20) return 'from-green-600 to-blue-300'; // Cool
        if (temp <= 30) return 'from-yellow-500 to-orange-300'; // Warm
        return 'from-red-600 to-orange-400'; // Hot
    };

    // Get weather condition icon and background
    const getWeatherBackground = (condition) => {
        if (!condition) return 'bg-gradient-to-br from-blue-500 to-indigo-700';

        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('clear')) return 'bg-gradient-to-br from-blue-400 to-indigo-600';
        if (conditionLower.includes('cloud')) return 'bg-gradient-to-br from-gray-400 to-gray-600';
        if (conditionLower.includes('rain')) return 'bg-gradient-to-br from-blue-700 to-gray-700';
        if (conditionLower.includes('snow')) return 'bg-gradient-to-br from-blue-100 to-gray-200';
        if (conditionLower.includes('thunderstorm')) return 'bg-gradient-to-br from-purple-800 to-gray-900';
        if (conditionLower.includes('mist') || conditionLower.includes('fog')) return 'bg-gradient-to-br from-gray-300 to-gray-500';

        return 'bg-gradient-to-br from-blue-500 to-indigo-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700">
                <div className="text-white text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    <p className="mt-4 text-xl font-medium">Loading weather information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 className="mt-4 text-xl font-bold text-gray-800">Error</h2>
                    <p className="mt-2 text-gray-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!weatherData) return null;

    // Get temperature and condition for background
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0]?.main;
    const bgClass = getWeatherBackground(condition);
    const tempColor = getTemperatureColor(temp);

    return (
        <div className={`min-h-screen ${bgClass} text-white`}>
            {/* Navigation bar */}
            <header className="bg-black/30 backdrop-blur-sm">
                <div className="container mx-auto p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Weather Forecast</h1>
                    <div className="flex items-center space-x-2">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{weatherData.name}, {weatherData.sys.country}</span>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                {/* Current weather card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            {/* Left side - city & date info */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold">{weatherData.name}</h2>
                                <p className="text-lg opacity-90 mt-1">{formatDate(weatherData.dt)}</p>
                                <div className="flex items-center mt-4">
                                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                        {weatherData.weather[0]?.description}
                                    </div>
                                </div>
                            </div>

                            {/* Right side - temperature */}
                            <div className="mt-6 md:mt-0 flex items-center">
                                <img
                                    src={getWeatherIcon(weatherData.weather[0]?.icon)}
                                    alt={weatherData.weather[0]?.description}
                                    className="w-20 h-20"
                                />
                                <div className="text-6xl font-bold">
                                    {Math.round(weatherData.main.temp)}°C
                                </div>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                                <p className="opacity-75 text-sm">Feels Like</p>
                                <p className="text-xl font-semibold mt-1">{Math.round(weatherData.main.feels_like)}°C</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                                <p className="opacity-75 text-sm">Humidity</p>
                                <p className="text-xl font-semibold mt-1">{weatherData.main.humidity}%</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                                <p className="opacity-75 text-sm">Wind</p>
                                <p className="text-xl font-semibold mt-1">{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
                                <p className="opacity-75 text-sm">Pressure</p>
                                <p className="text-xl font-semibold mt-1">{weatherData.main.pressure} hPa</p>
                            </div>
                        </div>
                    </div>

                    {/* Sunrise/Sunset banner */}
                    <div className={`bg-gradient-to-r ${tempColor} p-6 flex justify-between items-center`}>
                        <div className="flex items-center">
                            <svg className="h-8 w-8 mr-2 text-yellow-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
                            </svg>
                            <div>
                                <p className="text-sm opacity-90">Sunrise</p>
                                <p className="font-medium">{formatTime(weatherData.sys.sunrise)}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <svg className="h-8 w-8 mr-2 text-yellow-200" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                            </svg>
                            <div>
                                <p className="text-sm opacity-90">Sunset</p>
                                <p className="font-medium">{formatTime(weatherData.sys.sunset)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5-day forecast */}
                {forecast && (
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">5-Day Forecast</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {forecast.map((day, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
                                    <div className="p-4">
                                        <p className="font-medium">
                                            {new Date(day.dt_txt).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <img
                                                src={getWeatherIcon(day.weather[0]?.icon)}
                                                alt={day.weather[0]?.description}
                                                className="w-14 h-14"
                                            />
                                            <div className="text-xl font-bold">
                                                {Math.round(day.main.temp)}°C
                                            </div>
                                        </div>
                                        <div className="mt-2 text-center text-sm">
                                            <p className="capitalize">{day.weather[0]?.description}</p>
                                            <div className="flex justify-between mt-2">
                                                <span>H: {Math.round(day.main.temp_max)}°C</span>
                                                <span>L: {Math.round(day.main.temp_min)}°C</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`bg-gradient-to-r ${getTemperatureColor(day.main.temp)} p-2 text-center text-sm`}>
                                        <span>Humidity: {day.main.humidity}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Additional weather information */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-4">Wind & Pressure</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Wind Speed</span>
                                <span className="font-medium">{(weatherData.wind.speed * 3.6).toFixed(1)} km/h</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Wind Direction</span>
                                <span className="font-medium">{weatherData.wind.deg}° ({getWindDirection(weatherData.wind.deg)})</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pressure</span>
                                <span className="font-medium">{weatherData.main.pressure} hPa</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Visibility</span>
                                <span className="font-medium">{(weatherData.visibility / 1000).toFixed(1)} km</span>
                            </div>
                            {weatherData.wind.gust && (
                                <div className="flex justify-between">
                                    <span>Wind Gust</span>
                                    <span className="font-medium">{(weatherData.wind.gust * 3.6).toFixed(1)} km/h</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-4">Temperature & Clouds</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Current Temperature</span>
                                <span className="font-medium">{Math.round(weatherData.main.temp)}°C</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Feels Like</span>
                                <span className="font-medium">{Math.round(weatherData.main.feels_like)}°C</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Min Temperature</span>
                                <span className="font-medium">{Math.round(weatherData.main.temp_min)}°C</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Max Temperature</span>
                                <span className="font-medium">{Math.round(weatherData.main.temp_max)}°C</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cloudiness</span>
                                <span className="font-medium">{weatherData.clouds.all}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 bg-black/30 backdrop-blur-sm py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>Data provided by OpenWeatherMap</p>
                    <p className="mt-2 text-sm opacity-75">Last updated: {new Date().toLocaleString()}</p>
                </div>
            </footer>
        </div>
    );
};

// Function to get wind direction name from degrees
function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((deg % 360) / 45) % 8;
    return directions[index];
}

export default CityWeatherPage;