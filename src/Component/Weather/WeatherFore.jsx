import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../Config/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const WeatherFore = () => {
    const [location, setLocation] = useState('');
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentLocations, setRecentLocations] = useState([]);

    // Load recent locations from localStorage on component mount
    useEffect(() => {
        const savedLocations = localStorage.getItem('weatherRecentLocations');
        if (savedLocations) {
            setRecentLocations(JSON.parse(savedLocations));
        }
    }, []);

    const fetchWeather = async () => {
        if (!location.trim()) {
            setError('Please enter a location');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`${API_URL}/weather`, {
                params: { location }
            });
            
            setForecastData(response.data);
            
            // Update recent locations
            const updatedLocations = [
                location,
                ...recentLocations.filter(loc => loc !== location)
            ].slice(0, 5);
            
            setRecentLocations(updatedLocations);
            localStorage.setItem('weatherRecentLocations', JSON.stringify(updatedLocations));
        } catch (err) {
            console.error("Error fetching weather", err);
            setError(err.response?.data?.message || 'Failed to fetch weather data');
            setForecastData(null);
        } finally {
            setLoading(false);
        }
    }

    const forecastDays = forecastData?.forecast?.forecastday || [];

    return (
        <div className='max-w-5xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md'>
            <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
                {forecastData?.location ? 
                    `Weather Forecast for ${forecastData.location.name}, ${forecastData.location.country}` : 
                    'Weather Forecast'}
            </h2>
            
            <div className='flex flex-col sm:flex-row gap-3 mb-6 justify-center items-center'>
                <div className="relative w-full sm:w-80">
                    <Input
                        type="text"
                        placeholder='Enter location (e.g., London, Kathmandu)'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                        className='border border-green-400 py-2 pr-10 w-full'
                        list="recent-locations"
                    />
                    {recentLocations.length > 0 && (
                        <datalist id="recent-locations">
                            {recentLocations.map((loc, index) => (
                                <option key={index} value={loc} />
                            ))}
                        </datalist>
                    )}
                </div>
                
                <Button 
                    onClick={fetchWeather}
                    disabled={loading}
                    className='text-white bg-green-600 hover:bg-green-700 min-w-[120px]'
                >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {loading ? 'Fetching...' : 'Get Forecast'}
                </Button>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
            ) : forecastDays.length > 0 ? (
                <>
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Current Weather</h3>
                        <div className="flex items-center gap-4">
                            <img
                                src={`http:${forecastData.current.condition.icon}`}
                                alt={forecastData.current.condition.text}
                                className="w-16 h-16"
                            />
                            <div>
                                <p className="text-xl font-bold">{forecastData.current.temp_c}°C</p>
                                <p className="text-gray-600">{forecastData.current.condition.text}</p>
                                <p className="text-sm text-gray-500">
                                    Feels like: {forecastData.current.feelslike_c}°C | 
                                    Humidity: {forecastData.current.humidity}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-4">7-Day Forecast</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                        {forecastDays.map((day, index) => (
                            <div
                                key={index}
                                className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition shadow-sm"
                            >
                                <p className="text-sm font-medium text-gray-600">
                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                    {new Date(day.date).toLocaleDateString()}
                                </p>
                                <img
                                    src={`http:${day.day.condition.icon}`}
                                    alt={day.day.condition.text}
                                    className="mx-auto w-10 h-10"
                                />
                                <p className="text-lg font-bold mt-1">{day.day.avgtemp_c}°C</p>
                                <p className="text-sm text-gray-600">{day.day.condition.text}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                    <p>Max: {day.day.maxtemp_c}°C</p>
                                    <p>Min: {day.day.mintemp_c}°C</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                !loading && (
                    <div className="text-center py-10">
                        <p className="text-gray-400 mb-4">No forecast data available</p>
                        <p className="text-sm text-gray-500">
                            Enter a location to see the weather forecast
                        </p>
                    </div>
                )
            )}
        </div>
    )
}

export default WeatherFore;