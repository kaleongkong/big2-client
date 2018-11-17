import React, { Component } from 'react';
import spade from './spade.svg';
import club from './club.svg';
import heart from './heart.svg';
import diamond from './diamond.svg';
import './card.css';

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

  dataObj() {
    return {value: this.props.value, name: this.props.name, pattern: this.props.pattern, pattern_name: this.props.patternName}
  }

  render () {
    const pattern_srcs = [diamond, club, heart, spade]
    const pattern_src = pattern_srcs[this.props.pattern];
    let containerClass = 'card-container'
    if (this.props.pattern === 0 || this.props.pattern === 2) {
      containerClass += ' red-text'
    }
    if (this.state.up) {
      containerClass += ' up'
    }
    return <div 
      onMouseEnter={this.handleMouseEnter.bind(this)}
      onMouseLeave={this.handleMouseLeave.bind(this)}
      onClick={this.handleClick.bind(this)} 
      className={containerClass}>
      <div className='card-inner-container'>
        <div className='card-top'>
          <div className='card-text'> <b>{this.props.name}</b> </div>
        </div>
        <div className='card-pattern-container'>
          <img className='card-pattern' src={pattern_src} />
        </div>
        <div className='card-bottom'>
          <div className='card-text'> <b>{this.props.name}</b> </div>
        </div>
      </div>
    </div>
  }
}

Card.defaultProps = {
  value: 12,
  name: 2,
  pattern: 1,
  patternName: 'diamond',
  selected: false,
  interaction: true,
  updateHand: function(){}
}

export default Card;