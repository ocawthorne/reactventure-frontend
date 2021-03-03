export const authReducer = (state={loggedIn: false, currentUser: {}}, action) => {
   switch(action.type) {
      case "AUTH_SUCCESS":
         return {
            ...state,
            loggedIn: action.payload.loggedIn,
            currentUser: action.payload.currentUser
         }
      case "UPDATED_LOGIN":
         return {signInData: {
            username: action.signInData.username,
            password: action.signInData.password,
         }}
      case "RESETTED_LOGIN":
         return {...state}
      case "LOGOUT_SUCCESS":
         return {
            ...state,
            loggedIn: false,
            currentUser: {},
            userHistory: [],
            userObjects: []
         }
      default:
         return state
   }
}
