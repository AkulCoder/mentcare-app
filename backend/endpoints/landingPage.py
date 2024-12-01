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
            INNER JOIN testimonials ON users.userID = testimonials.userID
        """)
        testimonials = cursor.fetchall()
        cursor.close()
        formatted_testimonials = [
            {"Username": row[0], "Content": row[1]} for row in testimonials
        ]
        return jsonify({"Testimonials": formatted_testimonials})
    except Exception as err:
        return {"error": f"{err}"}

# Fetch mission statement, FAQs, and Contact Us data
@landingPageData.route('/companydata', methods=['GET'])
def get_data():
    try:
        cursor = mysql.connection.cursor()
        
        # Fetch mission statement
        cursor.execute("SELECT statement, phone, email FROM mission LIMIT 1")
        mission_data = cursor.fetchone()

        # Fetch FAQs
        cursor.execute("SELECT question, answer FROM company")
        faqs = cursor.fetchall()
        
        cursor.close()

        # Format data
        response = {
            "Mission": mission_data[0] if mission_data else "No mission statement available.",
            "Contact": {
                "Phone": mission_data[1] if mission_data else "No phone available.",
                "Email": mission_data[2] if mission_data else "No email available."
            },
            "FAQs": [{"Question": row[0], "Answer": row[1]} for row in faqs]
        }
        return jsonify(response)
    except Exception as err:
        return {"error": f"{err}"}
