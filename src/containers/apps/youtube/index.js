import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, LazyComponent} from 'components/utils';
import {dispatchAction, dispatchAct} from 'store/actions';

export const YoutubeApp = () => {
  const [count, setCount] = useState(0);
  const app = useSelector(state => state.home.apps.youtube || {});
  const home = useSelector(state => state.home);
  const show = home.ishome==false && home.stack.at(-1)==app.payload;

  useEffect(()=>{
    setCount(count + 1)
  }, [home])

  return <AppContainer app={app} show={show} count={count}/>
}

const AppContainer = ({app, show, count}) => {
  const clstring = `${app.payload}-wrapper`;

  return (
    <div className={"app-wrapper "+clstring} id={clstring} data-open={show}>
      <div className="app-icon-container">
        <Icon className="mdShad" src={"apps/" + app.icon} w={72} action="home/setHome"/>
        <span>{count}</span>
      </div>
    </div>
  );
}
