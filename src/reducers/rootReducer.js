import { combineReducers } from 'redux'
import { commandReducer } from './commandReducer'
import { authReducer } from './authReducer'

export default combineReducers({
   commands: commandReducer,
   auth: authReducer
})
