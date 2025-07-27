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
import FarmerVehicle from '../Booking/FarmerVehicle'
import Booking from '../FarmerReg/Booking'
import FarmerBookingsDashboard from '../FarmerReg/FarmerBookingDashboard'
import CheckoutPage from '../FarmerReg/CheckoutPage'
import FarmerJobCreationForm from '../FarmerReg/FarmerJobCreationForm'
import FarmerWorkRequests from '../Admin/FetchFarmer/FarmerWorkRequests'
import CreateWorkerProfile from '../Profile/CreateWorkerProfile'
import WorkerProfile from '../Profile/WorkerProfile'
import WorkerApplications from '../WageApplication/WorkerApplications'
import { PendingRetailerRoute, RetailerRoute } from '../Weather/RetailerRoute'
import RetailerDashboard from '../Retailer/RetailerDashboard/RetailerDashboard'
import RetailerLanding from '../Retailer/RetailerDashboard/RetailerLanding'
import RetailerRegistrationForm from '../Retailer/RetailerDashboard/RetailerRegistrationForm'
import ApplicationStatus from '../Retailer/RetailerDashboard/ApplicationStatus'
import AdminApplications from '../Admin/AdminApplication'
import AnimalMarketplace from '../FarmerReg/AnimalMarketPlace'
import AdminAnimalApplication from '../Admin/AdminAnimalApplication'
import FarmerAnimalRequest from '../Admin/FetchFarmer/FarmerAnimalRequest'
import FarmerOrders from '../FarmerReg/FarmerOrders'
import UserOrders from '../Orders/UserOrders'
import { PaymentStatusPage } from '../Services/PaymentStatusPage'
import OurFarm from '../FarmerReg/OurFarm'

function Croute() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout><Mainss/></Layout>}/>
        <Route path="/account/:register" element={<Layout><Mainss/></Layout>}/>
        <Route path="/farmer/:slug" element={<Layout><FarmerDetails/></Layout>}/>
        <Route path="/account/:register" element={<Layout><Mainss/></Layout>}/>
        <Route path="/booking" element={<Layout><Booking/></Layout>}/>
        <Route path="/farmer/farmerBookings" element={<Dashboard><FarmerBookingsDashboard/></Dashboard>}/>
        <Route path="/account/farmerRegister" element={<Layout><VehicleBooking/></Layout>}/>
        <Route path="/vehicleBooking" element={<Layout><VehicleBooking/></Layout>}/>
        <Route path="/schedule" element={<Layout><ScheduleTask/></Layout>}/>
        <Route path="/plantdisease" element={<Layout><PlantDiseases/></Layout>}/>
        <Route path="/profile" element={<Layout><Profile/></Layout>}/>
        <Route path="/createWork" element={<Layout><CreateWorkerProfile/></Layout>}/>
        <Route path="/workerProfile" element={<Layout><WorkerProfile/></Layout>}/>
        <Route path="/dashboard" element={<Dashboard><MainLanding/></Dashboard>}/>
        <Route path="/wages" element={<Layout><Wages/></Layout>}/>
         <Route path="/orders" element={<Layout><UserOrders/></Layout>}/>
         <Route path="/ourfarms" element={<Layout><OurFarm/></Layout>}/>

         <Route path="payment-status" element={<Layout><PaymentStatusPage/></Layout>}></Route>

          <Route path="/animalMarket" element={<Layout><AnimalMarketplace/></Layout>}/>

        <Route path="/workerApplication" element={<Layout><WorkerApplications
        /></Layout>}/>

        <Route path="/farmer/registerWages" element={<Dashboard><FarmerJobCreationForm/></Dashboard>}/>


        <Route path="/farmers/addProduct" element={<Dashboard><AddProduct/></Dashboard>}/>
        <Route path="/farmer/workRequest" element={<Dashboard><FarmerWorkRequests/></Dashboard>}/>
        <Route path="/farmer/addAnimal" element={<Dashboard><AddAnimal/></Dashboard>}/>
        <Route path="/farmer/addAnimal/:id" element={<Dashboard><AddAnimal/></Dashboard>}/>
        <Route path="/farmer/viewProduct" element={<Dashboard><DisplayProduct/></Dashboard>}/>
        <Route path="/farmer/addVehicle" element={<Dashboard><AddVehicle/></Dashboard>}/>
        <Route path="//checkout" element={<Layout><CheckoutPage/></Layout>}/>
        <Route path="/farmer/addVehicle/:id" element={<Dashboard><AddVehicle/></Dashboard>}/>
        <Route path="/farmer/cropPredict" element={<Dashboard><CropPredictorForm/></Dashboard>}/>
        <Route path="/farmer" element={<Dashboard><FetchFarm/></Dashboard>}/>

        <Route path="/farmer/vehicleApplication" element={<Dashboard><Application/></Dashboard>}/>
        <Route path="/farmer/animalApplication" element={<Dashboard><AnimalApplication/></Dashboard>}/>
                <Route path="/farmer/animalRequest" element={<Dashboard><FarmerAnimalRequest/></Dashboard>}/>

        <Route path="/farmer/predictCattle" element={<Dashboard><CattleDisease/></Dashboard>}/>
        <Route path="/farmerss/:slug" element={<Dashboard><FarmerD/></Dashboard>}/>
        <Route path="/farmersVehicle" element={<Dashboard><FarmerVehicle/></Dashboard>}/>
        <Route path="/farmer/Orders" element={<Dashboard><FarmerOrders/></Dashboard>}/>


        <Route path="/weather" element={<Layout><WeatherFore/></Layout>}/>
<Route path="/messages/:farmerId" element={<ChatPage />} />
<Route path='/messages' element={<ChatPage/>} />

<Route path='/chatbox/:farmerId' element={<RecentChatsList/>} />
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdDashboard />}>
    <Route index element={<AdLandingPage />} />
    <Route path="dashboard" element={<AdLandingPage />} />
    <Route path="farmers" element={<FetchFarmers />} />
    <Route path="retailerApplication" element={<AdminApplications />} />
    <Route path="adfarmer/:slug" element={<FarmerDeta />} /> 
        <Route path="animalApplication" element={<AdminAnimalApplication />} /> 

  </Route>
</Route>


      <Route path="/retailer/register" element={<RetailerRegistrationForm />} />

 <Route element={<PendingRetailerRoute />}>
        <Route path="/retailer/application-status" element={<ApplicationStatus />} />
      </Route>

<Route element={<RetailerRoute/>}>
<Route path="/retailer" element={<RetailerDashboard/>}>
<Route index element={<RetailerLanding/>}/>
{/* <Route path='dashboard' element={<RetailerDashboard/>} /> */}

</Route>
</Route>

</Routes>
      <Auth/>
    </div>
  )
}

export default Croute
