  const cityName = document.querySelector(".name");

  const getLocationBtn=document.querySelector(".getlocation");
  const getWeatherBtn=document.querySelector(".getweather");
  const showRst = document.querySelector(".tempresult");


  const weatherMapping = {
    0: { label: "Clear Sky", icon: "☀️" },
    1: { label: "Mainly Clear", icon: "🌤️" },
    2: { label: "Partly Cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Foggy", icon: "🌫️" },
    48: { label: "Depositing Rime Fog", icon: "🌫️" },
    51: { label: "Light Drizzle", icon: "🌦️" },
    61: { label: "Slight Rain", icon: "🌧️" },
    63: { label: "Moderate Rain", icon: "🌧️" },
    65: { label: "Heavy Rain", icon: "🌊" },
    71: { label: "Slight Snow", icon: "❄️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
  };

 
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
      showRst.innerHTML = `<div class="loader">Fetching the clouds... ☁️</div>`;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&weather_code=true`;
      const response = await fetch(url);
      const data = await response.json();

      const currentWeather = data.current_weather;
      const temp = currentWeather.temperature;
      const code = currentWeather.weathercode;

      
      const weatherInfo = weatherMapping[code] || { label: "Unknown", icon: "🌈" };

      showRst.innerHTML = `
        <div style="font-size: 3rem;">${weatherInfo.icon}</div>
        <div style="font-size: 2rem; font-weight: bold;">${temp}°C</div>
        <div style="color: #111010;">${weatherInfo.label}</div>
      `;
      
    } catch (error) {
      showRst.innerText = "Failed to load 😢";
      console.error(error);
    }
  }


  async function getLatitudeLongitude() {

    const address=cityName.value;
    if (!address) {
    showRst.innerText = "Please enter a city name! 📍";
    return null;
  }
      try {
        const latlonUrl =`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(address)}&count=1&format=json`;
        const response2 = await fetch(latlonUrl);
        const data2 = await response2.json();
        if (!data2.results) {
      showRst.innerText = "City not found. Try again? 🤔";
      return null;
    }
        const location = data2.results[0];
        return {
        lat: location.latitude,
        lon: location.longitude
      };
      
      
      
      
      
    } catch (error) {
      
      
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
