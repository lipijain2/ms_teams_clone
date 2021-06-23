import React, { useContext } from 'react';
import { Button } from '@material-ui/core';

import { SocketContext } from '../SocketContext';

const Notifications = () => {
  const { answerCall, call, callAccepted, declineCall } = useContext(SocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" style={{backgroundColor: '#12824C', color: '#FFFFFF'}} onClick={answerCall}>
            Answer
          </Button>
          <Button variant="contained" style={{backgroundColor: '#d32f2f', color: '#FFFFFF'}} onClick={declineCall}>
            Decline
          </Button>
        </div>
      )}
      
    </>
  );
};

export default Notifications;
