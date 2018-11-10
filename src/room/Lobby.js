import React, {Component} from 'react';
import Room from './Room'

class Lobby extends Component {
  handleCreateClick() {
    this.props.createRoom();
  }

  render() {
    const lobbyStyle = {
      position: 'absolute',
      width: '90%',
      height: '90%',
      top: '9%',
      left: '5%',
    }
    const rooms = []
    console.log(this.props.rooms);
    this.props.rooms.forEach(function(room){
      const roomNode = <Room userIds={room.user_ids} 
                            currentPlayer={this.props.currentPlayer}
                            currentRoomId={this.props.currentRoomId}
                            roomId={room.id}
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
    return <div className='lobby' style={lobbyStyle}>
      {this.props.showCreateButton ? <button onClick={this.handleCreateClick.bind(this)}> Create </button> : ''}
      {rooms}
    </div>
  }
}

export default Lobby;