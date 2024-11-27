from flask import request, jsonify, json, Blueprint
from app import mysql

# Define the Blueprint
therapist_routes = Blueprint('therapist_routes', __name__)

# Fetch a specific therapist by UserID
@therapist_routes.route('/therapistProfileInfo', methods=['POST'])
def thersProfInfoFunc():
    try:
        realUserID = request.json.get('realUserId')

        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT users.userName, therapists.Intro, therapists.Education, 
                   therapists.DaysHours, therapists.Price, 
                   therapists.specializations
            FROM users
            JOIN therapists ON users.userID = therapists.userID
            WHERE users.userID = %s AND users.userType = 'Therapist'
        """, (realUserID,))
        therapistInfo = cursor.fetchone()

        if not therapistInfo:
            return jsonify({"error": "Therapist not found"}), 404

        cursor.execute(f"""
            SELECT therapistID
            FROM therapists
            WHERE userID = {realUserID}
        """)
        therapistID = cursor.fetchone()[0]

        cursor.execute(f"""
            SELECT reviews.stars
            FROM reviews
            WHERE reviews.therapistID = {therapistID}
        """)
        reviews = cursor.fetchall()

        counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
        for review in reviews:
            counts[review[0]] = counts[review[0]] + 1

    except Exception as err:
        print(f"Error: {err}")
        return jsonify({"error": err}), 500
    finally:
        cursor.close()

    return jsonify({"Therapist": therapistInfo, "fives": counts[5], "fours": counts[4], "threes": counts[3], "twos": counts[2], "ones": counts[1]})

@therapist_routes.route('/therapistReviewInfo', methods=['POST'])
def theraReviewFunc():
    try:
        realUserID = request.json.get('realUserId')
        page = request.json.get('page')

        cursor = mysql.connection.cursor()

        cursor.execute(f"""
            SELECT therapistID
            FROM therapists
            WHERE userID = {realUserID}
        """)
        therapistID = cursor.fetchone()[0]

        cursor.execute(f"""
            SELECT reviews.content, reviews.stars, reviews.dateDone, users.userName
            FROM reviews, patients, users
            WHERE reviews.therapistID = {therapistID}
            AND reviews.patientID = patients.patientID
            AND patients.userID = users.userID
            LIMIT 4
            OFFSET {4*(int(page) - 1)}
        """)
        reviews = cursor.fetchall()


    except Exception as err:
        return jsonify({"error": err}), 500
    finally:
        cursor.close()

    return jsonify({"reviews": reviews})

@therapist_routes.route('/therapistUpdateInfo', methods=['POST'])
def theraUpdInfoFunc():
    try:
        print('0')
        realUserID = int(request.json.get('realUserId'))
        newSpecializations = request.json.get('specializationsArr')
        newEducation = request.json.get('educationUpd')
        newAboutMe = request.json.get('aboutMeUpd')
        newAvailability = request.json.get('availabilityUpd')
        newPricing = request.json.get('pricingUpd')
        print('0.5')

        cursor = mysql.connection.cursor()

        print(newSpecializations)
        print("1")
        if(len(newSpecializations) <= 1):
            newSpecializations = ''
            cursor.execute("""
                UPDATE therapists
                SET specializations = '', Education = %s, Intro = %s, DaysHours = %s, Price = %s
                WHERE userID = %s
            """, (newEducation, newAboutMe, newAvailability, newPricing, realUserID))
        else:
            if(newSpecializations[0] == ','):
                newSpecializations = newSpecializations[1:]
            cursor.execute("""
                UPDATE therapists
                SET specializations = %s, Education = %s, Intro = %s, DaysHours = %s, Price = %s
                WHERE userID = %s
            """, (newSpecializations, newEducation, newAboutMe, newAvailability, newPricing, realUserID))
        print("2")


        mysql.connection.commit()
        print("2.5")

        cursor.execute("""
            SELECT specializations, Education, Intro, DaysHours, Price
            FROM therapists
            WHERE userID = %s
        """, (realUserID, ))
        therapistInfo = cursor.fetchone()
        print("3")

        return jsonify({"specializations": therapistInfo[0], "education": therapistInfo[1], "aboutMe": therapistInfo[2], "availability": therapistInfo[3], "pricing": therapistInfo[4] }), 200
    except Exception as err:
        return {"error":  f"{err}"}