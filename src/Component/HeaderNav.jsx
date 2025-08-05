import { Button } from "@/components/ui/button";
import { AccountCircleOutlined } from "@mui/icons-material";
import { LogOutIcon, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./State/authSlice";
import { fetchFarmers, fetchLoggedInFarmer, resetFarmer } from "./State/Farmer/FarmerSlie";
import useUpdateLocation from "./FarmerReg/useLocationUpdater";
import { resetWages } from "./State/Wages/Wages";
import { resetBooking } from "./State/Booking/BookingSlice";
import { FaShoppingCart } from "react-icons/fa";
import { WiDaySunny } from "react-icons/wi";
import axios from "axios";
import { API_URL } from "./Config/api";

const HeaderNav = () => {
  const { jwt, user } = useSelector((state) => state.auth);
  const isLoggedIn = !!jwt;
  const name = user?.fullName;
  const { farmer } = useSelector((state) => state.farmer);
  const first = user ? name.slice(0, 2).toUpperCase() : "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useUpdateLocation(isLoggedIn, jwt);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

useEffect(() => {
  const fetchWeather = async (locationParam) => {
    try {
      const response = await axios.get(`${API_URL}/weather`, {
        params: { location: locationParam }
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      () => {
        console.warn("Location denied. Using Kathmandu as fallback.");
        fetchWeather("Kathmandu");
      }
    );
  } else {
    console.warn("Geolocation not supported. Using Kathmandu.");
    fetchWeather("Kathmandu");
  }
}, []);


console.log("Weather",weatherData);
  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (jwt) {
      dispatch(fetchLoggedInFarmer());
    }
  }, [dispatch, jwt]);

  const handleLogout = () => {
    dispatch(resetFarmer());
    dispatch(logout());
    dispatch(resetWages());
    dispatch(resetBooking());
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Navigation items
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Our Farms", path: "/ourfarms" },
    { label: "Orders", path: "/orders" },
  ];

  const servicesItems = [
    { label: "Book Vehicle", path: "/vehicleBooking" },
    { label: "Task Scheduling", path: "/schedule" },
    { label: "Weather Forecast", path: "/weather" },
    { label: "Crop Prediction", path: "/farmer/cropPredict" },
    { label: "Wages", path: "/wages" },
  ];

  const productItems = [
    { label: "Dairy Products", path: "/products/dairy" },
    { label: "Field Products", path: "/products/field" },
    { label: "Animal Waste", path: "/products/animal-waste" },
  ];

  const diseaseItems = [
    { label: "Plant Disease", path: "/plantdisease" },
    { label: "Cattle Disease", path: "/farmer/predictCattle" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-800 text-white px-6 py-3 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <span className="text-xl font-bold">Kishan ko Sarathi</span>
 {weatherData && (
  <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-2xl shadow-xl p-4 w-72 text-white">
    
    {/* Title & Date */}
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg font-semibold">Today’s Weather</h3>
      <span className="text-xs opacity-80">
        {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>
    </div>

    {/* Main Weather Info */}
    <div className="flex items-center gap-4">
      {/* Icon */}
      <img
        src={`http:${weatherData.current.condition.icon}`}
        alt={weatherData.forecast.forecastday.day.condition.text}
        className="w-14 h-14 drop-shadow-md"
      />

      {/* Temp & Condition */}
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{weatherData.current.temp_c}°C</span>
        <span className="text-sm italic opacity-90">{weatherData.current.condition.text}</span>
      </div>
    </div>

    {/* Divider */}
    <div className="my-3 h-px bg-white/30"></div>

    {/* Extra Info */}
    <div className="flex justify-between text-xs opacity-90">
      <div>
        <p className="font-medium">Feels like</p>
        <p>{weatherData.current.feelslike_c}°C</p>
      </div>
      <div>
        <p className="font-medium">Humidity</p>
        <p>{weatherData.current.humidity}%</p>
      </div>
    </div>
  </div>
)}


        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">{currentTime}</div>
          
          {jwt || name || user ? (
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1 hover:text-gray-300 transition"
            >
              <LogOutIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <div className="flex gap-4">
              <Link to="account/login" className="hover:underline">Login</Link>
              <Link to="account/register" className="hover:underline">Register</Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-green-600 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-white">FarmVerse</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {farmer ? (
              <Link 
                to="/dashboard" 
                className="px-3 py-2 bg-white text-green-700 rounded-md font-medium hover:bg-green-50 transition"
              >
                {farmer?.name}
              </Link>
            ) : (
              <Link 
                to="/account/farmerRegister" 
                className="px-3 py-2 bg-white text-green-700 rounded-md font-medium hover:bg-green-50 transition"
              >
                Register as Farmer
              </Link>
            )}
            
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="text-white hover:underline font-medium"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Services Dropdown */}
            <div className="relative group">
              <button className="text-white hover:underline font-medium flex items-center gap-1">
                Services <span className="text-xs">▼</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                {servicesItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Products Dropdown */}
            <div className="relative group">
              <button 
                className="text-white hover:underline font-medium flex items-center gap-1"
                onClick={() => handleDropdown('product')}
              >
                Products <span className="text-xs">▼</span>
              </button>
              <div className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ${activeDropdown === 'product' ? 'block' : 'hidden'} group-hover:block`}>
                {productItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Diseases Dropdown */}
            <div className="relative group">
              <button className="text-white hover:underline font-medium flex items-center gap-1">
                Diseases <span className="text-xs">▼</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                {diseaseItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-2 text-gray-800 hover:bg-green-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* User Profile and Cart */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
                title={name}
              >
                {first || <AccountCircleOutlined />}
              </button>
              
              <button 
                onClick={() => navigate("/checkout")}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg text-white transition"
              >
                <FaShoppingCart />
                <span>Cart</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={() => navigate("/checkout")}
              className="flex items-center gap-1 bg-green-700 hover:bg-green-800 px-3 py-2 rounded-lg text-white"
            >
              <FaShoppingCart />
            </button>
            
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-green-700 px-4 py-3 animate-slide-down">
            <ul className="space-y-3">
              {farmer ? (
                <li>
                  <Link 
                    to="/dashboard" 
                    onClick={toggleMenu}
                    className="block px-3 py-2 bg-white text-green-700 rounded-md font-medium"
                  >
                    {farmer?.name}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link 
                    to="/account/farmerRegister" 
                    onClick={toggleMenu}
                    className="block px-3 py-2 bg-white text-green-700 rounded-md font-medium"
                  >
                    Register as Farmer
                  </Link>
                </li>
              )}
              
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    onClick={toggleMenu}
                    className="block px-3 py-2 text-white hover:bg-green-600 rounded-md"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              
              <li className="relative">
                <button 
                  className="w-full text-left px-3 py-2 text-white hover:bg-green-600 rounded-md flex justify-between items-center"
                  onClick={() => handleDropdown('mobileServices')}
                >
                  Services
                  <span className="text-xs">▼</span>
                </button>
                {activeDropdown === 'mobileServices' && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {servicesItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={toggleMenu}
                          className="block px-3 py-2 text-white hover:bg-green-600 rounded-md"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              
              <li className="relative">
                <button 
                  className="w-full text-left px-3 py-2 text-white hover:bg-green-600 rounded-md flex justify-between items-center"
                  onClick={() => handleDropdown('mobileProducts')}
                >
                  Products
                  <span className="text-xs">▼</span>
                </button>
                {activeDropdown === 'mobileProducts' && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {productItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={toggleMenu}
                          className="block px-3 py-2 text-white hover:bg-green-600 rounded-md"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              
              <li className="relative">
                <button 
                  className="w-full text-left px-3 py-2 text-white hover:bg-green-600 rounded-md flex justify-between items-center"
                  onClick={() => handleDropdown('mobileDiseases')}
                >
                  Diseases
                  <span className="text-xs">▼</span>
                </button>
                {activeDropdown === 'mobileDiseases' && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {diseaseItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={toggleMenu}
                          className="block px-3 py-2 text-white hover:bg-green-600 rounded-md"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              
              <li>
                <button 
                  onClick={() => {
                    navigate("/profile");
                    toggleMenu();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-green-600 rounded-md"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold">
                    {first || <AccountCircleOutlined />}
                  </div>
                  <span>Profile</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default HeaderNav;