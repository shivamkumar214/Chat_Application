import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';

import { AuthContext } from '../../context/AuthContext';


const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({
        profilePic: base64Image,
        fullName: name, 
        bio
      })
      navigate('/');
    }
    navigate('/')
  }
 
  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='text-gray-300 border-2 flex items-center justify-between max-sm:flex-col-reverse
       w-5/6 rounded-lg backdrop-blur-2xl max-w-2xl'>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" 
             className={`w-12 h-12 ${selectedImg && 'rounded-full' }`} />
             upload profile image
          </label>
          <input type="text" required placeholder='Your name' onChange={(e) => setName(e.target.value)} value={name}
           className='p-2 border rounded-md focus:ring-2' />
          <textarea  placeholder='Write profile bio' onChange={(e) => setBio(e.target.value)} value={bio}
           className='p-2 border focus:ring-2' rows={4} required ></textarea>

          <button type='submit' className='text-white p-2 bg-blue-600 rounded-full text-lg cursor-pointer border'>Save</button>
        </form>

        <img src={authUser?.profilePic || assets.logo_icon} className='aspect-square rounded-full mx-10 max-sm:mt-10 max-w-44' alt="" />
      </div>
    </div>
  )
}

export default ProfilePage
