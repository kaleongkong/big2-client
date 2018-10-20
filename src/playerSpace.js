import React, {Component} from 'react';
import './playerSpace.css';
import Hand from './hand';

class PlayerSpace extends Component {
  constructor(props) {
    super(props);
    const rawCards=[{value: 'Ace', pattern: 'Square'}, 
                    {value: 'Ace', pattern: 'Diamond'},
                    {value: 'King', pattern: 'Square'},
                    {value: 'King', pattern: 'Spade'},
                    {value: '3', pattern: 'Diamond'},
                    {value: '8', pattern: 'Square'},
                    {value: '3', pattern: 'Spade'},
                    {value: '3', pattern: 'Square'},
                    {value: '2', pattern: 'Square'},
                    {value: '6', pattern: 'Heart'}];
    this.state = {rawCards: rawCards};
    this.hand = [];
  }

  updateHand(card) {
    this.hand[card.props.id] = card;
  }

  handleClick(e) {
    const selectedCards = []
    const remainedRawCards = []
    const remainedCards = []
    this.hand.forEach(function(card) {
      if (card.state.selected){
        selectedCards.push(card.props.value)
      } else {
        remainedRawCards.push({value: card.props.value, pattern: card.props.pattern})
        remainedCards.push(card);
      }
    });
    this.hand = remainedCards;
    console.log(selectedCards);
    this.setState({rawCards: remainedRawCards});
  }

  render() {
    return (
      <div className='player-space'>
        <div className='player-buttons'>
          <button className='confirm-button' onClick={this.handleClick.bind(this)}>
            Confirm
          </button>
          <button className='pass-button'>
            Pass
          </button>
        </div>
        <div className='player-hand'>
          <Hand
          rawCards={this.state.rawCards}
          updateHand={this.updateHand.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default PlayerSpace;