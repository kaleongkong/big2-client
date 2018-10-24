import React, {Component} from 'react';
import './playerSpace.css';
import Hand from './hand';
import axios from 'axios';
import ActionCable from 'actioncable'
import {SERVER_HOST, WEBSOCKET_HOST } from './api-config';

class PlayerSpace extends Component {
  constructor(props) {
    super(props);
    const rawCards=[];
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
        selectedCards.push({value: card.props.value, name: card.props.name, pattern: card.props.pattern, pattern_name: card.props.patternName})
      } else {
        remainedRawCards.push({value: card.props.value, name: card.props.name , pattern: card.props.pattern, pattern_name: card.props.patternName})
        remainedCards.push(card);
      }
    });
    axios.post(SERVER_HOST + "/welcome/move", {combination: selectedCards, user: this.props.current_player})
      .then(response => {
          console.log(response.data)
          if (response.data.error) {
            alert(response.data.error);
          } else if (this.props.sub) {
            this.hand = remainedCards;
            this.setState({rawCards: remainedRawCards});
            // this.props.updateRecentCombination(response.data)
            this.props.sub.send({combination: selectedCards, last_player: this.props.current_player});
          }
        })
        .catch(error => console.log(error))
  }

  handlePass(e) {
    const params = {combination: [], last_player: this.props.current_player};
    axios.post(SERVER_HOST + "/welcome/pass", params)
      .then(response => {
          console.log(response.data)
          if (response.data.error) {
            alert(response.data.error);
          } else if (this.props.sub) {
            this.props.sub.send(params);
          }
        }).catch(error => console.log(error))
  }

  render() {
    return (
      <div className='player-space'>
        {this.props.buttonEnable ? (<div className='player-buttons'>
          <button className='confirm-button' onClick={this.handleClick.bind(this)}>
            Confirm
          </button>
          <button className='pass-button' onClick={this.handlePass.bind(this)}>
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