export const globals = {
  // set to stuff
  roleIDForDispatchSettings: "1414225202690265279",
  roleIDForOfficer: "1414225202690265279",
  roleIDForYM: "1414225202690265279",
  channelID: "1422624151310569614",
  removeNonBotMessages: true,

  // don't touch
  mainDispatcher: "",
  gameDateTime: new Date(),
  lastSetRealTime: Date.now(),
  currentTrainOrder: 1
};

export const trainOrders: Record<number, string> = {};