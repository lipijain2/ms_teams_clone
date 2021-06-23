import React, { useContext, useState } from 'react'
import { Grid, Typography, Paper, Button, } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Mic, Videocam, MicOff, VideocamOff, PhoneDisabled } from '@material-ui/icons';


import { SocketContext } from '../SocketContext'

const useStyles = makeStyles((theme) => ({
    video: {
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
    },
}));

  
const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, leaveCall, toggleVideo, toggleMic } = useContext(SocketContext);
    const classes = useStyles();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    
    return (
        <Grid container className={classes.gridContainer}>
            {stream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{ name || 'Name' }</Typography>
                        <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                          <div>
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
                            {!callEnded && callAccepted && (
                              <Button  variant="contained" style={{backgroundColor: '#f44336', color: '#FFFFFF'}} startIcon={<PhoneDisabled style={{fontSize:30}} />} onClick={leaveCall} ></Button>
                            )}
                          </div>
                    </Grid>
                </Paper>
                )
            }
            
            {callAccepted && !callEnded && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>{ call.name || 'Name' }</Typography>
                        <video playsInline ref={userVideo} autoPlay className={classes.video} />
                    </Grid>
                </Paper>
                )
            }
        </Grid>
    );
};

export default VideoPlayer;
