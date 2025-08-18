import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ytlogo from '../assets/ytlogo.webp';
import axios from 'axios'
import { Link } from 'react-router-dom';

export function SignUp() {
    const [channelName,setChannelName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [phone,setPhone]=useState('')
    const [logo,setLogo]=useState(null)   
    const [imageUrl,setImageUrl]=useState(null) 
    const [isLoding,setIsLoading]=useState(false)
    const navigate = useNavigate()
    const fileHandler=(e)=>{
        setLogo(e.target.files[0])
        setImageUrl(URL.createObjectURL(e.target.files[0]))
    }
    const submitHandler=(e)=>{
        e.preventDefault()
        setIsLoading(true)
        const formData=new FormData();
        formData.append('channelName',channelName)
        formData.append('email',email)
        formData.append('phone',phone)
        formData.append('password',password)
        formData.append('logo',logo)

         axios.post(
        'https://youtube-clone-1-jp7n.onrender.com/user/signUp',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data', 
            },
        }
    )
        .then(res=>{
            setIsLoading(false)
            navigate('/login')
            console.log(res.data)
        })
        .catch(err=>{
            setIsLoading(false)
            console.log(err)
        })
    } 

    return (
        <>
       
            <div className='main-wrapper'>
                <div className='wrapper-header'>
                        <img className='logo-image' src={ytlogo}/>
                        <h2 className='c-name'>Youtube</h2>
                </div>
                <form className='form-wrapper' onSubmit={submitHandler}>
                    <input required onChange={(e)=>(setChannelName(e.target.value))} placeholder='Channel Name' type='text'></input>
                    <input required onChange={(e)=>(setEmail(e.target.value))} placeholder='Email' type='email'></input>
                    
                    <input required onChange={(e)=>(setPassword(e.target.value))} placeholder='Password' type='password'></input>
                    <input required onChange={(e)=>(setPhone(e.target.value))}placeholder='Phone' type='number'></input>
                    <input required onChange={fileHandler} type='file'></input>
                    {imageUrl && <img className='uploaded-image' src={imageUrl} alt="logo-image" />}
                    <button type='submit' > {isLoding && <i className="fa-solid fa-spinner fa-spin-pulse"></i>} Submit</button>
                    <Link to='/login'  className='link'>Login with your account</Link>
                    </form>
                
            </div>
        
        </>
    )
}
