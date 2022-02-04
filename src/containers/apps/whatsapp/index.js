import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, LazyComponent} from '../../../components/utils';
import {dispatchAction, dispatchAct} from "../../../store/actions";
import Swiper from "react-slick";

import './whatsapp.scss';
import wdata from './data.json';

export const WhatsappApp = () => {
  const app = useSelector(state => state.home.apps.whatsapp || {});
  const home = useSelector(state => state.home);
  const show = home.ishome==false && home.stack.at(-1)==app.payload;

  return <AppContainer app={app} show={show}/>
}

const AppContainer = ({app, show}) => {
  const [value, setValue] = React.useState('1');
  const clstring = `${app.payload}-wrapper`;

  return (
    <div className={"app-wrapper "+clstring} id={clstring} data-open={show}>
      <div className="app-inner-wrapper wp-inner-wrapper">
        <div className="whatsapp-home full-hide upbug">
          <div className="whatsapp-top-nav downbug">
            <div className="brand-name">WhatsApp</div>
            <div className="w-nav-icons">
              <Icon mui="Search"/>
              <Icon mui="MoreVert"/>
            </div>
          </div>
          <div className="home-nav-tab">
            <div className="tab-option">
              <Icon mui="PhotoCamera" round w={22}/>
            </div>
            <div className="tab-option">CHATS</div>
            <div className="tab-option">STATUS</div>
            <div className="tab-option">CALLS</div>
          </div>
          <div className="whatsapp-home-page">
            <Swiper className="full-height-swiper" {...{
              dots: false,
              arrows: false,
              infinite: false,
              initialSlide: 0,
              speed: 200
            }}>
              <ChatScreen/>
              <ChatScreen/>
              <ChatScreen/>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatScreen = ()=>{

  return (
    <div className="home-chats-container medScroll">
      <div className="home-chats">
        {wdata.chats.map((chat,i) => {
          return(
            <div className="chat-container" key={i}>
              <Image src={chat.img} dir="icon/pfp" w={48}/>
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
