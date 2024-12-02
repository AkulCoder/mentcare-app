from flask import Blueprint, jsonify
from app import mysql

landingPageData = Blueprint('landingPageData', __name__)

# Fetch testimonials
@landingPageData.route('/testimonials', methods=['GET'])
def get_testimonials():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT users.userName, testimonials.content
            FROM users
            JOIN testimonials ON users.userID = testimonials.userID
        """)
        testimonials = cursor.fetchall()
        cursor.close()
        formatted_testimonials = [
            {"Username": row[0], "Content": row[1]} for row in testimonials
        ]
        return jsonify({"Testimonials": formatted_testimonials})
    except Exception as err:
        return {"error": f"{err}"}

# Fetch mission statement, cycle stages, FAQs, and Contact Us data
@landingPageData.route('/companydata', methods=['GET'])
def get_data():
    try:
        cursor = mysql.connection.cursor()
        
        # Fetch mission statement and stages
        cursor.execute("SELECT statement, stage1, stage2, stage3, stage4, phone, email FROM mission LIMIT 1")
        mission_data = cursor.fetchone()

        # Fetch FAQs
        cursor.execute("SELECT question, answer FROM company")
        faqs = cursor.fetchall()
        
        cursor.close()

        # Format data
        response = {
            "Mission": mission_data[0] if mission_data else "No mission statement available.",
            "Stages": {
                "Stage1": mission_data[1] if mission_data else "",
                "Stage2": mission_data[2] if mission_data else "",
                "Stage3": mission_data[3] if mission_data else "",
                "Stage4": mission_data[4] if mission_data else ""
            },
            "Contact": {
                "Phone": mission_data[5] if mission_data else "No phone available.",
                "Email": mission_data[6] if mission_data else "No email available."
            },
            "FAQs": [{"Question": row[0], "Answer": row[1]} for row in faqs]
        }
        return jsonify(response)
    except Exception as err:
        return {"error": f"{err}"}
