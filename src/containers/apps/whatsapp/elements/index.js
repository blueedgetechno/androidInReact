import React, {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import TextField from '@mui/material/TextField'

import {Icon, Image, Video, isValidURL} from 'components/utils.js'
import {dispatchAction, dispatchAct} from 'store/actions'

import './extra.scss'

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
          <div className="tab-option active-light-lit prtclk"  key={i}
              value={props.tab == i} data-id={i} onClick={props.onClick}>
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
        {media.type=="Photo" &&
          <Image src={media.src} dir="asset/whatsapp/chats"/>}
        {media.type=="Video" && (
          <Video src={media.src} dir="asset/whatsapp/chats" h="100%" cstmctrl/>
        )}
      </div>
    </div>
  )
}

export const StatusScreen = ()=>{
  const [idx, setIdx] = useState(0)
  const [viewper, setPercent] = useState(0)
  const [paused, setPaused] = useState(false)
  const stdata = useSelector(state => state.whatsapp.status || {})
  const contact = useSelector(state => {
    var tmp = {}
    if(stdata.id == -1) tmp = state.whatsapp.self
    else tmp = state.whatsapp.chats && state.whatsapp.chats[stdata.id]
    return tmp || {}
  })

  const photoProgressBool = ()=>{
    return stdata.vis && contact.status && contact.status[idx].media!="Video" && !paused;
  }

  const progressPhoto = ()=>{
    if(!photoProgressBool()) return
    if(viewper<idx+1) setPercent(viewper + 0.02)
    else{
      setPercent(idx+1)
      if(idx < contact.status.length - 1){
        setIdx(idx + 1)
      }else{
        setIdx(0)
        dispatchAct({type: "home/goBack"})
      }
    }
  }

  const skipNext = ()=>{
    // setPaused(true)
    setPercent(idx+1)
    if(idx < contact.status.length - 1){
      setIdx(idx + 1)
    }else{
      setIdx(0)
      dispatchAct({type: "home/goBack"})
    }
  }

  const handleProg = (e)=>{
    if(e.played<1) setPercent(idx + e.played)
    else{
      setPercent(idx+1)
      if(idx < contact.status.length - 1){
        setIdx(idx + 1)
      }else{
        setIdx(0)
        dispatchAct({type: "home/goBack"})
      }
    }
  }

  useEffect(()=>{
    if(photoProgressBool() && !paused){
      setTimeout(progressPhoto, 100)
    }
  },[viewper,stdata.vis,idx,paused,contact.status])

  useEffect(()=>{
    if(!stdata.vis && (idx!=0 || viewper!=0)){
      setIdx(0)
      setPercent(0)
    }

    if(stdata.id){
      dispatchAct({type: "whatsapp/setViewStatus", payload: {
        id: stdata.id, count: idx + 1
      }})
    }
  }, [stdata.vis, idx, viewper])

  return (
    <div className="status-container" value={!stdata.vis && "hide"}>
      <div className="whatsapp-top-nav">
        <div className="progress-bar-container">
          {stdata.vis && contact.status && contact.status.map((st,i) => {
            return (
              <div className='progress-bar' data-lit={i<idx} key={i}>
                {i==idx && <div className="progress-fill" style={{
                  width: `${(viewper-i)*100}%`
                }}></div>}
              </div>
            )
          })}
        </div>
        <div className="chat-profile-container flex items-center">
          <div className="chat-profile active-light-lit">
            <Icon mui="ArrowBack" w={20} action="home/goBack"/>
            <Image className="rounded-full overflow-hidden"
              src={contact.img} dir="asset/whatsapp/pfp" w={36}/>
          </div>
          <div className="chat-name flex-column font-thin mb-1">
            <span>{stdata.id == -1 ? "You" : contact.name}</span>
            <span>
              {new Date(contact.status && contact.status.at(-1).time).minifyTime()}
            </span>
          </div>
        </div>
      </div>
      {stdata.vis && contact.status?(
        <>
        <div className="media-screen prtclk" onClick={skipNext}>
          {contact.status[idx].media=="Photo" &&
            <Image src={contact.status[idx].src} dir="asset/whatsapp/"/>}
          {contact.status[idx].media=="Video" && (
            <Video src={contact.status[idx].src} h="100%" dir="asset/whatsapp/"
              playIcon autoplay onProgress={handleProg} play={!paused}/>
          )}
          {contact.status[idx].msg && (
            <div className="status-msg-container">
              {contact.status[idx].msg}
            </div>
          )}
        </div>
        {contact.status[idx].caption && (
          <div className="caption-container">{contact.status[idx].caption}</div>
        )}
        </>
      ):null}
    </div>
  )
}

