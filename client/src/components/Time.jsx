import React, { Component } from 'react';
export default class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        username: window.localStorage.getItem('user')
    };
  };

  componentDidMount() {
    this.intervalID = setInterval(() =>
      this.updateClock(),
    	1000
    );
  };

  componentWillUnmount() {
  	clearInterval(this.intervalID)
  };

  updateClock() {
  	this.setState ({
  	time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
	}

	render() {
		return (
			<div>
  			<div className='Time'>
   				<p> { this.state.time }{ ' | ' }{ this.state.username }</p>
   			</div>
			</div>
		);
	};
};
