import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";
import { Typography } from '@material-ui/core';

const queryParams = new URLSearchParams(window.location.search);
const userID = queryParams.get('username');

function randomName() {
  const adjectives = [
    "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark",
    "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter",
    "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue",
    "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long",
    "late", "lingering", "bold", "little", "morning", "muddy", "old", "red",
    "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering",
    "withered", "wild", "black", "young", "holy", "solitary", "fragrant",
    "aged", "snowy", "proud", "floral", "restless", "divine", "polished",
    "ancient", "purple", "lively", "nameless"
  ];
  const nouns = [
    "waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning",
    "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter",
    "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook",
    "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly",
    "feather", "grass", "haze", "mountain", "night", "pond", "darkness",
    "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder",
    "violet", "water", "wildflower", "wave", "water", "resonance", "sun",
    "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog",
    "smoke", "star"
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class ChatApp extends Component {
  state = {
    messages: [],
    member: {
      username: this.userID,
      color: randomColor(),
    }
  }

  constructor() {
    super();
    const queryParams = new URLSearchParams(window.location.search);
    this.userID = queryParams.get('username');
    this.state = JSON.parse(window.localStorage.getItem('state')) || {
      messages: [],
      member: {
        username: this.userID,
        color: randomColor(),
      }
    }
    this.drone = new window.Scaledrone("bV9BflM5njIqoQRS", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      //member.id = this.drone.clientId;
      member.id = this.userID;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
      window.localStorage.setItem('state', JSON.stringify({...this.state}));
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Typography style= {{ fontFamily: 'Courgette', backgroundColor: '#212121', color: '#FFFFFF'}} variant="h3" align="center">ChatMate</Typography>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default ChatApp;