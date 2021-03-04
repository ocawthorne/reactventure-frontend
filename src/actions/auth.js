const baseUrl = 'https://reactventure-backend.herokuapp.com'

export const signup = (userData) => {
   return dispatch => {
      fetch(`${baseUrl}/api/v1/users`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
         },
         credentials: "include",
         body: JSON.stringify({user: userData})
      })
      .then(res => res.json())
      .then(data => {
         dispatch({
         type: "AUTH_SUCCESS",
         payload: {
            loggedIn: true,
            currentUser: data.user
            }
         })
         dispatch(save(
            data.user,
            [],                                                          // History
            [],                                                          // Inventory
            ['crowbar','door','desk','drawer','paper','candle','chest'], // knownObjects
            [],                                                          // brokenObjects
            {openedChest: false, meltedIce: false, completedGame: false} // uniqueEvents
         )) // Default values at beginning of game
      })
   }
}

export const login = (userData, history) => {
   return dispatch => {
      fetch(`${baseUrl}/api/v1/sessions`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
         },
         credentials: 'include',
         body: JSON.stringify(userData)
      })
      .then(resp => resp.json())
      .then(data => {
         if (data.error) {
            alert(data.error);
         } else {
            dispatch({
               type: "AUTH_SUCCESS",
               payload: {
                  loggedIn: true,
                  currentUser: data.user
               }
            })
            history.push('/')
            dispatch(retrieve(data.user))
         }
      })
   }
}

export const checkLoggedIn = () => {
   return dispatch => {
      fetch(`${baseUrl}/api/v1/logged_in`, {
         credentials: 'include'
      })
      .then(res => res.json())
      .then(data => dispatch({
         type: "AUTH_SUCCESS",
         payload: {
            loggedIn: data.logged_in,
            currentUser: data.user
         }
      }))
   }
}

export const logout = () => {
   return dispatch => {
      fetch(`${baseUrl}/api/v1/logout`, {
         method: "DELETE",
         credentials: "include"
      })
      .then(res => res.json())
      .then(data => dispatch({type: "LOGOUT_SUCCESS",}))
   }
}

export const save = (user, hist=[], inventory=[], knownObjects=['crowbar','door','desk','drawer','paper','candle','chest'], brokenObjects=[], uniqueEvents={openedChest: false, meltedIce: false, completedGame: false}) => {
   return dispatch => {
      fetch(`https://reactventure-backend.herokuapp.com/api/v1/users/${user.id}`, {
         method: 'POST',
         headers: {
            "Content-Type": "application/json",
         },
         credentials: 'include',
         body: JSON.stringify({
            history: hist,
            inventory: inventory,
            known_objects: knownObjects,
            broken_objects: brokenObjects,
            unique_events: uniqueEvents
         })
      })
      .then(res => res.json())
      .then(data => {
         dispatch({
            type: "USER_HISTORY_FETCH_SUCCESS",
            payload: {
               currentUser: user,
               userHistory: hist,
               userObjects: inventory,
               knownObjects,
               brokenObjects,
               uniqueEvents
            }
         })
      })
   }
}

export const retrieve = (user) => {
   console.log('Retrieve initiated.')
   console.log(user)
   return dispatch => {
      fetch(`${baseUrl}/api/v1/users/${user.id}`, {
         credentials: "include",
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
            Accept: "application/json"
         }
      })
      .then(r => r.json())
      .then(data => dispatch({
            type: "USER_HISTORY_FETCH_SUCCESS",
            payload: {
               currentUser: user,
               userHistory: data.history,
               userObjects: data.inventory,
               knownObjects: data.known_objects,
               brokenObjects: data.broken_objects,
               uniqueEvents: data.unique_events
               }
            })
      )
      .catch(error => {
         console.log("Error: ", error);
      })
   }
}
