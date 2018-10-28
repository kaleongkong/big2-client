import React, {Component} from 'react';
import Card from './card'

class Hand extends Component {
  constructor(props) {
    super(props);
    this.cards = []
  }

  render() {
    let i = 0;
    this.cards = []
    this.props.rawCards.forEach(function(rawCard){
      this.cards.push(
        <Card 
        key={`${rawCard.pattern}_${rawCard.value}`} 
        id={i} 
        value={rawCard.value}
        name={rawCard.name}
        pattern={rawCard.pattern}
        patternName={rawCard.pattern_name}
        interaction={this.props.interaction}
        updateHand={this.props.updateHand}/>);
      i++;
    }.bind(this));
    const handStyle = {
      position: 'absolute',
      bottom: 0,
      padding: '3%'
    }
    return (
      <div 
      className='handLayout' 
      style={handStyle}
      ref={node => this.node = node}>
        {this.cards}
      </div>
      );
  }
}

Hand.defaultProps = {
  rawCards: [],
  interaction: true,
  updateHand: function(){}
}

export default Hand;