import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useState } from 'react'
import { API_URL } from '../Config/api';

const WeatherFore = () => {
    const [location, setLocation] = useState('');
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        if (!location.trim()) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/weather?location=${location}`);
            setForecastData(response.data);
        } catch (err) {
            console.error("Error fetching weather", err);
            setForecastData(null);
        } finally {
            setLoading(false);
        }
    }

    const forecastDays = forecastData?.forecast?.forecastday || [];

    return (
        <div className='max-w-5xl mx-auto mt-8 p-6 bg-white rounded-xl'>
            <h2 className='text-2xl font-bold mb-6 text-center'>
                7-Day Weather Forecast {forecastData?.location?.country && `for ${forecastData.location.name}, ${forecastData.location.country}`}
            </h2>
            <div className='flex flex-col sm:flex-row gap-5 mb-6 justify-center items-center'>
                <Input
                    type="text"
                    placeholder='Enter location'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className='border border-green-400 py-2 w-full sm:w-80'
                />
                <Button className='text-black ring' onClick={fetchWeather}>Get Forecast</Button>
            </div>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : forecastDays.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {forecastDays.map((day, index) => (
                        <div
                            key={index}
                            className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition"
                        >
                            <p className="text-lg font-semibold">{day.day.condition.text}</p>
                            <img
                                src={`http:${day.day.condition.icon}`}
                                alt={day.day.condition.text}
                                className="mx-auto w-12 h-12"
                            />
                            <p className="text-xl font-bold">{day.day.avgtemp_c}°C</p>
                            <p className="text-sm text-gray-600">{day.date}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400">No forecast available.</p>
            )}
        </div>
    )
}

export default WeatherFore;
