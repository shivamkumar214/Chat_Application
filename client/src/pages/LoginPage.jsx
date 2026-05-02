import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const onSubmitHandler = (evt) => {
    evt.preventDefault();

    if(currState == "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }


  return (
    <div className='min-h-screen flex items-center justify-center
     sm:justify-evenly backdrop-blur-xl max-sm:flex-col gap-8 '>

      {/* -----------left---------- */}
      <img src={assets.logo_big} alt="" className='w-60 ' />

      {/* -----------right---------- */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col
       gap-6 rounded-lg '>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState} {isDataSubmitted && 
           <img src={assets.arrow_icon} onClick={(e)=> setIsDataSubmitted(false)} 
            className='w-5 cursor-pointer' /> }
        </h2>
 
        {currState === "Sign up" && !isDataSubmitted && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className='p-2 border 
           rounded-md' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' 
             required className='p-2 border rounded-md' />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' 
             required className='p-2 border rounded-md' />
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
            <textarea rows={4} className='' placeholder='Provide a short bio...' required
             onChange={(e) => setBio(e.target.value)} value={bio}></textarea>
          )
        }
        
        <button className='p-3 border rounded-4xl' type='submit'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex text-gray-400 text-sm'>
          <input type="checkbox"  />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-cols gap-1 text-gray-400 text-sm'>
          {currState === "Sign up" ? (
            <p> Already have an account? <span onClick={(e) => {setCurrState("Login"); setIsDataSubmitted(false);}}
             className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
           ) : (
            <p>Create an account <span onClick={(e) => setCurrState("Sign up")}
             className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage