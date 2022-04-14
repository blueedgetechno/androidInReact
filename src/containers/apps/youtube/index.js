import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, LazyComponent} from 'components/utils';
import {dispatchAction, dispatchAct} from 'store/actions';
import {Home, ViewPage, TrendingPage, SubsPage, LibPage} from './extra';
import './youtube.scss';

export const YoutubeApp = () => {
  const app = useSelector(state => state.home.apps.youtube || {})
  const home = useSelector(state => state.home)
  const show = home.ishome==false && home.stack.at(-1)==app.payload
  const pagetree = app && app.pagetree || {
    "main": {
      "home" : {},
      "subs" : {},
      "lib" : {}
    }
  }

  useEffect(()=>{
    if(app && !app.pagetree){
      dispatchAct({type: "home/setApp", payload: {
        id: app.payload,
        data: {
          ... app,
          pagetree: pagetree,
          path: ['main']
        }
      }})
    }
  }, [app])

  return <AppContainer app={app} show={show}/>
}

const AppContainer = ({app, show}) => {
  const ydata = useSelector(state => state.youtube)
  const [tab, setTab] = useState(0)
  const clstring = `${app.payload}-wrapper`

  const changeTab = (e)=>{
    if(e.target.dataset.payload) setTab(e.target.dataset.payload)
  }

  return (
    <div className={"app-wrapper "+clstring} id={clstring} data-open={show}>
      <div className="app-inner-wrapper yt-inner-wrapper">
        <div className="youtube-home">
          <div className="yt-top-nav">
            <Image src="asset/youtube/namelogo" w={80}/>
            <div className="y-nav-icons">
              <Icon mui="Cast" w={18}/>
              <Icon mui="NotificationsNone" round w={22}/>
              <Icon mui="Search" w={22}/>
              <Image className="rounded rounded-full" src="blue.jpg" w={22}/>
            </div>
          </div>
          {tab == 0 && <Home/>}
          {tab == 1 && <TrendingPage/>}
          {tab == 3 && <SubsPage/>}
          {tab == 4 && <LibPage/>}
          {<ViewPage/>}
          <div className="yt-bottom-nav" data-hide={ydata.comp}>
            <Icon className="active-dark-lit" mui="Home" w={24} label="Home"
                  out={tab!=0} onClick={changeTab} payload={0}/>
            <Icon className="active-dark-lit" mui="Explore" w={24} label="Explore"
                  out={tab!=1} onClick={changeTab} payload={1}/>
            <Icon mui="AddCircleOutline" w={36} round/>
            <Icon className="active-dark-lit" mui="Subscriptions" w={24} label="Subscriptions"
                  out={tab!=3} onClick={changeTab} payload={3}/>
            <Icon className="active-dark-lit" mui="VideoLibrary" w={24} label="Library"
                  out={tab!=4} onClick={changeTab} payload={4}/>
          </div>
        </div>
      </div>
    </div>
  );
}
