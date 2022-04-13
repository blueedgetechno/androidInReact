import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, Video} from 'components/utils.js';
import {dispatchAction, dispatchAct} from 'store/actions';
import './extra.scss';

const posneg = (a,b,seed) => {
  var sa = a.csum(), sb = b.csum(), sd = seed.csum()
  return (sa + sb)%2 == sd%2==0 ? 1:-1
}

const pseudorandom = (arr,seed)=>{
  arr = arr.filter(x => x!= seed)
  return arr.sort((a,b) => posneg(a,b,seed))
}

export const ViewPage = (props)=>{
  const [liked, setLiked] = useState(-1)
  const [loadSugg, setLoad] = useState(false)
  const ytwatch = useRef()
  const ydata = useSelector(state => state.youtube)
  const watvid = useSelector(state => {
    var id = state.youtube.watch && state.youtube.watch.id
    return state.youtube.vids && state.youtube.vids[id]
  })

  const vidch = useSelector(state => {
    var id = state.youtube.watch && state.youtube.watch.id,
        channel = {...state.youtube.channels && state.youtube.channels[
          state.youtube.vids[id] && state.youtube.vids[id].channel
        ]}

    if(channel) channel.subd = state.youtube.subd && state.youtube.subd.includes(channel.id)
    return channel
  })

  const handleFullReq = (e)=>{
    if(ydata.comp) return
    dispatchAct({type: 'youtube/setProp', payload:{
      key: 'comp', value: true
    }})
  }

  const handleLike = (e)=>{
    setLiked(e.target.dataset.payload)
  }

  useEffect(()=>{
    if(watvid && watvid.id){
      setLoad(true)
      setLiked(-1)
      if(ytwatch.current) ytwatch.current.scrollTo(0,0)
      setTimeout(()=> {
        setLoad(false)
      }, 1000)
    }
  },[watvid])

  useEffect(()=>{
    dispatchAct({type: 'home/setAppKey', payload:{
      id: 'youtube', key: 'comp', value: ydata.comp
    }})
  }, [ydata.comp])

  return watvid ? (
    <div className={`yt-vid-view ${!ydata.comp ? 'mini-yt-vid':''}`}>
      <div className="yt-vid-box">
        <Video src={"https://youtube.com/embed/"+watvid.id}
                playIcon w="100%" h="100%"/>
      </div>
      <div className="yt-watch-container" ref={ytwatch}>
        <div className="yt-vid-info" onClick={handleFullReq}>
          <div className="vid-title txt-ovf">{watvid.title}</div>
          <div className="vid-stat">
            {ydata.comp ? (
              `${watvid.views.quantf()} views • ${new Date(watvid.upload).minifyDate()}`
            ): `${vidch.name}`}
          </div>
          {ydata.comp && (
            <div className="vid-acts">
              <div className="flex flex-col items-center prtclk"
                      onClick={handleLike} data-payload="1">
                <Icon mui="ThumbUp" out={liked!=1}/>
                <span>{watvid.likes.quantf()}</span>
              </div>
              <div className="flex flex-col items-center prtclk"
                      onClick={handleLike} data-payload="0">
                <Icon mui="ThumbDown" out={liked!=0}/>
                <span>{watvid.dislikes.quantf()}</span>
              </div>
              <div className="flex flex-col items-center">
                <Icon mui="Reply" flip/><span>Share</span>
              </div>
              <div className="flex flex-col items-center">
                <Icon mui="Download"/><span>Download</span>
              </div>
              <div className="flex flex-col items-center">
                <Icon mui="LibraryAdd" out/><span>Save</span>
              </div>
            </div>
          )}
        </div>
        {!ydata.comp && (
          <div className="yt-mini-ctrl">
            <Icon className="mx-1" mui="PlayArrow" w={28} onClick={handleFullReq}/>
            <Icon className="mx-1" mui="Close" w={28} action="youtube/closeVid"/>
          </div>
        )}
        {ydata.comp && (
          <>
          <div className="yt-channel-row">
            <div className="flex items-center">
              <Image src={vidch.pfp} dir="asset/youtube/pfp" w={36}/>
              <div>
                <div className="leading-4">{vidch.name}</div>
                <div className="text-xss light-txt">{vidch.subs.quantf()} subscribers</div>
              </div>
            </div>
            <div className="subscribed-container">
              <div className={`text-sm mr-4 ${!vidch.subd?'red-txt':''}`} onClick={dispatchAction}
                  data-action="youtube/toggleSub" data-payload={vidch.id}>
                {vidch.subd ? "SUBSCRIBED":"SUBSCRIBE"}
              </div>
              {vidch.subd && <Icon mui="NotificationsActive"/>}
            </div>
          </div>
          <div className="yt-comment-box">
            <div className="text-sm">Comments are turned off&nbsp;
              {/* <span className="light-txt font-thin text-sm">{269}</span> */}
            </div>
          </div>
          <div className="yt-sugg-container">
            {!loadSugg && ydata.home && pseudorandom(ydata.home, watvid.id).splice(0,10).map((item,i)=>{
              var vid = ydata.vids[item],
                  channel = ydata.channels[vid.channel] || {}

              return (
                <div className="yt-item-container prtclk" onClick={dispatchAction}
                  data-action="youtube/watchVideo" data-payload={vid.id} key={i}>
                  <div className="yt-vid-thumbnail">
                    <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
                  </div>
                  <div className="yt-vid-info">
                    <Image src={channel.pfp} dir="asset/youtube/pfp" w={36}/>
                    <div className="flex-grow pl-2">
                      <div className="txt-ovf yt-vid-title">{vid.title}</div>
                      <div className="yt-vid-extra">
                        {channel.name} • {vid.views.quantf()} views • {new Date(vid.upload).minifyDate()}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {loadSugg && (
              <div className="yt-item-container">
                <div className="yt-vid-thumbnail">
                  <Image src="" dir="asset/youtube/thumbs"/>
                </div>
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  ) : null
}

export const TrendingPage = (props)=>{
  const ydata = useSelector(state => state.youtube)
  const [tab, setTab] = useState(0)

  const changeTab = (e) => setTab(e.target.dataset.id)
  const catg = ["Trending", "Music", "Gaming", "News", "Fashion and Beauty", "Learning"]

  return (
    <div className="yt-page yt-trending-page">
      <div className="yt-trending-catg">
        {catg.map((item, i) => {
          return (
            <div className="yt-catg prtclk softpress-in" key={item} data-id={i} onClick={changeTab}>
              <img src={"img/icon/other/" + item.toLowerCase().split(" ")[0] + ".svg"} alt="yticon"/>
              <span>{item}</span>
            </div>
          )
        })}
      </div>
      <hr/>
      <div className="yt-trending-container">
        <div className="yt-trending-title p-4">{catg[tab]}</div>
        {ydata.explore && ydata.explore[catg[tab].toLowerCase().split(" ")[0]].map((item,i)=>{
          var vid = ydata.vids[item],
              channel = ydata.channels[vid.channel] || {}

          return (
            <div className="yt-item-container prtclk" onClick={dispatchAction}
              data-action="youtube/watchVideo" data-payload={vid.id} key={i}>
              <div className="yt-vid-thumbnail">
                <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
              </div>
              <div className="yt-vid-info">
                <Image src={channel.pfp} dir="asset/youtube/pfp" w={36}/>
                <div className="flex-grow pl-2">
                  <div className="txt-ovf yt-vid-title">{vid.title}</div>
                  <div className="yt-vid-extra">
                    {channel.name} • {vid.views.quantf()} views • {new Date(vid.upload).minifyDate()}
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

export const SubsPage = (props)=>{
  const [chid, setId] = useState("")
  const ydata = useSelector(state => state.youtube)

  const handleChClick = (e)=>{
    var id = e.target.dataset.id
    if(chid==id) setId("")
    else setId(id)
  }

  return (
    <div className="yt-page">
      <div className="yt-subs-container">
        <div className="yt-channels-sc noscroll">
          <div className="yt-ch-body">
            {ydata.subd && ydata.subd.map((item, i)=>{
              var channel = ydata.channels[item] || {}
              return (
                <div className="yt-channel prtclk" onClick={handleChClick} key={i}
                  data-state={chid==""?0:(chid==item?1:2)} data-id={item}>
                  <Image src={channel.pfp} dir="asset/youtube/pfp" w={48}/>
                  <div className="txt-ovf ch-name">{channel.name}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="ch-text-all">ALL</div>
      </div>
      <div className="yt-sub-vids">
        {ydata.vids && Object.keys(ydata.vids).sort((ka,kb)=>{
          return new Date(ydata.vids[ka].upload) < new Date(ydata.vids[kb].upload)?1:-1
        }).map((key, i)=>{
          var vid = ydata.vids[key],
              channel = ydata.channels[vid.channel] || {}

          return ydata.subd.includes(channel.id) && (
            chid=="" || chid==channel.id ) && (
            <div className="yt-item-container prtclk" onClick={dispatchAction}
                  data-action="youtube/watchVideo" data-payload={vid.id} key={i}>
              <div className="yt-vid-thumbnail">
                <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
              </div>
              <div className="yt-vid-info">
                <Image src={channel.pfp} dir="asset/youtube/pfp" w={36}/>
                <div className="flex-grow pl-2">
                  <div className="txt-ovf yt-vid-title">{vid.title}</div>
                  <div className="yt-vid-extra">
                    {channel.name} • {vid.views.quantf()} views • {new Date(vid.upload).minifyDate()}
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

export const LibPage = (props)=>{
  const ydata = useSelector(state => state.youtube)

  return (
    <div className="yt-page">
      <div className="yt-his-container">
        <div className="yt-his-title">
          <span>History</span>
          <span className="ch-text-all">VIEW ALL</span>
        </div>
        <div className="yt-his-vids noscroll">
          <div className="yt-his-scbody">
            {ydata.library && ydata.library.hist.map((key, i)=>{
              var vid = ydata.vids[key],
                  channel = ydata.channels[vid.channel] || {}

              return (
                <div className="yt-his-vid prtclk" onClick={dispatchAction}
                  data-action="youtube/watchVideo" data-payload={vid.id} key={i}>
                  <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
                  <div className="txt-ovf his-vid-title">{vid.title}</div>
                  <div className="his-chname">{channel.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <hr className="my-2"/>
      <div className="flex flex-col yt-lib-cont">
        <div className="flex px-4 py-3 items-center">
          <Icon className="yt-lib-icon" mui="Download" w={20}/>
          <div className="yt-dock-name text-sm ml-4">Downloads</div>
        </div>
        <div className="flex px-4 py-3 items-center">
          <Icon className="yt-lib-icon" mui="Theaters" w={20} out/>
          <div className="yt-dock-name text-sm ml-4">Your Movies</div>
        </div>
        <div className="flex px-4 py-3 items-center">
          <Icon className="yt-lib-icon" mui="AccessTime" w={20} out/>
          <div className="yt-dock-name text-sm ml-4">Watch Later</div>
        </div>
        <div className="flex px-4 py-3 items-center">
          <Icon className="yt-lib-icon" mui="ThumbUp" w={20} out/>
          <div className="yt-dock-name text-sm ml-4">Liked Videos</div>
        </div>
      </div>
      <hr className="my-4"/>
    </div>
  )
}

export const Home = (props)=>{
  const ydata = useSelector(state => state.youtube)

  return (
    <div className="yt-page yt-feed">
      {ydata.home && ydata.home.map((item,i)=>{
        var vid = ydata.vids[ydata.home[i%ydata.home.length]],
            channel = ydata.channels[vid.channel] || {}

        return (
          <div className="yt-item-container prtclk" onClick={dispatchAction}
            data-action="youtube/watchVideo" data-payload={vid.id} key={i}>
            <div className="yt-vid-thumbnail">
              <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
            </div>
            <div className="yt-vid-info">
              <Image src={channel.pfp} dir="asset/youtube/pfp" w={36}/>
              <div className="flex-grow pl-2">
                <div className="txt-ovf yt-vid-title">{vid.title}</div>
                <div className="yt-vid-extra">
                  {channel.name} • {vid.views.quantf()} views • {new Date(vid.upload).minifyDate()}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
