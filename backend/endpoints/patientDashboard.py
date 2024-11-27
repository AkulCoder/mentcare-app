from flask import request, jsonify, json, Blueprint #,render_template, request
from app import mysql, socketio, sockets
import json
from datetime import datetime
# If you need socketio stuff maybe uncomment the below line.
# from flask_socketio import SocketIO, join_room, leave_room, send, emit

# Feel free to add more imports


PatientDashboardData = Blueprint('PatientDashboardData', __name__)

@PatientDashboardData.route("/patientDashboardData", methods=['POST'])
def patientDashFunc():
    try:
        totalResults = []
        patientId = request.json.get('patientId')
        cursor = mysql.connection.cursor()
        cursor.execute('''
                SELECT journalID, journalEntry, timeDone FROM journals WHERE patientID = %s
                ''', (patientId, ))
        data = cursor.fetchall()
        if data:
            #print("DATA: ", data)
            columns = [column[0] for column in cursor.description]
            results = [dict(zip(columns, row)) for row in data]
            #print("RESULTS: ", results)
            print("JOURNALS SUCCESSFUL")
            totalResults.append(results)
        else:
            totalResults.append("Nothing")

        cursor.execute('''
                SELECT feedbackID, feedbackDate, feedback FROM feedback WHERE patientID = %s
                ''', (patientId, ))
        feedback_data = cursor.fetchall()
        if feedback_data:
            feedback_columns = [column[0] for column in cursor.description]
            feedback_results = [dict(zip(feedback_columns, row)) for row in feedback_data]
            #print("Feedback RESULTS: ", feedback_results)
            print("FEEDBACK SUCCESSFUL")
            totalResults.append(feedback_results)
        else:
            totalResults.append("Nothing")

        #   Extract incomplete + complete daily surveys        
        cursor.execute('''
                SELECT
                    ds.dailySurveyID,
                    ds.dateCreated,
                    IFNULL(cds.weight, NULL) AS weight,
                    IFNULL(cds.height, NULL) AS height,
                    IFNULL(cds.calories, NULL) AS calories,
                    IFNULL(cds.water, NULL) AS water,
                    IFNULL(cds.exercise, NULL) AS exercise,
                    IFNULL(cds.sleep, NULL) AS sleep,
                    IFNULL(cds.energy, NULL) AS energy,
                    IFNULL(cds.stress, NULL) AS stress
                FROM dailySurveys ds
                LEFT JOIN completedDailySurveys cds
                    ON ds.dailySurveyID = cds.dailySurveyID
                WHERE (cds.dailySurveyID IS NULL)
                    OR (cds.dailySurveyID IS NOT NULL AND cds.patientID = %s)
                ''', (patientId, ))
        daily_survey_data = cursor.fetchall()
        if daily_survey_data:
            daily_survey_columns = [column[0] for column in cursor.description]
            daily_survey_results = [dict(zip(daily_survey_columns, row)) for row in daily_survey_data]
            # print("Daily Survey RESULTS: ", daily_survey_results)
            print("DAILY SURVEYS SUCCESSFUL")
            totalResults.append(daily_survey_results)
        else:
            totalResults.append("Nothing")
        
        #   Extract incomplete therapist survey (if exists)
        cursor.execute('''
                SELECT therapistID FROM therapistPatientsList WHERE patientID = %s AND status = 'Active';
                ''', (patientId, ))
        therapistId = 0
        if(cursor.rowcount > 0):
            therapistId = cursor.fetchone()[0]
        if (therapistId != 0):
            cursor.execute('''
                    SELECT users.userName, JSON_EXTRACT(surveys.content, '$.survey') AS survey, surveys.dateCreated, surveys.surveyID FROM surveys
                    INNER JOIN therapists ON surveys.therapistID = therapists.therapistID
                    INNER JOIN users ON therapists.userID = users.userID
                    WHERE surveys.therapistID = %s AND surveys.patientID = %s;
                ''', (therapistId, patientId ))
            incomp_surveys_data = cursor.fetchall()
            if (incomp_surveys_data):
                incomp_surveys_columns = [column[0] for column in cursor.description]
                incomp_surveys_results = [dict(zip(incomp_surveys_columns, row)) for row in incomp_surveys_data]
                #print("Incomplete Survey RESULTS: ", incomp_surveys_results)
                print("INCOMPLETE THERAPIST SURVEYS SUCCESSFUL")
                totalResults.append(incomp_surveys_results)
            else:
                totalResults.append("Nothing")
        else:
            totalResults.append("Nothing")

        
        #   Extract complete therapist surveys (if exists)
        if therapistId != 0:
            cursor.execute('''
                    SELECT users.userName, JSON_EXTRACT(completedSurveys.questions, '$.survey') AS questions,
                    JSON_EXTRACT(completedSurveys.answers, '$.answers') AS answers, completedSurveys.dateDone , completedSurveys.completionID,
                    completedSurveys.dateDone
                    FROM completedSurveys
                    INNER JOIN therapists ON completedSurveys.therapistID = therapists.therapistID
                    INNER JOIN users ON therapists.userID = users.userID
                    WHERE completedSurveys.patientID = %s and therapists.therapistID = %s;
                    ''', (patientId, therapistId))
            comp_surveys_data = cursor.fetchall()
            if comp_surveys_data:
                comp_surveys_columns = [column[0] for column in cursor.description]
                comp_surveys_results = [dict(zip(comp_surveys_columns, row)) for row in comp_surveys_data]
                print("COMPLETE THERAPIST SURVEYS SUCCESSFUL")
                totalResults.append(comp_surveys_results)
            else:
                totalResults.append("Nothing")
        else:
            totalResults.append("Nothing")

        #   Extract invoices (if exists):
        cursor.execute('''
                SELECT users.userName, invoices.invoiceID, invoices.amountDue, invoices.dateCreated FROM invoices
                INNER JOIN therapists ON invoices.therapistID = therapists.therapistID
                INNER JOIN users ON therapists.userID = users.userID
                WHERE invoices.patientID = %s;
                ''', (patientId, ))
        invoices_data = cursor.fetchall()
        if invoices_data:
            invoices_columns = [column[0] for column in cursor.description]
            invoices_results = [dict(zip(invoices_columns, row)) for row in invoices_data]
            #print("Invoices RESULTS: ", invoices_results)
            print("INVOICES SUCCESSFUL")
            totalResults.append(invoices_results)
        else:
            totalResults.append("Nothing")

        cursor.close()
        return jsonify(totalResults)
    except Exception as err:
        return {"error":  f"{err}"}
    
