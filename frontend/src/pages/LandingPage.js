import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../presets.css';
import './styles/LandingPage.css';


import missionImage1 from './assets/images/img4_mission.png';
import missionImage2 from './assets/images/img5_mission.png';
import missionImage3 from './assets/images/img6_mission.png';

function LandingPage() {
    const navigate = useNavigate();
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/testimonials')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.Testimonials && data.Testimonials.length > 0) {
                    setTestimonials(data.Testimonials);
                } else {
                    console.error('No testimonials found or empty array in the response');
                }
            })
            .catch(error => {
                console.error('Error fetching testimonials:', error);
                setTestimonials([]);
            });
    }, []);

    return (
        <div className="landing-page">
            <section className="statement">
                <div className="statement">
                    <h1>Mission Statement</h1>
                    <p>
                        MentCare is a mental-health care organization dedicated to helping people access some of the best therapists around the world. These therapists conduct mental diagnostic tests and provide personalized health-care tools, resources, and treatment to patients.
                        <br /><br />The mental health care cycle encompasses several key stages to ensure comprehensive support for individuals:
                        <br /><br /><strong>Access to Care:</strong> This initial phase involves recognizing the need for mental health services and overcoming barriers to obtain them.
                        <br /><br /><strong>Assessment and Diagnosis:</strong> Mental health professionals conduct thorough evaluations to understand an individual's psychological state, leading to accurate diagnoses.
                        <br /><br /><strong>Treatment Planning and Implementation:</strong> Based on the assessment, a personalized treatment plan is developed, includes mental therapy, and healthy lifestyle changes.
                        <br /><br /><strong>Monitoring and Evaluation: </strong> Continuous monitoring of the individual's progress allows for adjustments to the treatment plan as needed.
                    </p>
                    <img src={missionImage2} alt="MentCare Mission" className="about-image" />
                    <img src={missionImage1} alt="MentCare Mission" className="about-image" />
                    <img src={missionImage3} alt="MentCare Mission" className="about-image" />
                </div>
            </section>

            <section className="testimonials">
                <h1>Testimonials</h1>
                {testimonials.length > 0 ? (
                    testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial">
                            
                            <p>"{testimonial.Content}" — {testimonial.Username}</p>
                        </div>
                    ))
                ) : (
                    <p>No testimonials available.</p>
                )}
            </section>

            

            <section className="faqs">
                <h1>FAQs</h1>
                <div className="faq-item">
                    <strong>Q:</strong> What is MentCare, and how does it work?<br />
                    <strong>A:</strong> MentCare is a mental health care organization that connects patients with top therapists worldwide. Our therapists provide mental diagnostic tests, personalized health tools, and treatment plans to help patients on their mental health journey. Through our app, you can find and connect with therapists, track progress, and access resources from anywhere.
                </div>
                <div className="faq-item">
                    <strong>Q:</strong> How can I find a therapist that’s right for me?<br />
                    <strong>A:</strong> MentCare uses a detailed matching process to connect you with a therapist suited to your unique needs. During registration, you'll fill out a questionnaire about your preferences and challenges. Based on your responses, we suggest therapists who specialize in areas relevant to you.
                </div>
                <div className="faq-item">
                    <strong>Q:</strong> Is my information secure with MentCare?<br />
                    <strong>A:</strong> Yes, MentCare is committed to maintaining the privacy and confidentiality of all users. We use advanced security protocols to protect your personal information and comply with industry standards for data security and privacy.
                </div>
            </section>

            <section className="contact-us">
                <h1>Contact Us</h1>
                <div>Need Assistance? Call: 123-1234-1234 or Email: mentcareabc@gmail.com</div>
            </section>
        </div>
    );
}

export default LandingPage
