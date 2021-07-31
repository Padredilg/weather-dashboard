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

setInterval(function(){
    var currTime = moment().format("dddd, MMM Do - hh:mm:ss A");
    $("#current-day").text(currTime);
},1000); 

var searchBtnHandler = function(event){
    event.preventDefault();

    var cityName = inputBoxEl.value.trim();//convert to only first letter capitalized

    if(cityName == ""){//add || cityName already exists in localStorage
        return false;
    }
    else{
        //get the value of the input box. Then create a button on the same column as the search box for getting that info back
        createCityButton(cityName);
        //also create a box on the right where the info will be appended
        displayBoxInfo(cityName);
        //and a bottom section: 5-day forecast
        displayForecast(cityName);
    }
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

    for(var i=0; i<5; i++){
        var dayCards = document.querySelector(".forecast-cards");

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

searchFormEl.addEventListener("submit", searchBtnHandler);


//add drag-and-drop properties to make cities dropable to remove zone

//Now I have already handled the situation when a name is submitted.
//still need to fetch info from api to be displayed
//But what if a city is clicked? -- Then call the other two functions again passing its own textContent as parameter
