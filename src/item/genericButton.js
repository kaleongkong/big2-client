import React, { Component } from 'react';
import './genericButton.css';

class GenericButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      marginTop: 0
    }
  }

  componentDidUpdate() {
    const newmarginTop = parseInt((this.container.offsetHeight * 0.8 - this.node.offsetHeight) / 2);
    console.log(newmarginTop);
    if (newmarginTop !== this.state.marginTop && this.container.offsetHeight > 0 && newmarginTop > 0) {
      this.setState({marginTop: newmarginTop});
    }
  }

  handleClick() {
    if (!this.props.disable) {
      this.props.handleClick();
    }
  }

  render() {
    const rippleStyle = {
      marginTop: this.state.marginTop
    }
    const buttonClass = `generic-button ${this.props.disable ? 'disable' : 'ripple'} 
    ${this.props.placeholder ? 'placeholder' : ''} 
    ${this.props.roomButton ? 'room-button' : ''} 
    ${this.props.lobbyButton ? 'lobby-button' : ''} 
    ${this.props.alert ? 'alert' : ''}`
    const containerClass = `generic-button-container ${this.props.playerSpace ? 'player-space-button' : ''} ${this.props.roomButton ? 'room-button' : ''}`
    return <div className={containerClass} ref={node => this.container = node}>
      <button className={buttonClass} onMouseUp={this.handleClick.bind(this)} style={rippleStyle} ref={node => this.node = node}>
        {this.props.text}
      </button>
    </div>
  }
}

GenericButton.defaultProps = {
  text: 'Confirm',
  disable: false,
  placeholder: false,
  playerSpace: false,
  roomButton: false,
  lobbyButton: false,
  alert: false,
  handleClick: function(){}
}

export default GenericButton;