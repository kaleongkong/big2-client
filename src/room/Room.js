import React, {Component} from 'react';
import { SERVER_HOST } from '../api-config';
import GenericButton from '../item/genericButton';
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
    for (let i=0; i < this.props.userIds.length; i++) {
      users.push(<div key={i} className='name-space'> 
        {this.props.userIds[i]} </div>)
    }
    return <div className='user-row'> {users} </div>
  }

  handleJoinClick() {
    const url = SERVER_HOST + "/welcome/join_room";
    axios.post(url, {room_id: this.props.roomId, user_id: this.props.currentPlayer})
      .then(response => {
          const listOfRooms = response.data.rooms;
          const userId = response.data.user_id;
          const roomId = response.data.room_id;
          this.setUpSub(roomId);
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

  isAvailable() {
    return this.props.status === 0 && !this.props.header && this.props.userIds.length < this.props.roomLimit;
  }

  isStarted() {
    return this.props.status === 2
  }

  renderStatus() {
    const available = this.isAvailable();
    const started = this.isStarted();
    const className = `room-status-container ${available ? 'available' : (started ? 'started' : 'full')}`
    return <div className={className}>
      {this.props.header ? 'Status' : (available ? 'Available' : (started ? 'Started' : 'Full')) }
    </div>
  }

  render() {
    const is_participant = this.props.userIds.includes(this.props.currentPlayer);
    const is_owner = this.props.owner === this.props.currentPlayer;
    const deleteButton = is_owner ? <GenericButton text='Delete' handleClick={this.handleDelete.bind(this)} disable={false} roomButton={true} alert={true}  placeholder={this.props.header}/> : "";
    const startButton = is_owner && this.props.userIds.length > 1 ? <GenericButton text='Start' handleClick={this.handleStart.bind(this)} disable={false} roomButton={true}  placeholder={this.props.header}/> : "";
    
    const showJoinButton = !is_owner && !is_participant && !this.props.currentRoomId
    const joinButton = showJoinButton ? <GenericButton text='Join' handleClick={this.handleJoinClick.bind(this)} disable={!this.isAvailable()} roomButton={true}/> : "";
    const leaveButton = !is_owner && is_participant ? <GenericButton text='Leave' handleClick={this.handleLeaveClick.bind(this)} disable={false} roomButton={true} alert={true}/> : "";

    const roomClassName = `room ${this.props.header ? 'header' : ''}`
    return <div className='room-container'>
      <div className={roomClassName}>
        <div className='room-id-container'> 
          {this.props.header ? 'Room' : `${this.props.roomId}` }
        </div>
        <div className='room-players-container'>
          {this.props.header ? 'Players' : this.renderPlayerSection() }
        </div>
        <div className='room-limit-container'>
          {this.props.header ? '#/#' : `${this.props.userIds.length}/${this.props.roomLimit}` }
        </div>
        {this.renderStatus()}
        <div className='room-buttons-container'>
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
  header: false,
  roomId: null,
  userIds: ['18293040', '23452345', '87948342', '23452344'],
  roomLimit: 4,
  status: 0,
  owner: null,
  currentRoomId: null,
  currentPlayer: null,
  updateGameFrame: function(){},
  initUserAndUpdateLobby: function(){},
  handleLeaveRoom: function(){},
  handleDeleteRoom: function(){}
}

export default Room;