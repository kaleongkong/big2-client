import React, { Component } from 'react';
import axios from 'axios';
import {SERVER_HOST} from './api-config';

class Room extends Component {
  handleClick(user_id) {
    this.props.updateUser('user'+user_id);
    axios.get(SERVER_HOST + "/welcome/join_room?user=user"+user_id)
      .then(response => {
          this.props.updateGameFrame(response.data)
          if (this.props.sub) {
            this.props.sub.send({user: 'user'+user_id})
          }
        })
        .catch(error => console.log(error))
  }

  handleClickReset() {
    axios.get(SERVER_HOST + "/welcome/reset")
      .then(response => {
            console.log(response)
        })
        .catch(error => console.log(error))
  }

  render() {
    const roomStyle = {
      display: 'inline-block'
    }
    return (<div style={roomStyle}>
      <button onClick={this.handleClick.bind(this, 1)}> Player 1 </button>
      <button onClick={this.handleClick.bind(this, 2)}> Player 2 </button>
      <button onClick={this.handleClickReset.bind(this)}> Reset </button>
      </div>);
  }
}

export default Room;