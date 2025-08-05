import React, { useState } from 'react'
import HeaderNav from './HeaderNav'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { uploadImagetoCloud } from './Home/Util/UploadTocloud'
import { updateUserImage } from './State/authSlice'

function Layout({ children }) {
  const jwt = localStorage.getItem("jwt")
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const farmerId = user?.id
  
  const [showImageModal, setShowImageModal] = useState(false)
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  React.useEffect(() => {
    if (jwt && user && !user.image) {
      setShowImageModal(true)
    }
  }, [jwt, user])

  const handleImageUpload = async (e) => {
    e.preventDefault()
    if (!image) return

    setUploading(true)
    
    try {
      const imageUrl = await uploadImagetoCloud(image)  
      
      await dispatch(updateUserImage({ 
        userId: user.id, 
        imageUrl 
      })).unwrap()
      
      setShowImageModal(false)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <HeaderNav/>
      <main className='flex-grow'>{children}</main>

      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Profile Image</h2>
            <p className="mb-4 text-gray-600">Please upload a profile image to continue using the application.</p>
            
            <form onSubmit={handleImageUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {jwt && user?.image && (
        <div className="fixed bottom-4 right-4 flex flex-col items-end gap-3 z-40">
          <button 
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
            onClick={() => navigate(`/chatbox/${farmerId}`)}
          >
            💬
          </button>
        </div>
      )}
    </div>
  )
}

export default Layout