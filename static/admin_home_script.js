var airports = [];
var aircrafts = [];
var flights = [];
var timezone = {};
depfoc = 0;
retfoc = 0;

$(document).ready(function(){
    getAirportsList();
    getAircraftsList();
    getFlightsList();
    $('#fromFlight').on('input', updateAirportListDepart);
    $('#toFlight').on('input', updateAirportListReturn);
    updateAirportListDepart();
    updateAirportListReturn();
    $(".DepartListClass").on('click', function() {
        $("#fromFlight").val($(this).text());
    })
    $('.returnListClass').on('click', function() {
        $("#toFlight").val($(this).text());
    })
});
$('#aircraftFlight').focusin(function() {
    addAircraftOptions();
});
function validateFlight() {
    if($("#fromFlight").val().trim() == "") {
        $("#from-flight-error").append("Departure Airport cannot be empty");
    }
    else if(!airports.includes($("#fromFlight").val())) {
        $("#from-flight-error").append("select only from the dropdown");
    }
    else {
        $("#from-flight-error").html("");
    }

    if($("#toFlight").val().trim() == "") {
        $("#to-flight-error").append("Arrival Airport cannot be empty");
    }
    else if(!airports.includes($("#toFlight").val())) {
        $("#to-flight-error").append("select only from the dropdown");
    }
    else {
        $("#to-flight-error").html("");
    }

    if($("#price").val().trim() == "") {
        $("#price-flight-error").append("price cannot be empty");
    }
    else {
        $("#price-flight-error").html("");
    }

    if($("#depDateFlight").val() != "" && $("#arrDateFlight").val() != "") {
        var err = false;
        /////////////////////////////
        var arrTime = parseInt($("#arrhour").val());
        var arr = ""
        if($("#arrampm").val() == "AM") {
            if(arrTime == 12){
                arrTime = 0;
                arr += "00"
            }
            else {
                arr += $("#arrhour").val();
            }
        }
        else {
            if(arrTime == 12){
                arr += $("#arrhour").val();
            }
            else {
                arrTime += 12;
                arr += arrTime;
            }
        }
        arr += (":" + $("#arrminute").val());

        var depTime = parseInt($("#dephour").val());
        var dep = ""
        if($("#depampm").val() == "AM") {
            if(depTime == 12){
                depTime = 0;
                dep += "00"
            }
            else {
                dep += $("#dephour").val();
            }
        }
        else {
            if(depTime == 12){
                dep += $("#dephour").val();
            }
            else {
                depTime += 12;
                dep += arrTime;
            }
        }
        dep += (":" + $("#depminute").val());
        //////////////////////////////
        var depdate  = $("#depDateFlight").val().split('-')[2] + "-" + $("#depDateFlight").val().split('-')[0] + "-" + $("#depDateFlight").val().split('-')[1];
        var arrdate = $("#arrDateFlight").val().split('-')[2] + "-" + $("#arrDateFlight").val().split('-')[0] + "-" + $("#arrDateFlight").val().split('-')[1];
        for(var i = 0; i < flights.length; i++) {
            if((depdate == flights[i]["arrivalDate"])) {
                if(!($("#fromFlight").val().split("(")[1].split(")")[0] == flights[i]["arrivalAirport"] && timegap(flights[i]["arrivalTime"],dep) >= 60)) {
                    err = true;
                }
            }
            if(arrdate == flights[i]["departureDate"]) {
                if(!($("#toFlight").val().split("(")[1].split(")")[0] == flights[i]["departureAirport"] && timegap(flights[i]["arrivalTime"],dep) >= 60)) {
                    err = true;
                }
            }
        }
        if(err) {
            $("#depdate-flight-error").append("aircraft not available in that particular date");
        }
        else {
            $("#depdate-flight-error").html("");
        }
    }
    else {
        if($("#depDateFlight").val() == "") {
            $("#depdate-flight-error").append("departure date cannot be empty");
        }
        else {
            $("#depdate-flight-error").html("");
        }

        if($("#arrDateFlight").val() == "") {
            $("#arrdate-flight-error").append("arrival date cannot be empty");
        }
        else {
            $("#arrdate-flight-error").html("");
        }
    }

    if($("#arrDateFlight").val() == "") {
        $("#arrdate-flight-error").append("arrival date cannot be empty");
    }
    else {
        $("#arrdate-flight-error").html("");
    }


    if($("#flightID").val() == "") {
        $("#id-flight-error").append("flight id cannot be empty");
    }
    else if(isFlightIdAlreadyExists()){
        $("#id-flight-error").append("flight id already taken");
    }
    else {
        $("#id-flight-error").html("");
    }


    var ff = 0;
    $(".flightError").each(function() {
        if($(this).html() != ""){
            ff++;
        }
    });
    if(ff == 0) {
        var depdate1 = $("#depDateFlight").val().split('-')[2] + "-" + $("#depDateFlight").val().split('-')[0] + "-" + $("#depDateFlight").val().split('-')[1];
        var arrdate1 = $("#arrDateFlight").val().split('-')[2] + "-" + $("#arrDateFlight").val().split('-')[0] + "-" + $("#arrDateFlight").val().split('-')[1];
        $("#depDateFlight").val(depdate1);
        $("#arrDateFlight").val(arrdate1);
        addFlight();
    }
}
function addFlight() {
    var root = window.location.href;
    var duration = 0;
    var arrTime = parseInt($("#arrhour").val());
    var arr = ""
    if($("#arrampm").val() == "AM") {
        if(arrTime == 12){
            arrTime = 0;
            arr += "00"
        }
        else {
            arr += $("#arrhour").val();
        }
    }
    else {
        if(arrTime == 12){
            arr += $("#arrhour").val();
        }
        else {
            arrTime += 12;
            arr += arrTime;
        }
    }
    arr += (":" + $("#arrminute").val());

    var depTime = parseInt($("#dephour").val());
    var dep = ""
    if($("#depampm").val() == "AM") {
        if(depTime == 12){
            depTime = 0;
            dep += "00"
        }
        else {
            dep += $("#dephour").val();
        }
    }
    else {
        if(depTime == 12){
            dep += $("#dephour").val();
        }
        else {
            depTime += 12;
            dep += depTime;
        }
    }
    dep += (":" + $("#depminute").val());
    if($("#depDateFlight").val() == $("#arrDateFlight").val()) {
        var hour = parseInt(arr.split(":")[0]) - parseInt(dep.split(":")[0]);
        duration += (hour*60);
        duration += (parseInt(arr.split(":")[1]) - parseInt(dep.split(":")[1]));
        //duration += ((parseInt(timezone[$("#fromFlight").val()]) - parseInt(timezone[$("#toFlight").val()]))*60);
    }
    else {
        var hour = 24 - parseInt(dep.split(":")[0]);
        hour += parseInt(arr.split(":")[0])
        duration += (hour*60);
        duration += (parseInt(arr.split(":")[1]) - parseInt(dep.split(":")[1]));
        //duration += ((parseInt(timezone[$("#fromFlight").val()]) - parseInt(timezone[$("#toFlight").val()]))*60)
    }
    const data = {
        "departureAirport": $("#fromFlight").val().substring($("#fromFlight").val().indexOf('(')+1,$("#fromFlight").val().indexOf(')')),
        "arrivalAirport": $("#toFlight").val().substring($("#toFlight").val().indexOf('(')+1,$("#toFlight").val().indexOf(')')),
        "departureDate": $("#depDateFlight").val(),
        "arrivalDate": $("#arrDateFlight").val(),
        "duration": duration,
        "availableSeats": aircrafts.filter(obj => obj["id"] ==  $("#aircraftFlight").val())[0]["seats"],
        "aircraftNumber": parseInt($("#aircraftFlight").val()),
        "flightID": $("#flightID").val(),
        "arrivalTime": arr + ":00",
        "departureTime": dep + ":00",
        "price": parseInt($("#price").val())
    };
    $.ajax({
        type: "POST",
        url: root + "addflight/",
        data: data,
        success: function (data) {
            clearFlightRegister();
        }
    });
}
function BacktoLogin() {
    window.location = window.location.origin + "/";
}
function validateAircraft() {
    if($("#registrationNumber").val() == "") {
        $("#reg-aircraft-error").append("Registration Number cannot be empty");
    }
    else {
        $("#reg-aircraft-error").html("");
    }

    if($("#seating").val() == "") {
        $("#seating-aircraft-error").append("seats cannot be empty");
    }
    else {
        $("#seating-aircraft-error").html("");
    }

    if($("#maintenance").val() == "") {
        $("#maintenance-aircraft-error").append("Maintenance cannot be empty");
    }
    else {
        $("#maintenance-aircraft-error").html("");
    }

    var ff = 0;
    $(".aircraftError").each(function() {
        if($(this).html() != ""){
            ff++;
        }
    });
    if(ff == 0)
        addAircraft();
}
function addAircraft() {
    var root = window.location.href;
    const data = {
        "aircraftType" : $("#aircraftType").val(),
        "registrationNumber" : $("#registrationNumber").val(),
        "seatingConfiguration" : $("#seating").val(),
        "lastMaintenance" : $("#maintenance").val()
    };
    $.ajax({
        type: "POST",
        url: root + "addaircraft/",
        data: data,
        success: function (data) {
            clearAircraftRegister();
        }
    });
}
function validateAirport() {
    if($("#airportCode").val() == "") {
        $("#code-airport-error").append("Airport Code cannot be empty");
    }
    else {
        $("#code-airport-error").html("");
    }

    if($("#location").val() == "") {
        $("#location-airport-error").append("location cannot be empty");
    }
    else {
        $("#location-airport-error").html("");
    }

    if($("#portname").val() == "") {
        $("#portname-airport-error").append("Airport name cannot be empty");
    }
    else {
        $("#portname-airport-error").html("");
    }

    if($("#timezone").val() == "") {
        $("#timezone-airport-error").append("Timezone cannot be empty");
    }
    else {
        $("#timezone-airport-error").html("");
    }

    var ff = 0;
    $(".airportError").each(function() {
        if($(this).html() != ""){
            ff++;
        }
    });
    if(ff == 0)
        addAirport();
}
function addAirport() {
    var root = window.location.href;
    const data = {
        "airportCode" : $("#airportCode").val(),
        "location" : $("#location").val(),
        "airportName" : $("#portname").val(),
        "timeZone" : $("#timezone").val()
    };
    $.ajax({
        type: "POST",
        url: root + "addairport/",
        data: data,
        success: function (data) {
            clearAirportRegister();
        }
    });
}
function clearFlightRegister() {
    $('#flightForm input[type="text"], #flightForm input[type="date"], #flightForm input[type="time"]').val('');
    $(".flightError").html("");
    getAircraftsList();
}
function clearAircraftRegister() {
    $('#aircraftForm input[type="text"], #aircraftForm input[type="date"], #aircraftForm input[type="time"]').val('');
    $("#aircraftError").html("");
}
function clearAirportRegister() {
    $('#airportForm input[type="text"], #airportForm input[type="date"], #airportForm input[type="time"]').val('');
    $("#airportError").html("");
}
function isFlightIdAlreadyExists() {
    var root = window.location.href;
    var fid = $("#flightID").val();
    const data = {
        "flightid": fid
    }
    $.ajax({
        type: "POST",
        url: root + "flightid/",
        data: data,
        success: function (data) {
            if (data == "False") {
                return false;
            }
            else {
                return true;
            }
        }
    });
}
function getAirportsList() {
    airports = [];
    var root = window.location.href;
    $.ajax({
        type: "GET",
        url: root + "getairports/",
        data: {},
        success: function (data1) {
            console.log(data1);
            var data = JSON.parse(data1)
            for(var i = 0; i < data.length; i++) {
                airports.push(data[i]["airportName"] + " (" + data[i]["airportCode"] + ") " + data[i]["location"]);
                timezone[data[i]["airportName"] + " (" + data[i]["airportCode"] + ") " + data[i]["location"]] = data[i]["timeZone"];
            }
        }
    });
}
function getAircraftsList() {
    aircrafts = [];
    var root = window.location.href;
    $.ajax({
        type: "GET",
        url: root + "getaircrafts/",
        data: {},
        success: function (data1) {
            console.log(data1);
            var data = JSON.parse(data1)
            for(var i = 0; i < data.length; i++) {
                aircrafts.push({"aircraft" : data[i]["aircraftType"] + " " + data[i]["registrationNumber"],"id" : data[i]["aircraftID"], "seats":data[i]["seatingConfiguration"]});
            }
        }
    });
}
function getFlightsList() {
    flights = [];
    var root = window.location.href;
    $.ajax({
        type: "GET",
        url: root + "getflights/",
        data: {},
        success: function (data1) {
            console.log(data1);
            var data = JSON.parse(data1)
            for(var i = 0; i < data.length; i++) {
                flights.push(data[i]);
            }
        }
    });
}
$('#fromFlight').focusin(function() {
    $("#airportListFrom").css("display","block");
    updateAirportListDepart();
    depfoc = 1;
});
$('#toFlight').focusin(function() {
    $("#airportListTo").css("display","block");
    updateAirportListReturn();
    retfoc = 1;
});
$('#fromFlight').focusout(function() {
    depfoc = 0;
});
$('#toFlight').focusout(function() {
    retfoc = 0;
});
$(document).on("click", function (event) {
    if(event.target.classList[0] == "DepartListClass") {
        $("#fromFlight").val(event.target.textContent);
    }
    else if(event.target.classList[0] == "returnListClass") {
        $("#toFlight").val(event.target.textContent);
    }

    if(depfoc == 0){
        $("#airportListFrom").css("display","none");
    }
    if(retfoc== 0){
        $("#airportListTo").css("display","none");
    }
});
function updateAirportListDepart() {
    const input = $("#fromFlight").val().toLowerCase();
    const airportList = $('#airportListFrom');
    airportList.empty();
    const filteredAirports = airports.filter(airport => airport.toLowerCase().includes(input));
    filteredAirports.forEach(airport => {
        const listItem = $('<li></li>');
        listItem.text(airport);//.split(')')[0] + ")");
        listItem.addClass("DepartListClass");
        airportList.append(listItem);
    });
}
function updateAirportListReturn() {
    const input = $("#toFlight").val().toLowerCase();
    const airportList = $('#airportListTo');
    airportList.empty();
    const filteredAirports = airports.filter(airport => airport.toLowerCase().includes(input));
    filteredAirports.forEach(airport => {
        const listItem = $('<li></li>');
        listItem.text(airport);//.split(')')[0] + ")");
        listItem.addClass("returnListClass");
        airportList.append(listItem);
    });
}

