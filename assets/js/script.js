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

    getCityNameLatLon(cityName);
    inputBoxEl.value = "";

    //check if value is empty, or if name was already inputed, or if city name is non-existent
    // if(checkCity(cityName)){
    //     return;
    // };
    
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
                alert("Error: City name does not exist");
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

// var checkCity = function(cityName){
//     //returns false if cityName is "", or name was already chosen, or if name does not exist
//     if(cityName == ""){//add || cityName already exists in localStorage
//         return true;
//     }

//     //if there are cities in the citiesArr already, see if new city is already there
//     else if(citiesArr){
//         for(var i=0; i<citiesArr.length; i++){
//             if(cityName == citiesArr[i]){
//                 displayBoxInfo(cityName);
//                 displayForecast(cityName);
//                 return true;
//             }
//         }
//     }

//     // else if(name is not in the WebApi){
//     //     return true
//     // }
//     //loop through WebApi names and see if any corresponds. If no matches, then alert user and return true.
//     return false;
// }

var createCityButton = function(city){
    var newCity = document.createElement("button");
    newCity.classList = "button city-btn"
    newCity.textContent = city;
    leftSectionEl.appendChild(newCity);
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

var storeCity = function(cityName){
    citiesArr.push(cityName);
    localStorage.setItem("cities", JSON.stringify(citiesArr));
}

var loadCities = function () {
    var retrievedData = localStorage.getItem("cities");
    //only execute code if retrievedData isn't empty
    if (retrievedData) {
        citiesArr = JSON.parse(retrievedData);

        for (var i = 0; i < citiesArr.length; i++) {
            createCityButton(citiesArr[i]);
        }
    }
};


loadCities();
searchFormEl.addEventListener("submit", searchBtnHandler);


//merge searchBtnHandler() with getCityNameLatLon()

//add drag-and-drop properties to make cities dropable to remove zone

//displayed info-box and forecast need to be provided from the API

//style hover effects in the buttons

//still need to fetch info from api to be displayed
//But what if a city is clicked? -- Then call the other two functions again passing its own textContent as parameter

//maybe create addEventlistener on click for the left-section. when click check if its a button
