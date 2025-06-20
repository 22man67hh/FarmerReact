import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CardContent } from '@mui/material'
import React, { useState } from 'react'
import { API_URL } from '../Config/api'
import { Navigate } from 'react-router-dom'

const PlantDiseases = () => {
    const [image,setImage]=useState(null);
    const [preview,setPreview]=useState(null);
    const[prediction,setPrediction]=useState(null);
    const[cure,setCure]=useState(null);
    const[cause,setCause]=useState(null);
const [loading,setLoading]=useState(false)

      const jwt = localStorage.getItem("jwt"); 

if(!jwt){
 return <Navigate to="/" state={{message:"Please login to continue"}}/>
}

    const handeImageChange=(e)=>{
        const file=e.target.files[0];
        if(file){
          setImage(file);
        setPreview(URL.createObjectURL(file));
        setPrediction(null);
        setCure(null);
        setCause(null);
        setLoading(false);
        }
    }
    const handlePredict=async ()=>{
        if(!image) return;
        const formData=new FormData();
        formData.append("img",image);
        setLoading(true);
        try{
            const response=await fetch(`${API_URL}/upload-image`,{
                method:'POST',
                body:formData,
            });
            const data=await response.json();
           let rawPre=data.prediction;
           let parsed={};
           if(rawPre && rawPre.startsWith("{") && rawPre.endsWith("}")){
            rawPre
            .substring(1,rawPre.length-1)
            .split(",")
            .forEach(entry=>{
              const[key,value]=entry.split("=");
              parsed[key.trim()]=value?.trim();
            })
           }
 setPrediction(parsed.name || "Unknown");
        setCause(parsed.cause || "Not provided");
        setCure(parsed.cure || "Not provided");
            
        }catch(error){
            console.error("Prediction error", error);
            setPrediction('Error Predicting diseases');
            setPrediction("Error Predicting disease");
        setCause("N/A");
        setCure("N/A");
           
        }finally{
          setLoading(false);
        }
    }
  return (
    <div className='p-6 max-w-md mx-auto'>
        <Card>
            <CardContent className='space-y-4'>
                <h2 className='text-xl font-bold text-center mb-3'>Plant Disease Predictor</h2>
                <Input type="file" accept="image/*" name="image" onChange={handeImageChange} />
{preview &&(
    <img src={preview} alt="Leaf Preview"  className='w-full rounded shadow-md' />
    
)}
<Button onClick={handlePredict} className='w-full text-black bg-amber-100 hover:ring'>Predict Diseases</Button>
{loading && (
  <div className="text-center text-blue-600 font-medium">Predicting...</div>
)}
 {prediction && (
            <div className="text-center text-lg font-medium mt-4">
              Prediction: <span className="text-green-600">{prediction}</span>
            </div>
          )}
 {cause && (
            <div className="text-center text-lg font-medium mt-4">
              Cause: <span className="text-green-600">{cause}</span>
            </div>
          )}
 {cure && (
            <div className="text-center text-lg font-medium mt-4">
              Cure: <span className="text-green-600">{cure}</span>
            </div>
          )}
           
            </CardContent>
        </Card>
      
    </div>
  )
}

export default PlantDiseases
