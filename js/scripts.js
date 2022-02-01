// BING funkcija za autocomplete putem Bing Mapsa
function loadMapScenario() {
    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', {
        callback: onLoad,
        errorCallback: onError
    });
    function onLoad() {
        var options = { maxResults: 5 };
        var manager = new Microsoft.Maps.AutosuggestManager(options);
        manager.attachAutosuggest('#searchBox', '#searchBoxContainer', selectedSuggestion);
    }
    
    function onError(message) {
        document.getElementById('printoutPanel').innerHTML = message;
    }
    function selectedSuggestion(suggestionResult) {
        var lat1=suggestionResult.location.latitude;
        var lon1=suggestionResult.location.longitude;
        document.getElementById('printoutPanel').innerHTML =    
        'Suggestion: ' + suggestionResult.formattedSuggestion;
        document.getElementById('lat').innerHTML = suggestionResult.location.latitude;
        document.getElementById('lon').innerHTML = suggestionResult.location.longitude;
    } 
}


//DATE TIME FUNCTIONS for 1st column
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
  }



    $("#poster1").hide();
    $("#poster").hide();
    $("#podaci").hide();
    $(".back").hide();

    //YR NO funkcija
    var dohvatiYrNo = function(latitude, longitude, lokacija) 
    {
    console.log(latitude + " , " + longitude+ " , " + lokacija)
    var getDays="https://api.met.no/weatherapi/locationforecast/2.0/compact?lat="+latitude+"&lon="+longitude;

     $.getJSON(String(getDays),function(json) {
        if (json.query === null) {
            return $('#poster').append(
                "<h2>Entered location was not found!</h2>");
            }
            else {
                var standardniIspisHeader
                for (i = 0; i < 24; i++) {

                                      
                      var d = new Date().addHours(i);
                      var time = formatDate(d);

                    
                    //var time = new Date().addHours(i);
                    //var time = json.properties.timeseries[i].time;
                    var temp = json.properties.timeseries[i].data.instant.details.air_temperature;
                    var status = json.properties.timeseries[i].data.next_1_hours.summary.symbol_code;
                    var precipitation = json.properties.timeseries[i].data.next_1_hours.details.precipitation_amount;
                    var Slika = status+".svg"
                    var kisobran = '        '

                    if (precipitation>0) {
                        kisobran = '<img src=/img/umbrella_need.png'+' alt='+status+' width="30" height="30">'
                    }

                    var standardniIspisHeader =
                    "<tr>" + 
                        "<td>" +
                            time +
                        "</td>" +
                        "<td>" +
                            status + '<img src=/img/svg/'+Slika+' alt='+status+'width="30" height="30">'  +
                        "</td>" +
                        "<td>" +
                            temp + " C" +
                        "</td>" +
                        "<td>" +
                            precipitation + " mm" + kisobran +
                        "</td>"+
                    "</tr>"

                    $('#podaci').append(standardniIspisHeader);
                }
                var standardniIspisHeader = "</tbody>" + "</table>";
                $('form').hide();
                $('#naslov').hide();
                $('#poster1').hide();
                $('#podaci').append(standardniIspisHeader);
                $("#podaci").slideToggle("slow");
                $("#poster").append("<center> <b>Prikazuju se podaci za</b> </center>"+ "<strong>"+"<center>" + lokacija + "</center>" + "</strong>");
                $("#poster").slideToggle("slow");
                $(".back").show();
                $('#backbutton').html(
                    "<center><button onclick="+"window.location.href='index.html'"+">Povratak na pretragu?</button></center"
                );

            }
        })
    }



    //function definition
    var dohvatiVrijeme = function(latitude, longitude) {
        //Grab the weather and store it in the variable

        // var weatherCity = $('#term2').val();
        
        var vidi=latitude;
        var vidi2=longitude;
        var polje = $("#searchBox").val();

        var vrijemeKodovi = ['800', '801', '802', '803', '701', '711',
            '721', '731', '741', '751', '761', '762', '771', '781'
        ];
        var provjera = false;
        
        if (vidi) {
        //They must have entered a value, carry on with API call, first display a loading message to notify the user of activity
        $('#poster').html(
            "<h2 class='loading'>Checking weather!</h2>"
        );
        var upit="https://api.openweathermap.org/data/2.5/weather?lat="+vidi+"&lon="+vidi2+"&units=metric&exclude=current,minutely,hourly&appid=a05dc12322a6edace852c861084872a3"
        
        $.getJSON(String(upit),function(json) {
            if (json.query === null) {
                return $('#poster').append(
                    "<h2>Entered location was not found!</h2>"
                );
            } else {
                var chec=json.weather[0].main

                var provLow = json.weather[0].main;
                var opis = json.weather[0].description;
                var check = String(json.weather[0].id);
                
                var tempMin = json.main.temp_min;
                var tempMax = json.main.temp_max;
                
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
           //     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date;


                var lokacija = json.name;
                
                var standardniIspisHeader =
                    "<label> Location: " + lokacija +
                    "</label>"+ "<br>" +
                    "<label> Showing forecast for the date: <br> <strong>" +
                    dateTime + "</strong></label>" +
                    "<label> The weather today is going to be: " +
                    "<strong>" + provLow + "</strong>" +
                    "</label>" + "<br>" +
                    "<label> Description: " +
                    "<strong>" + opis + "</strong>" +
                    "</label>" +"<br>" +
                    "<label> Min temperature: " +
                    tempMin + " C </label>" + "<br>" +
                    "<label> Max temperature: " +
                    tempMax + " C </label>";
            }
            for (i = 0; i < vrijemeKodovi.length; i++) {
                if (check === vrijemeKodovi[i]) {
                    $('#poster1').html(
                        standardniIspisHeader);
                    $('#poster').html(
                        "<h2>You DON't NEED an Umbrella today!</h2> <img src=img/umbrella_off.png alt=\"UMBRELLA DONT NEED\" height=\"300\" width=\"300\"> " +
                        "<center><button onclick="+"window.location.href='index.html'"+">Povratak na pretragu?</button></center>"
                    );

                    $('form').hide();
                    $('#naslov').hide();
                    $("#poster1").slideToggle("slow");
                    $("#poster").slideToggle("slow");
                    $(".back").show();
                    provjera = true;
                    break;
                }
            }
            if (provjera === false) {
                $('#poster1').html(
                    standardniIspisHeader);
                $('#poster').html(
                    "<h2>You are going to NEED an Umbrella today!</h2> <img src=img/umbrella_on.png alt=\"UMBRELLA NEED\" height=\"300\" width=\"300\"> " +
                    "<center><button onclick="+"window.location.href='index.html'"+">Povratak na pretragu?</button></center"
                );

                $('form').hide();
                $('#naslov').hide();
                $("#poster1").slideToggle("slow");
                $("#poster").slideToggle("slow");
                $(".back").slideToggle("slow");
            }
        })
    
    } 

        
        else {
             //They must have entered a value, carry on with API call, first display a loading message to notify the user of activity
             $('#poster').html(
                "<h2 class='loading'>Checking weather!</h2>"
            );
            var upit2="https://api.openweathermap.org/data/2.5/weather?q="+polje+"&units=metric&exclude=current,minutely,hourly&appid=a05dc12322a6edace852c861084872a3"
            $.getJSON(String(upit2),function(json) {
                if (json.query === null) {
                    return $('#poster').append(
                        "<h2>Entered location was not found!</h2>"
                    );
                } else {
                    var chec=json.weather[0].main

                    var provLow = json.weather[0].main;
                    var opis = json.weather[0].description;
                    var check = String(json.weather[0].id);
                    
                    var tempMin = json.main.temp_min;
                    var tempMax = json.main.temp_max;
                    
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var dateTime = date;


                    var lokacija = json.name;
                    var drzava=json.sys.country;
                    
                    var standardniIspisHeader =
                        "<label> Location: " + lokacija + " ," + drzava +
                        "</label>"+ "<br>" +
                        "<label> Showing forecast for the date: <br> <strong>" +
                        dateTime + "</strong></label>" +
                        "<label> The weather today is going to be: " +
                        "<strong>" + provLow + "</strong>" +
                        "</label>"+ "<br>" +
                        "<label> Description: " +
                        "<strong>" + opis + "</strong>" +
                        "</label>" +"<br>" +
                        "<label> Min temperature: " +
                        tempMin + " C </label>" + "<br>" +
                        "<label> Max temperature: " +
                        tempMax + " C </label>";
                }
                for (i = 0; i < vrijemeKodovi.length; i++) {
                    if (check === vrijemeKodovi[i]) {
                        $('#poster1').html(
                            standardniIspisHeader);
                        $('#poster').html(
                            "<h2>You DON't NEED an Umbrella today!</h2> <img src=img/umbrella_off.png alt=\"UMBRELLA DONT NEED\" height=\"300\" width=\"300\"> " +
                            "<center><button onclick="+"window.location.href='index.html'"+">Povratak na pretragu?</button></center>"
                        );

                        $('form').hide();
                        $('#naslov').hide();
                        $("#poster1").slideToggle("slow");
                        $("#poster").slideToggle("slow");
                        $(".back").show();
                        provjera = true;
                        break;
                    }
                }
                if (provjera === false) {
                    $('#poster1').html(
                        standardniIspisHeader);
                    $('#poster').html(
                        "<h2>You are going to NEED an Umbrella today!</h2> <img src=img/umbrella_on.png alt=\"UMBRELLA NEED\" height=\"300\" width=\"300\"> " +
                        "<center><button onclick="+"window.location.href='index.html'"+">Povratak na pretragu?</button></center"
                    );

                    $('form').hide();
                    $('#naslov').hide();
                    $("#poster1").slideToggle("slow");
                    $("#poster").slideToggle("slow");
                    $(".back").slideToggle("slow");
                }
            })

        } 
            
        
    };


    // SUBMIT TIPKA
    $("#form").submit(function(e) {
        var latitude = $('#lat').text();
        var longitute = $('#lon').text();
        var polje = $("#searchBox").val();        
        if (!latitude || !longitute || !polje) { 
            //If the input field was empty, display a message
            $("#poster1").show();
            $('#poster1').html(
            "<h2 class='loading'>Error! Please enter your location using the Bing autocomplete form</h2>"
                    );
                e.preventDefault();
                } else {
                dohvatiYrNo(latitude, longitute, polje);
                //dohvatiVrijeme(latitude, longitute);
                e.preventDefault();
                }
        
    });
