import React, { useContext, useState } from 'react';
import Pop from './Pop';
import ChatPop from './ChatPop';
import { Button } from '@material-ui/core';
import { Mic, Videocam, MicOff, VideocamOff, PhoneDisabled, ScreenShare } from '@material-ui/icons';

import { SocketContext } from '../SocketContext';

const ButtonBar = () => {
  const { callAccepted, callEnded, leaveCall, switchVideoOn, switchVideoOff, switchMicOn, switchMicOff  } = useContext(SocketContext);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
    
  return (
    <div className="footer">
      <span style={{ display: 'absolute', marginLeft:'10%'}}>
        {isMicOn ?(
          <Button 
            style={{ 
              margintop: '5px', 
              paddingLeft : '20px', 
              minWidth: '30px', 
              width: '50px', 
              height: '50px', 
              marginLeft: '20px', 
              backgroundColor: '#000000', 
              color: '#FFFFFF', 
              borderRadius: '50px'
            }} 
            startIcon={<Mic style={{fontSize:30}}/>} 
            onClick={() => {setIsMicOn(!isMicOn); switchMicOff();}}>
          </Button>
        ):(
          <Button style={{ margintop: '5px', paddingLeft : '20px', minWidth: '30px', width: '50px', height: '50px', marginLeft: '20px', backgroundColor: '#f44336', color: '#FFFFFF', borderRadius: '50px'}} startIcon={<MicOff style={{fontSize:30}}/>} onClick={() => {setIsMicOn(!isMicOn); switchMicOn();}}></Button>
        )}
        {' '}
        {isVideoOn ?(
        <Button style={{ margintop: '5px', paddingLeft : '20px', minWidth: '30px', width: '50px', height: '50px', marginLeft: '20px', backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '50px'}} startIcon={<Videocam style={{fontSize:30}}/>} onClick={() => {setIsVideoOn(!isVideoOn); switchVideoOff();}}></Button>
        ):(
        <Button style={{ margintop: '5px', paddingLeft : '20px', minWidth: '30px', width: '50px', height: '50px', marginLeft: '20px', backgroundColor: '#f44336', color: '#FFFFFF', borderRadius: '50px'}} startIcon={<VideocamOff style={{fontSize:30}}/>} onClick={() => {setIsVideoOn(!isVideoOn); switchVideoOn();}}></Button>
        )}
        {' '}
        <Button style={{ margintop: '5px', paddingLeft : '20px', minWidth: '30px', width: '50px', height: '50px', marginLeft: '20px', backgroundColor: '#000000', color: '#FFFFFF', borderRadius: '50px'}} startIcon={<ScreenShare style={{fontSize:27}}/>}></Button>
        {' '}
        {!callEnded && callAccepted && (
          <Button  variant="contained" style={{ margintop: '5px', paddingLeft : '20px', minWidth: '30px', width: '50px', height: '50px', marginLeft: '20px', backgroundColor: '#f44336', color: '#FFFFFF', borderRadius: '50px'}} startIcon={<PhoneDisabled style={{fontSize:30}} />} onClick={leaveCall} ></Button>
        )}  
      </span>
      <span style={{width: '200px', align: 'right', float: 'right'}}>
      <Pop />
      {' '}
      <ChatPop />
      {' '}
      </span>
    </div>
  );
};

export default ButtonBar;