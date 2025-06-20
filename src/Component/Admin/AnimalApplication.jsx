import { GetAnimalApplication, resetProductstate } from '../State/Products/ProductsSlice';
import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AnimalApplication = () => {
  const { isLoading, error, success, animals = [],farmer } = useSelector((state) => state.products);
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jwt) {
      navigate("/");
    } else {
      dispatch(GetAnimalApplication());
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
                {/* Safe navigation to farmer's name */}
                {farmer.name || "Unknown Farmer"}
              </h3>

              <p><strong>Animal Name:</strong> {booking.animalName || "N/A"}</p>

              {/* booking.image might be an array of image URLs, display first image safely */}
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
                  <span className="text-white bg-amber-600 px-2 rounded">Pending</span>
                ) : (
                  <span className="text-white bg-green-600 px-2 rounded">Approved</span>
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
                  onClick={() => navigate(`/farmer/addAnimal/${booking.id}`, { state: { animals: booking } })}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimalApplication;
