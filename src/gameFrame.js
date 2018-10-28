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

const initialState = {
  gameState: 0,
  recentCombination: [],
  cards: [],
  sub: null,
  moveSub: null,
  user: null
};

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const cable = ActionCable.createConsumer(WEBSOCKET_HOST + '/cable');
    this.setState(
      {
        sub: cable.subscriptions.create('NotesChannel', {
      received: this.updateGameFrame.bind(this)}),
        moveSub: cable.subscriptions.create('MovesChannel', {
      received: this.updateRecentCombination.bind(this)}),
    });
  }

  updateUser(userId) {
    if (!this.state.user) {
      this.setState({user: parseInt(userId)});
    }
  }

  updateGameFrame(data){
    console.log(`this.state.user: ${this.state.user}`)
    if (this.state.gameState !== data.players_stats[this.state.user].game_state) {
      this.setState({
        gameState: data.players_stats[this.state.user].game_state, 
        cards: data.players_stats[this.state.user].deck
      });
    }
  }

  updateRecentCombination(data) {
    const combination = data.combination;
    if (this.state.recentCombination !== combination) {
      this.setState({recentCombination: combination})
    }
    const users = []
    users[this.state.user] = {}
    users[this.state.user].game_state = data.players_stats.users[this.state.user].game_state
    this.updateGameFrame({players_stats: users})
    if (data.end_game && data.user !== this.state.user) {
      alert('You Lose!')
      this.resetGameState();
    }
  }

  resetGame() {
    axios.get(SERVER_HOST + "/welcome/reset")
      .then(response => {
            this.resetGameState();
          })
        .catch(error => console.log(error))
  }

  resetGameState() {
    const users = []
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
    console.log('render');
    console.log(this.state)
    console.log(this.state.gameState === 1)
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
            sub = {this.state.sub}/>
        break;
      default:
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
            buttonEnable = {this.state.gameState === 1}/></div>)
        break;
    }
    return (
      <div className='game-frame'>
        {content}
      </div>
    );
  }
}
export default GameFrame;