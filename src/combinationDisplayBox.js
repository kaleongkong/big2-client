import React, {Component} from 'react';
import Hand from './hand';

class CombinationDisplayBox extends Component {
  render() {
    const boxStyle = {
      position: 'relative',
      top: '30%',
      left: '42%'
    }
    return (<div style={boxStyle} className='card-display-box'>
      <Hand 
      interaction={this.props.interaction}
      rawCards={this.props.rawCards}/>
      </div>)
  }
}

CombinationDisplayBox.defaultProps = {
  rawCards: [{value: 'King', pattern: 'Square'}, 
            {value: 'King', pattern: 'Diamond'}],
  interaction: false
}

export default CombinationDisplayBox;