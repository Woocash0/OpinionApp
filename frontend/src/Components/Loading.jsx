import React from 'react'
import { helix } from 'ldrs'

helix.register()

const loadingStyle = {
    width: "100%",
    height: "100%",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '1.5vh'
  };    

const loadingText = {
  
    fontFamily: "Inter",
    letterSpacing: '0.2vw',
    fontWeight: '900',
    color: '#261132',
    fontSize: '2vh'
};    

const Loading = () => {
  return (
    <div className='loading' style={loadingStyle}>
    <l-helix
      size="100"
      speed="1.5"
      color="#261132" 
    ></l-helix>
    <span style={loadingText}>Loading...</span>
    
    </div>
  )
}

export default Loading
