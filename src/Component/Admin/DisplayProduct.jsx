import { Delete, Edit } from '@mui/icons-material'
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DeleteProducts, GetUsersProducts, resetProductstate } from '../State/Products/ProductsSlice'
import UpdateProduct from './UpdateProduct'
import ProductUpdate from './ProductUpdate'

const DisplayProduct = () => {


  
    const{products,success,error}=useSelector((state)=>state.products);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const jwt=localStorage.getItem("jwt");

   useEffect(() => {
    if (!jwt) {
      toast.error("Please login to continue");
      navigate("/");
    } else {
      dispatch(GetUsersProducts());
    }
  }, [dispatch, jwt, navigate]);

useEffect(() => {
  if (success){ toast.success(success)
    dispatch(resetProductstate())
  };
  
}, [success]);
useEffect(() => {
  if (error){ toast.success(error)
    dispatch(resetProductstate())
  };
  
}, [error]);

    const[page,setPage]=useState(0);
    const [rowPage,setRowPage]=useState(5);
    const [searchI,setSearchI]=useState('');

    const handleSearch=(e)=>{
        setSearchI(e.target.value.toLowerCase())
        setPage(0)
    }
    const filterProducts=products.filter(
        (prod)=>
           (prod.name?.toLowerCase() ?? "").includes(searchI) ||
(prod.measurement?.toLowerCase() ?? "").includes(searchI) ||
(prod.producttype?.toLowerCase() ?? "").includes(searchI)
    )
    const handleChangePage=(event,newPage)=>{
        setPage(newPage);
    }

    const handleChangeRowPage=(event)=>{
        setRowPage(parseInt(event.target.value,10))
        setPage(0);
    }
    const paginatedProducts=filterProducts.slice(page *rowPage,page*rowPage+rowPage)
  return (
    
    <div className=" mt-2 max-w-md md:max-w-3xl justify-center items-center ml-8">
       <UpdateProduct />
      <h2 className='text-xl font-bold hover:underline cursor-cell mb-8'>Listed Products</h2>
      <TextField
      label='search by name,type,or measurement'
      variant='outlined'
      fullWidth
      value={searchI}
      onChange={handleSearch}
      className='mt-4'
      />
      <div className='flex p-3' >
<TableContainer component={Paper} className='p-3' sx={{ml:'auto'}}>
    <Table>
        <TableHead>
            <TableRow>
 <TableCell><strong>Image</strong></TableCell>
 <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Measurement</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Price (NPR)</strong></TableCell>        
              <TableCell><strong>Actions</strong></TableCell>        
              
                  </TableRow>
        </TableHead>
        <TableBody>
            {paginatedProducts.length>0?
            paginatedProducts.map((prod,index)=>(
                <TableRow key={index}>
                <TableCell>
    <div className='h-20 w-20 rounded-md'>
      <img src={prod.image[0]} alt="product" className='h-full w-full object-cover rounded-md' />
    </div>
  </TableCell>
<TableCell>{prod.name}</TableCell>
                <TableCell>{prod.measurement}</TableCell>
                <TableCell>{prod.producttype}</TableCell>
                <TableCell>{prod.price}</TableCell>
                <TableCell>
                    <div className='flex space-x-2'>  
                        <Button  sx={{color:'green'}} onClick={()=>navigate(`/farmer/viewProduct?edit=true&id=${prod.id}`,{state:{product:prod},})}><Edit/></Button>
                      <Button  sx={{color:'red'}} onClick={()=>dispatch(DeleteProducts(prod.id))}><Delete/></Button>
</div>
                    </TableCell>
                </TableRow>
            )):( <TableRow>
                <TableCell colSpan={5} align='center'>
                  No matching products found.
                </TableCell>
              </TableRow>)}
        </TableBody>
    </Table>
    <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filterProducts.length}
          rowsPerPage={rowPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowPage}
        />
      </TableContainer>

      </div>
            

    </div>
  )
}

export default DisplayProduct
