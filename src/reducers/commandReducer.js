const help = `COMMANDS:\n
"get/pick up/grab [item]" will add it to your inventory.\n
"use [item] on [another object]" will apply the first object to the second.\n
"look at [item]" will allow you to inspect it.\n
"touch/feel [item]" will let you feel the object.\n
"help" will display these choices again.`

const hitDialogues = [
   `Violence is never the answer.`,
   `That hurt, and it did nothing. Thanks.`,
   `Didn't your mother teach you anything?`,
   `Ow.`,
   `Great, now I'm going to get a bruise.`
]

const prayDialogues = [
   `God says: "You must lead the people to the Promised Land!"\nI'll do it next weekend if the weather's good.`,
   `God finds it surprising that you need His help in such a simple game.\nHis omniscience gets the better of Him sometimes.`,
   `I prayed and nothing happened. Maybe next time.`,
   `I knelt down to pray and felt a slight crick in my back. I should get that checked out.`,
   `God suggests that I look around the room a bit more.\nI think He's busy.`
]

const defaultState = {
   //! Inventory-related state
   // currentUser: '',    //? When a login is prompted, this value will be the user ID.
   // allEntities: [],
   // allEntityInteractions: [],
   isLoading: false,
   
   userObjects: [],    //? Starting empty at the beginning of the game, this is populated through 'get x' commands.
   knownObjects: ['crowbar','door','desk','drawer','paper','candle','chest'],   //? Gradually populated based on event.
   brokenObjects: [],

   //! History-related state
   userHistory: [],    //? This array stores every piece of narrative, feedback, and command that the user has prompted. This is rendered to the History container.

   //! Command-related state
   command: '',        //? This is modified when the user types in an input. When executed, this command is split into its respective words for further processing.
   uniqueEvents: {
      openedChest: false, //? This event is triggered by "use crowbar on chest" or "open chest with crowbar". Also destroys crowbar.
      meltedIce: false,
      completedGame: false
   }
}                      //! Specifically: "get x", "use x on y", "open x", and so on.

function aHNC(state, notification) { // Add History No Change (aHNC)
   return {...state, userHistory: [...state.userHistory, `> ${state.command}\n${notification}\n `]}
}

