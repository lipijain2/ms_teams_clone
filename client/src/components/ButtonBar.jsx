import React, { useContext, useState } from 'react';
import Pop from './Pop';
import { Button } from '@material-ui/core';
import { Mic, Videocam, MicOff, VideocamOff, PhoneDisabled, ScreenShare, Info, Chat } from '@material-ui/icons';

import { SocketContext } from '../SocketContext';

const ButtonBar = () => {
  const { callAccepted, callEnded, leaveCall, switchVideoOn, switchVideoOff, switchMicOn, switchMicOff  } = useContext(SocketContext);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
    
  return (
    <div className="footer">
      <span style={{ display: 'absolute', margin:'0 auto'}}>
        {isMicOn ?(
        <Button style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<Mic style={{fontSize:30}}/>} onClick={() => {setIsMicOn(!isMicOn); switchMicOff();}}></Button>
        ):(
        <Button style={{backgroundColor: '#f44336', color: '#FFFFFF'}} startIcon={<MicOff style={{fontSize:30}}/>} onClick={() => {setIsMicOn(!isMicOn); switchMicOn();}}></Button>
        )}
        {' '}
        {isVideoOn ?(
        <Button style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<Videocam style={{fontSize:30}}/>} onClick={() => {setIsVideoOn(!isVideoOn); switchVideoOff();}}></Button>
        ):(
        <Button style={{backgroundColor: '#f44336', color: '#FFFFFF'}} startIcon={<VideocamOff style={{fontSize:30}}/>} onClick={() => {setIsVideoOn(!isVideoOn); switchVideoOn();}}></Button>
        )}
        {' '}
        <Button style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<ScreenShare style={{fontSize:30}}/>}></Button>
        {' '}
        {!callEnded && callAccepted && (
          <Button  variant="contained" style={{backgroundColor: '#f44336', color: '#FFFFFF'}} startIcon={<PhoneDisabled style={{fontSize:30}} />} onClick={leaveCall} ></Button>
        )}  
      </span>
      <span style={{width: '300px', align: 'right', float: 'right'}}>
      <Pop />
      {' '}
      <Button variant='contained' style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<Info style={{fontSize:30}} />} ></Button>
      {' '}
      <Button variant='contained' style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<Chat style={{fontSize:30}} />} ></Button>
      </span>
    </div>
  );
};

export default ButtonBar;
