import React, {Component} from "react"
import { connect } from 'react-redux';

class History extends Component {

   render() {
      return (
         <div className="history">
            <p>I've woken up in a strange, cold, dark little room with only a door in front of me.</p>
            <p>There is a desk on the left of me with a lit candle on top of it and a piece of paper next to the candle.</p>
            <p>An old chest sits to the right of me.</p>
            <p>A crowbar lies in front of the door.</p>
            <br />
            <p>COMMANDS:</p>
            <p>get/pick up/grab [item]" will add it to your inventory.</p>
            <p>use [item] on [another object]" will apply the first object to the second.</p>
            <p>look at [item]" will allow you to inspect it.</p>
            <p>touch/feel [item]" will let you feel the object.</p>
            <p>help" will display these choices again.</p>
            <br />
            {this.props.userHistory.map(u => 
               u.split("\n").map(h => <p>{h}</p>)
            )}
         </div>
      )
   }
}

const mapStateToProps = state => {
   return {
      currentUser: state.auth.currentUser,
      userHistory: state.commands.userHistory
   }
}

export default connect(mapStateToProps)(History)
