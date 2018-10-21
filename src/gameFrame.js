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
    if (this.state.startState !== data.start_state) {
      this.setState({startState: data.start_state, cards: data[this.state.user]});
    }
  }

  updateRecentCombination(combination) {
    console.log(combination);
    if (this.state.recentCombination != combination) {
      this.setState({recentCombination: combination})
    }
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
      case 1:
        content = 
          (<div><div style={centerDisplayStyle} className='center-display'>
              <CombinationDisplayBox rawCards={this.state.recentCombination}/>
            </div>
            <PlayerSpace 
            updateRecentCombination={this.updateRecentCombination.bind(this)}
            sub = {this.state.moveSub} 
            cards = {this.state.cards}/></div>)
        break;
      default:
    }
    return (
      <div className='game-frame'>
        {content}
      </div>
    );
  }
}
export default GameFrame;