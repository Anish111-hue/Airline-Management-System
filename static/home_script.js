var current_search = [];
var current_data = [];
var airports = [];
var curbooking = [];
var curtickets = [];
var aircrafts = [];
var bookedseats = [];
var totalSeats = 180;
var passports = []
var curr_flight = [];
var curpass = [];
depfoc = 0;
retfoc = 0;
cust = 0;
var root = window.location.href.split("?")[0];
/*const airports = [
    "John F. Kennedy International Airport (JFK)",
    "Los Angeles International Airport (LAX)",
    "London Heathrow Airport (LHR)",
    "Dubai International Airport (DXB)",
    "Singapore Changi Airport (SIN)"
];*/
$(document).ready(function(){
    $(".selectable").click(function() {
        $(this).toggleClass("selected");
    });
    $(".close").click(function() {
        $(".main").css("display","block");
        $(".popup").css("display","none");
    });
    getAirportLists();
    $('.filterCheck').change(function() {
        getFilteredData();
    });
    $('input[type="radio"][name="trip-type"]').change(function() {
        if($(this).is(':checked')) {
            var radioValue = $(this).val();
            if(radioValue == "one-way") {
                $(".return").css('display', 'none');
            }
            else if(radioValue == "round-trip") {
                $(".return").css('display', 'block');
            }
        }
    });
    $("#search_flight").click(function(){
        $('input[type="checkbox"]').prop('checked', false);
        getFlightData();
    });
    $('#from').on('input', updateAirportListDepart);
    $('#to').on('input', updateAirportListReturn);
    updateAirportListDepart();
    updateAirportListReturn();
    $(".DepartListClass").on('click', function() {
        $("#from").val($(this).text());
    })
    $('.returnListClass').on('click', function() {
        $("#to").val($(this).text());
    })
    cust = JSON.parse(localStorage.getItem('data')).id
    
});
function getAirportLists() {
    //var root = window.location.href;
    $.ajax({
        type: "GET",
        url: root + "getairports/",
        data: {},
        success: function (data1) {
            console.log(data1);
            var data = JSON.parse(data1)
            for(var i = 0; i < data.length; i++) {
                airports.push(data[i]["airportName"] + " (" + data[i]["airportCode"] + ") " + data[i]["location"]);
            }
        }
    });
}

