$(document).ready(function() {
    $("#poster1").hide();
    $("#poster").hide();
    $(".back").hide();

    //function definition
    var dohvatiVrijeme = function() {
        //Grab the weather and store it in the variable
        var weatherTown = $('#term').val();

        // var weatherCity = $('#term2').val();

        var vrijemeKodovi = ['19', '20', '21', '22', '24', '25',
            '26', '29', '30', '31', '32', '33', '34', '36',
            '44'
        ];
        var provjera = false;
        //     console.log(weatherCity);
        //    console.log(weatherTown);

        //Check if the user has entered anything
        if (!weatherTown) {
            //If the input field was empty, display a message
            $("#poster").show();
            $('#poster').html(
                "<h2 class='loading'>Error! Please enter your location in the form</h2>"
            );
        } else {
            //They must have entered a value, carry on with API call, first display a loading message to notify the user of activity
            $('#poster').html(
                "<h2 class='loading'>Checking weather!</h2>"
            );
            $.getJSON(
                "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" +
                weatherTown + 
                "%22)%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
                function(json) {
                    if (json.query.results === null) {
                        //       console.log(json.query.results);
                        return $('#poster').append(
                            "<h2>Entered location was not found!</h2>"
                        );
                    } else {
                        var provLow = json.query.results.channel
                            .item.forecast[0].text;
                        var check = json.query.results.channel.item
                            .forecast[0].code;
                        var tempMin = json.query.results.channel
                            .item.forecast[0].low;
                        var tempMax = json.query.results.channel
                            .item.forecast[0].high;
                        var datum = json.query.results.channel.item
                            .forecast[0].date;
                        var lokacija = json.query.results.channel
                            .item.title;
                        console.log(check);
                        var standardniIspisHeader =
                            "<label> Location: " + lokacija +
                            "</label>" +
                            "<label> Showing forecast for the date: <br> <strong>" +
                            datum + "</strong></label>" +
                            "<label> The weather today is going to be: " +
                            "<strong>" + provLow + "</strong>" +
                            "</label>" +
                            "<label> Min temperature: " +
                            tempMin + " C </label>" + "<br>" +
                            "<label> Max temperature: " +
                            tempMax + " C </label>";
                    }
                    for (i = 0; i < vrijemeKodovi.length; i++) {
                        if (check === vrijemeKodovi[i]) {
                            console.log("USPJESNO");
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
        };
    };


    // SUBMIT TIPKA
    $("#form").submit(function(e) {
        dohvatiVrijeme();
        e.preventDefault();
    });
    // Ukoliko korisnik stisne Enter umjesto SUBMIT TIPKE
    

    $('#term').keyup(function(e) {
        if (e.keyCode === 13) {
            
        $("#form").submit(function(e) {
        dohvatiVrijeme();
        e.preventDefault();
    });

        }
    });
});

// AUTOCOMPLETE SCRIPT
