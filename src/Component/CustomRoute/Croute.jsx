import React from 'react'
import HeaderNav from '../HeaderNav'
import { Route, Routes } from 'react-router-dom'
import HeroMain from '../Hero/HeroMain'
import Auth from '../Auth/Auth'
import Layout from '../Layout'
import Services from '../Services/Services'
import Mainss from '../Hero/Mainss'
import VehicleBooking from '../Booking/VehicleBooking'
import ScheduleTask from '../Task/ScheduleTask'
import PlantDiseases from '../Prediction/PlantDiseases'
import Profile from '../Profile/Profile'
import WeatherFore from '../Weather/WeatherFore'
import Dashboard from '../Dashboard/Dashboard'
import AddProduct from '../Admin/AddProduct'
import MainLanding from '../Dashboard/MainLanding'
import DisplayProduct from '../Admin/DisplayProduct'
import UpdateProduct from '../Admin/UpdateProduct'
import AddVehicle from '../Admin/Vehicle/AddVehicle'
import Application from '../Admin/Vehicle/Application'
import CropPredictorForm from '../Predict/CropPredictorForm'
import CattleDisease from '../Predict/CattleDisease'
import AddAnimal from '../Admin/AddAnimal'
import AnimalApplication from '../Admin/AnimalApplication'
import FarmerDetails from '../FarmerReg/FarmerDetails'
import Wages from '../Wages'
import AdDashboard from '../Dashboard/AdminDashboard/AdDashboard'
import AdLandingPage from '../Dashboard/AdminDashboard/AdLandingPage'
import { AdminRoute } from '../Adminroute'
import FetchFarmers from '../Admin/FetchFarmer/FetchFarmers'
import FarmerDeta from '../Admin/FetchFarmer/FarmerDeta'
import ChatPage from '../Admin/ChatPage'
import RecentChatsList from '../Admin/Vehicle/RecentChatList'
import FetchFarm from '../FarmerReg/FetchFarm'
import FarmerD from '../FarmerReg/FarmD'

function Croute() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout><Mainss/></Layout>}/>
        <Route path="/account/:register" element={<Layout><Mainss/></Layout>}/>
        <Route path="/farmer/:slug" element={<Layout><FarmerDetails/></Layout>}/>
        <Route path="/account/:register" element={<Layout><Mainss/></Layout>}/>
        <Route path="/account/farmerRegister" element={<Layout><VehicleBooking/></Layout>}/>
        <Route path="/vehicleBooking" element={<Layout><VehicleBooking/></Layout>}/>
        <Route path="/schedule" element={<Layout><ScheduleTask/></Layout>}/>
        <Route path="/plantdisease" element={<Layout><PlantDiseases/></Layout>}/>
        <Route path="/profile" element={<Layout><Profile/></Layout>}/>
        <Route path="/dashboard" element={<Dashboard><MainLanding/></Dashboard>}/>
        <Route path="/wages" element={<Dashboard><Wages/></Dashboard>}/>


        <Route path="/farmers/addProduct" element={<Dashboard><AddProduct/></Dashboard>}/>
        <Route path="/farmer/addAnimal" element={<Dashboard><AddAnimal/></Dashboard>}/>
        <Route path="/farmer/addAnimal/:id" element={<Dashboard><AddAnimal/></Dashboard>}/>
        <Route path="/farmer/viewProduct" element={<Dashboard><DisplayProduct/></Dashboard>}/>
        <Route path="/farmer/addVehicle" element={<Dashboard><AddVehicle/></Dashboard>}/>
        <Route path="/farmer/addVehicle/:id" element={<Dashboard><AddVehicle/></Dashboard>}/>
        <Route path="/farmer/cropPredict" element={<Dashboard><CropPredictorForm/></Dashboard>}/>
        <Route path="/farmer" element={<Dashboard><FetchFarm/></Dashboard>}/>

        <Route path="/farmer/vehicleApplication" element={<Dashboard><Application/></Dashboard>}/>
        <Route path="/farmer/animalApplication" element={<Dashboard><AnimalApplication/></Dashboard>}/>
        <Route path="/farmer/predictCattle" element={<Dashboard><CattleDisease/></Dashboard>}/>
        <Route path="/farmerss/:slug" element={<Dashboard><FarmerD/></Dashboard>}/>

        <Route path="/weather" element={<Layout><WeatherFore/></Layout>}/>
<Route path='/messages/:farmerId' element={<ChatPage/>} />
<Route path='/chatbox/:farmerId' element={<RecentChatsList/>} />
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdDashboard />}>
    <Route index element={<AdLandingPage />} />
    <Route path="dashboard" element={<AdLandingPage />} />
    <Route path="farmers" element={<FetchFarmers />} />
    <Route path="adfarmer/:slug" element={<FarmerDeta />} /> 
  </Route>
</Route>
</Routes>
      <Auth/>
    </div>
  )
}

export default Croute
