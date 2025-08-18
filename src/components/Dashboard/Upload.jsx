import React, { useState } from 'react'
import axios from 'axios'

export function Upload() {
   const [title,setTitle]=useState("")
   const [description,setDescription]=useState('')
   const [category,setCategory]=useState('')
   const [tags,setTags]=useState('')
   const [video,setVideo]=useState("")
   const [thumbnail,setThumbnail]=useState('')
   const [thumbnailUrl,setThumbnailUrl]=useState(null)
   const [videoUrl,setVideoUrl]=useState(null)
   const token=localStorage.getItem('token')

   const SubmitEvent=(e)=>{
     e.preventDefault()
     
     const formData=new FormData();
     formData.append("title",title)
     formData.append("description",description)
     formData.append("category",category)
     formData.append("tags",tags)
     formData.append("video",video)
     formData.append("thumbnail",thumbnail)



      axios.post(
        'https://youtube-clone-1-jp7n.onrender.com/video/upload',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data', 
                "Authorization": `Bearer ${token}`,
            },
        }
    )
    .then(res=>{
        console.log(res.data)
        setThumbnailUrl(res.data.newVideo.thumbnailUrl)
        setVideoUrl(res.data.newVideo.videoUrl)

   })
    .catch(err=>console.log(err))
     
   }
   
        

    return (
        <>
         <div className='main-wrapper'>
                <div className='wrapper-header'>
                        
                        
                </div>
                <form className='form-wrapper'  onSubmit={SubmitEvent} >
                    <input required onChange={(e)=>{setTitle(e.target.value)}} placeholder='Title' type='text'></input>
                    <input required onChange={(e)=>{setDescription(e.target.value)}} placeholder='Description' type='text'></input>
                    
                    <input required onChange={(e)=>{setCategory(e.target.value)}} placeholder='Category' type='text'></input>
                    <input required onChange={(e)=>{setTags(e.target.value)}}placeholder='Tags' type='text'></input>
                    <input required onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setThumbnail(file);
                                                        setThumbnailUrl(URL.createObjectURL(file));
                                                        }} type='file'></input>{thumbnailUrl && <img className='uploaded-file' src={thumbnailUrl}/>}
                    <input required onChange={(e) => {
                                                       const file = e.target.files[0];
                                                       setVideo(file);
                                                       setVideoUrl(URL.createObjectURL(file));
                                                        }} type='file'></input>{videoUrl &&<img className='uploaded-file' src={videoUrl}/>}
                    
                    <button type='submit' > Submit</button>
                    
                    </form>
                
            </div>
        </>
    )
}