export const AllStatusScreen = (props)=>{
  const wdata = useSelector(state => state.whatsapp);
  const myself = useSelector(state => state.whatsapp.self);
  const contacts = useSelector(state => state.whatsapp.chats);

  const CalculateArc = ({n,i,viewed})=>{
    var gz = n==1 ? 0 : 3;
    var dash = `${300/n - 2*gz}% ${300*(1 - 1/n) + 2*gz}%`,
        offset = `${75 + 300*((i+1)/n) - 2*gz}%`

    return (
      <circle className={viewed?"viewed":"notviewed"} cx="52" cy="52"
        r="50" fill="none" strokeLinecap="round" strokeWidth="4"
        strokeDashoffset={offset} strokeDasharray={dash}></circle>
    )
  }

  return (
    <div className="chats-status-container medScroll">
      <div className="my-status active-dark-lit prtclk" onClick={dispatchAction}
        data-action="whatsapp/setStatus" data-payload={-1}>
        <div className="chat-status">
          <div className="status-preview-container">
            <div className="status-preview">
              <svg viewBox="0 0 104 104" xmlns="http://www.w3.org/2000/svg">
                {myself && myself.status.map((status,i)=>{
                  return <CalculateArc n={myself.status.length}
                                        i={i} viewed key={i}/>
                })}
              </svg>
            </div>
            <Image className="rounded-full rounded" src={myself && myself.img}
                    dir="" w={48}/>
          </div>
          <div className="status-info flex flex-col mx-4">
            <div className="chat-name">My status</div>
            <div className="status-date">
              {myself && new Date(myself.status.at(-1).time).minifyTime()}
            </div>
          </div>
        </div>
      </div>
      <div className="gray-txt text-sm px-6">Recent updates</div>
      <div className="chats-status">
        {contacts && contacts.map((contact,i) => {
          if(!contact.status || !contact.status.length) return null
          return (
            <div className="chat-status active-dark-lit prtclk" data-payload={contact.id}
              onClick={dispatchAction} data-action="whatsapp/setStatus" key={contact.id}>
              <div className="status-preview-container">
                <div className="status-preview">
                  <svg viewBox="0 0 104 104" xmlns="http://www.w3.org/2000/svg">
                    {contact.status.map((status,i)=>{
                      return <CalculateArc n={contact.status.length}
                              i={i} key={i} viewed={status.seen}/>
                    })}
                  </svg>
                </div>
                <Image className="rounded-full rounded" src={contact.img}
                        dir="asset/whatsapp/pfp" w={48}/>
              </div>
              <div className="status-info flex flex-col mx-4">
                <div className="chat-name">{contact.name}</div>
                <div className="status-date">
                  {new Date(contact.status.at(-1).time).minifyTime()}
                </div>
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
      <div className="call-logs">
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
                  <span>{new Date().minifyTime(minago)}</span>
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
  const [msg, setMsg] = useState('');
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

  const processLinks = (txt)=>{
    var arr = txt.split(' '), tmp = [], txtstr = [];

    for (var i = 0; i < arr.length; i++) {
      try{
        var url = (!arr[i].startsWith("http") ? "https://":"") + arr[i] ,
            urlobj = null;

        if(isValidURL(url)) urlobj = new URL(url)
        if(!urlobj) throw new Error()

        if(txtstr.length) tmp.push(txtstr.join(' '))
        txtstr = []
        tmp.push(<a href={urlobj.href} target="_blank" key={i}> {arr[i]} </a>)
      }catch(e){
        txtstr.push(arr[i])
      }
    }

    if(txtstr.length) tmp.push(txtstr.join(' '))

    return tmp
  }

  const sendMessage = ()=>{
    dispatchAct({
      type: "whatsapp/sendMsg",
      payload: {
        id: wdata.curr,
        msg: msg
      }
    })

    setMsg("")
  }

  const scrollToEnd = ()=>{
    chatscreen.current.scrollBy(0, chatscreen.current.scrollHeight + 100)
  }

  useEffect(()=>{
    if(props.checkstate('chat') && chatscreen.current){
      scrollToEnd()
      setTimeout(scrollToEnd, 200)
      dispatchAct({type: "whatsapp/setChatProp", payload: {
        id: wdata.curr,
        key: "seen",
        value: true
      }})
    }
  }, [wdata.curr, contact.chat])

  return(
    <div className="chat-screen-container flex-column scale-trans"
        data-vis={props.checkstate('chat')}>
      <div className="whatsapp-top-nav downbug">
        <div className="chat-profile-container flex items-center">
          <div className="chat-profile prtclk active-light-lit"
            onClick={dispatchAction} data-action="home/goBack">
            <Icon mui="ArrowBack" w={20}/>
            <Image className="rounded-full overflow-hidden"
                  src={contact.img} dir="asset/whatsapp/pfp" w={36}/>
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
                          {processLinks(item.msg)}
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
          ):<Icon className="send-icon press-in" mui="Send" h={24} onClick={sendMessage}/>}
        </div>
      </div>
    </div>
  )
}

export const AllContacts = (props)=>{
  const wdata = useSelector(state => state.whatsapp);
  const contacts = useSelector(state => state.whatsapp.chats || []);

  const clickContact = (e)=>{
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

  return (
    <div className="contacts-container scale-trans"
        data-vis={props.checkstate('contact')}>
      <div className="whatsapp-top-nav">
        <div className="chat-profile-container flex items-center">
          <div className="chat-profile active-light-lit">
            <Icon mui="ArrowBack" w={20} action="home/goBack"/>
          </div>
          <div className="chat-name flex-column font-thin mx-4">
            <span className="text-lg">Select Contacts</span>
            <span className="text-xs">
              {contacts.length} contact{contacts.length>1?"s":""}
            </span>
          </div>
        </div>
        <div className="w-nav-icons">
          <Icon mui="Search"/>
          <Icon mui="MoreVert"/>
        </div>
      </div>
      <div className="all-contacts medScroll">
        <div className="contact-cotainer active-dark-lit prtclk">
          <Icon className="rounded-full rounded" mui="Group" w={24}/>
          <div className="flex flex-col ml-4 flex-grow">
            <div className="chat-name">New group</div>
          </div>
        </div>
        <div className="contact-cotainer active-dark-lit prtclk">
          <Icon className="rounded-full rounded" mui="PersonAdd" w={22}/>
          <div className="flex flex-col ml-4 flex-grow">
            <div className="chat-name">New contact</div>
          </div>
        </div>
        {contacts && [...contacts].sort((a,b)=> {
          return a.name>b.name?1:-1
        }).map(contact => {
          return(
            <div className="contact-cotainer active-dark-lit prtclk"
                  key={contact.id} onClick={clickContact} value={contact.id}>
              <Image className="rounded-full rounded"
                src={contact.img} dir="asset/whatsapp/pfp" w={38}/>
              <div className="flex flex-col ml-4 flex-grow">
                <div className="chat-name">{contact.name}</div>
                <div className="status-date">
                  {contact.bio}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
