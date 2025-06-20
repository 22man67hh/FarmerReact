import { Button } from '@mui/material';
import React, { useState } from 'react';

const Products = () => {
  const products = [
    { id: 'milk', name: 'Milk', price: 40 },
    { id: 'cheese', name: 'Cheese', price: 60 },
    { id: 'yogurt', name: 'Yogurt', price: 30 },
    { id: 'butter', name: 'Butter', price: 50 }
  ];

  const initialQuantities = products.reduce((acc, product) => {
    acc[product.id] = 0;
    return acc;
  }, {});

  const [total,setTotal]=useState(0);


  const [quantities, setQuantities] = useState(initialQuantities);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => {
      const updated={
         ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
      }
     
 const newTotal = products.reduce((sum, product) => {
      return sum + product.price * (updated[product.id] || 0);
    }, 0);
    setTotal(newTotal);
    return updated;
  });
  };

  return (
    <div className="mt-4 ml-4 mr-4">
      <h2 className="text-2xl font-bold border-b-2 border-green-500 inline-block pb-1 mb-4">
        Our Farmers Farm
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-green-600 border-b-2 border-green-300 inline-block pb-1 mb-3">
          Farm
        </h3>

        <div className="flex flex-wrap gap-6 justify-center">
          {products.map(product => (
            <div key={product.id} className="p-4 border rounded shadow-md w-60">
              <h4 className="font-semibold">{product.name} - रू{product.price}</h4>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-2 py-1 bg-red-300 rounded"
                  onClick={() => handleQuantityChange(product.id, -1)}
                >
                  -
                </button>
                <span>{quantities[product.id]}</span>
                <button
                  className="px-2 py-1 bg-green-300 rounded"
                  onClick={() => handleQuantityChange(product.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-right font-bold text-lg mt-4">
  Total: रू{total}
  <Button variant='contained'
  color='success' sx={{
    marginLeft:2,
    paddingX:4,
    paddingY:1.2,
    textTransform:'none'
    
  }}>Put an Order</Button>
</div>
      </div>
    </div>
  );
};

export default Products;