export const commandReducer = (state=defaultState, action) => {
   switch (action.type) {
      case 'UPDATED_COMMAND':
         return {...state, command: action.command}
      case 'SUBMITTED_COMMAND':
         if (state.uniqueEvents.completedGame) {
            return aHNC(state, `Another room lies ahead, but my eyes haven't adapted to the light yet\nTO BE CONTINUED...`)
         }
         let cmdSplit = action.command.split(" ")
         let history = state.userHistory
         let item = cmdSplit[cmdSplit.length - 1]
         switch(cmdSplit[0]) {
            case 'get': //! Handling inventory changes
            case 'pick':
            case 'grab':
               if (!state.knownObjects.includes(item)) {
                  return aHNC(state, `I don't know what '${item}' is.`)
               } else if (state.userObjects.includes(item)) {
                  return aHNC(state, `I already have that!`)
               } else {
                  console.log(state.allEntities)
                  if (state.allEntities.filter(obj => obj.name === item)[0].obtainable) {
                     let notification = `I picked up the ${item}.`
                     return {...state, userObjects: [...state.userObjects, item], userHistory: [...history, `> ${action.command}\n${notification}\n `]}
                  } else {
                     return aHNC(state, `I can't pick that up!`)
                  }
               }
            case 'look':
               if (!state.knownObjects.includes(item)) {
                  return aHNC(state, `I don't know what '${item}' is.`)
               } else {
                  let object = state.allEntities.filter(obj => obj.name === item)[0]
                  return aHNC(state, (state.brokenObjects.includes(object.name) ? object.description_broken : object.description))
               }
            case 'touch':
            case 'feel':
               if (!state.knownObjects.includes(item)) {
                  return aHNC(state, `I don't know what '${item}' is.`)
               } else {
                  return aHNC(state, state.allEntities.filter(obj => obj.name === item)[0].feel)
               }
            case 'use': //! Handling the combination of two knownObjects.
               let items = [cmdSplit[1], item].sort()
               if (state.knownObjects.includes(items[0]) && state.knownObjects.includes(items[1]) && state.userObjects.includes(cmdSplit[1]) ) {
                  let outcome = state.allEntityInteractions.filter(obj => obj.entity_1 === items[0] && obj.entity_2 === items[1])[0]
                  if (!outcome) return aHNC(state, `I don't know how to do that.`)
                  switch(outcome.action) {
                     case 'openedChest':
                        switch(state.uniqueEvents.openedChest) {
                           case false:
                              return {
                                 ...state,
                                 knownObjects: [...state.knownObjects, 'ice'],
                                 uniqueEvents: {...state.uniqueEvents, openedChest: true},
                                 userObjects: [...state.userObjects].filter(obj => obj !== 'crowbar'),
                                 userHistory: [...state.userHistory, `> ${state.command}\n${outcome.result_text}\n `],
                                 brokenObjects: [...state.brokenObjects, 'crowbar', 'chest']
                              }
                           case true:
                              return aHNC(state, `I've already cracked the chest open.`)
                           default:
                              return {...state}
                        }
                     case 'meltedIce':
                        switch(state.uniqueEvents.meltedIce) {
                           case false:
                              return {
                                 ...state,
                                 knownObjects: [...state.knownObjects, 'key'],
                                 uniqueEvents: {...state.uniqueEvents, meltedIce: true},
                                 userObjects: [...[...state.userObjects].filter(obj => obj !== 'ice'), 'key'],
                                 userHistory: [...state.userHistory, `> ${state.command}\n${outcome.result_text}\n `],
                                 brokenObjects: [...state.brokenObjects, 'ice']
                              }
                           case true:
                              return aHNC(state, `I've already melted the ice to reveal a key.`)
                           default:
                              return {...state}
                        }
                     case 'completedGame':
                        switch(state.uniqueEvents.completedGame) {
                           case false:
                              return {
                                 ...state,
                                 uniqueEvents: {...state.uniqueEvents, completedGame: true},
                                 userObjects: [...[...state.userObjects].filter(obj => obj !== 'key')],
                                 userHistory: [...state.userHistory, `> ${state.command}\n${outcome.result_text}\n\nTO BE CONTINUED...\n `],
                                 brokenObjects: [...state.brokenObjects, 'key']
                              }
                           default:
                              return {...state}
                        }
                     default:
                        return aHNC(state, outcome.result_text)
                  }
               } else {
                  if (!state.userObjects.includes(cmdSplit[1]) && state.knownObjects.includes(cmdSplit[1]) && state.allEntities.filter(obj => obj.name === cmdSplit[1])[0].obtainable) {
                     return aHNC(state, `I don't have the ${cmdSplit[1]} in my inventory.`)
                  } else {
                     return aHNC(state, `I don't know how to do that.`)
                  }
               }
            case 'open':
               if (cmdSplit.length > 2) {
                  return aHNC(state, `Remember: the format for most commands is "use [first item] on [second item]".`)
               } else {
                  switch(item) {
                     case 'door':
                        return aHNC(state, `The door won't budge. I either need to find a key or use brute force.`)
                     case 'chest':
                        if (state.uniqueEvents.openedChest) {
                           return aHNC(state, `The chest is already open.`)
                        } else {
                           return aHNC(state, `The chest seems to be jammed shut.`)
                        }
                     case 'drawer':
                        return aHNC(state, `The drawer swings open with ease.\nSadly, there's nothing inside.`)
                     default:
                        return aHNC(state, `I can't open that.`)
                  }
               }
            case 'help':
               return aHNC(state, help)
            //? For fun
            case 'pray': //! TO ADD ABOVE: Miscellaneous commands such as open, look.
               return aHNC(state, prayDialogues[action.randomIndex])
            case 'punch':
            case 'hit':
               return aHNC(state, hitDialogues[action.randomIndex])
            default:
               return {...state, userHistory: [...history, `> ${action.command}\nI don't know how to do that.\n `]}
         }



      //? Loading entities and interactions
      case "LOADING_ENTITIES":
         return {...state, isLoading: true}
      case "FETCH_ENTITIES_SUCCESS":
         return {...state, allEntities: action.allEntities, isLoading: false}
      case "FETCH_ENTITY_INTERACTIONS_SUCCESS":
         return {...state, allEntityInteractions: action.allEntityInteractions, isLoading: false}
      case "USER_HISTORY_FETCH_SUCCESS":
         return {
            ...state,
            currentUser: action.payload.user,
            userHistory: action.payload.userHistory,
            userObjects: action.payload.userObjects,
            knownObjects: action.payload.knownObjects,
            brokenObjects: action.payload.brokenObjects,
            uniqueEvents: action.payload.uniqueEvents
         }
      case "CLEARED_HISTORY":
         return defaultState
      default:
         return state
   }
}
