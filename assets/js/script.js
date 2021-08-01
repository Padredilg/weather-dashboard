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
var inputBoxEl = document.querySelector("#search-input");
var leftSectionEl = document.querySelector("#left-section");
var infoBoxEl = document.querySelector("#info-box");

var citiesArr = [];
var cityName;

setInterval(function(){
    var currTime = moment().format("dddd, MMM Do - hh:mm:ss A");
    $("#current-day").text(currTime);
},1000); 

var searchBtnHandler = function(event){
    event.preventDefault();

    cityName = inputBoxEl.value.trim();

    if(cityName == ""){
        return;
    };

    getCityNameLatLon(cityName);
    inputBoxEl.value = "";
    
    //store city in localStorage
    //storeCity(cityName);
}

var getCityNameLatLon = function(city) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=03935d4c657922e697bf7040e8024e77";
    //console.log(apiUrl);
    
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok){
                response.json().then(function(data) {//string api becomes object 
                    cityName = data.name;
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;

                    getCityAdvancedInfo(lat, lon);
                });
            }
            //if request was not successful means city was not found
            else{
                alert("Error: City " + city + " was either misspelled or does not exist.");
                return false;
            }

        })//end bracket of then method
        .catch(function(error){
            //Catch() is chained to then()
            alert("Unable to connect to the internet");
        })
        
};

var getCityAdvancedInfo = function(lat, lon){
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=03935d4c657922e697bf7040e8024e77";
    //console.log(apiUrl);
        
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            if(response.ok){
                response.json().then(function(data) {//string api becomes object 
                    // In here we already have the Name, and data for Temp, Wind, Humidity, UV and all this info for future days.
                    // Can we call another function by passing data? -YES
                    // Call the function to display info with this data from now!
                    
                    // //get the value of the input box. Then create a button on the same column as the search box for getting that info back
                    createCityButton(cityName);
                    //also create a box on the right where the info will be appended
                    displayBoxInfo(data.current);
                    //and a bottom section: 5-day forecast
                    displayForecast(data.daily);
                });
            }
                
            //if request was not successful means city was not found
            else{
                alert("Error: City name does not exist");
                return false;
            }
    
        })//end bracket of then method
        .catch(function(error){
            //Catch() is chained to then()
            alert("Unable to connect to the internet");
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

    var name = document.querySelector("#box-city-name");
    name.textContent = cityName;

    var temp = document.querySelector("#box-temp");
    temp.textContent = "Temp: " + current.temp + "K";

    var wind = document.querySelector("#box-wind");
    wind.textContent = "Wind: " + current.wind_speed + "MPH";

    var humidity = document.querySelector("#box-humidity");
    humidity.textContent = "Humidity: " + current.humidity + "%";

    var uv = document.querySelector("#box-uv");
    uv.textContent = "UV Index: " + current.uvi;
}

var displayForecast = function(day){

    var sectionTitle = document.querySelector("#five-day-forecast");
    sectionTitle.textContent = "5-Day Forecast:";

    var dayCards = document.querySelector(".forecast-cards");
    dayCards.textContent = "";

    for(var i=1; i<=5; i++){

        var dayForecastCard = document.createElement("div");
        dayForecastCard.className = "forecast-single-card";
    
        var cardy = document.createElement("h5");
        cardy.className = "left";
        cardy.textContent = "Day " + (i+1);
    
        var temp = document.createElement("h6");
        temp.className = "left";
        temp.textContent = "Temp:" + day[i].temp.day + "K";
    
        var wind = document.createElement("h6");
        wind.className = "left";
        wind.textContent = "Wind:" + day[i].wind_speed + "MPH";
    
        var humidity = document.createElement("h6");
        humidity.className = "left";
        humidity.textContent = "Humidity:" + day[i].humidity + "%";
    
        dayForecastCard.appendChild(cardy);
        dayForecastCard.appendChild(temp);
        dayForecastCard.appendChild(wind);
        dayForecastCard.appendChild(humidity);
    
        dayCards.appendChild(dayForecastCard);
    }
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
        }
    }
};


loadCities();
searchFormEl.addEventListener("submit", searchBtnHandler);


//functions will stop at different fases. stop before fetching if "".
//stop during fetch if invalid name
//dont create new button if name already exists.

//merge searchBtnHandler() with getCityNameLatLon()

//add drag-and-drop properties to make cities dropable to remove zone

//displayed info-box and forecast need to be provided from the API

//style hover effects in the buttons

//still need to fetch info from api to be displayed
//But what if a city is clicked? -- Then call the other two functions again passing its own textContent as parameter

//maybe create addEventlistener on click for the left-section. when click check if its a button
