import React, { useEffect, useState, useMemo } from 'react';
import Slider from "react-slick";
import ReactFlow, { Background, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
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
    const [hoveredStage, setHoveredStage] = useState(null); 
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    const nodes = useMemo(() => [
        { id: '1', data: { label: 'Access to Care' }, position: { x: 0, y: 0 } },
        { id: '2', data: { label: 'Assessment and Diagnosis' }, position: { x: 0, y: 150 } },
        { id: '3', data: { label: 'Treatment Planning' }, position: { x: 0, y: 300 } },
        { id: '4', data: { label: 'Monitoring and Evaluation' }, position: { x: 0, y: 450 } }
    ], []);

    const edges = useMemo(() => [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' }
    ], []);

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

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000
    };

    const descriptions = {
        'Access to Care': stages.Stage1 || 'Loading...',
        'Assessment and Diagnosis': stages.Stage2 || 'Loading...',
        'Treatment Planning': stages.Stage3 || 'Loading...',
        'Monitoring and Evaluation': stages.Stage4 || 'Loading...'
    };

    const handleMouseEnter = (node) => {
        setHoveredStage(node.data.label);
    };

    const handleMouseLeave = () => {
        setHoveredStage(null);
    };

    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <div className="landing-page">
            <section className="mission-and-cycle">
                <div className="mission-container">
                    <div className="statement">
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
                    </div>
                </div>
                <div className="flow-diagram-container">
                    <h1>Mental Health Care Cycle</h1>
                    <ReactFlowProvider>
                        <div style={{ height: 600, border: '1px solid #ddd', borderRadius: '10px', padding: '10px' }}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                fitView
                                minZoom={1} // Prevent unintended zoom
                                maxZoom={1} // Fix zoom level
                                panOnDrag={false} // Disable dragging
                                zoomOnScroll={false} // Disable zoom on scroll
                                zoomOnPinch={false} // Disable zoom on pinch
                                zoomOnDoubleClick={false} // Disable zoom on double-click
                                nodesDraggable={false} // Disable node dragging
                                nodesConnectable={false} // Disable node connections
                                elementsSelectable={false} // Disable selection
                                onNodeMouseEnter={(event, node) => handleMouseEnter(node)}
                                onNodeMouseLeave={handleMouseLeave}
                            >
                                <Background />
                            </ReactFlow>
                            {hoveredStage && (
                                <div
                                    className="hover-description"
                                    style={{
                                        marginTop: '20px',
                                        padding: '15px',
                                        background: '#f9f9f9',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <strong>{hoveredStage}</strong>
                                    <p>{descriptions[hoveredStage]}</p>
                                </div>
                            )}
                        </div>
                    </ReactFlowProvider>
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
                <div className="contact-static">
                    Need Assistance? Call: {contact.phone || "N/A"} or Email: {contact.email || "N/A"}
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
