import apps from './apps'

const srandom = (seed)=>{
  var x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

const shuffle = (arr, seed)=>{
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

export const favbar = [
  "twitter", "github","settings","whatsapp"
]

export const page1wid = [
  [1,2,1,5,"GoogleSearch"],
  [2,4,3,5,"ShortWeather"],
  [2,4,1,3,"MinimalVertClock"],
  [4,6,3,5,"AnalogClock"],
  [4,6,1,2,"MinimalClock"]
]

export const page2wid = [
  [4,6,1,3,"DayCountdown"]
]

export const page3wid = [
  [3,6,1,5,"WideWeather"]
]

export const page4wid = [
  [1,4,1,5,"WideCalender"]
]

const page1arr = [
  "playstore", "youtube", "google", "unescape"
]

const page2arr = [
  "ssphone", "gmail", "discord", "buyme"
]

export const page1apps = apps.filter(x => page1arr.includes(x.icon)).sort((a, b) => {
  return page1arr.indexOf(a.icon) > page1arr.indexOf(b.icon) ? 1 : -1
})

export const page2bar = apps.filter(x => page2arr.includes(x.icon)).sort((a, b) => {
  return page2arr.indexOf(a.icon) > page2arr.indexOf(b.icon) ? 1 : -1
})

var remapps = shuffle(apps.filter(x => {
  return !page1arr.includes(x.icon) && !page2arr.includes(x.icon) && !favbar.includes(x.icon)
}), new Date().getFullYear())

export const page2apps = [...remapps.slice(0,12)]
export const page3apps = [...remapps.slice(12,20)]
