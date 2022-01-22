import apps from './apps';

export const favbar = [
  "ssphone", "messages","settings","whatsapp"
]

const page1arr = [
  "playstore", "youtube", "ssgallery", "ssbrowser"
]

export const page1apps = apps.filter(x => page1arr.includes(x.icon)).sort((a, b) => {
  return page1arr.indexOf(a.icon) > page1arr.indexOf(b.icon) ? 1 : -1;
});

var remapps = apps.filter(x => !page1arr.includes(x.icon) && !favbar.includes(x.icon))
              .sort((a,b)=> 2*Math.random() - 1).sort((a,b)=> 2*Math.random() - 1)

export const page2apps = [...remapps.slice(0,16)];
export const page3apps = [...remapps.slice(16,24)];