@PatientDashboardData.route("/saveJournal", methods=['POST'])
def save():
    try:
        journalEntry = request.json.get('journalEntry')
        patientId = request.json.get('patientId')
        journalId = request.json.get('journalId') if request.json.get('journalId') else "null"
        print("Journal ID: " + journalId + "\n")
        cursor = mysql.connection.cursor()
        if journalId == "null":
            currentDate = datetime.now()
            print(currentDate)
            cursor.execute('''
                    INSERT INTO journals (patientID, journalEntry, timeDone)
                    VALUES (%s, %s, %s)
                    ''', (patientId, journalEntry, currentDate))
        else:
            cursor.execute('''
                    UPDATE journals
                    SET journalEntry = %s
                    WHERE patientID = %s AND journalID = %s
                    ''', (journalEntry, patientId, journalId))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message" : "Journal saved successfully"}), 200
    except Exception as err:
        return {"error":  f"{err}"}
    
@PatientDashboardData.route("/sendFeedback", methods=['POST'])
def sendFeedbackFunc():
    try:
        print("GOT HERE")
        patientID = request.json.get('patientId')
        feedback = request.json.get('feedback')
        # Emit the event to the connected socket clients
        socketio.emit('new-feedback', {
            'feedback': feedback
        }, room=sockets[patientID])

        return jsonify({"message": "Success"}), 200
    except Exception as err:
        return jsonify({"error": str(err)}), 500