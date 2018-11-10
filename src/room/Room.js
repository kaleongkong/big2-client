import React, {Component} from 'react';
import { SERVER_HOST } from '../api-config';
import axios from 'axios';
import './Room.css'

class Room extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sub: null
    }
  }

  componentDidMount() {
    if (!this.state.sub && this.props.userIds.includes(this.props.currentPlayer)) {
      this.setUpSub();
    }
  }

  componentDidUpdate() {
    if (!this.state.sub && this.props.userIds.includes(this.props.currentPlayer)) {
      this.setUpSub();
    }
  }

  setUpSub(roomId) {
    console.log('set up sub')
    this.setState({
      sub: this.props.cable.subscriptions.create({channel: 'NotesChannel', roomId: this.props.currentRoomId || roomId}, {
    received: this.props.updateGameFrame.bind(this)})
    });
  }

  renderPlayerSection() {
    const users = []
    const userRowStyle = {
      display: 'flex',
    }
    const nameSpaceStyle = {
      margin: '2%'
    }
    for (let i=0; i < this.props.userIds.length; i++) {
      users.push(<div key={i} style={nameSpaceStyle}> {this.props.userIds[i]} </div>)
    }
    return <div style={userRowStyle}> {users} </div>
  }

  handleJoinClick() {
    const url = SERVER_HOST + "/welcome/join_room";
    axios.post(url, {room_id: this.props.roomId, user_id: this.props.currentPlayer})
      .then(response => {
          const listOfRooms = response.data.rooms;
          const userId = response.data.user_id;
          const roomId = response.data.room_id;
          this.setUpSub(roomId);
          console.log(this.state);
          // debugger
          this.props.initUserAndUpdateLobby(userId, listOfRooms, roomId);
        })
        .catch(error => console.log(error))
  }

  handleLeaveClick() {
    const url = SERVER_HOST + "/welcome/leave_room";
    axios.post(url, {room_id: this.props.roomId, user_id: this.props.currentPlayer})
      .then(response => {
          this.props.handleLeaveRoom(response.data);
        })
        .catch(error => console.log(error))
  }

  handleDelete() {
    const url = SERVER_HOST + "/welcome/delete_room";
    axios.post(url, {room_id: this.props.roomId})
      .then(response => {
          const listOfRooms = response.data.rooms;
          this.props.handleDeleteRoom(listOfRooms);
        })
        .catch(error => console.log(error))

  }

  handleStart() {
    this.state.sub.send({user: String(this.props.currentPlayer), room_id: this.props.currentRoomId})
  }

  render() {
    const is_participant = this.props.userIds.includes(this.props.currentPlayer);
    const is_owner = this.props.owner === this.props.currentPlayer;
    const deleteButton = is_owner ? (<button onClick={this.handleDelete.bind(this)}> Delete </button>) : ""
    const startButton = is_owner && this.props.userIds.length > 1 ? (<button onClick={this.handleStart.bind(this)}> Start </button>) : ""
    const joinButton = !is_owner && !is_participant && !this.props.currentRoomId ? <button onClick={this.handleJoinClick.bind(this)}> Join </button> : "";
    const leaveButton = !is_owner && is_participant ? <button onClick={this.handleLeaveClick.bind(this)}> Leave </button> : "";
    return <div className='room-container'>
      <div className='room'>
        <div> Room {this.props.roomId} </div>
        {this.renderPlayerSection()}
        <div> limit {this.props.userIds.length}/{this.props.roomLimit} </div>
        <div>
          {this.props.status}
        </div>
        <div>
          {joinButton}
          {leaveButton}
          {startButton}
          {deleteButton}
        </div>
      </div>
    </div>
  }
}

Room.defaultProps = {
  roomId: null,
  userIds: ['18293040', '23452345', '87948342', '23452344'],
  roomLimit: 4,
  status: 'Waiting...',
  owner: null,
  currentRoomId: null,
  currentPlayer: null
}

export default Room;