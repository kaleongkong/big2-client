import React, {Component} from 'react';
import Room from './Room'

class Lobby extends Component {
  handleCreateClick() {

  }

  render() {
    const lobbyStyle = {
      position: 'absolute',
      width: '90%',
      height: '90%',
      top: '5%',
      left: '5%',
      // border: '1px solid'
    }
    return <div className='lobby' style={lobbyStyle}>
      <button onClick={this.handleCreateClick.bind(this)}> Create </button>
      <Room/>
      <Room userIds= {['UserA', 'UserB']}/> 
      <Room userIds= {['UserA', 'UserB', 'UserC']}/> 
    </div>
  }
}

export default Lobby;