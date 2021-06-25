import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');

  let myVideo = useRef();
  let userVideo = useRef();
  const userStream = useRef();
  const connectionRef = useRef();

  let micSwitch = true;
  let videoSwitch = true;

  function shareScreen() {
    stream.removeTrack(stream.getVideoTracks()[0]);
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
        const screenTrack = stream.getTracks()[0];
        stream.current = screenTrack;
        myVideo.current.srcObject = stream;
        screenTrack.onended = function() {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            setStream(currentStream);
    
            myVideo.current.srcObject = currentStream;
            userStream.current = currentStream;
          });
        }
    })
  }
  
  function toggleVideo(){
    if(stream != null && stream.getVideoTracks().length > 0){
      videoSwitch = !videoSwitch;
      
      stream.getVideoTracks()[0].enabled = videoSwitch;
    }
  
  }
  
  function toggleMic(){
    if(stream != null && stream.getAudioTracks().length > 0){
      micSwitch = !micSwitch;
  
      stream.getAudioTracks()[0].enabled = micSwitch;
    }  
  }
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if(currentStream.getTracks().length>0){
        const screenTrack = currentStream.getTracks()[0];
        currentStream.current = screenTrack;
        userVideo.current.srcObject = currentStream;
      } else {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    
    connectionRef.current.destroy();
    window.location.reload();
    
  };

  const declineCall = () => {
    window.location.reload();
  }

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      toggleVideo,
      toggleMic,
      micSwitch,
      videoSwitch,
      declineCall,
      shareScreen
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
