import React, { useContext, useState, useEffect } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => { 

    const { getUsers, users, selectedUser, setSelectedUser, 
        unseenMessages,setUnseenMessages } = useContext(ChatContext);
        // console.log("getUsers", getUsers);

    const {logout, onlineUsers} = useContext(AuthContext);
    
    const [input, setInput] = useState("");

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user) => 
        user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    const [open, setOpen] = useState(false);

    useEffect(() => {
        getUsers();
    }, [onlineUsers])

    useEffect(() => {
         if (!open) return;

        const timer = setTimeout(() => {
            setOpen(false);
            console.log("i am setTimeout")
        }, 2000);

        return () => clearTimeout(timer);
    }, [open]);

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll
    text-white ${selectedUser ?  "max-md:hidden" : ''}`} >

        <div className=''>
            <div className='flex  justify-between  items-center '>
                <img src={assets.logo} alt="logo" className='max-w-40'/>

                <div className='relative py-2 group'>

                    <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' 
                     onClick={() => setOpen(!open)} />
                     {console.log(open)}

                    <div className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] 
                     border border-gray-600 text-gray-100 ${open ? "block" : "hidden"}`}>

                        <p className='cursor-pointer text-sm'
                            onClick={() => { navigate('/profile') 
                                setOpen(false)
                            }}                    
                        >Edit Profile</p>
                        <hr className='my-2 border-t border-grey-500'/>
                        <p className='cursor-pointer text-sm'
                            onClick={() => {
                                logout()
                                setOpen(false)
                            }} 
                        >Logout</p>

                    </div>
                </div>
            </div>


            <div className='bg-[#282142] rounded-full flex items-center gap-3 py-3 mb-1 px-3 mt-5'>

                <img src={assets.search_icon} alt="Search" className='w-3 ml-1' />
                <input type="text" name="" id="" className='bg-transparent border-none outline-none text-white
                 text-xs placeholder-white-100 flex-1' placeholder='Search User...' 
                 onChange={(e) => setInput(e.target.value)} />

            </div>


            <div className='flex flex-col'>
                {filteredUsers.map((user, idx) => (
                    
                    <div onClick={() => {setSelectedUser(user), setUnseenMessages(prev => (
                        { ...prev, [user._id]:0 }
                    ))}}
                     key={idx} className={`relative flex items-center gap-2 p-2 pl-4 rounded
                     cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#4a1343]'}`}>

                        <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-9 aspect-auto  rounded-full'/>

                        <div className='flex flex-col leading-5'>
                            <p>{user.fullName}</p>
                            {
                                onlineUsers.includes(user._id)
                                ? <span className='text-green-400 text-xs'>Online</span> 
                                : <span className='text-neutral-500 text-xs'>Offline</span>
                            }
                        </div>

                        {unseenMessages?.[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex
                        justify-center items-center rounded-full bg-slate-500'>
                        {unseenMessages?.[user._id]}</p>}

                    </div>
                ) )}
            </div>
        </div>
    </div>
  )
}

export default Sidebar