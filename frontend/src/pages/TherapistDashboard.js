import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';
import { DashboardCard, DashboardCardTitleless } from '../components/DashboardCards.js';
import './styles/TherapistDashboard.css'

// const socket = io('http://localhost:5000');

function TherapistDashboard() {
    const [acceptingStatus, setAcceptingStatus] = useState();
    const [surveyQuestions, setSurveyQuestions] = useState();
    const [constSurveyQuestions, setConstSurveyQuestions] = useState();
    const [patients, setPatients] = useState([]);
    const popupRef = useRef(null);

    useEffect(() => {
        const therapistId = localStorage.getItem("userID");
        console.log("THERAPIST ID: ", therapistId);

        fetch('http://localhost:5000/therapistDashboardData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: therapistId }), // Send therapistId in the body
        })
            .then(res => res.json())
            .then(data => {
                setSurveyQuestions(JSON.parse(data.survey));
                setConstSurveyQuestions(JSON.parse(data.survey));
                setAcceptingStatus(data.accepting);
                console.log(JSON.parse(data.survey));
            })
            .catch(err => console.error('Error fetching data:', err));

        // Listen for new feedback from therapist
        // socket.on('new-feedback', (newFeedback) => {

        // });

        // Listen for new surveys from therapist
        // socket.on('new-survey', (newSurvey) => {

        // });

        // Cleanup on component unmount
        // return () => {
        //     socket.off('new-feedback');
        //     socket.off('new-survey');
        // };
    }, []); // TODO: Add to "[]" so the patients list auto-updates upon new patient adding themself! (Socket.io?)

    useEffect(() => {
        const therapistId = localStorage.getItem("userID");

        fetch('http://localhost:5000/therapistsPatientsList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: therapistId }), // Send therapistId in the body
        })
            .then(res => res.json())
            .then(data => {
                setPatients(data.patientData);
            })
            .catch(err => console.error('Error fetching data:', err));
    }, []); // TODO: Add to "[]" so the patients list auto-updates upon new patient adding themself! (Socket.io?)

    const changeAcceptance = () => {
        const therapistId = localStorage.getItem("userID");

        fetch('http://localhost:5000/therapistsAcceptingStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: therapistId }), // We send the current value of acceptingStatus to the backend
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.inserted === 1) {
                    setAcceptingStatus(data.accepting); // We read the new value of acceptingStatus from the backend
                }
            })
            .catch(err => console.error('Error fetching data:', err));
    }

    const editSurvey = () => {
        popupRef.current.className = 'popUp-background';
    }

    const saveSurvey = (event) => {
        event.preventDefault();
        const therapistId = localStorage.getItem("userID");
        if (surveyQuestions !== constSurveyQuestions) {

            fetch('http://localhost:5000/therapistUpdateSurvey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ therapistId, surveyToSubmit: surveyQuestions }), // We send the current value of acceptingStatus to the backend
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.inserted === true) {
                        popupRef.current.className = 'hidden popUp-background';
                        setConstSurveyQuestions(surveyQuestions);
                    }
                    else {
                        alert("Unable to update survey.");
                    }
                })
                .catch(err => console.error('Error fetching data:', err));
        }
        else {
            alert("Nothing to update.");
        }
    }

    const cancelEditSurvey = () => {
        popupRef.current.className = 'hidden popUp-background';
        setSurveyQuestions(constSurveyQuestions);
    }

    const addSurveyElement = () => {
        const updatedItems = surveyQuestions.filter(item => item.question !== "NEW QUESTION");
        setSurveyQuestions(updatedItems.concat({ "question": "NEW QUESTION", "questionType": "string" }));
    }

    const removeSurveyElement = (elementToRemove) => {
        const updatedItems = surveyQuestions.filter(item => item.question !== elementToRemove);
        setSurveyQuestions(updatedItems);
    }

    const handleChange = (event, questionText) => {
        const updatedQuestions = surveyQuestions.map((question) => {
            if (question.question === questionText) {
                return { ...question, question: event.target.value }; // Update answer for the matching question
            }
            return question; // Keep other questions unchanged
        });
        console.log(updatedQuestions);
        // setSurveyQuestions();
        setSurveyQuestions(updatedQuestions);
    };

    return (
        <>
            <table style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '50%' }}>
                            <div className="flex-row flex-centered main-container">
                                <div className="">
                                    <DashboardCardTitleless extraClasses="margined">
                                        <p onClick={() => changeAcceptance()}>{acceptingStatus ? "START" : "STOP"} ACCEPTING PATIENTS</p>
                                    </DashboardCardTitleless>
                                    <DashboardCard title="Your Survey Questions" extraClasses="margined">
                                        {surveyQuestions && surveyQuestions.map((item, index) => (
                                            <p>{item.question}</p>
                                        ))}
                                        <button type="button" onClick={() => editSurvey()}>Edit Survey</button>
                                    </DashboardCard>
                                    <div ref={popupRef} className="hidden popUp-background">
                                        <div className="popUp flex-row flex-centered main-container">
                                            <h1>Editing Survey</h1>
                                            <form onSubmit={(event) => saveSurvey(event)}>
                                                {surveyQuestions && surveyQuestions.map((item, index) => (
                                                    <>
                                                        <input type="text" id="{index}" name="{index}" value={item.question} onChange={(event) => handleChange(event, item.question)} />
                                                        {/* <div className="flex-row">
                                                        <input type="radio" id={"string_" + index} name={"button" + index} defaultChecked={'string' === item.questionType} value="string" />
                                                        <label htmlFor={"string_" + index}>&nbsp;String</label>
                                                        </div>
                                                        <div className="flex-row">
                                                        <input type="radio" id={"number_" + index} name={"button" + index} defaultChecked={'number' === item.questionType} value="number" />
                                                        <label htmlFor={"number_" + index}>&nbsp;Number</label>
                                                        </div>
                                                        <div className="flex-row">
                                                        <input type="radio" id={"range10_" + index} name={"button" + index} defaultChecked={'range10' === item.questionType} value="range10" />
                                                        <label htmlFor={"range10_" + index}>&nbsp;1 - 10</label>
                                                        </div>
                                                        <div className="flex-row">
                                                        <input type="radio" id={"boolean" + index} name={"button" + index} defaultChecked={'boolean' === item.questionType} value="boolean" />
                                                        <label htmlFor={"boolean" + index}>&nbsp;True or False</label>
                                                        </div> */}
                                                        &nbsp;<button type="button" onClick={() => removeSurveyElement(item.question)}>Remove Question</button>
                                                        <br />
                                                    </>
                                                ))}
                                                <br />
                                                <div className="flex-row flex-centered main-container">
                                                    <button type="button" onClick={() => addSurveyElement()}>Add Question</button>&nbsp;
                                                    <input type="submit" value="Save Survey"></input>&nbsp;
                                                    <button type="button" onClick={() => cancelEditSurvey()}>Cancel Edit</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </td>
                        <td style={{ width: '50%' }}>
                            <h1 style={{ textAlign: 'center' }}>Active Patients</h1>
                            <div className="flex-row flex-centered main-container">
                                <div className="">
                                    {patients && patients.map((item, index) => (
                                        <DashboardCardTitleless key={index} extraClasses="margined">
                                            <p>Name: {item[0]}</p><p>FB: {item[1]}</p>
                                        </DashboardCardTitleless>
                                    ))}
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table >
        </>
    );
}

export default TherapistDashboard;