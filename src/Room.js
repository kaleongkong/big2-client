import React, { Component } from 'react';
import axios from 'axios';
import {SERVER_HOST} from './api-config';

class Room extends Component {
  handleClick(user_id) {
    this.props.updateUser(user_id);
    console.log(`this.props.roomId: ${this.props.roomId}`)
    const url = SERVER_HOST + "/welcome/join_room?user=" + user_id + (this.props.roomId ? `&room_id=${this.props.roomId}` : '')
    axios.get(url)
      .then(response => {
          this.props.updateGameFrame(response.data)
          if (this.props.sub) {
            this.props.sub.send({user: String(user_id), room_id: response.data.room_id})
          }
        })
        .catch(error => console.log(error))
  }

  handleClickReset() {
    this.props.resetGame();
  }

  render() {
    const roomStyle = {
      display: 'inline-block'
    }
    return (<div style={roomStyle}>
      <button onClick={this.handleClick.bind(this, 'user1')}> Player 1 </button>
      <button onClick={this.handleClick.bind(this, 'user2')}> Player 2 </button>
      <button onClick={this.handleClick.bind(this, 'user3')}> Player 3 </button>
      </div>);
  }
}

export default Room;