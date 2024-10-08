const REGION_ENDPOINTS = {
  'Americas': 'americas',
  'Europe': 'europe',
  'SE Asia': 'se_asia',
  'China': 'china'
};

const CACHE_KEY_PREFIX = 'dota2_leaderboard_';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

const DOTA_API_BE_HOST = process.env.REACT_APP_DOTA_API_BE_HOST || '';
const CACHE_ENABLED = process.env.REACT_APP_ENABLE_CACHE !== 1;
const saveToCache = (region, data) => {
  const cacheData = {
    data: data,
    lastFetchTime: data.lastFetchTime,
    nextScheduledPostTime: data.nextScheduledPostTime
  };
  localStorage.setItem(`${CACHE_KEY_PREFIX}${region}`, JSON.stringify(cacheData));
};

const getFromCache = (region) => {
  const cachedData = localStorage.getItem(`${CACHE_KEY_PREFIX}${region}`);
  return cachedData ? JSON.parse(cachedData) : null;
};

const isCacheValid = (cachedData) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return cachedData && currentTime < cachedData.nextScheduledPostTime;
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchRegionData = async (region, retryCount = 0) => {
  const endpoint = REGION_ENDPOINTS[region];
  if (!endpoint) {
    throw new Error(`Invalid region: ${region}`);
  }

  let cachedData;
  if (CACHE_ENABLED) {
    cachedData = getFromCache(region);

    if (isCacheValid(cachedData)) {
      return cachedData.data;
    }
  }

  try {
    //In production DOTA_API_BE_HOST will be an empty value, because we are fetching data from backend with same origin
    const response = await fetch(`${DOTA_API_BE_HOST}/api/leaderboard?region=${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if(CACHE_ENABLED){
      saveToCache(region, data);
    }
    return data;
  } catch (error) {

    console.error(`Error fetching data for ${region}:`, error);

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1} of ${MAX_RETRIES})`);
      await delay(RETRY_DELAY);
      return fetchRegionData(region, retryCount + 1);
    } else if(CACHE_ENABLED){
      console.error(`Max retries reached for ${region}. Using cached data if available.`);
      return cachedData ? cachedData.data : null;
    }else{
      return null;
    }
  }
};

export const getAvailableRegions = () => Object.keys(REGION_ENDPOINTS);