import React, {Component} from 'react';

class Room extends Component {

  renderPlayerSection() {
    const users = []
    const userRowStyle = {
      display: 'flex',
    }
    const nameSpaceStyle = {
      margin: '2%'
    }
    for (let i=0; i < this.props.userIds.length; i++) {
      users.push(<div style={nameSpaceStyle}> {this.props.userIds[i]} </div>)
    }
    return <div style={userRowStyle}> {users} </div>
  }

  handleJoinClick() {

  }

  handleLeaveClick() {

  }

  render() {
    const roomStyle = {
      position: 'relative',
      width: '100%',
      height: '10%',
      maxHeight: '50px',
      fontSize: '12px'
      // border: '1px solid'
    }
    const innerStyle = {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: '80%',
      top: '10%',
      maxHeight: '50px',
      border: '1px solid'
    }
    return <div className='room-container' style={roomStyle}>
      <div className='room' style={innerStyle}>
        <div> Room {this.props.roomId} </div>
        {this.renderPlayerSection()}
        <div> limit {this.props.userIds.length}/{this.props.roomLimit} </div>
        <div>
          {this.props.status}
        </div>
        <div>
          <button onClick={this.handleJoinClick.bind(this)}> Join </button>
          <button onClick={this.handleLeaveClick.bind(this)}> Leave </button>
        </div>
      </div>
    </div>
  }
}

Room.defaultProps = {
  roomId: 1,
  userIds: ['18293040', '23452345', '87948342', '23452344'],
  roomLimit: 4,
  status: 'Waiting...'
}

export default Room;