$('#from').focusin(function() {
    $("#airportListFrom").css("display","block");
    updateAirportListDepart();
    depfoc = 1;
});
$('#to').focusin(function() {
    $("#airportListTo").css("display","block");
    updateAirportListReturn();
    retfoc = 1;
});
$('#from').focusout(function() {
    depfoc = 0;
});
$('#to').focusout(function() {
    retfoc = 0;
});
$(document).on("click", function (event) {
    if(event.target.classList[0] == "DepartListClass") {
        $("#from").val(event.target.textContent);
    }
    else if(event.target.classList[0] == "returnListClass") {
        $("#to").val(event.target.textContent);
    }

    if(depfoc == 0){
        $("#airportListFrom").css("display","none");
    }
    if(retfoc== 0){
        $("#airportListTo").css("display","none");
    }
});
/*function ff() {
    $(".DepartListClass").on('click', function() {
        $("#from").val($(this).text());
    })
    $("#airportListFrom").css("display","none");
}
function gg() {
    $('.returnListClass').on('click', function() {
        $("#to").val($(this).text());
    })
    $("#airportListTo").css("display","none");
}*/
function updateAirportListDepart() {
    const input = $("#from").val().toLowerCase();
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
    const input = $("#to").val().toLowerCase();
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

// Add event listener to input field
//document.getElementById('from').addEventListener('input', updateAirportListDepart);
//document.getElementById('to').addEventListener('input', updateAirportListReturn);
function datesetdep(){
    var d = $("#depart-date").val();
       if(!validDate(d)) {
            $("#depart-date").val("");
            $("#depart-error").append("enter correct format");
       }
       else {
           $("#depart-error").html("");
           $("#depart-date").val(d[0]+d[1]+"-"+d[2]+d[3]+"-"+d[4]+d[5]+d[6]+d[7]);
       }
   }
function datecleardep() {
    $("#depart-date").val("")
}
function validDate(dateStr){
    var regex = /^\d{8}$/;
    return regex.test(dateStr);
}
function getFlightData() {
    var trip_type = $('input[name="trip-type"]:checked').val();
    var from = $('#from').val();
    var to = $('#to').val();
    var d = $('#depart-date').val();
    
    var date = d.split('-')[2] + "-" + d.split('-')[0] + "-" + d.split('-')[1];
    var passengers = $('#passengers').val();
    if($("#from").val() == "") {
        $("#from-error").append("Source can't be empty");
    }
    else if(!airports.includes(from)) {
        $("#from-error").append("We couldn't find the city/airport you entered.");
    }
    else {
        $("#from-error").html("");
    }

    if($("#to").val() == "") {
        $("#to-error").append("Source can't be empty");
    }
    else if(!airports.includes(to)) {
        $("#to-error").append("We couldn't find the city/airport you entered.");
    }
    else if(from == to) {
        $("#to-error").append("source and destination shouldn't be same");
    }
    else {
        $("#to-error").html("");
    }

    if(date == "") {
        $("#depart-error").append("departure date can't be empty");
    }
    else {
        $("#depart-error").html("");
    }

    if(passengers == "") {
        $("#passengers-error").append("passengers count can't be empty");
    }
    else {
        $("#passengers-error").html("");
    }
    if(trip_type == "round-trip" && $("#return-date").val() == "") {
        $("#return-error").append("return date can't be empty");
    }
    else {
        $("#return-error").html("");
    }

    var ff = 0;
    $(".searchError").each(function() {
        if($(this).html() != ""){
            ff++;
        }
    });
    if(ff == 0)
        searchFlight();
}

function searchFlight() {
    var trip_type = $('input[name="trip-type"]:checked').val();
    var from = $('#from').val();
    var to = $('#to').val();
    var passengers = $('#passengers').val();

    if(trip_type == "one-way") {
        //var root = window.location.href;
        var d = $('#depart-date').val();
        var date = d.split('-')[2] + "-" + d.split('-')[0] + "-" + d.split('-')[1];
        const dd = {
            "from": from.substring(from.indexOf('(')+1,from.indexOf(')')),
            "to" : to.substring(to.indexOf('(')+1,to.indexOf(')')),
            "date": date,
            "passengers":passengers
        };
        $.ajax({
            type: "POST",
            url: root + "getflights/",
            data: dd,
            success: function (data1) {
                console.log(data1);
                var data = JSON.parse(data1);
                current_search = data;
                current_data = current_search
                displayOnewayFlights();
            }
        });
    }
    else {  

    }
}
function displayOnewayFlights() {
    $(".flights-data").html("");
    for(var i = 0; i < current_data.length; i++) {
        var depd = current_data[i]["departureDate"].split('-')[1] + "-" + current_data[i]["departureDate"].split('-')[2] + "-" + current_data[i]["departureDate"].split('-')[0];
        var arrd = current_data[i]["arrivalDate"].split('-')[1] + "-" + current_data[i]["arrivalDate"].split('-')[2] + "-" + current_data[i]["arrivalDate"].split('-')[0];
        var deph = parseInt(current_data[i]["departureTime"].split(':')[0]);
        var depTime = "";
        if(deph > 12){
            depTime += deph-12 + ":" + current_data[i]["departureTime"].split(':')[1] + " PM";
        }
        else {
            depTime += deph + ":" + current_data[i]["departureTime"].split(':')[1] + " AM";
        }
        var arrh = parseInt(current_data[i]["arrivalTime"].split(':')[0]);
        var arrTime = "";
        if(arrh > 12){
            arrTime += arrh-12 + ":" + current_data[i]["arrivalTime"].split(':')[1] + " PM";
        }
        else {
            arrTime += arrh + ":" + current_data[i]["arrivalTime"].split(':')[1] + " AM";
        }
        
        var htm = '<div class="flight">' + 
            '<div class="flight-details">' +  
                '<div class="flight-info">' + 
                    '<div class="flight-dates">' + 
                        '<span><b>Departure</b>: ' + depd + '</span>' +
                        '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
                        '<span><b>Return</b>: ' + arrd + '</span>' + 
                    '</div>' + 
                    '<div class="flight-time">' + 
                        '<span>' + depTime + '</span>' + 
                        '<span>' + airports.filter(str => str.includes(current_data[i]["departureAirport"]))[0].split(") ")[1] + " (" + current_data[i]["departureAirport"] + ")" + '</span>' +
                    '</div>' +
                    '<div class="flight-duration">' + 
                        '<span>' + parseInt(parseInt(current_data[i]["duration"])/60) + "H " + parseInt(current_data[i]["duration"])%60 + "M" + '</span>' + 
                    '</div>' +
                    '<div class="flight-time">' + 
                        '<span>' + arrTime + '</span>' +
                        '<span>' + airports.filter(str => str.includes(current_data[i]["arrivalAirport"]))[0].split(") ")[1] + " (" + current_data[i]["arrivalAirport"] + ")" + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="flight-price">' +
                    '<span>$' + current_data[i]["price"] + '</span>' + 
                    "<button class='book' onclick='booknow(" + JSON.stringify(current_data[i]) + ");'>Book Now</button>" +
                '</div>' + 
            '</div>' + 
        '</div>';
        $(".flights-data").append(htm);
    }
}
function getFilteredData() {
    var anyNotSelected = true;
    $(".filterCheck").each(function() {
        if ($(this).is(":checked")) {
            anyNotSelected = false;
        }
    });
    if(anyNotSelected) {
        current_data = current_search;
        displayOnewayFlights();
        return;
    }
    current_data_f = [];
    $('input[name="departure-time"]').filter(':checked').each(function() {
        var selectedDep = parseInt($(this).val());
        var filteredArray = current_search.filter(function(item) {
            var h = parseInt(item.departureTime.split(":")[0]);
            if(h < selectedDep && h>= selectedDep-6) 
                return true;
            return false;
        });
        current_data_f = current_data_f.concat(filteredArray);
    });
    $('input[name="arrival-time"]').filter(':checked').each(function() {
        var selectedDep = parseInt($(this).val());
        var filteredArray = current_search.filter(function(item) {
            var h = parseInt(item.arrivalTime.split(":")[0]);
            if(h < selectedDep && h>= selectedDep-6) 
                return true;
            return false;
        });
        current_data_f = current_data_f.concat(filteredArray);
    });
    $('input[name="price-range"]').filter(':checked').each(function() {
        var selectedDep = parseInt($(this).val());
        if(selectedDep == 0) {
            var filteredArray = current_search.filter(function(item) {
                var p = parseInt(item.price);
                if(p >= selectedDep && p < selectedDep + 200) 
                    return true;
                return false;
            });
            current_data_f = current_data_f.concat(filteredArray);
        }
        else if(selectedDep == 200 || selectedDep == 300) {
            var filteredArray = current_search.filter(function(item) {
                var p = parseInt(item.price);
                if(p >= selectedDep && p < selectedDep + 100) 
                    return true;
                return false;
            });
            current_data_f = current_data_f.concat(filteredArray);
        }
        else if(selectedDep == 400) {
            var filteredArray = current_search.filter(function(item) {
                var p = parseInt(item.price);
                if(p >= selectedDep) 
                    return true;
                return false;
            });
            current_data_f = current_data_f.concat(filteredArray);
        }
    });
    current_data = current_data_f;
    displayOnewayFlights();
}

function booknow(data) {
    curr_flight = data;
    var bookedseats = getBookedseats(data["flightID"]);
    var totalSeats = getseats(data["aircraftNumber"]);
    $(".main").css("display","none");
    $(".popup").css("display","block");
}
function getBookedseats(flightID) {
    //var root = window.location.href;
    const dd = {
        "flightID": flightID
    };
    $.ajax({
        type: "POST",
        url: root + "getbook/",
        contentType: 'application/json',
        data: JSON.stringify(dd),
        success: function (data1) {
            console.log(data1);
            //var data = JSON.parse(data1);
            bookedseats = data1;
            showSeats();
        }
    });
}
function showSeats() {
    var pop = "";
    for(var i = 1; i <= parseInt(totalSeats/9); i++) {
        pop += "<div class=roo>";
            pop += " <div class='selectable' data-value='A" + i + "'>A" + i + "</div>";
            pop += " <div class='selectable' data-value='B" + i + "'>B" + i + "</div>";
            pop += " <div class='selectable' data-value='C" + i + "'>C" + i + "</div>";
            pop += "<div style='display: inline-block;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>";
            pop += " <div class='selectable' data-value='D" + i + "'>D" + i + "</div>";
            pop += " <div class='selectable' data-value='E" + i + "'>E" + i + "</div>";
            pop += " <div class='selectable' data-value='F" + i + "'>F" + i + "</div>";
            pop += "<div style='display: inline-block;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>";
            pop += " <div class='selectable' data-value='G" + i + "'>G" + i + "</div>";
            pop += " <div class='selectable' data-value='H" + i + "'>H" + i + "</div>";
            pop += " <div class='selectable' data-value='I" + i + "'>I" + i + "</div>";
        pop += "</div>";
    }
    if(parseInt(totalSeats%9)>0) {
        pop += "<div class=roo>";
        for(var i = 1; i <= parseInt(totalSeats%9); i++) {
                pop += " <div class='selectable' data-value='" + String.fromCharCode(i+65) + i + "'>" +  String.fromCharCode(i+65) + i + "</div>";
                if(i%3 == 0)
                    pop += "<div style='display: inline-block;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>";
        }
        pop += "</div>";
    }
    $(".seat-content").html("");
    $(".seat-content").append(pop);
    for(var i = 0; i < bookedseats.length; i++) {
        $('.selectable[data-value=' + bookedseats[i] + ']').each(function() {
            $(this).addClass("unselectable");
            $(this).removeClass("selectable");
        });
    }
    $(".selectable").click(function() {
        $(this).toggleClass("selected");
        if($('.selected').length > parseInt($("#passengers").val())) {
            $(this).removeClass("selected");
        }
    });
}
function validateSelectedSeats() {
    if($('.selected').length != parseInt($("#passengers").val())) {
        alert("select " + $("#passengers").val() + " seats");
    }
    else{
        bookSelectedSeats();
    }
}
function backtoSelectedSeats() {
    $("#selseat").css("display","block");
    $("#bookpop").css("display","none");
}
function bookSelectedSeats() {
    var pop = ""
    var count = parseInt($("#passengers").val());
    for(var i = 1; i <= count; i++) {
        pop += '<div class="form-group form-group' + i + '">' +
                    '<h5 for="form-group' + i + '" style="text-align: center">Passenger' + i + '</h5>' +
                    '<div class="row" style="padding-bottom: 5px;">' + 
                        '<label class="le" for="name' + i + '" style="text-align: right;font-size: larger;padding-right: 35px;">Name :</label>' +
                        '<div class="ri"><input type="text" id="name' + i + '" required></div>' +
                    '</div>' +
                    '<div class="row" style="padding-bottom: 5px;">' + 
                        '<label class="le" for="passport' + i + '" style="text-align: right;font-size: larger;padding-right: 35px;">Passport :</label>' +
                        '<div class="ri"><input type="text" id="passport' + i + '" required></div>' +
                    '</div>' +
                    '<div class="row" style="padding-bottom: 5px;">' + 
                        '<label class="le" for="phone' + i + '" style="text-align: right;font-size: larger;padding-right: 35px;">Phone :</label>' +
                        '<div class="ri"><input type="text" id="phone' + i + '" required></div>' +
                    '</div>' +
                    '<div class="row" style="padding-bottom: 5px;">' + 
                        '<label class="le" for="email' + i + '" style="text-align: right;font-size: larger;padding-right: 35px;">Email :</label>' +
                        '<div class="ri"><input type="text" id="email' + i + '" required></div>' +
                    '</div>' +
                '</div>'  
    }
    $(".bookpop-content-body").html("");
    $(".bookpop-content-body").append(pop);

    $("#selseat").css("display","none");
    $("#bookpop").css("display","block");

    getPassport();
}
function getPassport() {
    //var root = window.location.href;
    $.ajax({
        type: "GET",
        url: root + "checkPass/",
        data: {},
        success: function (data1) {
            console.log(data1);
            var data = JSON.parse(data1)
            for(var i = 0; i < data.length; i++) {
                passports.push(data[i]);
            }
        }
    });
}
function validatePassengers(){
    var count = parseInt($("#passengers").val());
    var err = false;
    for(var i = 0; i < count; i++) {
        if($("#name" + i).val() == "" || $("#passport" + i).val() == "" || $("#phone" + i).val() == "" || $("#email" + i).val() == "") {
            err = true;
        }
    }
    if(!err) {
        addPass();
    }
}
function addPass() {
    var count = parseInt($("#passengers").val());
    curpass = [];
    incPassenger();
}
function updateBooking() {
    //var root = window.location.href;
    $(".bookpop-content").css("display", "none");
    $(".bookpay-content").css("display", "none");
    $(".ticket-content").css("display", "block");
    var f = [];
    var hech = [];
    $(".selected").each(function () { 
        f.push($(this).attr('data-value'));
    });
    for(var i = 0; i < curpass.length; i++) {
        hech.push(curpass[i]["passengerID"]);
    }
    const dd = {
        "flightID" : curr_flight["flightID"],
        "bookingStatus" : "confirmed",
        "passengerID" : hech,
        "seatNumber" : f,
        "us" : parseInt(window.location.href.split("=")[1]),
        "amount" : parseInt(curr_flight["price"]*curpass.length)
    };
    $.ajax({
        type: "POST",
        url: root + "updbook/",
        contentType: 'application/json',
        data: JSON.stringify(dd),
        success: function (data1) {
            showTicket();
        }
    });
}
function closePopup() {
    $(".unpop").css("display","block");
    $(".yespop").css("display","none");
}
function showTicket() {
    var f = [];
    $(".selected").each(function () { 
        f.push($(this).attr('data-value'));
    });
    pop = "";
    for(var i = 0; i < curpass.length; i++){
        var dd = curr_flight["departureDate"];
        var ddep = dd.split('-')[1] + dd.split('-')[2] + dd.split('-')[0]; 
        var t = curr_flight["departureTime"];
        var h = parseInt(t.split(":")[0]);
        var time = ""
        if(h>12){
            time += ((h-12)+":"+t.split(":")[1]+" PM");
        }
        else{
            time += ((h)+":"+t.split(":")[1]+" AM");
        }
        pop += '<div class="ticket">' + 
            '<h2>Ticket</h2>' + 
            '<p><strong>Flight:</strong> ' + curr_flight["flightID"] + '</p>' +
            '<p><strong>Departure:</strong> ' + curr_flight["departureAirport"] + '</p>' +
            '<p><strong>Arrival:</strong> ' + curr_flight["arrivalAirport"] + '</p>' +
            '<p><strong>Date:</strong> ' + ddep + '</p>' +
            '<p><strong>Time:</strong> ' + time + '</p>' +
            '<div class="ticket-details">' +
                '<p><strong>Passenger Name:</strong> ' + curpass[i]["name"] + '</p>' +
                '<p><strong>Seat Number:</strong> ' + f[i] + '</p>' +
                '<p><strong>Price:</strong> $' + curr_flight["price"] + '</p>' +
            '</div>' +
        '</div>';
    }
    $(".ticket-content-body").html("");
    $(".ticket-content-body").append(pop);
}
function doneFun() {
    window.location = window.location.origin + "/";
}
function BacktoLogin() {
    window.location = window.location.origin + "/";
}
function incPassenger() {
    //var root = window.location.href;
    var count = parseInt($("#passengers").val());
    var dtt = [];
    for(var i = 1; i <= count; i++) {
        dtt.push({
            "passportNumber" : $("#passport" + i).val(),
            "name" : $("#name" + i).val(),
            "contactNumber" : $("#phone" + i).val(),
            "email" : $("#phone" + i).val()
        });
    }
    const dd = {"data":dtt};
    $.ajax({
        type: "POST",
        url: root + "incPassenger/",
        contentType: 'application/json',
        data: JSON.stringify(dd),
        success: function (data1) {
            curpass = curpass.concat(JSON.parse(data1));

            $(".bookpop-content").css("display", "none");
            $(".bookpay-content").css("display", "block");
            $(".ticket-content").css("display", "none");
            $(".amm").html("Amount : " + (curr_flight["price"]*curpass.length*1.093));
        }
    });
}
function incPass(i){
    //var root = window.location.href;
    const dd = {
        "passportNumber" : $("#passport" + i).val(),
        "name" : $("#name" + i).val(),
        "contactNumber" : $("#phone" + i).val(),
        "email" : $("#phone" + i).val()
    };
    $.ajax({
        type: "POST",
        url: root + "incPass/",
        contentType: 'application/json',
        data: JSON.stringify(dd),
        success: function (data1) {
            curpass.push(data1);
        }
    });
}
function passExists(Passport) {
    for(var i = 0; i<passports.length; i++) {
        if(passports[i]["passportNumber"] == Passport){
            return passports[i]["passengerID"];
        }
    }
    return 0;
}
function getseats(aircraftNumber) {
    aircrafts = [];
    //var root = window.location.href;
    $.ajax({
        type: "GET",
        url: root + "getaircrafts/",
        data: {},
        success: function (data1) {
            console.log(data1);
            var data = JSON.parse(data1);
            for(var i = 0; i < data.length; i++) {
                aircrafts.push({"aircraft" : data[i]["aircraftType"] + " " + data[i]["registrationNumber"],"id" : data[i]["aircraftID"], "seats":data[i]["seatingConfiguration"]});
            }
            for(var i = 0; i < aircrafts.length; i++) { 
                if(aircrafts[i]["id"] == aircraftNumber)
                {
                    totalSeats = aircrafts[i]["seats"];
                }
            }
        }
    });
    
}
/*function getFlightBookings(dic){
    //var root = window.location.href;
    $.ajax({
        type: "GET",
        url: root + "getbookings/",
        data: {},
        success: function (data1) {
            console.log(data1);
            var data = JSON.parse(data1)
            curbooking = data;

            var bookid = [];
            for(var i = 0; i < curbooking.length; i++) {
                if(curbooking[i]["bookingStatus"] == "confirmed" && curbooking[i]["flightID"] == dic["flightID"]) {
                    bookid.push(curbooking[i]["bookingID"])
                }
            }
            var bookedseats = [];
            $.ajax({
                type: "GET",
                url: root + "gettickets/",
                data: {},
                success: function (data1) {
                    console.log(data1);
                    var data = JSON.parse(data1)
                    curtickets = data;

                    for(var i = 0; i < curtickets.length; i++) {
                        for(var j = 0; j < bookid.length; j++) {
                            if(curtickets[i]["bookingID"] == bookid[j]) {
                                bookedseats = bookedseats.concat(curtickets[i]["seatNumber"])
                            }
                        }
                    }
                    return bookedseats;
                }
            });
        }
    });
}*/