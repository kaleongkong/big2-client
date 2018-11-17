import React, {Component} from 'react';
import Room from './Room'
import GenericButton from '../item/genericButton';
import './Lobby.css'

class Lobby extends Component {
  handleCreateClick() {
    this.props.createRoom();
  }

  render() {
    const rooms = []
    console.log(this.props.rooms);
    this.props.rooms.forEach(function(room){
      const roomNode = <Room userIds={room.user_ids} 
                            currentPlayer={this.props.currentPlayer}
                            currentRoomId={this.props.currentRoomId}
                            roomId={room.id}
                            status={room.status}
                            key={room.id}
                            roomLimit={room.limit}
                            owner = {room.owner}
                            cable = {this.props.cable}
                            updateGameFrame = {this.props.updateGameFrame.bind(this)}
                            initUserAndUpdateLobby = {this.props.initUserAndUpdateLobby.bind(this)}
                            handleLeaveRoom = {this.props.handleLeaveRoom.bind(this)}
                            handleDeleteRoom = {this.props.handleDeleteRoom.bind(this)}/>
      rooms.push(roomNode)
    }.bind(this));
    return <div className='lobby'>
      <GenericButton text='Create Room' handleClick={this.handleCreateClick.bind(this)} disable={!this.props.showCreateButton} lobbyButton={true}/>
      <Room header={true}/>
      {rooms}
    </div>
  }
}

export default Lobby;