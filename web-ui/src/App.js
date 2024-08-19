import MMRLeaderboard from "./MMRLeaderboard.comp"
import Tribute from "./Tribute.comp"
import './App.css'
import React, { useEffect } from "react"
import posthog from "posthog-js"


const initAnalytics = () => {
  const pgApiKey = process.env.REACT_APP_POSTHOG_API_KEY;
  const isAnalyticsEnabled = pgApiKey !== null && pgApiKey !== "";
  if (!isAnalyticsEnabled) {
    console.log("Skipping analytics (posthog) init, as id not found");
    return;
  }
  
  posthog.init(pgApiKey,{
    api_host:'https://us.i.posthog.com',
    person_profiles:'identified_only'
  });

  posthog.register({
    environment: process.env.NODE_ENV,
    host: window.location.hostname || 'unknown'
  })
}

initAnalytics();
const App = () => {
  useEffect(()=>{
    posthog.capture('$pageview')
  },[]);


  return (
    <div className="app-container">
      <MMRLeaderboard />
      <Tribute />
    </div>
  )
}

export default App;