import React, { useContext, useState } from 'react';
import Pop from './Pop';
import './PopUpStyles.css';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Mic, Videocam, MicOff, VideocamOff, PhoneDisabled, ScreenShare, Info, Chat } from '@material-ui/icons';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
  footer: {
    bottom: '0',
    padding: '10px 0px',
    position: 'fixed',
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    margin: 'auto auto',
    backgroundColor: '#202124',
  },
}));

const ButtonBar = () => {
  const { callAccepted, callEnded, leaveCall, toggleVideo, toggleMic } = useContext(SocketContext);
  const classes = useStyles();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
    
  return (
    <div className={ classes.footer }>
      <span style={{ display: 'absolute', margin:'0 auto'}}>
        {isMicOn ?(
        <Button style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<Mic style={{fontSize:30}}/>} onClick={() => {setIsMicOn(!isMicOn); toggleMic();}}></Button>
        ):(
        <Button style={{backgroundColor: '#f44336', color: '#FFFFFF'}} startIcon={<MicOff style={{fontSize:30}}/>} onClick={() => {setIsMicOn(!isMicOn); toggleMic();}}></Button>
        )}
        {' '}
        {isVideoOn ?(
        <Button style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<Videocam style={{fontSize:30}}/>} onClick={() => {setIsVideoOn(!isVideoOn); toggleVideo();}}></Button>
        ):(
        <Button style={{backgroundColor: '#f44336', color: '#FFFFFF'}} startIcon={<VideocamOff style={{fontSize:30}}/>} onClick={() => {setIsVideoOn(!isVideoOn); toggleVideo();}}></Button>
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
