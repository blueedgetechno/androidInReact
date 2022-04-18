import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import TextField from '@mui/material/TextField'

import {Icon, Image} from 'components/utils'
import {dispatchAction, dispatchAct} from 'store/actions'

import './google.scss'
import newsdata from './news.json'

export const GoogleApp = () => {
  const app = useSelector(state => state.home.apps.google || {})
  const home = useSelector(state => state.home)
  const show = home.ishome==false && home.stack.at(-1)==app.payload
  const pagetree = app && app.pagetree || {
    "main": {
      "search" : {},
      "result" : {}
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
  const [searchtxt, setTxt] = useState('')
  const clstring = `${app.payload}-wrapper`
  const path = app.path || ['main']

  const handlleReset = () => setTxt('')
  const openResults = () => dispatchAct({
    type: "home/navApp",
    payload: "google.result"
  })

  const handleTxtChange = (e) => setTxt(e.target.value)
  const handleSuggClk = (e) => {
    setTxt(e.target.innerText)
    openResults()
  }

  const handleSearch = (e) => {
    if(e.key == "Enter" && searchtxt.length) openResults()
  }

  const checkstate = (comp) => {
    return path.includes(comp) ? (
      path.at(-1) == comp ? 1 : 2
    ) : 0;
  }

  const sdata = {
    "sugg": ["videos", "old songs", "hd wallpapers", "love", "new movies", "new songs", "cool photos", "images"],
    "trend": ["T20 World Cup", "Squid Game", "Afghanistan", "Ethereum Price", "Baked oats", "Battlefield 2042", "Black Widow"]
  }

  return (
    <div className={"app-wrapper "+clstring} id={clstring} data-open={show}>
      <div className="app-inner-wrapper gg-inner-wrapper">
        {checkstate('main')==1 && (
          <div className="google-home overflow-y-scroll h-full">
            <div className="google-land flex flex-col items-end">
              <Image className="rounded rounded-full" src="blue.jpg" w={28}/>
              <Image className="namelogo" dir="asset/other" src="googlename" w={120}/>
              <div className="search-box-container press-in prtclk" onClick={dispatchAction}
                data-action="home/navApp" data-payload="google.search">
                <div className="search-input">
                  <Icon mui="Search" w={24}/>
                  <TextField className="search-inp" placeholder="Search..." disabled/>
                  <Icon src="apps/mic" w={20}/>
                </div>
              </div>
              <div className="news-container">
                {newsdata.articles.map((article,i) => {
                  return (
                    <div className="news-box" key={i}>
                      <Image src={article.urlToImage}/>
                      <div className="news-title txt-ovf wb-line-3">
                        {article.title}
                      </div>
                      <div className="flex mt-2 px-1 mb-8">
                        <Icon className="rounded-full" src={new URL(article.url).origin + "/favicon.ico"} w={14}/>
                        <span className="text-xs light-txt font-thin ml-2">{article.source.name}</span>
                        <div className="flex-grow"></div>
                        <Icon className="mr-4" mui="Share" w={16}/>
                        <Icon mui="MoreVert" w={18}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        {checkstate('search')==1 && (
          <div className="google-spage">
            <div className="search-box-container">
              <div className="search-input">
                <Icon src="apps/google" w={26}/>
                <TextField className="search-inp" placeholder="Search..." autoFocus
                  value={searchtxt} onChange={handleTxtChange} onKeyPress={handleSearch}/>
                  {searchtxt.length ? (
                    <Icon mui="Close" w={20} onClick={handlleReset}/>
                  ) : <Icon src="apps/mic" w={20}/>}
              </div>
            </div>
            <div className="search-suggestions thinScroll">
              <div className="try-search">
                <div className="sugg-title">TRY SEARCHING FOR</div>
                {sdata.sugg.map((x,i) => (
                  <div className="sugg-box active-dark-lit xlit prtclk"
                    onClick={handleSuggClk} key={i}>
                    <Icon mui="Search" w={20}/>
                    <span>{x}</span>
                    <div className="flex-grow"></div>
                    <Icon mui="CallMade" flip w={20}/>
                  </div>
                ))}
              </div>
              <div className="trending-search">
                <div className="sugg-title">TRENDING SEARCHES</div>
                {sdata.trend.map((x,i) => (
                  <div className="sugg-box active-dark-lit xlit prtclk"
                    onClick={handleSuggClk} key={i}>
                    <Icon mui="TrendingUp" w={20}/>
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {checkstate('result')==1 && (
          <div className="search-frame">
            <iframe src={'https://www.google.com/search?igu=1&q='+searchtxt} frameBorder="0"></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
