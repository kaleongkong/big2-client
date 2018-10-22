import React, {Component} from 'react';
import './playerSpace.css';
import Hand from './hand';
import axios from 'axios';
import ActionCable from 'actioncable'
import {SERVER_HOST, WEBSOCKET_HOST } from './api-config';

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
    this.state = {rawCards: this.props.cards};
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
        selectedCards.push({value: card.props.value, pattern: card.props.pattern})
      } else {
        remainedRawCards.push({value: card.props.value, pattern: card.props.pattern})
        remainedCards.push(card);
      }
    });
    this.hand = remainedCards;
    console.log(selectedCards);
    this.setState({rawCards: remainedRawCards});
    // axios.post(SERVER_HOST + "/welcome/move", {combination: selectedCards})
    //   .then(response => {
    //       console.log(response.data)
    //       this.props.updateRecentCombination(response.data)
    //     })
    //     .catch(error => console.log(error))
    if (this.props.sub) {
      this.props.sub.send({combination: selectedCards, last_player: this.props.current_player})
    }
  }

  render() {
    return (
      <div className='player-space'>
        {this.props.buttonEnable ? (<div className='player-buttons'>
          <button className='confirm-button' onClick={this.handleClick.bind(this)}>
            Confirm
          </button>
          <button className='pass-button'>
            Pass
          </button>
        </div>) : ""}
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