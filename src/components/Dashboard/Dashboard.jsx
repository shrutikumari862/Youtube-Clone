import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function Dashboard() {
    const location=useLocation()

    return (
        <>
            <div className='dashboard-container'>
                <div  className='side-nav'>
                     <div className='profile-container'>
                        <img  src={localStorage.getItem('logoUrl')} alt='logo'/>
                        <h2>{localStorage.getItem('channelName')}</h2>
                     </div>
                     <div className='menu-container'>
                        <Link  className={location.pathname=='/dashboard/home'?'active-menu-link':'menu-link'} to='/dashboard/home'><i className="fa-solid fa-house"></i>  Home</Link >
                        <Link className={location.pathname=='/dashboard/MyVideos'?'active-menu-link':'menu-link'} to='/dashboard/MyVideos'><i className="fa-solid fa-file-video"></i> My Videos</Link >
                        <Link className={location.pathname=='/dashboard/Upload'?'active-menu-link':'menu-link'} to='/dashboard/Upload'><i className="fa-solid fa-upload"></i> Upload Video</Link >
                        <Link className='menu-link' ><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</Link >
                     </div>
                </div>
                <div className='content-container'>
                    <Outlet/>
                </div>
            </div>
        </>
    )
}
