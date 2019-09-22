/*
    -------------------A polling Utility---------------------
    #########################################################
    !!!!!!!!! Polling object will be passed as value !!!!!!!!
    #########################################################
    Please use helper functions to manipulate polling. 
    Object should have below  fields
    let Obj = {
        pollMethod: pollMethod,                 // mandatory 
        pollInterval: 1000,                     // mandatory
        continuePolling: continuePolling,       // mandatory
        onPollingStop: afterPoll,               // mandatory
        logEnabled: true                        // optional
    };
*/

let obj = {};

const validateParms = obj => {
  return obj.continuePolling &&
    typeof obj.continuePolling === "function" &&
    obj.hasOwnProperty("pollInterval") &&
    (obj.pollMethod && typeof obj.pollMethod === "function")
    ? true
    : false;
};

export const polling = Obj => {
  if (obj.hasPollingStarted) {
    return 2;
  }
  obj = { ...Obj };
  obj.hasPollingStarted = true;
  const pollingFn = () => {
    if (validateParms(obj)) {
      obj.status = "IN_PROGRESS";
      if (obj.logEnabled) console.log("pollMethod called");
      const poll = obj.pollMethod();
      poll.then(response => {
        const ispollContinue = obj.continuePolling(response);
        if (ispollContinue && !obj.isPollTerminate) {
          if (obj.logEnabled) console.log("continuePolling condition met");
          setTimeout(function() {
            pollingFn();
          }, obj.pollInterval);
        } else {
          if (obj.logEnabled && (obj.isPollTerminate && ispollContinue))
            console.log("poll terminated");
          if (obj.logEnabled && (!obj.isPollTerminate && !ispollContinue))
            console.log("continuePolling condition not met");
          obj.status = "IDLE";
          return true;
        }
      });
    } else {
      if (obj.logEnabled) console.log("Invalid settings passed");
      return false;
    }
  };
  return pollingFn();
};

export const pollingObj = () => {
  return { ...obj };
};

export const pollTerminate = () => {
  if (obj.logEnabled) console.log("Terminate request initiated");
  obj.isPollTerminate = true;
  const waitForPoll = () => {
    if (obj.status === "IDLE") {
      obj.hasPollingStarted = false;
      obj.onPollingStop();
    } else {
      if (obj.logEnabled) console.log("Terminate request - waiting");
      setTimeout(waitForPoll, 10);
    }
  };
  if (obj.hasPollingStarted) {
    waitForPoll();
  } else {
    if (obj.logEnabled)
      console.log("Polling Terminate is called before polling start");
    return 2;
  }
};
