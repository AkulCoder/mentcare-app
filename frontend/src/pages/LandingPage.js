import './styles/LandingPage.css';
import React, { useState, useEffect } from "react";
import { Row, Col } from 'react-grid-system';
import Grid from '@mui/material/Grid2';
import VideoPlayer from '../components/VideoPlayer';
import { Link } from 'react-router-dom';
import FadeInSection from '../components/FadeInSection';

function LandingPage() {
    const [openQuestion, setOpenQuestion] = useState(null);
    const [testimonials, setTestimonials] = useState([]);

    const toggleQuestion = (index) => {
        setOpenQuestion((openQuestion === index) ? null : index);
    };

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch("http://localhost:5000/getTestimonials");
                const data = await response.json();
                console.log("Fetched testimonials:", data);
                setTestimonials(data);
            } catch (error) {
                console.error("No testimonials", error);
            }
        };
        fetchTestimonials();
    }, []);

    console.log("Fetched testimonials:", testimonials);


    return (
        <div className="landing-page">
            <div className="video-section">
                <div className="video">{VideoPlayer()}</div>
                <div className='video-text animation'>
                    <FadeInSection>
                        <h1>Welcome to MentCare</h1>
                        <h1>Your Journey to Wellness starts here</h1>
                        <Link to="/register">
                            <button className="send-button">Register Now</button>
                        </Link>
                    </FadeInSection>
                </div>
            </div>
            <div className="content-container flex-col">
                {/* <Row className="row-spacing">
                        <Col>
                            <Link to="/register">
                                <button className="send-button">Register Now</button>
                            </Link>
                        </Col>
                    </Row> */}

                <FadeInSection>
                    <Row className="row-spacing" >
                        <Col md={6} className='about-us'>
                            <h2>About Us</h2>
                            <p>
                                At MentCare, our mission is to create a safe, supportive, and accessible online space where individuals can prioritize their mental well-being. By connecting patients with licensed therapists through secure and meaningful interactions, we aim to empower users to overcome challenges, develop resilience, and lead fulfilling lives. <br /> <br />
                                Through our platform, we provide a confidential environment where patients can openly communicate with therapists via chat, receive personalized advice, and gain tools to navigate their mental health journey. Our commitment is to make professional mental health support more accessible, fostering a community of care and understanding in a digital world. <br /> <br />
                                At MentCare, we believe that everyone deserves compassionate support and the opportunity to thrive.
                            </p>
                        </Col>
                        <Col md={6}>
                            <div><img src="/Mentcare-Symbol.png" alt="image" width={350} height={350} /></div>
                        </Col>
                    </Row>
                </FadeInSection>

                <FadeInSection>
                    <div className="testimonial-users-section" >
                        <h2>Hear Our Happy Users!</h2>
                        <div className="testimonial-users-container">
                            {testimonials.map((testimonial, index) => (
                                <div className={`testimonial-user ${(index % 2 === 0) ? "left" : "right"}`} key={testimonial.id}>
                                    <div className="profile-picture">{(testimonial.img === null) ? <img src='/assets/images/default-profile-pic.jpg' width={100} height={100}></img> : testimonial.img}</div>
                                    <div className="testimonial">{testimonial.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="faq-section" >
                        <h2>FAQs</h2>
                        <div className="faq-container">
                            <div className={`faq-bubble ${(openQuestion === 0) ? "open" : ""}`} onClick={() => toggleQuestion(0)}>
                                <div className="faq-question">How many people are we helping?</div>
                                {(openQuestion === 0) && (
                                    <div className="faq-answer">MILLIONS!</div>
                                )}
                            </div>
                            <div className={`faq-bubble ${(openQuestion === 1) ? "open" : ""}`} onClick={() => toggleQuestion(1)}>
                                <div className="faq-question">Are we legit?</div>
                                {(openQuestion === 1) && (
                                    <div className="faq-answer">Of course.</div>
                                )}
                            </div>
                            <div className={`faq-bubble ${(openQuestion === 2) ? "open" : ""}`} onClick={() => toggleQuestion(2)}>
                                <div className="faq-question">Do we make a lot of money?</div>
                                {(openQuestion === 2) && (
                                    <div className="faq-answer">No.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div >
                        <h2 style={{ textAlign: 'center' }}>Contact Us</h2>
                        <Row className="row-spacing">
                            <Col md={6}>
                                <h2>Leave a review!</h2>
                                <textarea placeholder="Enter review" className="review-box"></textarea>
                                <button className="send-button">Send</button>
                            </Col>
                            <Col md={6}>
                                <div>
                                    <h2>Need Assistance?</h2>
                                    <p>Call: 111-222-3333</p>
                                    <p>Email: mentcare@gmail.com</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
};

export default LandingPage;
