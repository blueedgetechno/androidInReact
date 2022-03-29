import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Icon, Image, Video} from 'components/utils.js';
import {dispatchAction, dispatchAct} from 'store/actions';

export const ViewPage = (props)=>{

  return (
    <div className="yt-vid-view">
      Hmm ...
    </div>
  )
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
            <div className="yt-item-container" key={i}>
              <div className="yt-vid-thumbnail">
                <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
              </div>
              <div className="yt-vid-info">
                <Image src={channel.pfp} dir="asset/youtube/pfp" w={36}/>
                <div className="flex-grow pl-2">
                  <div className="yt-vid-title">{vid.title}</div>
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
  const ydata = useSelector(state => state.youtube)

  return (
    <div className="yt-page">
      <div className="yt-subs-container">
        <div className="yt-channels-sc noscroll">
          <div className="yt-ch-body">
            {ydata.subd && ydata.subd.map((item, i)=>{
              var channel = ydata.channels[item] || {}
              return (
                <div className="yt-channel" key={i}>
                  <Image src={channel.pfp} dir="asset/youtube/pfp" w={48}/>
                  <div className="ch-name">{channel.name}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="ch-text-all">ALL</div>
      </div>
      <div className="yt-sub-vids">
        {ydata.vids && Object.keys(ydata.vids).map((key, i)=>{
          var vid = ydata.vids[key],
              channel = ydata.channels[vid.channel] || {}

          return (
            <div className="yt-item-container" key={i}>
              <div className="yt-vid-thumbnail">
                <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
              </div>
              <div className="yt-vid-info">
                <Image src={channel.pfp} dir="asset/youtube/pfp" w={36}/>
                <div className="flex-grow pl-2">
                  <div className="yt-vid-title">{vid.title}</div>
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

  return (
    <div className="yt-page">
      Hmm ... 2
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
          <div className="yt-item-container" key={i}>
            <div className="yt-vid-thumbnail">
              <Image src={vid.thumb} dir="asset/youtube/thumbs"/>
            </div>
            <div className="yt-vid-info">
              <Image src={channel.pfp} dir="asset/youtube/pfp" w={36}/>
              <div className="flex-grow pl-2">
                <div className="yt-vid-title">{vid.title}</div>
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
