import React, {useState, useEffect} from 'react';
import Hammer from 'react-hammerjs';
import {useDispatch} from 'react-redux';

import './home.scss';
import QuickPanel from '../../components/quickpanel';
import StatusBar from '../../components/statusbar';

function Home() {
  const [action, setAction] = useState("Tap");
  const dispatch = useDispatch();
  
  const options = {
    // direction: 'DIRECTION_ALL'
  }

  const handleSwipe = (e)=>{
    // console.log(e);
    setAction(e.type + " " + e.direction)
    if(e.direction === 16){
      dispatch({type: "quickpanel/open"});
    }

    if(true){
      if (!navigator.userAgentData){
        document.documentElement.requestFullscreen();
      }
    }
  }

  return (
    <div className="viewport">
      <StatusBar/>
      <QuickPanel/>
      <Hammer onSwipe={handleSwipe} options={options} direction='DIRECTION_ALL'>
        <div className='home'>
          <div>{action}</div>
        </div>
      </Hammer>
    </div>
  );
}

export default Home;
