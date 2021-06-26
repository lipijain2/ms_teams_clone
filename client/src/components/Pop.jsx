import React from 'react';
import PopUp from "./PopUp";
import { Button } from '@material-ui/core'
import { ContactPhone } from '@material-ui/icons';

export default class Pop extends React.Component {
  state = {
    seen: false
  };
  togglePop = () => {
    this.setState({
      seen: !this.state.seen
    });
  };

  render() {
    return (
      <div style={{display:'inline-block'}}>
      <div className="btn" onClick={this.togglePop}>
      <Button variant='contained' style={{backgroundColor: '#000000', color: '#FFFFFF'}} startIcon={<ContactPhone style={{fontSize:30}} />} ></Button>
      </div>
      {this.state.seen ? <PopUp toggle={this.togglePop} /> : null}
      </div>
    );
  }
}