import React, {useState} from "react";
import {polling, pollTerminate} from "./polling";
import axios from "axios";
import './App.css';

function App() {

  const [data, setData] = useState('');
  let responseData = '';

/* Polling Start */
  function pollMethod() {
    return axios.get("http://www.mocky.io/v2/5d857c78320000411007b26b");
  }
  
  function afterPoll() {
    responseData = responseData + JSON.stringify({'msg':'Polling Stopped....'});
    setData(responseData);
  }


  let Obj = {
    pollMethod: pollMethod,
    pollInterval: 1000,
    continuePolling: continuePolling,
    onPollingStop: afterPoll,
    logEnabled: true
  };


  function continuePolling(obj) {
    if(obj.status === 200 && obj.data){
      responseData = responseData + JSON.stringify(obj.data);
      setData(responseData);
      if (obj.data.nextAction === "tenderStart"){
        return true;
      } else{
        return false;
      }
    }
  }

  const pollStart = () => {
    if(polling({...Obj}) === 2) console.log('Duplicate Polling Start; ignored')
  };

/* Polling End */

  return (
    <div className="App" >
      <button onClick={pollStart}  > start Polling </button>
      &nbsp;
      <button onClick={pollTerminate}> stop Polling </button>
      <br></br>
      <div className="text"> {data} </div>
    </div>
  );
}

export default App;
