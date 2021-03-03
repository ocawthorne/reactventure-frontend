export const fetchEntitiesSuccess = (allEntities) => {
   return {
      type: "FETCH_ENTITIES_SUCCESS",
      allEntities
   }
} 

export const fetchEntityInteractionsSuccess = (allEntityInteractions) => {
   return {
      type: "FETCH_ENTITY_INTERACTIONS_SUCCESS",
      allEntityInteractions
   }
} 

export const getAllEntities = () => {
   return dispatch => {
      dispatch({type: 'LOADING_ENTITIES'})
      return (
         fetch("https://reactventure-backend.herokuapp.com/api/v1/entities", {
         credentials: "include",
         method: "GET",
         headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": true
         }
         })
         .then(r => r.json())
         .then(entities => {
            dispatch(fetchEntitiesSuccess(entities));
         })
         .catch(error => {
            console.log("Error: ", error);
            })
      )
   }
}

export const getAllEntityInteractions = () => {
   return dispatch => {
      dispatch({type: 'LOADING_ENTITIES'})
      return (
         fetch("https://reactventure-backend.herokuapp.com/api/v1/entity_interactions", {
         credentials: "include",
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": true
         }
         })
         .then(r => r.json())
         .then(ei => {
            dispatch(fetchEntityInteractionsSuccess(ei));
            })
         .catch(error => {
            console.log("Error: ", error);
            })
      )
   }
}
