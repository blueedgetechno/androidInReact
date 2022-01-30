import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Hammer from 'react-hammerjs';
import Swiper from "react-slick";
import html2canvas from 'html2canvas';

import * as Widgets from "../../components/widgets/widget.js";
import { Icon } from "../../components/utils.js";
import QuickPanel from '../../components/quickpanel';
import StatusBar from '../../components/statusbar';
import BottomNav from '../../components/bottomnav';
import { dispatchAction, dispatchAct } from "../../store/actions";

import * as Applications from '../apps';

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
  const dispatch = useDispatch();

  const openedapp = !home.ishome && home.stack.at(-1);
  const viewportclass = openedapp ? openedapp + "-viewport":""

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
              <Icon className="mdShad" src={"apps/" + app.icon} action={app.action || "home/openApp"}
                  data-padd={app.padd} w={52} radii={20} key={i} payload={app.payload}/>
            )
          })}
        </div>
        <AppWrapper openedapp={openedapp}/>
        <BrowseWrapper/>
      </div>
      <BottomNav bg={openedapp && "var(--navbg)"} invert={home.ishome?false:null}/>
    </div>
  )
}

const AppWrapper = ({openedapp})=>{
  const home = useSelector((state) => state.home);
  const stack = useSelector((state) => state.home.stack);
  const appScroll = useRef();

  useEffect(()=>{
    if(stack.length){
      if(appScroll.current){
        appScroll.current.slickGoTo(apps_order.indexOf(openedapp), true)
      }
    }
  }, [stack])

  return (
    <div className="apps-wrapper" data-ninja="true">
      <Swiper className="full-app-container" {...{
        dots: false,
        arrows: false,
        infinite: false,
        swipe: false,
        speed: 200
      }} ref={appScroll}>
      {[1,1][stack.length?1:0] && Object.keys(Applications).map(key=>{
        var WinApp = Applications[key],
            item = key.slice(0,key.length - 3).toLowerCase();

        if(stack.includes(item)) return <WinApp key={item}/>
      })}
      </Swiper>
    </div>
  )
}

const MiniApp = ({app})=>{

  return app ? (
    <Hammer>
      <div className="mini-app-container prtclk" onClick={dispatchAction}
          data-action="home/openApp" data-payload={app.payload}>
        <div className="mini-app-icon">
          <Icon src={"apps/" + app.icon} data-padd={app.padd}/>
        </div>
      </div>
    </Hammer>
  ):null
}

const BrowseWrapper = ()=>{
  const home = useSelector((state) => state.home);
  const apps = useSelector(state => state.home.apps);
  const recentScroll = useRef();

  const closeRecent = (e) => {
    if (e.target.classList.contains("recent-apps-container") || home.stack.length==0) {
      dispatchAct({ type: "home/closeRecent" });
    }
  }

  useEffect(()=>{
    if(home.stack.length && home.recent){
      if(recentScroll.current){
        recentScroll.current.slickGoTo(home.stack.length - 1)
      }
    }
  }, [home.recent])

  return (
    <div className="recent-apps-container backblur" onClick={closeRecent} data-hide={!home.recent}>
      <div className="recent-slider" data-hide={!home.recent}>
        <Swiper className="recent-app-container" {...{
          dots: false,
          arrows: false,
          infinite: false,
          speed: 200
        }} ref={recentScroll}>
        {/* {home.recent && home.stack.map(item => {
          var app = apps[item]
          return <MiniApp app={app} key={item}/>
        })} */}
        {home.recent && Object.keys(Applications).map(key=>{
          var WinApp = Applications[key],
              item = key.slice(0,key.length - 3).toLowerCase();

          var app = apps[item]
          return <MiniApp app={app} key={item}/>
        })}
        </Swiper>
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
                          <Icon src={"apps/" + app.icon} action={app.action || "home/openApp"}
                            w={52} radii={22} data-padd={app.padd} payload={app.payload}/>
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
