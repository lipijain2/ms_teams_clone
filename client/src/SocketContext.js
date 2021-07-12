import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();
const socket = io('http://localhost:5000/');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [videoSwitch, setVideoSwitch] = useState();
  const [screenSwitch, setScreenSwitch] = useState();

  let myVideo = useRef();
  let userVideo = useRef();
  const connectionRef = useRef();
  
  const location = window.location;
  const username = window.localStorage.getItem('user');
 
  socket.emit('send-username', username);

  function logout() {
    window.localStorage.clear();
    window.location.href = '/?logout=true';
  };

  function shareScreenOn() {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
      const screenTrack = stream.getTracks()[0];
      stream.current = screenTrack;
      myVideo.current.srcObject = stream;
      setStream(stream);
      setScreenSwitch(true);
    });
  };

  function shareScreenOff() {
    stream.getTracks().forEach(track => track.stop());
    
    if(videoSwitch) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        const screenTrack = stream.getVideoTracks()[0];
        stream.current = screenTrack;
        myVideo.current.srcObject = stream;
        setStream(stream);
      });
    }
    else{
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        const screenTrack = stream.getVideoTracks()[0];
        stream.current = screenTrack;
        myVideo.current.srcObject = stream;
        stream.getVideoTracks()[0].enabled = false;
        setStream(stream);
      });
    }
    setScreenSwitch(false);
  };

  function switchVideoOff() {
    if(!screenSwitch) stream.getVideoTracks()[0].enabled = false;
    setVideoSwitch(false);
  };
  
  function switchVideoOn() {
    if(!screenSwitch) stream.getVideoTracks()[0].enabled = true;
    setVideoSwitch(true);
  };

  function switchMicOff() {
    if(stream != null && stream.getAudioTracks().length > 0){
      stream.getAudioTracks()[0].enabled = false;
    }  
  };
  
  function switchMicOn() {
    if(stream != null && stream.getAudioTracks().length > 0){
      stream.getAudioTracks()[0].enabled = true;
    }  
  };
  
  useEffect(() => {
    if(location.pathname === '/app'){
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          myVideo.current.srcObject = currentStream;
        });

      socket.on('me', (id) => setMe(id));

      socket.on('callDecline', () => {
        window.location.reload();
      });

      socket.on('callEnded', () => {
        setCallEnded(true);
        window.location.reload();
      });

      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }
  }, [location]);

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
      } 
      else {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name: username });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', ({signal,name}) => {
      setCallAccepted(true);
      setCall({to: id});
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    socket.emit('callEnded');
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  const declineCall = () => {
    socket.emit('callDecline');
    window.location.reload();
  };

  return (
    <SocketContext.Provider value = {{
      logout,
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
      switchVideoOff,
      switchVideoOn,
      switchMicOn,
      switchMicOff,
      declineCall,
      shareScreenOn,
      shareScreenOff,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
