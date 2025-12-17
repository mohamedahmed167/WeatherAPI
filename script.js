const cityInput=document.querySelector(".city-input")
const searchBtn=document.querySelector(".search-btn")
const notFounded=document.querySelector(".not-found")
const searchCityData=document.querySelector(".search-city")
const weatherInfo=document.querySelector(".weather-info ");
const apiKey="f83e063733ac30eb0368776117d3b9cd"
const countryText=document.querySelector(".country-txt")
const tempText=document.querySelector(".temp-txt")
const cloud=document.querySelector(".condition-txt ")
const humidityValue=document.querySelector(".humditiy-value-txt")
const windSpeedValue=document.querySelector(".wind-value-txt")
const weatherSummeryImg=document.querySelector(".weather-summry-img")
const currentDataTxt=document.querySelector(".current-data-txt")
const forecastItemContainer=document.querySelector(".forecast-items-container")
searchBtn.addEventListener("click",()=>{
    if(cityInput.value.trim() != ""){
    updateWeatherInfo(cityInput.value)
    console.log(cityInput.value)
    cityInput.value="";
    cityInput.blur()
}})
cityInput.addEventListener("keydown",(e)=>{
    if(e.key=='Enter' &&cityInput.value.trim() != ""){
        console.log(cityInput.value)
        updateWeatherInfo(cityInput.value)
        cityInput.value="";
        cityInput.blur()
    }
})
async  function getFetchData(endPoint,city){
const apiURl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}`
const response=await fetch(apiURl)
return response.json()
}
function getWeatherIcon(id){
    if (id <=232) return "thunderstorm.svg"
    if (id <=321) return "drizzle.svg"
    if (id <=531) return "rain.svg"
    if(id <=622) return "snow.svg"
    if(id <=800) return "clear.svg"
    else return "clouds.svg"
}
function getCurrentTxt(){
const current =new Date();
const options={
    weekday: "short",
    day:"2-digit",
    month:"short"
}
    return current.toLocaleDateString("en-GB",options)
}
async function updateWeatherInfo(city){
    const weatherData=await getFetchData('weather',city);
    if(weatherData.cod != 200){
        showDisplaysection(notFounded)
        return
    }
console.log(weatherData)
const {
    name:country,
    main:{temp ,humidity},
    weather:[{id ,main}],
    wind:{speed},
}=weatherData;
    countryText.textContent=country;
    tempText.textContent=Math.round(temp - 273.15) +" ℃";
    cloud.textContent=main;
    humidityValue.textContent=humidity +"%";
    windSpeedValue.textContent=speed + " M/s";
    currentDataTxt.textContent=getCurrentTxt()
    weatherSummeryImg.src=`/weather/${getWeatherIcon(id)}`
    await updataForecastInfo(city)
    showDisplaysection(weatherInfo)
}
async function updataForecastInfo(city){
const forcastData=await getFetchData("forecast",city)
const timeTake="12:00:00";
const toDayDate=new Date().toISOString().split('T')[0];
    forecastItemContainer.innerHTML=""
    forcastData.list.forEach(forecastWeather=>{
        if(forecastWeather.dt_txt.includes(timeTake) &&  !forecastWeather.dt_txt.includes(toDayDate)){
            updataForecastItem(forecastWeather)
        }
        // console.log(forecastWeather);

    })
    // console.log(toDayDate)
}
function updataForecastItem(weatherData){
console.log(weatherData)
const {
    dt_txt:dataTXT,
    weather:[{id}],
    main:{temp},
}=weatherData;
const dataTaken=new Date(dataTXT);
const dataOption ={
    day: "2-digit",
    month:"short",
}
const dataResult=dataTaken.toLocaleDateString("en-US",dataOption)
const forecastItem=`
        <div class="forecast-item">
            <h5 class="forecast-item-date regluer-txt">${dataResult}</h5>
            <img src="./weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp -273.15)} ℃</h5>
        </div>`
        forecastItemContainer.insertAdjacentHTML("beforeend",forecastItem)
}

function showDisplaysection(section){
[weatherInfo ,searchCityData ,notFounded]
.forEach(section=>section.style.display="none")
section.style.display="block";
}