import React, {Component} from 'react';
import './playerSpace.css';
import Hand from './hand';
import axios from 'axios';
import {SERVER_HOST } from './api-config';

class PlayerSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawCards: this.props.cards,
      selectedCards: {}
    };
  }

  updateHand(card) {
    const id = `${card.props.value}-${card.props.pattern}`;
    const newSelectedCards = Object.assign({}, this.state.selectedCards);
    if (this.state.selectedCards[id] && !card.state.selected) {
      delete newSelectedCards[id];
    } else if (!this.state.selectedCards[id] && card.state.selected){
      newSelectedCards[id] = card.dataObj();
    }
    if (Object.values(newSelectedCards).length !== Object.values(this.state.selectedCards).length) {
      this.setState({
        selectedCards: newSelectedCards,
      });
    }
  }

  handleClick(e) {
    const selectedCards = Object.values(this.state.selectedCards);
    const params = {
      combination: selectedCards, 
      user: this.props.current_player,
      room_id: this.props.roomId}
    axios.post(SERVER_HOST + "/welcome/move", params)
      .then(response => {
          if (response.data.error) {
            alert(response.data.error);
          } else if (this.props.sub) {
            this.setState({
              rawCards: response.data.hand,
              selectedCards: {},
            });
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
          rawCards={this.state.rawCards}
          updateHand={this.updateHand.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default PlayerSpace;