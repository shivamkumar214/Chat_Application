import { createContext, useState, useEffect } from "react";
import axios from 'axios'

import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try{
            const {data} = await axios.get("/api/auth/check");
            if(data.success && data.user){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        }catch(err){
            toast.error(err.message)
        }
    }

    // Login function to handle user authentication and socket connection
    const login = async (state, credentials)=> {
        try{
            const {data}  = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        }catch(err){
            toast.error(err.message)
        }
    }

    // Logout function to handle user logout and Socket disconnection
    const logout = async() => {
        try {
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            setOnlineUsers([]);
            delete axios.defaults.headers.common["token"];
            toast.success("Logged out successfully")
            if (socket) socket.disconnect();
        } catch (error) {
            toast.error(err.message);
        }
    }

    // Update profile function to handle user profile update
    const updateProfile = async (body) =>{
        try {
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updates successfully");
            }
        } catch (error) {
            toast.error(err.message);
        }
    }


    /* “I used Socket.IO to establish real-time communication. When a user logs in, 
       I send their userId during the handshake. The backend stores a mapping of userId to socketId, 
       allowing me to track online users and emit real-time updates to all clients.” */

    // Connect socket function to handle socket connection and online users updates 
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return ;
        const newSocket = io(backendUrl, {
            query:{
                userId: userData._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=> {
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}