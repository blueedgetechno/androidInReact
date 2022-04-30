## The major problems I faced during the development

(ps: This is just the tip of iceberg)

##### How do you change apps?
  - either hide them all at once and show one of them when called

  or

  - use a long slider with all apps and scroll (or rather snap) it accordingly
     on demand (✔️)

##### So the problem is how to statically order the apps without losing the state in the Swiper
  - Make your own swiper ??
  - Use Iframe and router
  - Somehow ?

**sol**: render them separately (the apps and recent menu)

##### This weird bug when stack array is being changed, it transfers the state
  - yeah, because that is what happens when you dynamically change the array in react, dumbass

  - to fix the CSS tranlateUp transition, I used animation instead of transition

  - to make it more fruitful, I manually handled the scrolls and gave up on the last item

##### How do you make the glimpse of apps appear in the recent menu without breaking the whole thing
  - duplicate the innerHTML

  - make sure to handle the react states properly

  - I had to disable the lazy component for that to work (¬_¬")

##### Sometime the bottom nav back button should not revoke back action in few cases
  For any certain apps like media opened in case of whatsApp, it need to be handled
  not by pagination of components. So how do you accommodate this without breaking
  the current navigation system?

  **sol**: Make a common value that tells the global back action handler to skip this
     call and listen it in the custom app reducer by using extraReducers properties
     of @redux/toolkit

##### How to reiterate the previous state of the app when collapsed?
  - Either use a separate reducer for that app

  or

  - if the requirement is small make the changes in the main apps reducer

##### How to transition between pages of an app without have to repeat the same code for every app
  - Make a navigation system with predefined path and fetch the page state for each app accordingly
    - I know! I made it sound easier XD

##### Now the problem with nav system is that it is declaring the app pagetree when the app is opened first time
i.e it need to be opened atleast once before getting called to open from externally.

The problem with this is that apps like google can be opened by a widget and user should be able to open the app from widget before opening from app icon

  - The simplest solution is to manually trigger the openApp action before triggering navapp action, everytime. (¬_¬ )

  - Another is to call the openApp action from navApp
  action once for all
      - The problem with solution is that there won't be    any buffer time for the app to open and define its pagetree, rendering the navapp action useless (╯°□°）╯︵ ┻━┻

**sol** : Make an action that first opens the app and then triggers the navApp action
     with some delay (⌐■_■), Hotel ? Trivago ...
