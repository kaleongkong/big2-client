import React, {Component} from 'react';
import TextBox from './textBox';
import PlayerSpace from './playerSpace';
import CombinationDisplayBox from './combinationDisplayBox';
import Room from './Room';
import ActionCable from 'actioncable'
import { SERVER_HOST, WEBSOCKET_HOST } from './api-config';
import {setCookie, getCookie} from './utils/helper'
import './playerSpace.css';
import './gameFrame.css';
import axios from 'axios';
import Lobby from './room/Lobby';

const initialState = {
  gameState: 0,
  recentCombination: [],
  cards: [],
  // sub: null,
  moveSub: null,
  roomSub: null,
  user: getCookie('userId'),
  currentRoomId: getCookie('currentRoomId'),
  rooms: []
};

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.cable = ActionCable.createConsumer(WEBSOCKET_HOST + '/cable');
    this.state = initialState;
  }

  componentDidMount() {
    if (this.state.rooms.length === 0) {
      this.getRooms();
    }
    this.setState(
      {
      //   sub: this.cable.subscriptions.create('NotesChannel', {
      // received: this.updateGameFrame.bind(this)}),
        roomSub: this.cable.subscriptions.create('RoomChannel', {
      received: this.updateLobby.bind(this)})
    });
  }

  createRoom() {
    const url = SERVER_HOST + "/welcome/create_room";
    axios.post(url)
      .then(response => {
          const userId = response.data.user_id;
          const listOfRooms = response.data.rooms;
          setCookie('userId', userId);
          const userRoomId = response.data.room_id;
          setCookie('currentRoomId', userRoomId);
          this.setState({
            user: userId,
            rooms: listOfRooms,
            currentRoomId: userRoomId
          });
          this.state.roomSub.send({userAction: 'create'});
        })
        .catch(error => console.log(error))
  }

  initUserAndUpdateLobby(userId, rooms, roomId) {
    setCookie('userId', userId);
    setCookie('currentRoomId', roomId);
    this.setState({
      user: userId,
      rooms: rooms,
      currentRoomId: roomId
    });
    this.state.roomSub.send({userAction: 'join'});
  }

  handleJoinRoom(data) {
    this.updateLobby(data);
    this.state.roomSub.send({userAction: 'join'});
  }

  handleLeaveRoom(data) {
    this.updateLobby(data);
    this.removeUserId();
    this.removeRoomId();
    this.state.roomSub.send({userAction: 'leave'});
  }

  getRooms() {
    const url = SERVER_HOST + "/welcome/get_rooms";
    axios.get(url)
      .then(response => {
          const listOfRooms = response.data.rooms;
          this.setState({
            rooms: listOfRooms
          });
        })
        .catch(error => console.log(error))
  }

  updateLobby(data) {
    const listOfRooms = data.rooms;
    const params = {
      rooms: listOfRooms
    };
    if (data.userAction === 'delete'){
      let roomExist = false;
      let i;
      for (i = 0; i < listOfRooms.length && !roomExist; i++) {
        let room = listOfRooms[i]
        if (room.id === this.state.currentRoomId) {
          roomExist = true;
        }
      }
      if (this.state.currentRoomId && !roomExist){
        params.currentRoomId = null;
        params.user = null;
        setCookie('currentRoomId', '');
        setCookie('userId', '');
      }
    }
    this.setState(params);
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
        currentRoomId: data.room_id
      }
      if (!this.state.moveSub && data.room_id !== this.state.userId) {
        stateParams.moveSub = this.cable.subscriptions.create({channel: 'MovesChannel', roomId: data.room_id}, {
      received: this.updateRecentCombination.bind(this)})
      }
      this.setState(stateParams);
    } else {
      this.setState({currentRoomId: data.room_id})
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
    this.updateGameFrame({players_stats: users, room_id: this.state.currentRoomId})
    if (data.end_game && data.user !== this.state.user) {
      alert('You Lose!')
      this.resetGameState();
    }
  }

  resetGame() {
    axios.get(SERVER_HOST + "/welcome/reset?room_id=" + this.state.currentRoomId)
      .then(response => {
            this.resetGameState();
          })
        .catch(error => console.log(error))
  }

  handleDeleteRoom(rooms) {
    this.setState({
      rooms: rooms,
      currentRoomId: null
    });
    this.removeUserId();
    this.removeRoomId();
    this.state.roomSub.send({userAction: 'delete'});
  }

  resetGameState() {
    const users = {}
    users[this.state.user] = {}
    users[this.state.user].game_state = 0
    this.updateGameFrame({players_stats: users});
    console.log(this.state);
    setCookie('userId', '');
    setCookie('currentRoomId', '');
    this.setState({
      user: null,
      recentCombination: []
    });
    this.state.roomSub.send({userAction: 'endGame'});
  }

  removeUserId() {
    setCookie('userId', '');
    this.setState({
      user: null
    })
  }

  removeRoomId() {
    setCookie('currentRoomId', '');
    this.setState({
      currentRoomId: null
    })
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
        // content = <Room
        //     updateGameFrame={this.updateGameFrame.bind(this)}
        //     updateUser = {this.updateUser.bind(this)}
        //     resetGame= {this.resetGame.bind(this)}
        //     roomId = {this.state.currentRoomId}
        //     sub = {this.state.sub}/>
        content = <Lobby
          showCreateButton = {!this.state.user}
          currentRoomId = {this.state.currentRoomId} 
          rooms = {this.state.rooms}
          createRoom = {this.createRoom.bind(this)}
          currentPlayer = {this.state.user}
          cable = {this.cable}
          initUserAndUpdateLobby = {this.initUserAndUpdateLobby.bind(this)}
          updateGameFrame = {this.updateGameFrame.bind(this)}
          handleJoinRoom = {this.handleJoinRoom.bind(this)}
          handleLeaveRoom = {this.handleLeaveRoom.bind(this)}
          handleDeleteRoom = {this.handleDeleteRoom.bind(this)}/>
        break;
      default:
        console.log(`this.state.currentRoomId: ${this.state.currentRoomId}`)
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
            roomId = {this.state.currentRoomId} /></div>)
        break;
    }
    return (
      <div className='game-frame'>
      <div>
        room id: {this.state.currentRoomId}
        <br></br>
        user id: {this.state.user}
        { true ? (<div><button onClick={this.removeUserId.bind(this)}> Remove user ID </button><button onClick={this.removeRoomId.bind(this)}> Remove room ID </button></div>) : ""}
      </div>
        {content}
      </div>
    );
  }
}
export default GameFrame;