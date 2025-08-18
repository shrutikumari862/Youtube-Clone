import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ytlogo from '../assets/ytlogo.webp';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export function Login() {
    
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [isLoding,setIsLoading]=useState(false)
     let [error,setError]=useState('')

    const navigate = useNavigate()
    
    const submitHandler=(e)=>{
        e.preventDefault()
        setIsLoading(true)
       
         axios.post(
        'https://youtube-clone-1-jp7n.onrender.com/user/login',{
            email:email,
            password:password
        }
    )
        .then(res=>{
            setIsLoading(false)
            navigate('/dashboard')
            console.log(res.data)
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("userId",res.data._id)
            localStorage.setItem("channelName",res.data.channelName)
            localStorage.setItem("logoUrl",res.data.logoUrl)
        })
        .catch(err=>{
            setIsLoading(false)
            
            //console.log(err.response.data)
            setError(err.response.data.ERROR)
            console.log(error)
            toast.error(error);
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
                    <input required onChange={(e)=>(setEmail(e.target.value))} placeholder='Email' type='email'></input>
                    <input required onChange={(e)=>(setPassword(e.target.value))} placeholder='Password' type='password'></input>
                    <button type='submit' > {isLoding && <i className="fa-solid fa-spinner fa-spin-pulse"></i>} Submit</button>


                    <Link to='/signup'  className='link'>Create your account</Link>
                    </form>
                
            </div>
           
        </>
    )
}

