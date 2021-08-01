// GIVEN a weather dashboard with form inputs

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, 
//the humidity, the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, 
//the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var searchFormEl = document.querySelector("#search-form");
var clearSearchEl = document.querySelector("#clear");
var inputBoxEl = document.querySelector("#search-input");
var leftSectionEl = document.querySelector("#searched-cities");
var infoBoxEl = document.querySelector("#info-box");

var citiesArr = [];
var cityName;

setInterval(function(){
    var currTime = moment().format("dddd, MMM Do - hh:mm:ss A");
    $("#current-day").text(currTime);
},1000); 

var clearHistory = function(){
    leftSectionEl.innerHTML = "";
    citiesArr = [];
    localStorage.clear();
}

var searchBtnHandler = function(event){
    event.preventDefault();

    cityName = inputBoxEl.value.trim();

    if(cityName == ""){
        return;
    };

    //if some city was inputed, lets see if it exists.
    getCityNameLatLon(cityName);
    inputBoxEl.value = "";
}

var getCityNameLatLon = function(city) {
    //get the API URL so we can fetch it
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=03935d4c657922e697bf7040e8024e77";
    
    // fetch the API URL
    fetch(apiUrl)
        .then(function(response) {
            //if city is found in the API library, execute this:
            if(response.ok){
                response.json().then(function(data) {//string api becomes object 
                    cityName = data.name;
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;

                    getCityTempWindHumUV(lat, lon);
                });
            }
            //if city was not found in API, alert user.
            else{
                alert("Error: City " + city + " was either misspelled or does not exist.");
                return false;
            }

        })//this will execute if fetch was not successful. Probably due to internet issues
        .catch(function(error){
            //Catch() is chained to then()
            alert("Unable to complete your request at this time. Please check your internet connection.");
        })
        
};

var getCityTempWindHumUV = function(lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=03935d4c657922e697bf7040e8024e77";
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok){
                response.json().then(function(data) {//string api becomes object
                    createCityButton(cityName);
                    displayBoxInfo(data.current);
                    displayForecast(data.daily);
                });
            }
            else{
                alert("Error: City " + city + " was either misspelled or does not exist.");
                return false;
            }
    
        })
        .catch(function(error){
            alert("Unable to complete your request at this time. Please check your internet connection.");
        })
};

var createCityButton = function(city){
    //check if name was already inputed.
    //Oops, this is blocking the loadCities when page is reloaded.
    if(checkRepeatedCity(city)){
        return;
    };

    var newCityButton = document.createElement("button");
    newCityButton.classList = "button city-btn"
    newCityButton.textContent = city;
    leftSectionEl.appendChild(newCityButton);
    newCityButton.addEventListener("click", clickHandlerFunction);

    storeCity(city);
}

var checkRepeatedCity = function(cityName){
    if(citiesArr){
        for(var i=0; i<citiesArr.length; i++){
            if(cityName == citiesArr[i]){
                // displayBoxInfo(cityName);
                // displayForecast(cityName);
                return true;
            }
        }
    }
    return false;
}

var displayBoxInfo = function (current){
    //give the div its border class and Populate the info into its tags.
    infoBoxEl.className = "info-box-border";

    //<img src="http://openweathermap.org/img/w/04d.png" alt="Clouds">
    //include icon!

    var name = document.querySelector("#box-city-name");
    name.textContent = cityName + " (" + moment().format("M/D/YYYY") + ")";
    
    document.getElementById("info-box-img").src="http://openweathermap.org/img/w/" + current.weather[0].icon + ".png";
    document.getElementById("info-box-img").alt=current.weather[0].description;

    var temp = document.querySelector("#box-temp");
    var tempFahr = ((current.temp  - 273.15)*(9/5) + 32);
    tempFahr = tempFahr.toFixed(2);
    temp.textContent = "Temp: " + tempFahr + "°F";

    var wind = document.querySelector("#box-wind");
    wind.textContent = "Wind: " + current.wind_speed + " MPH";

    var humidity = document.querySelector("#box-humidity");
    humidity.textContent = "Humidity: " + current.humidity + "%";

    var uv = document.querySelector("#box-uv");
    var uvColor = getUVColor(current.uvi);
    uv.innerHTML = "UV Index: <span class='background " + uvColor + "'>" + current.uvi + "</span>";
}

var getUVColor = function(uv){
    if(uv < 3){
        return "green";
    }
    else if(uv < 6){
        return "yellow"
    }
    else if(uv < 9){
        return "orange"
    }
    else{
        return "red"
    }
}

var displayForecast = function(day){

    var sectionTitle = document.querySelector("#five-day-forecast");
    sectionTitle.textContent = "5-Day Forecast:";

    var dayCards = document.querySelector(".forecast-cards");
    dayCards.textContent = "";

    for(var i=1; i<=5; i++){

        var dayForecastCard = document.createElement("div");
        dayForecastCard.className = "forecast-single-card";
    
        var cardDate = document.createElement("h5");
        cardDate.className = "left";
        cardDate.textContent = moment().add(i,'days').format("M/D/YYYY");

        var icon = document.createElement("img");
        icon.src = "http://openweathermap.org/img/w/" + day[i].weather[0].icon + ".png";
        icon.alt = day[i].weather[0].description;
    
        var temp = document.createElement("h6");
        temp.className = "left";
        var tempFahr = ((day[i].temp.day  - 273.15)*(9/5) + 32);
        tempFahr = tempFahr.toFixed(2);
        temp.textContent = "Temp: " + tempFahr + "°F";
    
        var wind = document.createElement("h6");
        wind.className = "left";
        wind.textContent = "Wind: " + day[i].wind_speed + " MPH";
    
        var humidity = document.createElement("h6");
        humidity.className = "left";
        humidity.textContent = "Humidity: " + day[i].humidity + "%";
    
        dayForecastCard.appendChild(cardDate);
        dayForecastCard.appendChild(icon);
        dayForecastCard.appendChild(temp);
        dayForecastCard.appendChild(wind);
        dayForecastCard.appendChild(humidity);
    
        dayCards.appendChild(dayForecastCard);
    }
}

var clickHandlerFunction = function(event){
    getCityNameLatLon(event.target.innerHTML)
}

var storeCity = function(city){
    citiesArr.push(city);
    localStorage.setItem("cities", JSON.stringify(citiesArr));
}

var loadCities = function () {
    var retrievedData = localStorage.getItem("cities");
    //only execute code if retrievedData isn't empty
    if (retrievedData) {
        citiesArr = JSON.parse(retrievedData);

        for (var i = 0; i < citiesArr.length; i++) {
            var newCityButton = document.createElement("button");
            newCityButton.classList = "button city-btn"
            newCityButton.textContent = citiesArr[i];
            leftSectionEl.appendChild(newCityButton);
            newCityButton.addEventListener("click", clickHandlerFunction);
        }
    }
};


loadCities();
searchFormEl.addEventListener("submit", searchBtnHandler);
clearSearchEl.addEventListener("click", clearHistory);

//Update Read Me

//add Media Queries