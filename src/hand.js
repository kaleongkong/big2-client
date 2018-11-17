import React, {Component} from 'react';
import Card from './item/card'

class Hand extends Component {

  constructor(props) {
    super(props)
    this.state = {
      marginBottom: 0
    }
  }

  componentDidMount() {
    this.adjustPosition()
  }

  componentDidUpdate() {
    this.adjustPosition()
  }

  adjustPosition() {
    const newmarginBottom = (this.node.parentNode.offsetHeight - this.node.offsetHeight) / 2;
    if (Math.abs(newmarginBottom - this.state.marginBottom) > 2 && this.node.parentNode.offsetHeight > 0 && newmarginBottom > 0) {
      this.setState({marginBottom: newmarginBottom});
    }
  }

  render() {
    let i = 0;
    const cards = []
    this.props.rawCards.forEach(function(rawCard){
      cards.push(
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
      paddingLeft: '3%',
      marginBottom: this.state.marginBottom
    }
    return (
      <div 
      className='handLayout' 
      style={handStyle}
      ref={node => this.node = node}>
        {cards}
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