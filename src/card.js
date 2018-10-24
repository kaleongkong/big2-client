import React, { Component } from 'react';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      up: false,
      selected: false
    }
  }

  componentDidMount() {
    if (this.props.resetCard) {
      this.resetCardState();
    }
    this.props.updateHand(this);
  }

  componentDidUpdate() {
    if (this.props.resetCard) {
      this.resetCardState();
    }
    this.props.updateHand(this);
  }

  handleMouseEnter(e) {
    if (!this.state.selected && this.props.interaction) {
      this.setState({up: true});
    }
  }

  handleMouseLeave(e) {
    if (!this.state.selected && this.props.interaction) {
      this.setState({up: false});
    }
  }

  handleClick(e) {
    if (this.props.interaction) {
      this.setState({selected: !this.state.selected});
    }
  }

  render() {
    const cardStyle = {
      height: 75,
      width: 44,
      display: 'inline-block',
      position: 'relative',
      top: this.state.up ? -10 : 0
    }
    const buttonStyle = {
      height: '100%',
      width: '100%'
    }
    const className = this.state.selected ? 'card cardSelected' : 'card';
    return (
      <div 
      style={cardStyle} 
      onMouseEnter={this.handleMouseEnter.bind(this)}
      onMouseLeave={this.handleMouseLeave.bind(this)}
      onClick={this.handleClick.bind(this)} 
      className = {className}
      ref = {node => this.node = node}>
        <button style={buttonStyle}>
          {this.props.name} {this.props.patternName}
        </button>
      </div>
    );
  }
}

Card.defaultProps = {
  value: 12,
  pattern: 'Square',
  selected: false,
  interaction: true,
  updateHand: function(){}
}

export default Card;