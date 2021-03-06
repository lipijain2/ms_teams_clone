import {Component} from 'react';
import React from 'react';
import {Send} from '@material-ui/icons';
import { Button } from '@material-ui/core';
class Input extends Component {
  state = {
    text: ''
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ text: '' });
    this.props.onSendMessage(this.state.text);
  }

  render() {
    return (
      <div className = 'Input'>
        <form onSubmit = { e => this.onSubmit(e) }>
          <input
            onChange = { e => this.onChange(e) }
            value = { this.state.text }
            type = 'text'
            placeholder = 'Enter your message'
            autofocus = 'true'
          />
          <button>
            <Button 
              style = {{ 
                minWidth: '35px', 
                backgroundColor: '#212121', 
                width: '50px', 
                height: '40px', 
                color: '#FFFFFF', 
                paddingRight: '0'
                }} 
              startIcon = {<Send />}>
            </Button>
          </button>
        </form>
      </div>
    );
  };
};

export default Input;
