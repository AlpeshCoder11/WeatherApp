const cityName = document.querySelector(".name");

const getLocationBtn=document.querySelector(".getlocation");
const getWeatherBtn=document.querySelector(".getweather");
const showRst = document.querySelector(".tempresult");

getWeatherBtn.addEventListener("click",async()=>{

const coords = await getLatitudeLongitude();
  if (!coords) return;

  fetchWeather(coords.lat, coords.lon);
  
});
getLocationBtn.addEventListener("click",async ()=>{
  
  const coords =  await getBrowserLocation();
  if (!coords) return;

  fetchWeather(coords.lat, coords.lon);
  latLonToCity(coords.lat, coords.lon);
});
async function fetchWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();

    showRst.innerText = data.current_weather.temperature + " °C";
  } catch (error) {
    showRst.innerText = "Failed to load 😢";
  }
}


async function getLatitudeLongitude() {

  const address=cityName.value;
    try {
      const latlonUrl =`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(address)}&count=1&format=json`;
      const response2 = await fetch(latlonUrl);
      const data2 = await response2.json();
      const location = data2.results[0];
      return {
      lat: location.latitude,
      lon: location.longitude
    };
    
    
    
    
    
  } catch (error) {
    console.log("hi");
    
  }


}
function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => reject(error)
    );
  });
}
async function latLonToCity(lat, lon) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  );
  const data = await res.json();

  console.log("City:", data.city || data.locality);
  cityName.value=data.city||data.locality;
}
