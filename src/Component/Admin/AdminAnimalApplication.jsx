import { GetAdminAnimalApplication, GetAnimalApplication, resetProductstate } from '../State/Products/ProductsSlice';
import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminAnimalApplication = () => {
  const { isLoading, error, success, animals = [],farmer } = useSelector((state) => state.products);
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    } else {
      dispatch(GetAdminAnimalApplication());
    }
  }, [dispatch, jwt, navigate]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(resetProductstate());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetProductstate());
    }
  }, [error, dispatch]);

  if (isLoading) {
    return <p>Loading animal applications...</p>;
  }


   const handleApproveReject = async (status) => {
      try {
        setProcessing(true);
        const endpoint=activeSubTab=='Animals'
        ?  `${API_URL}/api/admin/updateAnimals/${selectedApp.id}` : `${API_URL}/api/admin/updateVehicle/${selectedApp.id}`;
  
        await axios.put(
          endpoint,
          { status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
          }
        );
  
          const updatedFarmer = { ...farmer };
        const appType = activeSubTab === 'Animals' ? 'pendingAnimals' : 'pendingVehicles';
        updatedFarmer[appType] = updatedFarmer[appType].filter(app => app.id !== selectedApp.id);
        
        setFarmer(updatedFarmer);
        setSelectedApp(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setProcessing(false);
      }
    };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Animal Applications</h2>

      {animals.length === 0 ? (
        <p>No Animal applications found.</p>
      ) : (
        <div className="grid gap-4">
          {animals.map((booking) => (
            <div key={booking.id} className="border rounded-xl p-4 shadow-sm bg-white">
              <h3 className="text-lg font-bold text-center">
                {farmer.name || "Unknown Farmer"}
              </h3>

              <p><strong>Animal Name:</strong> {booking.animalName || "N/A"}</p>

              {booking.image && booking.image.length > 0 ? (
                <img
                  src={booking.image[0]} 
                  alt={booking.animalName || "Animal"}
                  className="w-40 h-40 rounded shadow-md"
                />
              ) : (
                <p>No image available</p>
              )}



              <p>
                <strong>Status:</strong> {booking.isPending ? (
                  <span className="text-white bg-green-600 px-2 rounded">Approved</span>
                ) : (
                  <span className="text-white bg-amber-600 px-2 rounded">Pending</span>
                )}
              </p>

              <p><strong>Age:</strong> {booking.age || "N/A"}</p>
              <p><strong>Milk Per Day:</strong> {booking.milkPerDay || "N/A"}</p>
              <p>
                <strong>Produce Milk:</strong>{" "}
                {booking.produceMilk ? (
                  <button className="bg-green-600 text-black px-2 rounded cursor-default">Produce Milk</button>
                ) : (
                  <button className="bg-yellow-300 text-black px-2 rounded cursor-default">No</button>
                )}
              </p>
              <p><strong>Calves:</strong> {booking.calves || "N/A"}</p>
              <p><strong>Price:</strong> {booking.price || "N/A"}</p>
              <p><strong>Description:</strong> {booking.description || "N/A"}</p>
              <p><strong>Location:</strong> {booking.location?.address || "N/A"}</p>

              <div className="flex justify-center items-center mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApproveReject('Approved')}
                >
                  Approve
                </Button>

                  <Button
                  variant="contained"
                  color="Danger"
                  onClick={() => handleApproveReject('Rejected')}
                >
                  Reject
                </Button>

                    <Button
                  variant="contained"
                  color="Secondary"
                  onClick={() => navigate('adfarmer/' + booking.farmerId )}
                >
                  Farmer Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAnimalApplication;
