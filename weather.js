$(function(){
    $(".app-bg").removeClass("hidden");
    $(".app-bg").hide();
});

$(document).ready(function(){
    /* GEN. FUNCTION */
    function isInArray(value, array) {
      return array.indexOf(value) > -1;
    }
    
    function randomInt(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    
    function getForecastImageSource(code, isSmallImage) {                    
        var sunny_codes = [32,34,36];
        var cloudy_codes = [19,20,21,22,23,24,26,27,28,29,30,44];
        var rainy_codes = [5,6,8,9,10,11,12,35,40];
        var snowy_codes = [7,13,14,15,16,17,18,25,41,42,43,46];
        var stormy_codes = [0,1,2,3,4,37,38,39,45,47];
        var night_codes = [31,33];
        var error = 3200;
        
        code = parseInt(code, 10);
        var imageSource;
        
        if (isSmallImage) {
            if (isInArray(code, sunny_codes) || isInArray(code, night_codes)) {
                imageSource = "sunny.png";
            }

            else if (isInArray(code, cloudy_codes)) {
                imageSource = "cloudy.png";
            }

            else if (isInArray(code, rainy_codes)) {
                imageSource = "rainy.png";
            }

            else if (isInArray(code, snowy_codes)) {
                imageSource = "snowy.png";
            }

            else if (isInArray(code, stormy_codes)) {
                imageSource = "stormy.png";
            }

            else {
                imageSource = "sunny.png";
            }
        }
        
        else {
            if (isInArray(code, sunny_codes)) {
                imageSource = "sunny";
            }
            
            else if (isInArray(code, night_codes)) {
                imageSource = "starry";
            }

            else if (isInArray(code, cloudy_codes)) {
                imageSource = "cloudy";
            }

            else if (isInArray(code, rainy_codes)) {
                imageSource = "rainy";
            }

            else if (isInArray(code, snowy_codes)) {
                imageSource = "snowy";
            }

            else if (isInArray(code, stormy_codes)) {
                imageSource = "stormy";
            }

            else {
                imageSource = "sunny";
            }
            
        }
        
        return imageSource;
    }
    
    /* APP GET WEATHER BY LOC. FUNCTION */
    function getWeatherByLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position){
               loadWeather(position.coords.latitude + "," + position.coords.longitude); 
            });
        }
        
        else {
            $(".app-bg").addClass("hidden");
            $("app-bg-nogeo").removeClass("hidden");
        }
    }
    
    function loadWeather(location, woeid) {
        $.simpleWeather({
            location: location,
            woeid: woeid,
            unit: 'f',
            success: function(weather) {
                console.log("success");
                var curr_cond = (weather.currently).toString();
                if (curr_cond.length > 28) {
                    curr_cond = curr_cond.replace(/ /g, '<br/>');
                    $(".curr-cond br").addClass("hidden");
                }
                
                var curr_code = weather.code;
                var curr_loc = weather.city;
                var curr_region = weather.region;
                var curr_temp = weather.temp;
                var curr_alt_temp = weather.alt.temp;
                var today_high = weather.high;
                var today_alt_high = weather.alt.high;
                var today_low = weather.low;
                var today_alt_low = weather.alt.low;
                var today_sunrise = weather.sunrise;
                today_sunrise = today_sunrise.substring(0, today_sunrise.length - 3);
                var today_sunset = weather.sunset;
                today_sunset = today_sunset.substring(0, today_sunset.length - 3);
                var curr_wind = weather.wind.speed;
                var curr_wind_direction = weather.wind.direction;
                
                getFlickrBG(curr_loc);
                $(".loader").hide().addClass("hidden");
                $(".app-bg").removeClass("hidden");
                $(".app-bg").fadeIn(1500)
                
                $(".curr-city").html(curr_loc);
                $(".curr-region").html(curr_region);
                $(".curr-cond-desc").html(curr_cond);
                $(".curr-temp-value").html(curr_temp);
                $(".curr-alt-temp-value").html(curr_alt_temp);
                $(".today .today-high").html(today_high);
                $(".today .today-alt-high").html(today_alt_high);
                $(".today .today-low").html(today_low);
                $(".today .today-alt-low").html(today_alt_low);
                $(".today .sunrise-time").html(today_sunrise);
                $(".today .sunset-time").html(today_sunset);
                $(".today .wind-speed-val").html(curr_wind);
                $(".today .wind-dir").html(curr_wind_direction);
                
                $(".weather-icon div").removeClass();
                $(".weather-icon div").addClass(getForecastImageSource(curr_code, false));

                for(var i = 1; i < 6; i++) {
                    $(".day_" + i + " .day").html(weather.forecast[i].day).addClass("uppercase");
                    $(".day_" + i + "_image").addClass("_" + weather.forecast[i].code);
                    console.log("here");
                    $(".day_" + i + " .high").html(weather.forecast[i].high);
                    $(".day_" + i + " .alt-high").html(weather.forecast[i].alt.high);
                    $(".day_" + i + " .low").html(weather.forecast[i].low);
                    $(".day_" + i + " .alt-low").html(weather.forecast[i].alt.low);
                    
                    
                    var forecast_text = (weather.forecast[i].text).toString();
                    if (forecast_text.length > 14) {
                        forecast_text = forecast_text.replace(/ /g, '<br/>');
                        $(".day_" + i + " .day-weather").html(forecast_text).addClass("smaller");
                    }
                    
                    else {
                        $(".day_" + i + " .day-weather").html(forecast_text);
                    }
                    
    
                    var imageSource = getForecastImageSource(weather.forecast[i].code, true);
                    $(".day_" + i + " .day_" + i + "_image").attr("src", "images/" + imageSource);
                    
                    
                    /* SPEAK WEATHER FUNCTION */
                    $(".speak-weather").unbind().click(function(){
                        var speechWeatherSummary = "Today: " + weather.currently + " currently. The temperature is " + weather.temp + " degrees with a high of " + weather.high + " and a low of " + weather.low + " degrees Fahrenheit. Wind speed is " + weather.wind.speed + "miles per hour, with a visibility of " + weather.visibility + "miles.";
                        
                        function speakIconAddActive() {
                            $(".speak-weather i").addClass("active");
                        }
                        function speakIconRemoveActive() {
                            $(".speak-weather i").removeClass("active");
                        }
                        
                        responsiveVoice.speak(speechWeatherSummary, "UK English Female", {onstart: speakIconAddActive, onend: speakIconRemoveActive, rvTotal: 1});
                    });
                   
                }
            },
            error: function(error) {
                console.log(error);
                console.log("error");
            }
        });
    }
    
    /* ALT WEATHER FUNCTION */
    $(function(){
        $(".change-units-container .unit").click(function(){
           if ($(this).hasClass("curr-units")) {
               $(this).addClass("active");
               $(".alt-units").removeClass("active");
               
               if(!$(".alt").hasClass("hidden")) {
                   $(".alt").addClass("hidden");
               }
               
               if ($(".curr").hasClass("hidden")) {
                   $(".curr").removeClass("hidden");
               }
           }
            else {
                $(this).addClass("active");
                $(".curr-units").removeClass("active");
                
                if($(".alt").hasClass("hidden")) {
                    $(".alt").removeClass("hidden");
                }
                
                if (!$(".curr").hasClass("hidden")) {
                   $(".curr").addClass("hidden");
               }
            }       
        });  
    });
    
    /* APP BACKGROUND FUNCTION */
    function createAppBG(url) {
        $(".app-bg").css("background-image", "url(" + url + ")");
    }
    
    function getFlickrBG(location){
        var flickrKey = "f57388ba912e09eabb5a500be18ebf24"
        var query = "https://api.flickr.com/services/rest/" + //init flickr api
                        "?method=flickr.photos.search&api_key=" + flickrKey + //add flick API key
                        "&tags=" + location + //add search query query
                        "&sort=relevance&format=json&nojsoncallback=1";
        console.log(query);
        
        $.getJSON(query, function(data){ 
            var randomIndex = randomInt(0,5);
            var item = data.photos.photo[randomIndex];
            //create url of ACTUAL PHOTO from returned json
            var flickr_src = "https://farm" + item.farm + ".static.flickr.com/" + item.server
            + "/" + item.id + "_" + item.secret + "_b.jpg"; //create source, _b indicates large, _s  small, _m thumb
            
            createAppBG(flickr_src);
        });
    } 
        
    /* ROTATE WHEEL FUNCTION */
    function addRotation(rotateDegree) {
        if (rotateDegree - 60 <= -390) {
            rotateDegree = -30;
        }
        else {
            rotateDegree = rotateDegree - 60;
        }
        return rotateDegree;
    }
    
    function rotateWheel() {
        $(".rotate-wheel").click(function(){
            var currRotation = $(".forecast-wheel").data('rot');
            currRotation = addRotation(currRotation);
            console.log(currRotation);
            $(".forecast-wheel").css({
              '-webkit-transform': 'rotate('+currRotation+'deg)',
                 '-moz-transform': 'rotate('+currRotation+'deg)',
                  '-ms-transform': 'rotate('+currRotation+'deg)',
                   '-o-transform': 'rotate('+currRotation+'deg)',
                      'transform': 'rotate('+currRotation+'deg)'
            }).data('rot', currRotation);
        });
    }
    
    getWeatherByLocation();
    rotateWheel();
});
