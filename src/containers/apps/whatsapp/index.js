import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, LazyComponent} from 'components/utils';
import {dispatchAction, dispatchAct} from 'store/actions';
import Swiper from 'react-slick';

import './whatsapp.scss';
import wdata from './data.json';

import {StatusScreen, ChatScreen, CallLogs, minifyTime, NavBar} from './elements'

export const WhatsappApp = () => {
  const app = useSelector(state => state.home.apps.whatsapp || {});
  const home = useSelector(state => state.home);
  const show = home.ishome==false && home.stack.at(-1)==app.payload;
  const pagetree = app && app.pagetree || {
    "main": {
      "chat" : {}
    }
  }

  useEffect(()=>{
    if(app && !app.pagetree){
      dispatchAct({type: "home/setApp", payload: {
        id: app.payload,
        data: {
          ... app,
          pagetree: pagetree,
          path: ['main','chat']
        }
      }})
    }

    // console.log(app.path);
  }, [app])

  return <AppContainer app={app} show={show}/>
}

const AppContainer = ({app, show, pagetree}) => {
  const [tab, setTab] = React.useState(1);
  const homeSwiper = useRef();
  const clstring = `${app.payload}-wrapper`;
  const path = app.path || ["main"];

  const tabSetter = (hmswiper)=>{
    if(!hmswiper) return

    var swidth = hmswiper.style.width,
        swleft = hmswiper.style.transform;

    swidth = swidth.replace("px","")
    swleft = swleft.replace("translate3d(","").replace("px, 0px, 0px)","")

    try{
      swidth = parseInt(swidth)
      swleft = Math.abs(parseInt(swleft))

      var tb = Math.round((swleft*4)/swidth)
      tb = Math.max(0, Math.min(3, tb))
      setTab(tb)
    }catch(err){
      console.log(err)
    }
  }

  const swipehandler = ()=>{
    if(homeSwiper.current){
      var hmswiper = document.querySelector('.whatsapp-home-swiper .slick-track');
      tabSetter(hmswiper)
      setTimeout(()=>{
        tabSetter(hmswiper)
      },200)
    }
  }

  const checkstate = (comp)=>{
    return path.includes(comp) ? (
      path.at(-1) == comp ? 1 : 2
    ) : 0;
  }

  return (
    <div className={"app-wrapper "+clstring} id={clstring} data-open={show}>
      <div className="app-inner-wrapper wp-inner-wrapper">
        <div className='whatsapp-home full-hide upbug scale-trans' data-vis={checkstate('main')}>
          <div className="whatsapp-top-nav downbug">
            <div className="brand-name">WhatsApp</div>
            <div className="w-nav-icons">
              <Icon mui="Search"/>
              <Icon mui="MoreVert"/>
            </div>
          </div>
          <NavBar className="home-nav-tab" tab={tab} options={[
            <Icon mui="PhotoCamera" round w={22}/>,"CHATS","STATUS","CALLS"
          ]}/>
          <div className="whatsapp-home-page">
            <Swiper className="whatsapp-home-swiper full-height-swiper" {...{
              dots: false,
              arrows: false,
              infinite: false,
              initialSlide: tab,
              speed: 200
            }} onSwipe={swipehandler} ref={homeSwiper}>
              <CameraScreen/>
              <AllChatScreen/>
              <StatusScreen/>
              <CallLogs/>
            </Swiper>
          </div>
        </div>
        <ChatScreen checkstate={checkstate}/>
      </div>
    </div>
  );
}

const CameraScreen = ()=>{
  return (
    <div>Camera</div>
  )
}

const AllChatScreen = ()=>{

  return (
    <div className="home-chats-container medScroll">
      <div className="home-chats">
        {wdata.chats.map((chat,i) => {
          return(
            <div className="chat-container prtclk active-dark-lit" key={i} onClick={dispatchAction}
              data-action="home/navApp" data-payload="whatsapp.chat">
              <Image src={chat.img} dir="asset/whatsapp/pfp" w={48}/>
              <div className="short-info">
                <div className="chat-info">
                  <div className="chat-name">{chat.name}</div>
                  <div className="chat-date">8:30 PM</div>
                </div>
                <div className="flex">
                  <div className="latest-message">
                    <Icon className="seentick" mui={["Done","DoneAll"][i%3?1:0]} w={12}
                      payload={i%3}/>
                    <span>Okay! I will do it by tomorrow</span>
                  </div>
                  <div className="chat-acts">
                    {Math.random()<0.5?<div className="unread">{Math.floor(1 + Math.random()*8)}</div>:null}
                    {i<3 ? <Icon icon="pinned" fill="#687881"/>: null}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
