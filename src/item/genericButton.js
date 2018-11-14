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
    const newmarginTop = (this.container.offsetHeight * 0.8 - this.node.offsetHeight) / 2;
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
    const buttonClass = this.props.disable ? 'generic-button disable' : (this.props.placeholder ? 'generic-button placeholder' : 'generic-button ripple')
    return <div className='generic-button-container' ref={node => this.container = node}>
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
  handleClick: function(){}
}

export default GenericButton;