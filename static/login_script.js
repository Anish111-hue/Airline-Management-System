function toggleTab(tab) {
    if (tab === 'admin') {
        clearUserRegister();
        clearUserLogin();
        clearAdminLogin();
        $('#admin-login').css('display', 'block');
        $('#user-login').css('display', 'none');
        $('#registration').css('display', 'none');
        $('#sliderID').css('display', 'block');
        $('#admin-tab').addClass('active')
        $('#user-tab').removeClass('active')
    }
    else if (tab === 'user_register') {
        clearUserRegister();
        clearUserLogin();
        clearAdminLogin();
        $('#admin-login').css('display', 'none');
        $('#user-login').css('display', 'none');
        $('#registration').css('display', 'block');
        $('#sliderID').css('display', 'none');
    } else {
        clearUserRegister();
        clearUserLogin();
        clearAdminLogin();
        $('#admin-login').css('display', 'none');
        $('#user-login').css('display', 'block');
        $('#registration').css('display', 'none');
        $('#sliderID').css('display', 'block');
        $('#admin-tab').removeClass('active')
        $('#user-tab').addClass('active')
    }
}

function clearUserRegister() {
    $("#first-name").val("");
    $("#last-name").val("");
    $("#phone").val("");
    $("#email").val("");
    $("#password").val("");
    $("#user-id").val("");
}
function clearUserLogin() {
    $("#user-username").val("");
    $("#user-password").val("");
}
function clearAdminLogin() {
    $("#admin-username").val("");
    $("#admin-password").val("");
}

function isUserIdAlreadyExists() {
    var root = window.location.href;
    var uid = $("#user-id").val();
    const data = {
        "userid": uid
    }
    $.ajax({
        type: "POST",
        url: root + "userid/",
        data: data,
        success: function (data) {
            console.log(data);
            if (data == "False") {
                $("#user-id-error").append("userid unavailable")
            }
            else {
                $("#user-id-error").html("");
            }
        }
    });
}

function validateUserRegistration() {

    $(".error").each(function () {
        $(this).html("");
    });

    if($("#first-name").val().trim() == ""){
        $("#first-name-error").append("Please enter first name");
    }
    else if($("#first-name").val() != $("#first-name").val().trim()){
        $("#first-name-error").append("Please enter first name with no spaces before and after");
    }
    else{
        $("#first-name-error").html("");
    }

    if($("#last-name").val().trim() == ""){
        $("#last-name-error").append("Please enter last name");
    }
    else if($("#last-name").val() != $("#last-name").val().trim()){
        $("#last-name-error").append("Please enter last name with no spaces before and after");
    }
    else{
        $("#last-name-error").html("");
    }

    if($("#email").val().trim() == ""){
        $("#email-error").append("Please enter email");
    }
    else{
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!re.test($("#email").val().trim())){
            $("#email-error").append("Please enter valid email id");
        }
        else{
            $("#email-error").html("");
        }
    }

    if($("#phone").val().trim() == ""){
        $("#phone-error").append("Please enter phone number");
    }
    else{
        var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if(!re.test($("#phone").val().trim())){
            $("#phone-error").append("Please enter valid phone number");
        }
        else{
            $("#phone-error").html("");
        }
    }

    if($("#user-id").val().trim() == ""){
        $("#user-id-error").append("Please enter userid");
    }
    else if($("#user-id").val().split(" ").length > 1){
        $("#user-id-error").append("Please enter user id with no spaces");
    }
    else{
        if(isUserIdAlreadyExists()){
            $("#user-id-error").append("userid unavailable")
        }
        else{
            $("#user-id-error").html("");
        }
    }

    if($("#password").val().trim() == ""){
        $("#password-error").append("Please enter password");
    }
    else{
        var re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/ ;
        if(!re.test($("#password").val())){
            $("#password-error").append("password must be more than 8 to 16 characters one capital and one small alphabet and one number with no spaces");
        }
        else{
            $("#password-error").html("");
        }
    }
    if($("#confirmpassword").val().trim() == ""){
        $("#confirm-password-error").append("Please confirm password");
    }
    else if($("#confirmpassword").val().trim() != $("#password").val().trim()) {
        $("#confirm-password-error").append("Password not matching");
    }
    else {
        $("#confirm-password-error").html("");
    }
    var ff = 0;
    $(".error").each(function() {
        if($(this).html() != ""){
            ff++;
        }
    });
    if(ff == 0)
        addCustomer();
}

function addCustomer(){
    var root = window.location.href;
    const data = {
        "name": $("#first-name").val() + " " + $("#last-name").val(),
        "contactNumber": $("#phone").val(),
        "email": $("#email").val(),
        "password": $("#password").val(),
        "userID": $("#user-id").val(),
    };
    $.ajax({
        type: "POST",
        url: root + "register/",
        data: data,
        success: function (data) {
            clearUserRegister();
            toggleTab('user');
        }
    });
}

function logUserIn(){
    var root = window.location.href;
    var uid = $("#user-username").val();
    var password = $("#user-password").val();
    const data = {
        "userid": uid,
        "password": password
    }
    $.ajax({
        type: "POST",
        url: root + "validateUser/",
        data: data,
        success: function (data) {
            console.log(data);
            if (data == "False") {
                $("#login-error").append("user id and password doesnot match")
            }
            else {
                $("#login-error").html("");
                clearUserLogin();
                window.location = "home?id="+data["id"];
            }
        }
    });
}

function logAdminIn(){
    var root = window.location.href;
    var uid = $("#admin-username").val();
    var password = $("#admin-password").val();
    const data = {
        "userid": uid,
        "password": password
    }
    $.ajax({
        type: "POST",
        url: root + "validateAdmin/",
        data: data,
        success: function (data) {
            console.log(data);
            if (data == "False") {
                $("#admin-error").append("user id and password doesnot match")
            }
            else {
                $("#admin-error").html("");
                clearAdminLogin();
                window.location = "admin";
            }
        }
    });
}
