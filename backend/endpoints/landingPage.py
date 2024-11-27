from flask import request, jsonify, json, Blueprint #,render_template, request
from app import mysql

# Feel free to add more imports above

landingPageData = Blueprint('landingPageData', __name__)

# these endpoints heed to have unique names across the entire app (i.e there can only be one "/testimonials" anywhere)
@landingPageData.route('/testimonials')
def index():
    cursor = mysql.connection.cursor()
    # Fetching combined data of users and their testimonials
    cursor.execute("""
        SELECT Users.Username, Testimonials.Content
        FROM Users
        JOIN Testimonials ON Users.UserID = Testimonials.UserID
    """)
    testimonials = cursor.fetchall()
    
    cursor.close()
    
    return jsonify({"Testimonials": testimonials})