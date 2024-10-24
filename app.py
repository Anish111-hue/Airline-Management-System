from flask import Flask
from flask_pymongo import PyMongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask import jsonify, request, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = "secretkey"
app.config['MONGO_URI'] = "mongodb+srv://axk96410:Anish@cluster0.stpshez.mongodb.net/ASMA"
mongo = PyMongo(app)

@app.route('/')
def index():
    #print("started")
    return render_template("login.html")

@app.route('/home/')
def index1():
    _json = request.form
    data = {
        '': 'New York'
    }
    #print("started")
    return render_template("home.html")

@app.route('/admin/')
def index2():
    #print("started")
    return render_template("admin_home.html")

@app.route('/validateUser/', methods = ['GET', 'POST'])
def loginUser():
    #print("started")
    
    _json = request.form
    user =  _json["userid"]
    password = _json["password"]
    count = mongo.db.Customers.count_documents({ "userID": user, "password": password })
    if(count == 0):
        return "False"
    else:
        fvf = mongo.db.Customers.find_one({ "userID": user, "password": password },{"passengerID":1,"_id":0})
        print(fvf)
        print(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
        print(dumps(fvf))
        print(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
        print(type(dumps(fvf)))
        print(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
        k = dumps(fvf).split(':')[1].split('}')[0]
        ff = int(k)
        print(ff)
        print(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
        print(type(ff))
        data = {
            "id" : ff
        }
        return jsonify(data)

@app.route('/validateAdmin/', methods = ['GET', 'POST'])
def loginAdmin():
    #print("started")
    _json = request.form
    user =  _json["userid"]
    password = _json["password"]
    count = mongo.db.Admin.count_documents({ "userID": user, "password": password })
    if(count == 0):
        return "False"
    else:
        return render_template("admin_home.html")


@app.route('/userid/', methods = ['GET', 'POST'])
def check_user_ID():
    _json = request.form
    input = _json["userid"]
    count = mongo.db.Customers.count_documents({ "userID": input })
    if count == 0:
        return "True"
    else:
        return "False"
    
@app.route('/register/', methods = ['GET', 'POST'])
def add_customer():
    #print("entered")
    _json = request.form
    #print(_json)
    p_id_dict = mongo.db.Customers.find({}, {'passengerID':1,'_id':0})
    p_id_list = []
    for dic in p_id_dict:
        p_id_list.append(dic['passengerID'])
    ans = len(p_id_list)+1
    i = 1
    for j in p_id_list:
        if i != j:
            ans = i
            break
        i += 1

    _pid = ans
    _name = _json['name']
    _contact_number = _json['contactNumber']
    _email = _json['email']
    _password = _json['password']
    _userID = _json['userID']

    if _pid and _name and _contact_number and _email and _password and _userID and request.method == 'POST':
        id = mongo.db.Customers.insert_one({'passengerID' : _pid, 'name' : _name, 'contactNumber' : _contact_number, 'email' : _email, 'password' : _password, 'userID' : _userID})
        resp = jsonify("product added successfully")
        resp.status_code = 200
        return resp
    
    else:
        return not_found()
    
@app.errorhandler(404)
def not_found(error = None):
    message = {
        'status' : 404,
        'message' : 'Not Found' + request.url
    }
    resp = jsonify(message)
    resp.status_code = 404
    return resp



#Home 

@app.route('/home/getairports/', methods = ['GET', 'POST'])
def get_airports():
    id = mongo.db.Airport.find()
    resp = dumps(id)
    return jsonify(resp)

@app.route('/home/getbook/', methods = ['GET', 'POST'])
def get_book():
    _json = request.json
    id = mongo.db.Bookings.find({"flightID": _json['flightID'], "bookingStatus":"confirmed"})
    response_json = jsonify(dumps(id)).get_json()
    data_list = json.loads(response_json)
    bookid = []
    for ele in data_list:
        bookid.append(ele["bookingID"])
    ans = []
    for bid in bookid:
        ff = mongo.db.Tickets.find({"bookingID":bid})
        response_json1 = jsonify(dumps(ff)).get_json()
        data_list1 = json.loads(response_json1)
        for d in data_list1:
            ans.extend(d["seatNumber"])
    return jsonify(ans)

@app.route('/home/getbookings/', methods = ['GET', 'POST'])
def get_bookings():
    id = mongo.db.Bookings.find()
    resp = dumps(id)
    return jsonify(resp)

@app.route('/home/gettickets/', methods = ['GET', 'POST'])
def get_tickets():
    id = mongo.db.Tickets.find()
    resp = dumps(id)
    return jsonify(resp)

@app.route('/home/getaircrafts/', methods = ['GET', 'POST'])
def get_aircrafts():
    id = mongo.db.Aircraft.find()
    resp = dumps(id)
    return jsonify(resp)

@app.route('/home/checkPass/', methods = ['GET', 'POST'])
def check_passport():
    id = mongo.db.passengers.find({},{"passengerID":1,"passportNumber":1,'_id':0})
    resp = dumps(id)
    return jsonify(resp)


@app.route('/home/updbook/', methods = ['GET', 'POST'])
def update_Book():
    _json = request.json
    print("####################################?????????????????????????????????????????#########################")
    print(_json)
    print("########################??????????????????????????????????????????????##########################")
    print(_json)
    p_id_dict = mongo.db.Bookings.find({}, {'bookingID':1,'_id':0})
    p_id_list = []
    for dic in p_id_dict:
        p_id_list.append(dic['bookingID'])
    ans = len(p_id_list)+1
    i = 1
    for j in p_id_list:
        if i != j:
            ans = i
            break
        i += 1

    _pid = ans
    _flightID = _json['flightID']
    _bookingStatus = _json['bookingStatus']
    _seatNumber = _json['seatNumber']
    _passengerID = _json['passengerID']
    _user = _json['us']
    _amount = _json['amount']
    print("###############################################################")
    print(_json)
    print("###############################################################")

    id = mongo.db.Bookings.insert_one({"bookingID":_pid, 
                                         "flightID":_flightID, 
                                         "bookingStatus":_bookingStatus
                                         })
    print("###############################################################")
    print(_seatNumber)
    print(_passengerID)
    print("###############################################################")
    id1 = mongo.db.Tickets.insert_one({"bookingID":_pid, 
                                         "seatNumber":_seatNumber, 
                                         "passengerID":_passengerID
                                         })
    id2 = mongo.db.payment.insert_one({"bookingID":_pid, 
                                         "amount":_amount, 
                                         "paidBy":_user
                                         })
    return "success"
    
@app.route('/home/incPass/', methods = ['GET', 'POST'])
def include_passport():
    _json = request.json
    print("###############################################################")
    print(_json)
    print("###############################################################jujuu")
    
    p_id_dict = mongo.db.passengers.find({}, {'passengerID':1,'_id':0})
    
    p_id_list = []
    for dic in p_id_dict:
        print(dic)
        p_id_list.append(dic['passengerID'])
    ans = len(p_id_list)+1
    i = 1
    for j in p_id_list:
        if i != j:
            ans = i
            break
        i += 1

    _pid = ans
    _passportNumber = _json['passportNumber']
    _name = _json['name']
    _contactNumber = _json['contactNumber']
    _email = _json['email']
    id = mongo.db.passengers.insert_one({"passengerID":_pid, 
                                         "passportNumber":_passportNumber, 
                                         "name":_name,
                                         "contactNumber":_contactNumber,
                                         "email":_email})
    return str(_pid)


@app.route('/home/getflights/', methods = ['GET', 'POST'])
def get_flights():
    _json = request.form
    #print("before")
    #print(_json)
    #print("after")
    fromP = _json['from']
    to = _json['to']
    date = _json['date']
    passengers = int(_json['passengers'])
    id = mongo.db.Flights.find({"departureAirport" : fromP, "arrivalAirport" : to, "departureDate" : date, "availableSeats": { '$gte': passengers}})
    resp = dumps(id)
    #print(resp)
    return jsonify(resp)

#admin

@app.route('/admin/getairports/', methods = ['GET', 'POST'])
def get_airports1():
    id = mongo.db.Airport.find()
    resp = dumps(id)
    return jsonify(resp)

@app.route('/admin/getaircrafts/', methods = ['GET', 'POST'])
def get_aircrafts1():
    id = mongo.db.Aircraft.find()
    resp = dumps(id)
    return jsonify(resp)

@app.route('/admin/getflights/', methods = ['GET', 'POST'])
def get_flights1():
    id = mongo.db.Flights.find()
    resp = dumps(id)
    return jsonify(resp)

@app.route('/admin/flightid/', methods = ['GET', 'POST'])
def check_flight_ID():
    _json = request.form
    input = _json["flightid"]
    count = mongo.db.Flights.count_documents({ "flightID": input })
    if count == 0:
        return "True"
    else:
        return "False"
    
@app.route('/admin/addflight/', methods = ['GET', 'POST'])
def add_flight():
    #print("entered")
    _json = request.form
    data_json = _json.to_dict
    #id = mongo.db.Customers.insert_one(data_json)
    id = mongo.db.Flights.insert_one({"departureAirport":_json['departureAirport'], 
                                        "arrivalAirport":_json['arrivalAirport'], 
                                        "departureDate":_json['departureDate'], 
                                        "arrivalDate":_json['arrivalDate'], 
                                        "duration":int(_json['duration']), 
                                        "availableSeats":int(_json['availableSeats']), 
                                        "aircraftNumber":int(_json["aircraftNumber"]),
                                        "flightID":_json["flightID"],
                                        "arrivalTime":_json["arrivalTime"],
                                        "departureTime":_json['departureTime'],
                                        "price":int(_json['price'])})
    resp = jsonify("flight added successfully")
    resp.status_code = 200
    return resp

@app.route('/admin/addaircraft/', methods = ['GET', 'POST'])
def add_aircraft():
    #print("entered")
    _json = request.form
    p_id_dict = mongo.db.Aircraft.find({}, {'aircraftID':1,'_id':0})
    p_id_list = []
    for dic in p_id_dict:
        p_id_list.append(dic['aircraftID'])
    ans = len(p_id_list)+1
    i = 1
    for j in p_id_list:
        if i != j:
            ans = i
            break
        i += 1
    id = mongo.db.Aircraft.insert_one({"aircraftID":ans, 
                                        "aircraftType":_json['aircraftType'], 
                                        "registrationNumber":int(_json['registrationNumber']), 
                                        "seatingConfiguration":int(_json['seatingConfiguration']), 
                                        "lastMaintenance":_json['lastMaintenance']})
    resp = jsonify("aircraft added successfully")
    resp.status_code = 200
    return resp

@app.route('/admin/addairport/', methods = ['GET', 'POST'])
def add_airport():
    #print("entered")
    _json = request.form
    id = mongo.db.Airport.insert_one({"airportCode":_json['airportCode'], 
                                        "location":_json['location'], 
                                        "airportName":_json['airportName'], 
                                        "timeZone":int(_json['timeZone'])})
    resp = jsonify("airport added successfully")
    resp.status_code = 200
    return resp









##################################################################################################
@app.route('/home/incPassenger/', methods = ['GET', 'POST'])
def include_passport2():
    _json = request.json
    print("###############################################################")
    print(_json['data'])
    print("###############################################################jujuu")
    arr = _json['data']
    print(arr)
    print("###############################################################jujuu")
    print(len(arr))
    passCount = len(arr)
    cc = mongo.db.passengers.count_documents({})

    for i in range(0,passCount):
        arr[i]["passengerID"] = cc+i+1

    id = mongo.db.passengers.insert_many(arr)
    arr = mongo.db.passengers.find({"passengerID":{ "$gt": cc, "$lt": cc+passCount+1 }}, {'_id':0})
    return jsonify(dumps(arr))
##################################################################################################





        
if __name__ == "__main__":
    app.run(debug=True)
