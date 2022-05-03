import store from 'store';
import apps from './data/apps';
import {
  favbar,
  page1apps,
  page2bar,
  page2apps,
  page3apps,
  page1wid,
  page2wid,
  page3wid,
  page4wid
} from './data/preset';
import axios from 'axios';
import './prototypes.js';

import whatsapp_data from './data/whatsapp.json';
import youtube_data from './data/youtube.json';

const {round, floor, random, min, max, abs} = Math;

export const gene_name = (x=10) => random().toString(36).substring(2, x).toLowerCase()
export const srandom = (seed)=>{
  var x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

export const shuffle = (arr, seed)=>{
  var m = arr.length, t, i
  while (m) {
    i = Math.floor(srandom(seed) * m--)
    t = arr[m]
    arr[m] = arr[i]
    arr[i] = t
    ++seed
  }

  return arr
}

export const dispatchAction = (e) => {
  var action = {
    type: e.target.dataset.action,
    payload: e.target.dataset.payload,
  };

  if (action.type) store.dispatch(action);
}

export const dispatchAct = (action) => {
  if(action.type) store.dispatch(action);
}

export const openAppPage = (id, page) => {
  dispatchAct({type: "home/navApp", payload: page})
  setTimeout(()=> dispatchAct({
    type: "home/openApp",
    payload: id
  }), 200)
}

export const fetchBatteryStatus = () => {
  try{
    var battery = navigator.getBattery()
    if(battery){
      battery.then((battery) => {
        store.dispatch({
          type: "global/battery",
          payload: {
            charging: battery.charging,
            level: battery.level,
          },
        })
      })
    }
  }catch(e){

  }
}

export const fillZero = (x)=>{
  return (x<9?"0":"") + x
}

const fetchTime = () => {
  var date = new Date();
  var timestring = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: !store.getState().global.time.military,
  }).split(" ")

  timestring[0] = timestring[0].split(":")

  store.dispatch({type: "global/time", payload: {
    hours: timestring[0][0],
    minutes: timestring[0][1],
    abb: timestring[1]
  }})

  store.dispatch({type: "global/date", payload: {
    day: date.getDate(), month: date.getMonth(), year: date.getFullYear()
  }})
}

const fetchActions = () => {
  fetchBatteryStatus();
  fetchTime();
}

export const fetchWeather = () => {
  var defaultData = {
    city: "New york",
    temperature: "32",
    icon: "c",
    predictions: [
      {
        date: "2020-01-01",
        day: "Mon",
        temperature: "33",
        icon: "lr"
      },{
        date: "2020-01-02",
        day: "Tue",
        temperature: "34",
        icon: "t"
      },{
        date: "2020-01-03",
        day: "Wed",
        temperature: "35",
        icon: "lc"
      },{
        date: "2020-01-04",
        day: "Thu",
        temperature: "36",
        icon: "hr"
      }
    ]
  }

  var geocodingapi = "https://api.techniknews.net/ipgeo/",
      weatherapi = "https://www.metaweather.com/api/location"

  if(true) return

  axios.get(geocodingapi).then(res => res.data).then((res) => {
    defaultData.city = res.regionName + ", " + res.country
    var woeidurl = weatherapi + `/search/?lattlong=${res.lat},${res.lon}`
    console.log(woeidurl);
    axios.get(woeidurl, {
      "mode": "no-cors",
      withCredentials: false
    }).then(res => res.data).then(res => {
      console.log(res);
      if(res && res[0]){
        var weatherurl = weatherapi + "/" + res[0].woeid
        console.log(weatherurl);
        // axios.get(weatherurl).then(res => res.data).then(res => {
          // console.log(res);
        // })
      }
    })
  }).catch(e => e)
}

export const loadSettings = () => {
  fetchActions()
  loadApps()
  fetchWeather()
  const shortUpdates = setInterval(fetchActions, 10000);
  window.onresize = ()=>{
    store.dispatch({type: "global/resolution", payload: {
      width: window.innerWidth,
      height: window.innerHeight
    }})
  }
}

