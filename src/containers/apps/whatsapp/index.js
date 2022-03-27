import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, LazyComponent} from 'components/utils';
import {dispatchAction, dispatchAct} from 'store/actions';
import Swiper from 'react-slick';

import './whatsapp.scss';

import {
  NavBar,
  AllStatusScreen,
  AllContacts,
  StatusScreen,
  ChatScreen,
  CallLogs,
  MediaViewer
} from './elements'

export const WhatsappApp = () => {
  const app = useSelector(state => state.home.apps.whatsapp || {});
  const home = useSelector(state => state.home);
  const show = home.ishome==false && home.stack.at(-1)==app.payload;
  const pagetree = app && app.pagetree || {
    "main": {
      "chat" : {},
      "contact" : {}
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
  const [tab, setTab] = useState(1);
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

  const clickTabHandler = (e)=>{
    var id = e.target.dataset.id
    if(homeSwiper.current){
      setTab(id)
      homeSwiper.current.slickGoTo(id, false)
    }
  }

  const swipehandler = ()=>{
    if(homeSwiper.current){
      var hmswiper = document.querySelector('.app-wrapper .whatsapp-home-swiper .slick-track');
      tabSetter(hmswiper)
      setTimeout(()=>{
        tabSetter(hmswiper)
      },200)
    }
  }

  const checkstate = (comp) => {
    return path.includes(comp) ? (
      path.at(-1) == comp ? 1 : 2
    ) : 0;
  }

  return (
    <div className={"app-wrapper " + clstring} id={clstring} data-open={show}>
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
          ]} onClick={clickTabHandler}/>
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
              <AllStatusScreen/>
              <CallLogs/>
            </Swiper>
            {tab!=0 && (
              <div className="quick-wtool-container press-in">
                {tab==1 && <Icon action="home/navApp" mui="Chat"
                              payload="whatsapp.contact" w={24}/>}
                {tab==2 && <Icon mui="PhotoCamera" round w={24}/>}
                {tab==3 && <Icon mui="AddIcCall" rounded w={24}/>}
              </div>
            )}
          </div>
        </div>
        <ChatScreen checkstate={checkstate}/>
        <AllContacts checkstate={checkstate}/>
        <MediaViewer/>
        <StatusScreen/>
      </div>
    </div>
  );
}

const CameraScreen = ()=>{
  return (
    <div className="camera-container"></div>
  )
}

const AllChatScreen = ()=>{
  const wdata = useSelector(state => state.whatsapp);
  const contacts = useSelector(state => state.whatsapp.chats);

  const clickChat = (e)=>{
    var id = e.target.getAttribute("value");

    dispatchAct({
      type: "whatsapp/setProp",
      payload: {key: "curr", value: id}
    })

    dispatchAct({
      type: "home/navApp",
      payload: "whatsapp.chat"
    })
  }

  useEffect(()=>{
    dispatchAct({type: 'home/setAppKey', payload:{
      id: 'whatsapp', key: 'comp', value: wdata.comp
    }})
  }, [wdata.comp])

  return (
    <div className="home-chats-container medScroll">
      <div className="home-chats">
        {contacts && [...contacts].sort((a,b)=>{
          if(!a.chat || !b.chat) return 1
          if(!a.chat.length) return -1
          if(!b.chat.length) return 1

          var a_lastmsg = a.chat.at(-1),
              b_lastmsg = b.chat.at(-1)

          var a_seen = a_lastmsg.type=="0" && !a.seen,
              b_seen = b_lastmsg.type=="0" && !b.seen

          if(a_seen ^ b_seen){
            if(!a_seen) return 1
            else return -1
          }else{
            if(new Date(a_lastmsg.time) > new Date(b_lastmsg.time)) return -1
            else return 1
          }
        }).map((contact,i) => {
          if(!contact.chat || !contact.chat.length) return null
          var lastmsg = contact.chat.at(-1)

          return(
            <div className="all-chat-container prtclk active-dark-lit"
                key={contact.id} onClick={clickChat} value={contact.id}>
              <Image src={contact.img} dir="asset/whatsapp/pfp" w={48}/>
              <div className="short-info">
                <div className="chat-info">
                  <div className="chat-name">{contact.name}</div>
                  <div className="chat-date">{new Date(lastmsg.time).time12()}</div>
                </div>
                <div className="latest-message-container">
                  <div className="latest-message">
                    {lastmsg.type=="2"?(
                      <Icon className="seentick" mui={lastmsg.seen==0?"Done":null}
                        icon={lastmsg.seen>0?"seentick":null} w={14} payload={lastmsg.seen}/>
                    ):null}
                    {lastmsg.media=="Photo"?<Icon mui="Photo" w={14}/>:null}
                    {lastmsg.media=="Video"?<Icon mui="Videocam" w={14}/>:null}
                    <span className="last-msg-txt">{lastmsg.msg || lastmsg.media}</span>
                  </div>
                  <div className="chat-acts">
                    {lastmsg.type=="0" && !contact.seen && <div className="unread">{1}</div>}
                    {/* {i<3 ? <Icon icon="pinned" fill="#687881"/>: null} */}
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
