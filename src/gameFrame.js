import React, {Component} from 'react';
import TextBox from './textBox';
import PlayerSpace from './playerSpace';
import CombinationDisplayBox from './combinationDisplayBox';
import Room from './Room';
import ActionCable from 'actioncable'
import { WEBSOCKET_HOST } from './api-config';
import './playerSpace.css';
import './gameFrame.css';

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startState: 0,
      recentCombination: [],
      cards: [],
      sub: null,
      moveSub: null,
      user: null
    }
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
      this.setState({user: userId});
    }
  }

  updateGameFrame(data){
    console.log('updateGameFrame')
    console.log(this.state);
    if (this.state.startState !== data.start_state) {
      this.setState({startState: data[this.state.user].start_state, cards: data[this.state.user].deck});
    }
  }

  updateRecentCombination(data) {
    const combination = data.combination
    console.log('updateRecentCombination')
    console.log(data);
    if (this.state.recentCombination !== combination) {
      this.setState({recentCombination: combination})
    }
    if (this.state.user === 'user1') {
      this.updateGameFrame({'user1' : {start_state: data.users[0].game_state}})
    } else if (this.state.user === 'user2'){
      this.updateGameFrame({'user2' : {start_state: data.users[1].game_state}})
    }
    if (data.end_game && data.user !== this.state.user) {
      alert('You Lose!')
    }
  }

  render() {
    console.log('render');
    console.log(this.state)
    console.log(this.state.startState === 1)
    const centerDisplayStyle = {
      position: 'absolute',
      width: '70%',
      height: '50%',
      left: '15%',
      top: '10%'
    }
    let content = '';
    switch (this.state.startState) {
      case -1:
        content = <TextBox/>
        break;
      case 0:
        content = <Room 
            updateGameFrame={this.updateGameFrame.bind(this)}
            updateUser = {this.updateUser.bind(this)}
            sub = {this.state.sub}/>
        break;
      default:
        content = 
          (<div><div style={centerDisplayStyle} className='center-display'>
              <CombinationDisplayBox rawCards={this.state.recentCombination}/>
            </div>
            <PlayerSpace 
            updateRecentCombination={this.updateRecentCombination.bind(this)}
            sub = {this.state.moveSub} 
            cards = {this.state.cards}
            current_player= {this.state.user}
            buttonEnable = {this.state.startState === 1}/></div>)
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