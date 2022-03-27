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

export const Home = (props)=>{
  const ydata = useSelector(state => state.youtube)

  return (
    <div className="yt-feed">
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
                  {channel.name} • {vid.views.quantf()} views • 8 months ago
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
