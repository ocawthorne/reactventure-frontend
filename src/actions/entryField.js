export const updateEntryField = (command) => {
   return {
      type: "UPDATED_COMMAND",
      command
   }
} 

export const submitEntryField = (command) => {
   return {
      type: "SUBMITTED_COMMAND",
      command,
      randomIndex: Math.floor(Math.random()*5)
   }
} 

export const clearHistory = () => {
   return {
      type: "CLEARED_HISTORY"
   }
} 
