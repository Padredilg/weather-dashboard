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

setInterval(function(){
    var currTime = moment().format("dddd, MMM Do - hh:mm:ss A");
    $("#current-day").text(currTime);
},1000); 

var searchBtnHandler = function(event){
    event.preventDefault();

    var cityName = inputBoxEl.value.trim();//convert to only first letter capitalized
    //Capitalize first letter of each word
    cityName = capFirstLetter(cityName);
    //this function may not be needed because we can instead use the one in the webApi

    //check if value is empty, or if name was already inputed, or if city name is non-existent
    if(checkCity(cityName)){
        return;
    };
    
    //get the value of the input box. Then create a button on the same column as the search box for getting that info back
    createCityButton(cityName);
    //also create a box on the right where the info will be appended
    displayBoxInfo(cityName);
    //and a bottom section: 5-day forecast
    displayForecast(cityName);

    //store city in localStorage
    storeCity(cityName);
}

var checkCity = function(cityName){
    //returns false if cityName is "", or name was already chosen, or if name does not exist
    if(cityName == ""){//add || cityName already exists in localStorage
        return true;
    }
    
    //if there are cities in the citiesArr already, see if new city is already there
    else if(citiesArr){
        for(var i=0; i<citiesArr.length; i++){
            if(cityName == citiesArr[i]){
                return true;
            }
        }
    }

    // else if(name is not in the WebApi){
    //     return true
    // }
    //loop through WebApi names and see if any corresponds. If no matches, then alert user and return true.
    return false;
}

var capFirstLetter = function(cityName){
    //convert entire string name to lowercase, and split the cityName at every space
    //splitName becomes an array in which each element is one of the words
    var splitName = cityName.toLowerCase().split(" ");
        
    // loop will only execute the same number of elements contained in the array
    for (var i=0; i<splitName.length; i++) {
        //Make first letter of the element capital, followed by the remaining.
        splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substring(1);     
    }

    // join all of the elements while separating them by a space
    return splitName.join(' '); 
}

var createCityButton = function(city){
    var newCity = document.createElement("button");
    newCity.classList = "button city-btn"
    newCity.textContent = city;
    leftSectionEl.appendChild(newCity);
}

var displayBoxInfo = function (city){
    //give the div its border class and Populate the info into its tags.
    infoBoxEl.className = "info-box-border";

    var cityName = document.querySelector("#box-city-name");
    cityName.textContent = city;

    var temp = document.querySelector("#box-temp");
    temp.textContent = "Temp: " + "get from fetching info";

    var wind = document.querySelector("#box-wind");
    wind.textContent = "Wind: " + "get from fetching info";

    var humidity = document.querySelector("#box-humidity");
    humidity.textContent = "Humidity: " + "get from fetching info";

    var uv = document.querySelector("#box-uv");
    uv.textContent = "UV Index: " + "get from fetching info";
}

var displayForecast = function(city){

    var sectionTitle = document.querySelector("#five-day-forecast");
    sectionTitle.textContent = "5-Day Forecast:";

    var dayCards = document.querySelector(".forecast-cards");
    dayCards.textContent = "";

    for(var i=0; i<5; i++){

        var dayForecastCard = document.createElement("div");
        dayForecastCard.className = "forecast-single-card";
    
        var day = document.createElement("h5");
        day.className = "left";
        day.textContent = "Day " + (i+1);
    
        var temp = document.createElement("h6");
        temp.className = "left";
        temp.textContent = "Temp:" + "use moment and fetch";
    
        var wind = document.createElement("h6");
        wind.className = "left";
        wind.textContent = "Wind:" + "use moment and fetch";
    
        var humidity = document.createElement("h6");
        humidity.className = "left";
        humidity.textContent = "Humidity:" + "use moment and fetch";
    
        dayForecastCard.appendChild(day);
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


//add drag-and-drop properties to make cities dropable to remove zone

//still need to fetch info from api to be displayed
//But what if a city is clicked? -- Then call the other two functions again passing its own textContent as parameter

//maybe create addEventlistener on click for the left-section. when click check if its a button