function setFlightTab() {
    getAirportsList();
    getAircraftsList();
    getFlightsList();
    addAircraftOptions();
}
function addAircraftOptions() {
    $('#aircraftFlight').html("");
    for(var i = 0; i < aircrafts.length; i++) {
        var newOption = $('<option>', {
            value: aircrafts[i]["id"],
            text: aircrafts[i]["aircraft"]
        });
        $('#aircraftFlight').append(newOption);
    }
}
function showForm(formId) {
    // Hide all forms
    var forms = document.querySelectorAll('.form-container');
    forms.forEach(function(form) {
        form.classList.remove('active');
    });
    getAirportsList();
    getAircraftsList();
    getFlightsList();
    // Show the selected form
    var selectedForm = document.getElementById(formId);
    if(formId == "flightForm") {
        setFlightTab();
    }
    selectedForm.classList.add('active');
}






















/*
if(flights[i]["aircraftNumber"] == $("#aircraftFlight").val()) {
                var dtd = parseInt($("#depDateFlight").val().split("-")[2]);
                var dtm = parseInt($("#depDateFlight").val().split("-")[1]);
                var dty = parseInt($("#depDateFlight").val().split("-")[0]);

                var atd = parseInt($("#arrDateFlight").val().split("-")[2]);
                var atm = parseInt($("#arrDateFlight").val().split("-")[1]);
                var aty = parseInt($("#arrDateFlight").val().split("-")[0]);

                var dth = parseInt($("#depTimeFlight").val().split(":")[0]);
                var dtmi = parseInt($("#depTimeFlight").val().split(":")[1]);

                var ath = parseInt($("#arrTimeFlight").val().split(":")[0]);
                var atmi = parseInt($("#arrTimeFlight").val().split(":")[1]);

                ////////////////////////////////////////////////////////////

                var dod = parseInt(flights[i]["departureDate"].split("-")[2]);
                var dom = parseInt(flights[i]["departureDate"].split("-")[1]);
                var doy = parseInt(flights[i]["departureDate"].split("-")[0]);

                var aod = parseInt(flights[i]["arrivalDate"].split("-")[2]);
                var aom = parseInt(flights[i]["arrivalDate"].split("-")[1]);
                var aoy = parseInt(flights[i]["arrivalDate"].split("-")[0]);

                var doh = parseInt(flights[i]["departureTime"].split(":")[0]);
                var domi = parseInt(flights[i]["departureTime"].split(":")[1]);

                var aoh = parseInt(flights[i]["arrivalTime"].split(":")[0]);
                var aomi = parseInt(flights[i]["arrivalTime"].split(":")[1]);

                if(dth-6 < 0) {
                    if(dtd-1 == dod && dtm == dt)
                }
            }
*/