export const loadApps = ()=>{
  var tmp = {}
  for (var i = 0; i < apps.length; i++) {
    tmp[apps[i].icon] = apps[i]
  }

  store.dispatch({type: "home/setApps", payload: tmp});
  store.dispatch({type: "home/setFavBar", payload: favbar});

  var homelist = {}
  // page 1
  for (var i = 0; i < page1apps.length; i++) {
    homelist[page1apps[i].icon] = {
      page: 1,
      type: 'app',
      row: [6,7],
      col: [i+1,i+2]
    }
  }

  // adding home screen widgets
  for (var i = 0; i < page1wid.length; i++) {
    homelist[gene_name()] = {
      page: 1,
      type: 'widget',
      row: page1wid[i].slice(0,2),
      col: page1wid[i].slice(2,4),
      widget: page1wid[i][4]
    }
  }

  // page 2
  for (var i = 0; i < page2apps.length; i++) {
    homelist[page2apps[i].icon] = {
      page: 2,
      type: 'app',
      row: [floor(i/4) + 1, floor(i/4) + 2],
      col: [(i%4)+1,(i%4)+2]
    }
  }

  // page 2 bar
  for (var i = 0; i < page2bar.length; i++) {
    homelist[page2bar[i].icon] = {
      page: 2,
      type: 'app',
      row: [6, 7],
      col: [(i%4)+1,(i%4)+2]
    }
  }

  // page 2 widgets
  for (var i = 0; i < page2wid.length; i++) {
    homelist[gene_name()] = {
      page: 2,
      type: 'widget',
      row: page2wid[i].slice(0,2),
      col: page2wid[i].slice(2,4),
      widget: page2wid[i][4]
    }
  }

  // page 3
  for (var i = 0; i < page3apps.length; i++) {
    homelist[page3apps[i].icon] = {
      page: 3,
      type: 'app',
      row: [floor(i/4) + 1, floor(i/4) + 2],
      col: [(i%4)+1,(i%4)+2]
    }
  }

  // page 3 widgets
  for (var i = 0; i < page3wid.length; i++) {
    homelist[gene_name()] = {
      page: 3,
      type: 'widget',
      row: page3wid[i].slice(0,2),
      col: page3wid[i].slice(2,4),
      widget: page3wid[i][4]
    }
  }

  // page 4 widgets
  for (var i = 0; i < page4wid.length; i++) {
    homelist[gene_name()] = {
      page: 4,
      type: 'widget',
      row: page4wid[i].slice(0,2),
      col: page4wid[i].slice(2,4),
      widget: page4wid[i][4]
    }
  }

  Object.keys(homelist).forEach((key, i) => {
    store.dispatch({type: "home/setSlide", payload: {
      id: key,
      data: homelist[key]
    }});
  });

  loadWhatsApp()
  loadYouTube()
}

const randomTimes = (c = 1, b = 60, f = 60)=>{
  var tmptime = new Date(new Date() - round(random()*b)*60*1000),
      arr = []

  while(c>0){
    arr.push(tmptime)
    tmptime = new Date(tmptime - round(random()*f)*60*1000)
    c -= 1
  }

  return arr
}

const loadWhatsApp = ()=>{
  var tmp = {...whatsapp_data};
  tmp.curr = 0;

  var tmptimes = randomTimes(tmp.self.status.length).reverse()
  for (var i = tmp.self.status.length - 1; i>=0; i--) {
    tmp.self.status[i].time = tmptimes[i].toISOString()
  }

  for (var i = 0; i < tmp.chats.length; i++) {
    var cont = tmp.chats[i]
    cont.id = i

    if(cont.status){
      var tdates = randomTimes(cont.chat.length,720,20).reverse()
      for (var j = cont.status.length - 1; j >= 0; j--) {
        cont.status[j].time = tdates[j].toISOString()
      }
    }else cont.status = []


    if(cont.chat){
      var tdates = randomTimes(cont.chat.length,60,300).reverse(),
          replied = false;

      for (var j = cont.chat.length - 1; j >= 0; j--) {
        cont.chat[j].time = tdates[j].toISOString()
        if(cont.chat[j].type=="2"){
          cont.chat[j].seen = (j+1 == cont.chat.length) && !replied ?
                                floor(random()*3) : 2;
        }else replied = true
      }
    }else cont.chat = []

    tmp.chats[i] = {...cont};
  }

  tmp.media = {}
  tmp.status = {
    vis: !true,
    id: -1
  }

  store.dispatch({type: 'whatsapp/setData', payload: tmp});
}

const loadYouTube = ()=>{
  var tmp = {...youtube_data}

  tmp.watch = {}
  tmp.comp = false

  Object.keys(tmp.channels).forEach((key, i) => {
    var chnl = {...tmp.channels[key]}
    chnl.id = key
    tmp.channels[key] = {...chnl}
  })

  Object.keys(tmp.vids).forEach((key, i) => {
    var ytvid = {...tmp.vids[key]}
    ytvid.id = key
    ytvid.views = Number(ytvid.views)
    ytvid.likes = round(ytvid.views*(0.1 + random()*0.4))
    ytvid.dislikes = round(ytvid.likes*(0.2 + random()*0.8))
    if(!ytvid.thumb) ytvid.thumb = `https://i.ytimg.com/vi/${key}/hq720.jpg`
    var channel
    if(typeof(ytvid.channel)!="string"){
      channel = {...ytvid.channel}
      channel.id = gene_name(8)
      ytvid.channel = channel.id
    }else channel = {...tmp.channels[ytvid.channel]}

    if(!channel.subs) channel.subs = round(ytvid.views*(0.05 + random()*0.1))

    tmp.channels[channel.id] = channel
    tmp.vids[key] = {...ytvid}
  })

  // tmp.watch = {id: "3izFMB91K_Q"}
  // tmp.comp = false

  tmp.explore.trending = Object.keys(tmp.vids).sort(() => Math.random() - 0.5).splice(0,15)
  tmp.home = Object.keys(tmp.vids).sort(() => Math.random() - 0.5)
  tmp.library.hist = Object.keys(tmp.vids).filter((x,i) => i&1).splice(0,8)

  store.dispatch({type: 'youtube/setData', payload: tmp});
}
