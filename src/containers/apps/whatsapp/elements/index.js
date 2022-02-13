import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import TextField from '@mui/material/TextField';

import {Icon, Image} from 'components/utils.js';
import {dispatchAction, dispatchAct} from 'store/actions';
import wdata from '../data.json';

import './extra.scss';

export const minifyTime = (t)=>{
  if(t < 60) return `${t} min ago`
  else{
    var d1 = new Date(),
        d2 = new Date(d1 - t*60*1000);

    var timestr = "";
    if(d2.getDate() == d1.getDate()) timestr += "Today, "
    else timestr += "Yesterday, "

    timestr += d2.toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric"})

    return timestr
  }
}

export const NavBar = (props)=>{
  const [swidth, setWidth] = useState(0);
  const [offLeft, setLeft] = useState(0);
  const navbar = useRef();

  useEffect(()=>{
    if(navbar.current){
      var childEle = navbar.current.children[props.tab];
      var cwidth = getComputedStyle(childEle).width,
          cleft = childEle.offsetLeft;

      setWidth(cwidth)
      setLeft(cleft)
    }
  }, [props.tab])

  return (
    <div className={`w-nav-tab ${props.className || ""}`} ref={navbar}>
      {props.options && props.options.map((opt,i) => {
        return (
          <div className="tab-option" value={props.tab == i} key={i}>
            {opt}
          </div>
        )
      })}
      <div className="nav-slider" style={{
        width: swidth,
        left: offLeft
      }}></div>
    </div>
  )
}

export const StatusScreen = (props)=>{

  const CalculateArc = ({n,i,viewed})=>{
    var gz = n==1 ? 0 : 3;
    var dash = `${300/n - 2*gz}% ${300*(1 - 1/n) + 2*gz}%`,
        offset = `${75 + 300*(i/n) - 2*gz}%`

    return (
      <circle className={viewed?"viewed":"notviewed"} cx="52" cy="52" r="50" fill="none"
        strokeLinecap="round" strokeWidth="4" strokeDashoffset={offset} strokeDasharray={dash}></circle>
    )
  }

  return (
    <div className="chats-status-container medScroll">
      <div className="my-status">
        <div className="chat-status">
          <div className="status-preview-container">
            <div className="status-preview">
              <svg viewBox="0 0 104 104" xmlns="http://www.w3.org/2000/svg">
                {[...Array(3)].map((x,i)=>{
                  return <CalculateArc n={3} i={i} viewed key={i}/>
                })}
              </svg>
            </div>
            <Image className="rounded-full rounded" src="blue.jpg" dir="asset/whatsapp/pfp" w={48}/>
          </div>
          <div className="status-info flex flex-col mx-4">
            <div className="chat-name">My status</div>
            <div className="status-date">Today, 10:08 AM</div>
          </div>
        </div>
      </div>
      <div className="gray-txt text-sm px-6 py-2">Recent updates</div>
      <div className="chats-status px-2 py-1">
        {wdata.chats.map((chat,i) => {
          var s = chat.name,
              randv = s.split("").map(x => x.charCodeAt()).reduce((b,c) => 2*b + 3*c);
          var nos = 1 + randv%8,
              minago = (randv*13)%1440

          return(
            <div className="chat-status" key={i}>
              <div className="status-preview-container">
                <div className="status-preview">
                  <svg viewBox="0 0 104 104" xmlns="http://www.w3.org/2000/svg">
                    {[...Array(nos)].map((x,i)=>{
                      return <CalculateArc n={nos} i={i} key={i} viewed={i%2==0}/>
                    })}
                  </svg>
                </div>
                <Image className="rounded-full rounded" src={chat.img} dir="asset/whatsapp/pfp" w={48}/>
              </div>
              <div className="status-info flex flex-col mx-4">
                <div className="chat-name">{chat.name}</div>
                <div className="status-date">{minifyTime(minago)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const CallLogs = ()=>{

  return (
    <div className="call-logs-container medScroll">
      <div className="call-logs px-2 py-1">
        {wdata.chats.map((chat,i) => {
          var randv = chat.name.split("").map(x => x.charCodeAt()).reduce((b,c) => 2*b + 3*c);
          var callst = randv%3, callsticon = callst!=2?"CallReceived":"CallMade",
              className = callst == 0? "callMissed":(callst==1?"callConnected":"callMade"),
              minago = (randv*13)%1440, calltype = ["ph","vid"][randv%2];

          return(
            <div className="call-log" key={i}>
              <Image className="rounded-full rounded" src={chat.img} dir="asset/whatsapp/pfp" w={48}/>
              <div className="flex flex-col mx-4 flex-grow">
                <div className="chat-name">{chat.name}</div>
                <div className="status-date">
                  <Icon className={className} mui={callsticon} w={14}/>
                  <span>{minifyTime(minago)}</span>
                </div>
              </div>
              {calltype=="ph"?<Icon className="teal-green" mui="Call" rounded/>:
                                <Icon className="teal-green" mui="Videocam"/>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ChatScreen = (props)=>{
  const [msg, setMsg] = useState("");

  const msgstring = `Help us keep running heywhatsthematterthisisallfinetrustmewearejustconducting\nIf you don't mind tech-related ads (no tracking or remarketing), and want to keep us running, please whitelist MUI in your blocker.\nThank you! ❤️`

  const handleMsg = (e)=>{
    setMsg(e.target.value)
  }

  return(
    <div className="chat-screen-container flex-column scale-trans" data-vis={props.checkstate('chat')}>
      <div className="whatsapp-top-nav downbug">
        <div className="chat-profile-container flex items-center">
          <div className="chat-profile prtclk active-light-lit"
            onClick={dispatchAction} data-action="home/goBack">
            <Icon mui="ArrowBack" w={20}/>
            <Image className="rounded-full overflow-hidden" src="hero" dir="asset/whatsapp/pfp" w={36}/>
          </div>
          <div className="chat-name text-lg font-thin mx-2">Spider Man</div>
        </div>
        <div className="w-nav-icons">
          <Icon mui="Videocam"/>
          <Icon mui="Call" w={20} rounded/>
          <Icon mui="MoreVert"/>
        </div>
      </div>
      <div className="chat-screen flex-column" style={{
        background: 'url(/img/asset/whatsapp/background.png)'
      }}>
        <div className="chat-container">
          <div className="chat-scroll-container">
            {wdata.chats[0].chat.map((item, i) => {
              return (
                <div className="chat-toast" value={item.type}>
                  {item.type!="1"?(
                    <div className={`msg-box ${item.type=="0"?'in-msg':'out-msg'}`}>
                      <pre>
                        {item.msg}
                        <div className="chat-date">
                          <span>12:43 AM</span>
                          {i%3?<Icon className="seentick" icon="seentick" w={14} payload={i%3}/>:
                              <Icon className="seentick" mui="Done" w={14} payload={0}/>}
                        </div>
                      </pre>
                    </div>
                  ):(
                    <div className="msg-toast">{item.msg}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <Icon mui="EmojiEmotions" out/>
            <TextField className="chat-input-field" multiline maxRows={4}
              placeholder="Message" value={msg} onChange={handleMsg}/>
            <Icon mui="AttachFile"/>
            {msg.length==0?<Icon className="CameraIcon" mui="PhotoCamera" round/>:null}
          </div>
          {msg.length==0?(
            <Icon className="mic-icon" mui="Mic" h={24}/>
          ):<Icon className="send-icon" mui="Send" h={24}/>}
        </div>
      </div>
    </div>
  )
}