function datesetdep(){
 var d = $("#depDateFlight").val();
    if(!validDate(d)) {
        $("#depdate-flight-error").append("enter correct format");
    }
    else {
        $("#depdate-flight-error").html("");
        $("#depDateFlight").val(d[0]+d[1]+"-"+d[2]+d[3]+"-"+d[4]+d[5]+d[6]+d[7]);
    }
}
function datecleardep() {
    $("#depDateFlight").val("")
}
function datesetarr(){
    var d = $("#arrDateFlight").val();
       if(!validDate(d)) {
           $("#arrdate-flight-error").append("enter correct format");
       }
       else {
           $("#arrdate-flight-error").html("");
           $("#arrDateFlight").val(d[0]+d[1]+"-"+d[2]+d[3]+"-"+d[4]+d[5]+d[6]+d[7]);
       }
   }
   function datecleararr() {
       $("#arrDateFlight").val("");
   }
function validDate(dateStr){
    var regex = /^\d{8}$/;
    return regex.test(dateStr);
}


function timegap(t1,t2){
    var duration = 0;
    duration += 60 * (parseInt(t2.split(":")[0]) - parseInt(t1.split(":")[0]));
    duration += parseInt(t2.split(":")[1]) - parseInt(t1.split(":")[1]);
    return duration
}