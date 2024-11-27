import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './styles/TherapistProfile.css';
import '../presets.css';
import { Rating, Slider, Pagination } from '@mui/material';

function TherapistProfile() {
    const { userId } = useParams();
    const [therapistName, setTherapistName] = useState("Loading Name");

    const [specializations, setSpecializations] = useState("Loading specializations");
    const [education, setEducation] = useState("Loading education");
    const [availability, setAvailability] = useState("Loading availability");
    const [aboutMe, setAboutMe] = useState("Loading about me");
    const [pricing, setPricing] = useState("Loading pricing");

    const [specializationsArr, setSpecializationsArr] = useState([]);
    const [educationUpd, setEducationUpd] = useState("Loading education");
    const [availabilityUpd, setAvailabilityUpd] = useState("Loading availability");
    const [aboutMeUpd, setAboutMeUpd] = useState("Loading about me");
    const [pricingUpd, setPricingUpd] = useState("Loading pricing");

    const [reviews, setReviews] = useState();
    const [reviewSummary, setReviewSummary] = useState({ "avgStars": 0, "individualReviews": [{ "fives": 5, "fours": 4, "threes": 3, "twos": 2, "ones": 1 }] });
    const [totalReviews, setTotalReviews] = useState(0);
    const [page, setPage] = useState(1);

    const [editing, setEditing] = useState(0);
    const aboutMeRef = useRef(null);
    const educationRef = useRef(null);
    const availRef = useRef(null);
    const priceRef = useRef(null);
    const specializationRef = useRef(null);


    useEffect(() => {
        fetch(`http://localhost:5000/therapistProfileInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ realUserId: userId }),
        })
            .then(res => res.json())
            .then(data => {
                setTherapistName(data.Therapist[0]);
                setSpecializations(data.Therapist[5]);
                setSpecializationsArr(data.Therapist[5].split(','));
                setEducation(data.Therapist[2]);
                setEducationUpd(data.Therapist[2]);
                setAboutMe(data.Therapist[1]);
                setAboutMeUpd(data.Therapist[1]);
                setAvailability(data.Therapist[3]);
                setAvailabilityUpd(data.Therapist[3]);
                setPricing(data.Therapist[4]);
                setPricingUpd(data.Therapist[4]);
                let totRevs = data.fives + data.fours + data.threes + data.twos + data.ones
                let avgStars = (5 * data.fives + 4 * data.fours + 3 * data.threes + 2 * data.twos + data.ones) / totRevs
                setReviewSummary({ "avgStars": avgStars, "individualReviews": [{ "fives": data.fives, "fours": data.fours, "threes": data.threes, "twos": data.twos, "ones": data.ones }] });
                setTotalReviews(totRevs);
            })
            .catch(err => console.error('Error fetching data:', err));

        fetch(`http://localhost:5000/therapistReviewInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ realUserId: userId, page: page }),
        })
            .then(res => res.json())
            .then(data => {
                setReviews(data.reviews);
            })
            .catch(err => console.error('Error fetching data:', err));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:5000/therapistReviewInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ realUserId: userId, page: page }),
        })
            .then(res => res.json())
            .then(data => {
                setReviews(data.reviews);
            })
            .catch(err => console.error('Error fetching data:', err));
    }, [page]);

    const paginationFunc = (event, value) => {
        setPage(value);
    }

    function selectedSpecialization(e) {
        if (e.target.className === 'grid-spec') {
            e.target.className = 'grid-spec selected-spec';
        }
        else {
            e.target.className = 'grid-spec';
        }

        if (specializationsArr.includes(e.target.value)) {
            setSpecializationsArr(specializationsArr.filter(item => item !== e.target.value));
        }
        else {
            let otherArray = specializationsArr;
            otherArray.push(e.target.value);
            setSpecializationsArr(otherArray);
        }
    }

    const startEditing = (event) => {
        event.preventDefault();
        setSpecializationsArr(specializations.split(','));
        setEducationUpd(education);
        setAboutMeUpd(availability);
        setAvailabilityUpd(aboutMe);
        setPricingUpd(pricing);
        setEditing(1);
    }

    const saveEditing = (event) => {
        event.preventDefault();
        console.log("specializationsArr");
        console.log(specializationsArr.join(','));
        fetch(`http://localhost:5000/therapistUpdateInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                realUserId: userId,
                specializationsArr: specializationsArr.join(','),
                educationUpd: educationUpd,
                aboutMeUpd: aboutMeUpd,
                availabilityUpd: availabilityUpd,
                pricingUpd: pricingUpd
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log("edited save data", data);
                setSpecializations(String(data.specializations));
                setSpecializationsArr(String(data.specializations).split(','));
                setEducation(data.education);
                setAboutMe(data.aboutMe);
                setAvailability(data.availability);
                setPricing(data.pricing);
            })
            .catch(err => console.error('Error fetching data:', err));
        setEditing(0);
    }

    const cancelEditing = (event) => {
        event.preventDefault();
        setSpecializationsArr(specializations.split(','));
        setEditing(0);
    }

    const updText = (event, setFunc) => {
        event.preventDefault();
        setFunc(event.target.value);
    }

    return (
        <>
            <form onSubmit={(event) => saveEditing(event)}>
                <div className="flex-col main-container flex-centered">
                    <div className="flex-row">
                        <div className="flex-col flex-centered thera-prof-top-left">
                            <p>PFP here</p>
                            <p>{therapistName}</p>
                            <Rating name="stars-overview" value={reviewSummary.avgStars} precision={0.1} readOnly />
                        </div>

                        <div className="flex-col flex-centered thera-prof-top-right">
                            <h1>ABOUT ME</h1>
                            <div className={editing ? "hidden" : "flex-col flex-centered"}>
                                <p><strong>Specializations: </strong>{specializations.replace(/,/g, ", ")}</p>
                                <p><strong>Education: </strong>{education}</p>
                                <p>{aboutMe}</p>
                            </div>
                            <div className={editing ? "flex-col flex-centered" : "hidden"}>
                                <div ref={specializationRef} className='grid-specs-container'>
                                    <input type='button' value={'Relationship'} className={specializations.includes("Relationship") ? 'grid-spec selected-spec' : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                    <input type='button' value={'Depression'} className={specializations.includes("Depression") ? 'grid-spec selected-spec' : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                    <input type='button' value={'Addiction'} className={specializations.includes("Addiction") ? 'grid-spec selected-spec' : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                    <input type='button' value={'Anxiety'} className={specializations.includes("Anxiety") ? 'grid-spec selected-spec' : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                    <input type='button' value={'PTSD'} className={specializations.includes("PTSD") ? 'grid-spec selected-spec' : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                    <input type='button' value={'Family Therapy'} className={specializations.includes("Family Therapy") ? "a" : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                    <input type='button' value={'Anger Mgmt.'} className={specializations.includes("Anger Mgmt.") ? 'grid-spec selected-spec' : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                    <input type='button' value={'Confidence'} className={specializations.includes("Confidence") ? 'grid-spec selected-spec' : 'grid-spec'} onClick={(e) => selectedSpecialization(e)}></input>
                                </div>
                                <textarea ref={educationRef} value={educationUpd} onChange={(event) => updText(event, setEducationUpd)}></textarea>
                                <textarea ref={aboutMeRef} value={aboutMeUpd} onChange={(event) => updText(event, setAboutMeUpd)}></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex-col flex-centered thera-prof-mid">
                        <h1>AVAILABILITY</h1>
                        <div className={editing ? "hidden" : "flex-col flex-centered"}>
                            <p>{availability}</p>
                        </div>
                        <div className={editing ? "flex-col flex-centered" : "hidden"}>
                            <textarea ref={availRef} value={availabilityUpd} onChange={(event) => updText(event, setAvailabilityUpd)}></textarea>
                        </div>

                        <h1>PRICING</h1>
                        <div className={editing ? "hidden" : "flex-col flex-centered"}>
                            <p>{pricing}</p>
                        </div>
                        <div className={editing ? "flex-col flex-centered" : "hidden"}>
                            <textarea value={pricingUpd} onChange={(event) => updText(event, setPricingUpd)}></textarea>
                        </div>

                        <button className={(localStorage.getItem("userType") === "Patient") ? "" : "hidden"}>Add/Rem Therapist</button>
                        <h1>Reviews</h1>
                        <div className="flex-centered flex-col">
                            <div className="flex-centered flex-row">
                                5<Rating name="5Stars" value={1} max={1} readOnly />
                                <Slider
                                    value={reviewSummary.individualReviews[0].fives}
                                    max={totalReviews}
                                    sx={{ width: "400px", '& .MuiSlider-thumb': { display: 'none' } }}
                                    disabled />
                            </div>
                            <div className="flex-centered flex-row">
                                4<Rating name="4Stars" value={1} max={1} readOnly />
                                <Slider
                                    value={reviewSummary.individualReviews[0].fours}
                                    max={totalReviews}
                                    sx={{ width: "400px", '& .MuiSlider-thumb': { display: 'none' } }}
                                    disabled />
                            </div>
                            <div className="flex-centered flex-row">
                                3<Rating name="3Stars" value={1} max={1} readOnly />
                                <Slider
                                    value={reviewSummary.individualReviews[0].threes}
                                    max={totalReviews}
                                    sx={{ width: "400px", '& .MuiSlider-thumb': { display: 'none' } }}
                                    disabled />
                            </div>
                            <div className="flex-centered flex-row">
                                2<Rating name="2Stars" value={1} max={1} readOnly />
                                <Slider
                                    value={reviewSummary.individualReviews[0].twos}
                                    max={totalReviews}
                                    sx={{ width: "400px", '& .MuiSlider-thumb': { display: 'none' } }}
                                    disabled />
                            </div>
                            <div className="flex-centered flex-row">
                                1<Rating name="1Stars" value={1} max={1} readOnly />
                                <Slider
                                    value={reviewSummary.individualReviews[0].ones}
                                    max={totalReviews}
                                    sx={{ width: "400px", '& .MuiSlider-thumb': { display: 'none' } }}
                                    disabled />
                            </div>
                        </div>
                        <div className="flex-centered flex-row">
                            {reviews && reviews.map((item, index) => (
                                <div className="flex-centered flex-col" style={{ "marginLeft": "25px", "marginRight": "25px", "marginBottom": "10px" }}>
                                    <div className="flex-centered flex-row">
                                        <p>{item[3]}<br />{item[2]}</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Rating name="1Stars" value={item[1]} max={5} readOnly />
                                    </div>
                                    <p>{item[0]}</p>
                                </div>
                            ))}
                        </div>
                        <Pagination variant="text" shape="rounded" count={Math.ceil(totalReviews / 4)} onChange={paginationFunc} />
                        <button className={(localStorage.getItem("userType") === "Patient") ? "" : "hidden"}>Add Review</button>
                        <button className={(localStorage.getItem("userType") === "Therapist" && editing === 0) ? "" : "hidden"} onClick={(event) => startEditing(event)}>Edit Details</button>
                        <input type="submit" className={(localStorage.getItem("userType") === "Therapist" && editing === 1) ? "" : "hidden"} value="Save Details" />
                        <button className={(localStorage.getItem("userType") === "Therapist" && editing === 1) ? "" : "hidden"} onClick={(event) => cancelEditing(event)}>Cancel Editing</button>
                    </div>

                </div>
            </form>
        </>
    );
};

export default TherapistProfile;