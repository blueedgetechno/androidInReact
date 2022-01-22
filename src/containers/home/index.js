import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Hammer from 'react-hammerjs';
import Swiper from "react-slick";
import { Icon } from "../../components/utils.js";

import QuickPanel from '../../components/quickpanel';
import StatusBar from '../../components/statusbar';
import BottomNav from '../../components/bottomnav';

import './home.scss';

function Home() {
  const [action, setAction] = useState("Tap");
  const display = useSelector((state) => state.global.display);
  const favbar = useSelector((state) => state.home.favbar);
  const apps = useSelector((state) => state.home.apps);
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
      <div className='home'>
        <Hammer onSwipe={handleSwipe} options={options} direction='DIRECTION_ALL'>
          <div className="homescreen-container">
            <HomeScreen/>
          </div>
        </Hammer>
        <div className="favorite-bar">
          {favbar.map((favicon, i)=>{
            var app = apps[favicon]
            return (
              <Icon className="mdShad" src={"apps/" + app.icon}
                  data-padd={app.padd} w={52} radii={20} key={i}/>
            )
          })}
        </div>
      </div>
      <BottomNav/>
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
                          <Icon src={"apps/" + app.icon} w={52} radii={22} data-padd={app.padd}/>
                          <div className="app-name">{app.name}</div>
                        </div>
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
