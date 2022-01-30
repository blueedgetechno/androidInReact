import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, LazyComponent} from '../../../components/utils';
import {dispatchAction, dispatchAct} from "../../../store/actions";

const AppContainer = ({app, show, count}) => {

  return (
    <div className={"app-wrappper "+`${app.payload}-wrappper`} data-open={show}>
      <div className="app-icon-container">
        <Icon className="mdShad" src={"apps/bg/" + app.icon} w={72} action="home/setHome"/>
        <span>{count}</span>
      </div>
    </div>
  );
}

export const WhatsappApp = () => {
  const [count, setCount] = useState(0);
  const app = useSelector(state => state.home.apps.whatsapp || {});
  const home = useSelector(state => state.home);
  const show = home.ishome==false && home.stack.at(-1)==app.payload;

  useEffect(()=>{
    setCount(count + 1)
  }, [home])

  return <LazyComponent show={show}>
    <AppContainer app={app} show={show} count={count}/>
  </LazyComponent>
}
