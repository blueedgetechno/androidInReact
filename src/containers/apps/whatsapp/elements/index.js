import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import TextField from '@mui/material/TextField';

import {Icon, Image, Video} from 'components/utils.js';
import {dispatchAction, dispatchAct} from 'store/actions';

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

export const MediaViewer = () => {
  const media = useSelector(state => state.whatsapp.media || {});

  return (
    <div className="media-viewer-container" value={!media.vis && "hide"}>
      <div className="whatsapp-top-nav">
        <div className="chat-profile-container flex items-center">
          <div className="chat-profile active-light-lit">
            <Icon mui="ArrowBack" w={20} action="home/goBack"/>
          </div>
          <div className="chat-name flex-column font-thin mx-4">
            <span>{media.name}</span>
            <span>{new Date(media.time).pastdatetime()}</span>
          </div>
        </div>
        <div className="w-nav-icons">
          <Icon mui="Reply" flip/>
          <Icon mui="MoreVert"/>
        </div>
      </div>
      <div className="media-screen">
        {media.type=="Photo" && <Image src={media.src} dir="asset/whatsapp/chats"/>}
        {media.type=="Video" && (
          <Video src={media.src} dir="asset/whatsapp/chats" h="100%" cstmctrl/>
        )}
      </div>
    </div>
  )
}

export const StatusScreen = (props)=>{
  const wdata = useSelector(state => state.whatsapp);
  const contacts = useSelector(state => state.whatsapp.chats);

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
        {contacts && contacts.map((chat,i) => {
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
  const wdata = useSelector(state => state.whatsapp);
  const contacts = useSelector(state => state.whatsapp.chats);

  return (
    <div className="call-logs-container medScroll">
      <div className="call-logs px-2 py-1">
        {contacts && contacts.map((chat,i) => {
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
  const chatscreen = useRef();
  const wdata = useSelector(state => state.whatsapp);
  const contact = useSelector(state => {
    return (
      state.whatsapp.chats && state.whatsapp.chats[state.whatsapp.curr]
    ) || {}
  })

  const handleMsg = (e)=>{
    setMsg(e.target.value)
  }

  const mediaHandler = (e)=>{
    var ele = e.target;
    const payload = {
      type: ele.dataset.type,
      src: ele.dataset.src,
      name: ele.dataset.name,
      time: ele.dataset.time
    }

    dispatchAct({type: "whatsapp/setMedia", payload: payload})
  }

  useEffect(()=>{
    if(chatscreen.current){
      chatscreen.current.scrollBy(0, chatscreen.current.scrollHeight + 100)
    }
  }, [wdata.curr])

  return(
    <div className="chat-screen-container flex-column scale-trans" data-vis={props.checkstate('chat')}>
      <div className="whatsapp-top-nav downbug">
        <div className="chat-profile-container flex items-center">
          <div className="chat-profile prtclk active-light-lit"
            onClick={dispatchAction} data-action="home/goBack">
            <Icon mui="ArrowBack" w={20}/>
            <Image className="rounded-full overflow-hidden" src={contact.img} dir="asset/whatsapp/pfp" w={36}/>
          </div>
          <div className="chat-name text-lg font-thin mx-2">{contact.name}</div>
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
        <div className="chat-container medScroll" ref={chatscreen}>
          <div className="chat-scroll-container">
            <div className="chat-toast" value="1">
              <div className="msg-toast">
                🔓 Messages and calls are end-to-end open. It's Facebook, what else would you expect. Privacy go brrr.
              </div>
            </div>
            {contact.chat && contact.chat.map((item, i) => {
              var arr = [], prev = i>0 && contact.chat[i-1];

              if(i==0 || new Date(prev.time).getDate() != new Date(item.time).getDate()){
                arr.push(
                  <div className="chat-toast" value="1" key={"msg-"+i}>
                    <div className="msg-toast">
                      {new Date(item.time).pastdate()}
                    </div>
                  </div>
                )
              }

              arr.push(
                <div className="chat-toast" value={item.type} key={i}>
                  {item.type!="1"?(
                    <div className={'msg-box ' +
                      (item.type=='0'?'in-msg':'out-msg') +
                      (!prev || prev.type!=item.type ? ' first-msg':'')
                    }>
                      {item.media=="Photo"?(
                        <Image src={item.src} dir="asset/whatsapp/chats"
                          data-type={item.media} data-name={
                            item.type=='0'? (item.name || contact.name): "You"
                          } onClick={mediaHandler} data-time={item.time}
                          data-src={item.src}/>
                      ):null}
                      {item.media=="Video"?(
                        <Video
                          src={item.src} inactive
                          dir="asset/whatsapp/chats"
                          data-type={item.media} data-name={
                            item.type=='0'? (item.name || contact.name): "You"
                          } onClick={mediaHandler}
                          data-time={item.time}
                          data-src={item.src}/>
                      ):null}
                      {item.msg?(
                        <pre>
                          {item.msg}
                          <div className="chat-date">
                            <span>{new Date(item.time || 0).time12()}</span>
                            {item.type=="2"?(
                              item.seen?<Icon className="seentick" icon="seentick" w={14} payload={item.seen}/>:
                                  <Icon className="seentick" mui="Done" w={14} payload={0}/>
                            ):null}
                          </div>
                        </pre>
                      ):(
                        <div className="chat-date">
                          <span>{new Date(item.time || 0).time12()}</span>
                          {item.type=="2"?(
                            item.seen?<Icon className="seentick" icon="seentick" w={14} payload={item.seen}/>:
                                <Icon className="seentick" mui="Done" w={14} payload={0}/>
                          ):null}
                        </div>
                      )}
                    </div>
                  ):(
                    <div className="msg-toast">{item.msg}</div>
                  )}
                </div>
              )

              return arr
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
