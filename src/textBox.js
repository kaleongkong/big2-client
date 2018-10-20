import React, {Component} from 'react';

class TextBox extends Component {
  render() {
    const waitingForOpponent = {
      position: 'relative',
      fontSize: 30,
      top: '35%',
      left: '15%'
    }
    return (
        <div style={waitingForOpponent}className='displayItem'>
          {'Waiting for opponent...'}
        </div>
      );
  }
}

export default TextBox;