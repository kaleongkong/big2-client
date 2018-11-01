import React, {Component} from 'react';
import TextBox from './textBox';
import PlayerSpace from './playerSpace';
import CombinationDisplayBox from './combinationDisplayBox';
import Room from './Room';
import ActionCable from 'actioncable'
import { SERVER_HOST, WEBSOCKET_HOST } from './api-config';
import './playerSpace.css';
import './gameFrame.css';
import axios from 'axios';
import Lobby from './room/Lobby';

const initialState = {
  gameState: 0,
  recentCombination: [],
  cards: [],
  sub: null,
  moveSub: null,
  user: null,
  roomId: null
};

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.cable = ActionCable.createConsumer(WEBSOCKET_HOST + '/cable');
    this.state = initialState;
  }

  componentDidMount() {
    this.setState(
      {
        sub: this.cable.subscriptions.create('NotesChannel', {
      received: this.updateGameFrame.bind(this)}),
    });
  }

  updateUser(userId) {
    if (!this.state.user) {
      this.setState({user: userId});
    }
  }

  updateGameFrame(data){
    console.log(`this.state.user: ${this.state.user}`)
    if (this.state.user && this.state.gameState !== data.players_stats[this.state.user].game_state) {
      const stateParams = {
        gameState: data.players_stats[this.state.user].game_state, 
        cards: data.players_stats[this.state.user].deck,
        roomId: data.room_id
      }
      if (!this.state.moveSub && data.room_id) {
        stateParams.moveSub = this.cable.subscriptions.create({channel: 'MovesChannel', roomId: data.room_id}, {
      received: this.updateRecentCombination.bind(this)})
      }
      this.setState(stateParams);
    } else {
      this.setState({roomId: data.room_id})
    }
  }

  updateRecentCombination(data) {
    const combination = data.combination;
    if (this.state.recentCombination !== combination) {
      this.setState({recentCombination: combination})
    }
    const users = {}
    users[this.state.user] = {}
    users[this.state.user].game_state = data.players_stats.users[this.state.user].game_state
    this.updateGameFrame({players_stats: users, room_id: this.state.roomId})
    if (data.end_game && data.user !== this.state.user) {
      alert('You Lose!')
      this.resetGameState();
    }
  }

  resetGame() {
    axios.get(SERVER_HOST + "/welcome/reset?room_id=" + this.state.roomId)
      .then(response => {
            this.resetGameState();
          })
        .catch(error => console.log(error))
  }

  resetGameState() {
    const users = {}
    users[this.state.user] = {}
    users[this.state.user].game_state = 0
    this.updateGameFrame({players_stats: users});
    console.log(this.state);
    this.setState({
      user: null,
      recentCombination: []
    });
  }

  render() {
    const centerDisplayStyle = {
      position: 'absolute',
      width: '70%',
      height: '50%',
      left: '15%',
      top: '10%'
    }
    let content = '';
    switch (this.state.gameState) {
      case -1:
        content = <TextBox/>
        break;
      case 0:
        content = <Room
            updateGameFrame={this.updateGameFrame.bind(this)}
            updateUser = {this.updateUser.bind(this)}
            resetGame= {this.resetGame.bind(this)}
            roomId = {this.state.roomId}
            sub = {this.state.sub}/>
        break;
      default:
        console.log(`this.state.roomId: ${this.state.roomId}`)
        content = 
          (<div>
            {this.state.user}
            <div style={centerDisplayStyle} className='center-display'>
              <CombinationDisplayBox rawCards={this.state.recentCombination}/>
            </div>
            <PlayerSpace 
            updateRecentCombination={this.updateRecentCombination.bind(this)}
            updateGameFrame={this.updateGameFrame.bind(this)}
            resetGame= {this.resetGame.bind(this)}
            sub = {this.state.moveSub} 
            cards = {this.state.cards}
            current_player= {this.state.user}
            buttonEnable = {this.state.gameState === 1}
            roomId = {this.state.roomId} /></div>)
        break;
    }
    return (
      <div className='game-frame'>
      <div>
        room id: {this.state.roomId}
      </div>
        {content}
      </div>
    );
  }
}
export default GameFrame;