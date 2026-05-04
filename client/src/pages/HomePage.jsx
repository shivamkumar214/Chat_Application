import React, { useContext, useState } from 'react'
import Sidebar from "../components/Sidebar.jsx"
import ChatContainer from "../components/ChatContainer.jsx"
import RightSidebar from "../components/RightSidebar.jsx"
import { ChatContext } from '../../context/ChatContext.jsx'


const HomePage = () => {

  const {selectedUser, setSelectedUser} = useContext(ChatContext);

  return (
    <div className='border w-full h-[100dvh] sm:px-[15%] sm:py-[5%]'>

        <div className={`backdrop-blue-xl border-xl border-2 border-grey-600 rounded-2xl
        overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? 
        'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'} backdrop-blur-lg`}>

          <Sidebar />
          <ChatContainer />
          <RightSidebar />

        </div>

    </div>
  )
}

export default HomePage