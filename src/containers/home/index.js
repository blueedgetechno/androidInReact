import React, {useState, useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import Hammer from '@win11react/react-hammerjs';
import Swiper from 'react-slick';

import * as Widgets from 'components/widgets';
import { Icon } from 'components/utils';
import QuickPanel from 'components/quickpanel';
import StatusBar from 'components/statusbar';
import BottomNav from 'components/bottomnav';
import { dispatchAction, dispatchAct } from 'store/actions';

import * as Applications from 'containers/apps';

import './home.scss';

const apps_order = Object.keys(Applications).map(key => {
  return key.slice(0,key.length - 3).toLowerCase()
})

function Home() {
  const [action, setAction] = useState("Tap");
  const display = useSelector((state) => state.global.display);
  const home = useSelector((state) => state.home);
  const favbar = useSelector((state) => state.home.favbar);
  const apps = useSelector((state) => state.home.apps);

  const openedapp = !home.ishome && home.stack.at(-1);
  const viewportclass = openedapp ? openedapp + "-viewport":""

  const handleSwipe = (e)=>{
    setAction(e.type + " " + e.direction)
    if(e.direction === 16){
      dispatchAct({type: "quickpanel/open"});
    }

    if(process.env.REACT_APP_ENV!="development"){
      if (navigator.userAgentData){
        document.documentElement.requestFullscreen();
      }
    }
  }

  useEffect(()=>{
    if(apps && apps[apps_order[0]] && !apps[apps_order[0]].payload){
      var tmp = {...apps}
      apps_order.map(x=>{
        tmp[x] = {...apps[x]}
        tmp[x].payload = x
      })

      dispatchAct({type: "home/setApps",payload: tmp})
    }
  }, [apps])

  return (
    <div className={"viewport " + viewportclass}>
      <StatusBar bg={openedapp && "var(--statusbg)"} invert={home.ishome?false:null}/>
      <QuickPanel/>
      <div className='home'>
        <Hammer onSwipe={handleSwipe} direction='DIRECTION_ALL'>
          <div className="homescreen-container">
            <HomeScreen/>
          </div>
        </Hammer>
        <div className="favorite-bar">
          {favbar.map((favicon, i)=>{
            var app = apps[favicon]
            return (
              <Icon className="mdShad press-in" src={"apps/" + app.icon} key={i}
                action={app.action || "home/openApp"} w={52} h={52}
                radii={20} data-padd={app.padd} payload={app.payload}/>
            )
          })}
        </div>
        <AppWrapper openedapp={openedapp}/>
        <RecentWrapper/>
      </div>
      <BottomNav bg={openedapp && "var(--navbg)"} invert={home.ishome?false:null}/>
    </div>
  )
}

const AppWrapper = ({openedapp})=>{
  const home = useSelector((state) => state.home);
  const stack = useSelector((state) => state.home.stack);
  const opened_apps = apps_order.filter(x => stack.includes(x));
  const appScroll = useRef();

  useEffect(()=>{
    if(stack.length){
      if(appScroll.current){
        var appidx = opened_apps.indexOf(openedapp)
        appScroll.current.slickGoTo(appidx, true)
      }
    }
  }, [stack])

  return (
    <div className="apps-wrapper" data-ninja="true">
      <Swiper className="full-app-container full-height-swiper" {...{
        dots: false,
        arrows: false,
        infinite: false,
        swipe: false,
        speed: 200
      }} ref={appScroll}>
      {opened_apps.map(item=>{
        var key = item.capitalize()+"App",
            WinApp = Applications[key];

        return <WinApp key={item}/>
      })}
      </Swiper>
    </div>
  )
}

const MiniApp = ({app, handleSwipeUp})=>{
  const miniRef = useRef();

  useEffect(()=>{
    var cloneApp = document.getElementById(app.payload+"-wrapper");
    if(cloneApp){
      cloneApp = cloneApp.cloneNode(true);
      cloneApp.removeAttribute('id');
      cloneApp.removeAttribute('data-open');
      cloneApp.classList.toggle('app-wrapper');
      cloneApp.classList.toggle('mini-app-wrapper');

      var parentDiv = miniRef.current;
      parentDiv.innerHTML = "";
      parentDiv.appendChild(cloneApp);
    }
  }, [app.payload])

  return (
    <Hammer onSwipeUp={handleSwipeUp} direction="DIRECTION_ALL">
      <div className="mini-app-container" data-rem="false">
        <div className="mini-app-icon">
          <Icon src={"apps/" + app.icon} data-padd={app.padd}/>
        </div>
        <div className="mini-app-holder" ref={miniRef}></div>
        <div className="recent-cover" onClick={dispatchAction}
          data-action="home/openApp" data-payload={app.payload}></div>
      </div>
    </Hammer>
  )
}

const RecentWrapper = ()=>{
  const home = useSelector((state) => state.home);
  const apps = useSelector(state => state.home.apps);
  const [recent_lag, setLag] = useState(home.recent);
  const recentScroll = useRef();
  const recentContainer = useRef();
  var recents = [...home.stack];

  const closeRecent = (e) => {
    if (e.target.classList.contains("recent-apps-container") || home.stack.length==0) {
      dispatchAct({ type: "home/closeRecent" });
    }
  }

  const closeAll = (e)=>{
    if(recentContainer.current){
      recentContainer.current.classList.toggle('closing-all-apps')
      setTimeout(()=>{
        recentContainer.current.classList.toggle('closing-all-apps')
        dispatchAct({ type: "home/closeAllApps" });
      }, 400)
    }
  }

  const scrollRecentTo = (i, anim=false)=>{
    if(recentScroll.current){
      recentScroll.current.slickGoTo(i, anim)
    }
  }

  const handleSwipeUp = (e)=>{
    var payload = e.target.dataset.payload;
    e.target.dataset.rem = true;

    setTimeout(()=>{
      var i = recents.indexOf(payload);
      if(i!=0) scrollRecentTo(i - 1);
      setTimeout(()=>{
        e.target.dataset.rem = false;
        dispatchAct({type: "home/closeApp", payload: payload})
      }, 200)
    },200)
  }

  useEffect(()=>{
    if(home.stack.length && home.recent){
      scrollRecentTo(home.stack.length - 1, true)
    }

    if(home.recent) setLag(true)
    else {
      setTimeout(()=>{
        setLag(false)
      }, 600)
    }
  }, [home.recent])

  return (
    <div className="recent-apps-container backblur" onClick={closeRecent} data-hide={!home.recent}>
      <div className="recent-slider" data-hide={!home.recent} ref={recentContainer}>
        <Swiper className="recent-app-container full-height-swiper" {...{
          dots: false,
          arrows: false,
          infinite: false,
          initialSlide: home.stack.length,
          speed: 200
        }} ref={recentScroll}>
        {recent_lag && home.stack.map((item,idx) => {
          var app = apps[item]
          return <MiniApp app={app || {}} handleSwipeUp={handleSwipeUp} key={item}/>
        })}
        </Swiper>
      </div>
      {home.stack.length==0?(
        <div className="no-recent-container">
          No recent tasks
        </div>
      ):null}
      <div className="close-recent-container">
        <div className="close-all-btn press-in quick-trans" onClick={closeAll}>Close all</div>
      </div>
    </div>
  )
}

const HomeScreen = (props)=>{
  const home = useSelector(state => state.home)
  const apps = useSelector(state => state.home.apps)
  const pages = useSelector(state => state.home.slides.list)
  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    initialSlide: 0,
    speed: 200
  }

  return (
    <div className="homescreen">
      <Swiper className="pages-container" {...settings}>
        {home && [...Array(home.slides.count)].map((x,i)=>{
          return (
            <div className="page-container" key={i}>
              <div className="grid-page">
                {Object.keys(pages).map((id, ix)=>{
                  var item = pages[id]
                  if(item.page != i+1) return null

                  if(item.type=="app"){
                    var app = apps[id]
                    return (
                      <div className="cell-container" key={ix} style={{
                        gridRow: item.row.join(" / "),
                        gridColumn: item.col.join(" / ")
                      }}>
                        <div className="app-container">
                          <Icon className="press-in" src={"apps/" + app.icon}
                            action={app.action || "home/openApp"} w={52} h={52}
                            radii={22} data-padd={app.padd} payload={app.payload}/>
                          <div className="app-name">{app.name}</div>
                        </div>
                      </div>
                    )
                  }else if (item.type=="widget") {
                    var Widget = Widgets[item.widget]
                    return (
                      <div className="cell-container" key={ix} style={{
                        gridRow: item.row.join(" / "),
                        gridColumn: item.col.join(" / ")
                      }}>
                        <Widget/>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        })}
      </Swiper>
    </div>
  )
}

export default Home;
