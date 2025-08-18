import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react'

export function MyVideos() {
    const [videos, setVideos] = useState([])
    const token=localStorage.getItem('token')
  useEffect(() => {
    axios.get(
      'https://youtube-clone-1-jp7n.onrender.com/video/own-video',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(res => {
      setVideos(res.data.videos)  
      console.log(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [token])
    return (
        <>
        <div >
            <div className='video-div' >
        
         {videos.map(v => (
          <div className='video-div'>
            <div><img src={v.thumbnailUrl}></img></div>
            <div>
              <h2>{v.title}</h2>
              <div>
                <h4>{v.likes}</h4>
                <h4>{v.dislike}</h4>
              </div>
              
            </div>
          </div>
      ))}
    </div>
    </div>
        </>
    )
}
