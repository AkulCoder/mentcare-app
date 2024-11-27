from flask import request, jsonify, json, Blueprint #,render_template, request
from app import mysql # , socketio, sockets
# If you need socketio stuff maybe uncomment the below line. 100% uncomment the stuff directly above
# from flask_socketio import SocketIO, join_room, leave_room, send, emit

# Feel free to add more imports


registrationPageData = Blueprint('registrationPageData', __name__)

@registrationPageData.route("/validateUserEmail", methods=['POST'])
def validateEmailFunc():
    email = request.json.get('email')
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT email FROM users WHERE email LIKE %s", (email, ))
    if(cursor.rowcount > 0):
        return jsonify({"message" : "Email/User already exists"}), 409
    else:
        return jsonify({"message" : "Email is good for use"}), 200
    
@registrationPageData.route("/registerPatient", methods=['POST'])
def registerPatientFunc():
    try:
        fname = request.form.get('fname')
        lname = request.form.get('lname')
        fullname = fname + ' ' + lname
        email = request.form.get('email')
        password = request.form.get('password')

        print("\nBEFORE REQUEST FILES profileIMG")
        profileImgBinary = None

        # Check if a file was uploaded
        if 'profileImg' in request.files:
            print("\nPROFILE IMAGE EXISTS\n")
            profileImg = request.files['profileImg']

            # Optional: Validate file type (example: image/jpeg, image/png)
            if profileImg:
                profileImgBinary = profileImg.read()  # Read the binary data of the image
                print("Image binary:", profileImgBinary)
            else:
                return jsonify({"error": "Invalid file type. Only image files are allowed."}), 400

        insuranceCompany = request.form.get('company')
        insuranceID = request.form.get('insuranceId')
        insuranceTier = request.form.get('tier')

        weight = request.form.get('weight')
        height = request.form.get('height')
        calories = request.form.get('calories')
        water = request.form.get('water')
        exercise = request.form.get('exercise')
        sleep = request.form.get('sleep')
        energy = request.form.get('energy')
        stress = request.form.get('stress')

        print("\nGOT HERE BEFORE INSERT INTO\n")
        cursor = mysql.connection.cursor()
        cursor.execute('''
                INSERT INTO users (userName, email, pass, userType, profileImg)
                VALUES (%s, %s, %s, 'Patient', %s)
                ''', (fullname, email, password, profileImgBinary))
        mysql.connection.commit()
        print("\nSUCCESSFULLY ADDED USER!\n")

        #   Retrive userID of newly created user
        cursor.execute("SELECT userID FROM users WHERE email LIKE %s AND pass LIKE %s", (email, password))
        data = cursor.fetchone()
        userID = data[0]

        #   Check if user inputted Insurance Information
        if insuranceCompany and insuranceID and insuranceTier:
            cursor.execute('''
                    INSERT INTO patients (userID, insuranceCompany, insuranceID, insuranceTier)
                    VALUES (%s, %s, %s, %s)
                    ''', (userID, insuranceCompany, insuranceID, insuranceTier))
        else:
            cursor.execute('INSERT INTO patients (userID) VALUES (%s)', (userID, ))
        mysql.connection.commit()

        #   Retrive patientID of newly created user
        cursor.execute("SELECT patientID FROM patients WHERE userID = %s", (userID,))
        data = cursor.fetchone()
        patientID = data[0]

        cursor.close()
        return jsonify({"message" : "User successfully registered", "patientID" : patientID, "userID" : userID}), 200
    except Exception as err:
        return jsonify({"error":  f"{err}"}), 400
    
@registrationPageData.route("/registerTherapist", methods=['POST'])
def registerTherapistFunc():
    try:
        fname = request.form.get('fname')
        lname = request.form.get('lname')
        fullname = fname + ' ' + lname
        email = request.form.get('email')
        password = request.form.get('password')
        license = request.form.get('license')
        specsArray = request.form.get('specializations')

        print("\nBEFORE REQUEST FILES profileIMG")
        profileImgBinary = None

        # Check if a file was uploaded
        if 'profileImg' in request.files:
            print("\nPROFILE IMAGE EXISTS\n")
            profileImg = request.files['profileImg']

            # Optional: Validate file type (example: image/jpeg, image/png)
            if profileImg:
                profileImgBinary = profileImg.read()  # Read the binary data of the image
                # print("Image binary:", profileImgBinary)
            else:
                return jsonify({"error": "Invalid file type. Only image files are allowed."}), 400
    
        content = '{"survey" : [{"question": "How was your day?", "questionType": "string"}, {"question": "How much do you weigh in pounds?", "questionType": "number"}, {"question": "Did you eat today", "questionType": "boolean"}, {"question": "How much do you look forward to tomorrow?", "questionType": "range10"}]}'

        cursor = mysql.connection.cursor()
        cursor.execute('''
                INSERT INTO users (userName, email, pass, userType, profileImg)
                VALUES (%s, %s, %s, 'Therapist', %s)
                ''', (fullname, email, password, profileImgBinary))
        mysql.connection.commit()

        #   Retrive userID of newly created user
        cursor.execute("SELECT userID FROM users WHERE email LIKE %s AND pass LIKE %s", (email, password))
        data = cursor.fetchone()
        userID = data[0]
        print(userID)
        print(license)
        print(specsArray)

        cursor.execute('''
                INSERT INTO therapists (userID, licenseNumber, specializations, acceptingPatients, content)
                VALUES (%s, %s, %s, %s, %s)
                ''', (userID, license, specsArray, 1, content))
        mysql.connection.commit()

        #   Retrive therapistID of newly created user
        cursor.execute("SELECT therapistID FROM therapists WHERE userID = %s", (userID,))
        data = cursor.fetchone()
        therapistID = data[0]

        cursor.close()

        return jsonify({"message" : "User successfully registered", "therapistID" : therapistID, "userID" : userID}), 200
    except Exception as err:
        return jsonify({"error":  f"{err}"}), 400