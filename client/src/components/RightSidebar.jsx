import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext)
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])

  // Get all the images from the messages and set them to state
  useEffect(() =>{
    setMsgImages(
      messages
        .filter(msg => msg.image)   
        .map(msg => msg.image)      
    )
  }, [messages, selectedUser])


  return selectedUser && (
    <div className={`text-white w-full relative overflow-y-scroll bg-gray-900 ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className='pt-10 flex flex-col items-center gap-1 text-xs font-light text-white mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" 
         className='w-20 aspect-square rounded-full'/>

        
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>

        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
        
      <hr className='border-b-lime-50 my-4 w-80'/>

      <div className=' px-5 text-xs'>
        <p className=''>Media</p>
        <div className='mt-2 max-h-70 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url, idx) => (
            <div key={idx} onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md'/>
            </div>
          ))}
        </div>
      </div> 

      <div className='bg-amber-400'>
        <button onClick={() => logout()} className='text-white absolute  bottom-5 left-4 right-4 
          border-none text-sm py-2 px-20 rounded-full cursor-pointer bg-blue-600'> Logout
        </button>
      </div>
    </div>
  )
}
 
export default RightSidebar
