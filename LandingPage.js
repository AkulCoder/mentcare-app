import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Slider from "react-slick";
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import '../presets.css';
import './styles/LandingPage.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import missionImage1 from './assets/images/img4_mission.png';
import missionImage2 from './assets/images/img5_mission.png';
import missionImage3 from './assets/images/img6_mission.png';

function LandingPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [mission, setMission] = useState("");
    const [stages, setStages] = useState({});
    const [faqs, setFaqs] = useState([]);
    const [contact, setContact] = useState({ phone: "", email: "" });
    const [hoveredStage, setHoveredStage] = useState("");
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    // Fetch Testimonials
    useEffect(() => {
        fetch('http://127.0.0.1:5000/testimonials')
            .then(response => response.json())
            .then(data => {
                if (data.Testimonials) {
                    setTestimonials(data.Testimonials);
                }
            })
            .catch(error => console.error('Error fetching testimonials:', error));
    }, []);

    // Fetch Company Data (Mission, Stages, FAQs, and Contact Info)
    useEffect(() => {
        fetch('http://127.0.0.1:5000/companydata')
            .then(response => response.json())
            .then(data => {
                if (data.Mission) {
                    setMission(data.Mission);
                }
                if (data.Stages) {
                    setStages(data.Stages);
                }
                if (data.FAQs) {
                    setFaqs(data.FAQs);
                }
                if (data.Contact) {
                    setContact({
                        phone: data.Contact.Phone || "",
                        email: data.Contact.Email || ""
                    });
                }
            })
            .catch(error => console.error('Error fetching company data:', error));
    }, []);

    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { duration: 800 }
    });

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000
    };

    const nodes = [
        { id: '1', data: { label: 'Access to Care' }, position: { x: 0, y: 0 } },
        { id: '2', data: { label: 'Assessment and Diagnosis' }, position: { x: 0, y: 150 } },
        { id: '3', data: { label: 'Treatment Planning' }, position: { x: 0, y: 300 } },
        { id: '4', data: { label: 'Monitoring and Evaluation' }, position: { x: 0, y: 450 } }
    ];

    const edges = [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e2-3', source: '2', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true }
    ];

    const descriptions = {
        'Access to Care': stages.Stage1 || 'Loading...',
        'Assessment and Diagnosis': stages.Stage2 || 'Loading...',
        'Treatment Planning': stages.Stage3 || 'Loading...',
        'Monitoring and Evaluation': stages.Stage4 || 'Loading...'
    };

    const onNodeMouseEnter = (event, node) => {
        setHoveredStage(node.data.label);
    };

    const onNodeMouseLeave = () => {
        setHoveredStage("");
    };

    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    // Contact Us Bouncing Animation
    const movingContact = useSpring({
        loop: true,
        from: { transform: 'translateX(0%)' },
        to: async (next) => {
            while (true) {
                await next({ transform: 'translateX(80%)' }); // Bounce to the right
                await next({ transform: 'translateX(0%)' }); // Bounce back to the left
            }
        },
        config: { duration: 6000 }, // Smooth animation
    });

    return (
        <div className="landing-page">
            <section className="mission-and-cycle">
                <div className="mission-container">
                    <animated.div className="statement" style={fadeIn}>
                        <h1>Our Mission</h1>
                        <p className="mission-text">{mission}</p>
                        <div className="mission-slider">
                            <Slider {...sliderSettings}>
                                <div>
                                    <img src={missionImage1} alt="Mission 1" className="mission-image" />
                                </div>
                                <div>
                                    <img src={missionImage2} alt="Mission 2" className="mission-image" />
                                </div>
                                <div>
                                    <img src={missionImage3} alt="Mission 3" className="mission-image" />
                                </div>
                            </Slider>
                        </div>
                    </animated.div>
                </div>
                <div className="flow-diagram-container">
                    <h1>Mental Health Care Cycle</h1>
                    <div style={{ height: 600, border: '1px solid #ddd', borderRadius: '10px', padding: '10px' }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            fitView
                            onNodeMouseEnter={onNodeMouseEnter}
                            onNodeMouseLeave={onNodeMouseLeave}
                            nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable={false}
                        >
                            <Controls />
                        </ReactFlow>
                        {hoveredStage && (
                            <div className="hover-description">
                                <strong>{hoveredStage}</strong>
                                <p>{descriptions[hoveredStage]}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <h1>Testimonials</h1>
                <Slider {...sliderSettings}>
                    {testimonials.length > 0 ? (
                        testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <p className="testimonial-content">"{testimonial.Content}"</p>
                                <h4 className="testimonial-username">— {testimonial.Username}</h4>
                            </div>
                        ))
                    ) : (
                        <p>No testimonials available.</p>
                    )}
                </Slider>
            </section>

            <section className="faqs">
                <h1>FAQs</h1>
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${expandedFAQ === index ? 'expanded' : ''}`}
                            onClick={() => toggleFAQ(index)}
                            style={{ cursor: 'pointer', transition: 'all 0.3s ease-in-out' }}
                        >
                            <strong>Q:</strong> {faq.Question}
                            {expandedFAQ === index && (
                                <p className="faq-answer">
                                    <strong>A:</strong> {faq.Answer}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="contact-us">
                <h1>Contact Us</h1>
                <animated.div style={movingContact} className="contact-running">
                    Need Assistance? Call: {contact.phone || "N/A"} or Email: {contact.email || "N/A"}
                </animated.div>
            </section>
        </div>
    );
}

export default LandingPage;
