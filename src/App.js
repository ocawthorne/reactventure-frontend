import React, {Component} from "react";
import { connect } from 'react-redux';

import './App.css';
import EntryField from "./containers/EntryField";
import SideBar from './components/SideBar'
import History from './containers/History'

import { getAllEntities, getAllEntityInteractions } from './actions/entities'


class App extends Component {

  componentDidMount() {
    this.props.getAllEntities()
    this.props.getAllEntityInteractions()
 }

  render() {
    return (
      <div className="App">
        <SideBar />
        <div className="App-header">
          <History />
          <EntryField />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
     allEntities: state.commands.allEntities,
     allEntityInteractions: state.commands.allEntityInteractions
  }
}

export default connect(mapStateToProps, { getAllEntities, getAllEntityInteractions })(App)
