import apps from './apps';

export const favbar = [
  "ssphone", "github","settings","whatsapp"
]

export const page1wid = [
  [1,2,1,5,"GoogleSearch"],
  [2,4,3,5,"ShortWeather"],
  [2,4,1,3,"MinimalVertClock"],
  [4,6,3,5,"AnalogClock"],
  [4,6,1,2,"MinimalClock"]
]

export const page2wid = [
  [5,7,1,3,"DayCountdown"]
]

export const page3wid = [
  [3,6,1,5,"WideWeather"]
]

export const page4wid = [
  [1,4,1,5,"WideCalender"]
]

const page1arr = [
  "playstore", "youtube", "google", "buyme"
]

export const page1apps = apps.filter(x => page1arr.includes(x.icon)).sort((a, b) => {
  return page1arr.indexOf(a.icon) > page1arr.indexOf(b.icon) ? 1 : -1;
});

var remapps = apps.filter(x => !page1arr.includes(x.icon) && !favbar.includes(x.icon))
              .sort((a,b)=> 2*Math.random() - 1).sort((a,b)=> 2*Math.random() - 1)

export const page2apps = [...remapps.slice(0,16)];
export const page3apps = [...remapps.slice(16,24)];
