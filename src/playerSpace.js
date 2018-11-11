import React, {Component} from 'react';
import './playerSpace.css';
import Hand from './hand';
import axios from 'axios';
import {SERVER_HOST } from './api-config';

class PlayerSpace extends Component {

  updateHand(card) {
    const id = `${card.props.value}-${card.props.pattern}`;
    const newSelectedCards = Object.assign({}, this.props.selectedCards);
    if (this.props.selectedCards[id] && !card.state.selected) {
      delete newSelectedCards[id];
    } else if (!this.props.selectedCards[id] && card.state.selected){
      newSelectedCards[id] = card.dataObj();
    }
    if (Object.values(newSelectedCards).length !== Object.values(this.props.selectedCards).length) {
      this.props.updateCards(null, newSelectedCards);
    }
  }

  handleClick(e) {
    const selectedCards = Object.values(this.props.selectedCards);
    const params = {
      combination: selectedCards, 
      user: this.props.current_player,
      room_id: this.props.roomId}
    axios.post(SERVER_HOST + "/welcome/move", params)
      .then(response => {
          if (response.data.error) {
            alert(response.data.error);
          } else if (this.props.sub) {
            console.log('move');
            console.log(selectedCards);
            this.props.updateCards(response.data.hand, {});
            params.last_player = this.props.current_player;
            params.end_game = response.data.end_game;
            this.props.sub.send(params);
            if (response.data.end_game) {
              alert('You win!')
              this.props.resetGame();
            }
          }
        })
        .catch(error => console.log(error))
  }

  handlePass(e) {
    const params = {combination: [], last_player: this.props.current_player, room_id: this.props.roomId};
    if (this.props.sub) {
      this.props.sub.send(params);
    }
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
          rawCards={this.props.cards}
          updateHand={this.updateHand.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default PlayerSpace;