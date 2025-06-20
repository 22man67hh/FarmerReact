import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFarmers } from '../State/Farmer/FarmerSlie'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import slugify from 'slugify'
const FarmCard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { farmers } = useSelector((state) => state.farmer)
  const jwt = localStorage.getItem('jwt')

  useEffect(() => {
    if (!jwt) return
    dispatch(fetchFarmers())
  }, [dispatch, jwt])

  return (
    <div className="mt-9 px-4 md:px-8">
      <h2 className="text-2xl font-bold border-b-2 border-green-500 inline-block pb-1 mb-6">
        Our Farmers Farm
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {farmers?.map((farmer, index) => (
          <Card
            key={index}
            className="shadow-md rounded-xl hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => navigate(`/farmer/${slugify(farmer.displayname,{lower:true})}`, { state: { farmer } })}
          >
            <img
              src={farmer.images}
              alt={farmer.displayname}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-green-600">{farmer.displayname}</h3>
              <p className="text-sm text-gray-700">
                <strong>Owner:</strong> {farmer.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Distance:</strong> {farmer.distanceKm} km
              </p>
              <p className="mt-2 bg-gray-100 px-2 py-1 rounded text-center text-sm">
                {farmer.productType}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FarmCard
