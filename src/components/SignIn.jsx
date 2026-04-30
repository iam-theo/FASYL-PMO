import React from 'react'
import { useNavigate } from 'react-router-dom'
import bgSignIn from "../assets/bgSignIn.jpg"
import bgSignInTwo from "../assets/bgSignInTwo.jpg"
import { useState } from 'react'
import MainBody from './MainBody'

function SignIn() {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [user, setUser] = useState(null)
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    
    const logins = [
        {role: "admin", email: "admin@gmail.com", password: "5656"},
        {role: "user", email: "user@gmail.com", password: "7676"}
    ]

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const navigate = useNavigate()
    const handleLogin = (e) => {
        e.preventDefault();

        const user = logins.find(
            login =>
            form.email === login.email &&
            form.password === login.password
        );

        if (!user) {
            alert("Invalid credentials");
            return;
        }

        setUser(user.role);

        navigate("/app", {
            state: { user: user.role }
        });
    };


    return (
        <div className='flex max-w-360 max-h-screen'>
            <div className='w-238 h-screen relative'>
                <img src={bgSignIn} alt="" className='w-full h-full object-cover absolute'/>
                <div className='bg-linear-to-bl from-[#1B3C4A] to-[#1A5C78] w-full h-full top-0 opacity-80 text-[#FFFFFF] flex flex-col items-start justify-center px-25'>
                    <h1 className='text-[48px]/[100%] font-semibold tracking-[-2%] mb-3.5'>Welcome to Fasyl help-desk</h1>
                    <p className='font-normal text-[20px]/[30px] tracking[0%]'>Login to the help-desk to manage your dashboard</p>
                </div>
            </div>

            {/* Sign In Form */}
            <div className='w-122 h-screen relative flex flex-col items-start justify-center'>
                <img src={bgSignInTwo} alt="" className='w-full h-full object-cover opacity-30 absolute z-[-1000]'/>
                <div className='px-16 flex flex-col items-start justify-center gap-4'>
                    <h3 className='text-[#101828] text-[24px]/[100%] tracking-[0%] font-semibold'>Log in</h3>
                    <p className='text-[#141414] text-[16px]/[24px] tracking-[0%] font-normal'>Welcome back! Please enter your details</p>
                    <form action="">
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="" className='font-medium text-[14px]/[20px] tracking[0%] text-[#090909] mb-1.5'>Email</label>
                            <input 
                            value={form.email}
                            onChange={handleChange}
                            type="email" 
                            name='email' 
                            placeholder='Enter your email' 
                            className='w-90 h-11 rounded-lg bg-[#FFFFFF] border border-[#D0D5DD] shadow-[#1018280D] shadow-[2px] py-2.5 px-3.5'/>
                        </div>
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="" className='font-medium text-[14px]/[20px] tracking[0%] text-[#090909] mb-1.5'>Password</label>
                            <input 
                            value={form.password}
                            onChange={handleChange}
                            type="password" 
                            name='password' 
                            placeholder='........' 
                            className='w-90 h-11 rounded-lg bg-[#FFFFFF] border border-[#D0D5DD] shadow-[#1018280D] shadow-[2px] py-2.5 px-3.5'/>
                        </div>
                        <label htmlFor="" className='text-[14px]/[20px] tracking-[0%] text-[#1B3C4A] font-medium'>Forgot password?</label>
                        <button onClick={handleLogin} type='submit' className='text-[16px]/[24px] tracking-[0%] text-[#FFFFFF] font-medium bg-[#1B3C4A] shadow-[#1018280D] shadow-[2px] w-90 h-11 rounded-lg py-2.5 px-4.5 mt-2 cursor-pointer' >Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn