import { Modal, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProductUpdate from './ProductUpdate'

const UpdateProduct = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location?.state?.product || null
  const searchParams = new URLSearchParams(location.search)
  const isModalOpen = searchParams.get("edit") === "true"

  const handleOnClose = () => {
    searchParams.delete("edit")
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

 

  return (
    <div>
      {product && (
        <Modal open={isModalOpen} onClose={handleOnClose}>
          <Box
            tabIndex={0}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-40%,-50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
              width: 600,
              maxWidth: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <ProductUpdate product={product} />
          </Box>
        </Modal>
      )}
    </div>
  )
}

export default UpdateProduct
