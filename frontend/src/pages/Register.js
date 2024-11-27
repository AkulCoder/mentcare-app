import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../presets.css';
import './styles/Register.css';
import defaultProfilePic from './assets/images/default-profile-pic.jpg';

function Register() {
    const [patientFormVisibility, setPatientFormVisibility] = useState("visible");
    const [therapistFormVisibility, setTherapistFormVisibility] = useState("hidden");
    const [pageOneVisibility, setPageOneVisibility] = useState("visible");
    const [pageTwoVisibility, setPageTwoVisibility] = useState("hidden");
    const [pageThreeVisibility, setPageThreeVisibility] = useState("hidden");
    const [licenseValue, setLicenseValue] = useState('');

    const [patientProfilePic, setPatientProfilePic] = useState(null);
    const [patientProfilePicURL, setPatientProfilePicURL] = useState(defaultProfilePic);
    const [therapistProfilePic, setTherapistProfilePic] = useState(null);
    const [therapistProfilePicURL, setTherapistProfilePicURL] = useState(defaultProfilePic);

    const [hasUpdatedPatientProfilePic, setUpdatedPatientProfilePic] = useState(false);
    const [hasUpdatedTherapistProfilePic, setUpdatedTherapistProfilePic] = useState(false);

    //  Need this to redirect user to their dashboard page
    const navigate = useNavigate();

    const formRefs = useRef({
        patientPageOne: null,
        patientRegister: null,
        therapistRegister: null
    });

    const infoRefs = useRef({
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        license: null,
        tosAgreement: null,
        patientBtn: null,
        therapistBtn: null
    });

    const insuranceRefs = useRef({
        company: null,
        id: null,
        tier: null
    });

    const answersRefs = useRef({
        weight: null,
        height: null,
        calories: null,
        water: null,
        exercise: null,
        sleep: null,
        energy: null,
        stress: null
    });

    const infoTherapistRefs = useRef({
        fname: null,
        lname: null,
        email: null,
        password: null,
        license: null,
        tosAgreement: null,
        gridContainer: null
    });

    async function validateEmail(e, userType) {

        const email = userType === 'Patient' ? infoRefs.current.email.value : infoTherapistRefs.current.email.value;
        try {
            const response = await fetch('http://localhost:5000/validateUserEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.status === 200) {
                console.log("Email is available for registration.");
                return true;
            } else {
                alert("Email already in use!");
                return false;
            }
        } catch (err) {
            console.error('Error during email validation:', err);
            return false;  // In case of error (e.g., network issues)
        }
    }

    async function registerPatient(e) {
        const form = formRefs.current.patientRegister;
        if (form.checkValidity()) {
            const fname = infoRefs.current.firstName.value;
            const lname = infoRefs.current.lastName.value;
            console.log("fname: ", fname)
            console.log("lname: ", lname)
            const email = infoRefs.current.email.value;
            const password = infoRefs.current.password.value;
            const tosAgreement = infoRefs.current.tosAgreement.checked;
            console.log(tosAgreement);
            const company = insuranceRefs.current.company.value;
            const insuranceId = insuranceRefs.current.id.value;
            const tier = insuranceRefs.current.tier.value;
            const weight = answersRefs.current.weight.value;
            const height = answersRefs.current.height.value;
            const calories = answersRefs.current.calories.value;
            const water = answersRefs.current.water.value;
            const exercise = answersRefs.current.exercise.value;
            const sleep = answersRefs.current.sleep.value;
            const energy = answersRefs.current.energy.value;
            const stress = answersRefs.current.stress.value;
            const profileImg = hasUpdatedPatientProfilePic ? patientProfilePic : null;

            const formData = new FormData();
            formData.append('fname', fname);
            formData.append('lname', lname);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('company', company);
            formData.append('insuranceId', insuranceId);
            formData.append('tier', tier);
            formData.append('weight', weight);
            formData.append('height', height);
            formData.append('calories', calories);
            formData.append('water', water);
            formData.append('exercise', exercise);
            formData.append('sleep', sleep);
            formData.append('energy', energy);
            formData.append('stress', stress);
            console.log(profileImg.filename);
            formData.append('profileImg', profileImg, profileImg.filename);

            try {
                const response = await fetch('http://localhost:5000/registerPatient', {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const data = await response.json()
                    localStorage.setItem('userID', data.patientID);
                    localStorage.setItem('realUserID', data.userID)
                    localStorage.setItem('userType', 'Patient');
                    navigate('/dashboard');
                    return true;
                } else {
                    alert("Patient Registration Failed. Try Again!");
                    return false;
                }
            } catch (err) {
                console.error('Error duing patient registration:', err);
                return false;  // In case of error (e.g., network issues)
            }

            // fetch('http://localhost:5000/registerPatient', {
            //     method: 'POST',
            //     body: formData,
            // })
            //     .then((res) => {
            //         if (!res.ok) {

            //         }
            //         return res.json();
            //     })
            //     .then(data => {
            //         //console.log("UserID: ", data.userID);
            //         localStorage.setItem('userID', data.patientID);
            //         localStorage.setItem('realUserID', data.userID)
            //         localStorage.setItem('userType', 'Patient');
            //         navigate('/dashboard');

            //     })
            //     .catch(err => console.error('Error updating rental:', err));
        }
        else {
            form.reportValidity();
        }
    }

    async function registerTherapist(e) {
        const form = formRefs.current.therapistRegister;
        if (form.checkValidity()) {
            const isEmailValid = await validateEmail(e, 'Therapist');
            if (isEmailValid) {
                const specsArr = infoTherapistRefs.current.gridContainer.children;
                let specializations = []
                Array.from(specsArr).forEach(element => {
                    if (element.className === 'grid-spec selected-spec') {
                        specializations.push(element.value);
                    }
                });
                const fname = infoTherapistRefs.current.fname.value;
                const lname = infoTherapistRefs.current.lname.value;
                const email = infoTherapistRefs.current.email.value;
                const password = infoTherapistRefs.current.password.value;
                const license = infoTherapistRefs.current.license.value;
                const profileImg = hasUpdatedTherapistProfilePic ? therapistProfilePic : null;

                const formData = new FormData();
                formData.append('fname', fname);
                formData.append('lname', lname);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('license', license);
                formData.append('specializations', specializations.join(','));
                formData.append('profileImg', profileImg, profileImg.filename);

                try {
                    const response = await fetch('http://localhost:5000/registerTherapist', {
                        method: 'POST',
                        body: formData,
                    });
                    if (response.ok) {
                        const data = await response.json()
                        localStorage.setItem('userID', data.therapistID);
                        localStorage.setItem('realUserID', data.userID)
                        localStorage.setItem('userType', 'Therapist');
                        localStorage.setItem('isActive', true);
                        navigate('/dashboard');
                        return true;
                    } else {
                        alert("Therapist Registration Failed. Try Again!");
                        return false;
                    }
                } catch (err) {
                    console.error('Error duing therapist registration:', err);
                    return false;  // In case of error (e.g., network issues)
                }

                // fetch('http://localhost:5000/registerTherapist', {
                //     method: 'POST',
                //     body: formData,
                // })
                //     .then((res) => {
                //         if (res.ok) {
                //             localStorage.setItem('userType', 'Therapist');
                //             navigate('/dashboard');
                //         }
                //         return res.json();
                //     })
                //     .then(data => {
                //         // console.log("UserID: ", data.userID);
                //         localStorage.setItem('userID', data.therapistID);
                //         localStorage.setItem('realUserID', data.userID)

                //     })
                //     .catch(err => console.error('Error updating rental:', err));
            }
        }
        else {
            form.reportValidity();
        }
    }

    function changeUserRegister(btn) {
        if (infoRefs.current.therapistBtn && infoRefs.current.patientBtn) {
            if (btn) {
                //  Swith to therapist button & de-select patient button
                infoRefs.current.therapistBtn.className = 'pt-button selected-pt-btn';
                infoRefs.current.patientBtn.className = 'pt-button';
                hidePatientForm();
            } else {
                //  Do the opposite
                infoRefs.current.therapistBtn.className = 'pt-button';
                infoRefs.current.patientBtn.className = 'pt-button selected-pt-btn';
                displayPatientForm();
            }
        }
    }

    //  Used to make the patient registration form visible
    function displayPatientForm() {
        setPatientFormVisibility("visible");
        setTherapistFormVisibility("hidden");
    }
    //  Used to hide the patient registration form
    function hidePatientForm() {
        setPatientFormVisibility("hidden");
        setTherapistFormVisibility("visible");
    }

    async function goToNextPage(e, page) {
        e.preventDefault();
        const form = formRefs.current.patientPageOne;
        if (form.checkValidity()) {
            if (page === 1) {
                const isEmailValid = await validateEmail(e, 'Patient');
                if (isEmailValid) {
                    if (pageOneVisibility === 'visible') {
                        setPageOneVisibility('hidden');
                        setPageTwoVisibility('visible');
                        setPageThreeVisibility('hidden');
                    }
                    else if (pageTwoVisibility === 'visible') {
                        setPageOneVisibility('hidden');
                        setPageTwoVisibility('hidden');
                        setPageThreeVisibility('visible');
                    }
                }
            }
            else {
                if (pageOneVisibility === 'visible') {
                    setPageOneVisibility('hidden');
                    setPageTwoVisibility('visible');
                    setPageThreeVisibility('hidden');
                }
                else if (pageTwoVisibility === 'visible') {
                    setPageOneVisibility('hidden');
                    setPageTwoVisibility('hidden');
                    setPageThreeVisibility('visible');
                }
            }
        }
        else {
            form.reportValidity();
        }
    }

    function goToPreviousPage() {
        if (pageTwoVisibility === 'visible') {
            setPageOneVisibility('visible');
            setPageTwoVisibility('hidden');
            setPageThreeVisibility('hidden');
        }
        else if (pageThreeVisibility === 'visible') {
            setPageOneVisibility('hidden');
            setPageTwoVisibility('visible');
            setPageThreeVisibility('hidden');
        }
    }

    function selectedSpecialization(e) {
        if (e.target.className === 'grid-spec') {
            e.target.className = 'grid-spec selected-spec';
        }
        else {
            e.target.className = 'grid-spec';
        }
    }

    function handleNumberFieldInput(e) {
        const inputValue = e.target.value.toString();
        const numericValue = inputValue.replace(/[^0-9]/g, '');
        setLicenseValue(String(numericValue));
    }

    function handleImageFileChange(event, user) {
        const file = event.target.files[0]; // Get the first file
        if (file) {
            // Create a URL for the selected file
            console.log(file);
            const fileURL = URL.createObjectURL(file);
            console.log(fileURL)
            if (user === 'Patient') {
                setUpdatedPatientProfilePic(true);
                setPatientProfilePicURL(fileURL)
                setPatientProfilePic(file);
            } else {
                setUpdatedTherapistProfilePic(true);
                setTherapistProfilePicURL(fileURL)
                setTherapistProfilePic(file);
            }
        }
    };

    return (
        <>
            {/* Patient Registration Form */}
            <div className={patientFormVisibility}>

                {/* PAGE 1 OF 3 */}
                <div className={`register-form flex-col ${pageOneVisibility}`}>
                    <div className='flex-col flex-centered'>
                        <h1 className='title'>REGISTER</h1>
                        <div className='subtitle'>Are you a...</div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <input type='button' value={'PATIENT'} className=' pt-button selected-pt-btn' ref={el => (infoRefs.current.patientBtn = el)} onClick={() => { changeUserRegister(0) }}></input>
                            <input type='button' value={'THERAPIST'} className='pt-button ' ref={el => (infoRefs.current.therapistBtn = el)} onClick={() => { changeUserRegister(1) }}></input>
                        </div>
                    </div>

                    <form onSubmit={goToNextPage} ref={el => (formRefs.current.patientPageOne = el)}>
                        <div className='flex-row' style={{ gap: '40px' }}>
                            <div className='patient-input-container'>
                                <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                    <div className='flex-col'>
                                        <label>First Name</label>
                                        <input type="text" required ref={el => (infoRefs.current.firstName = el)} className='userNameInput userInput'></input>
                                    </div>

                                    <div className='flex-col'>
                                        <label>Last Name</label>
                                        <input type="text" required ref={el => (infoRefs.current.lastName = el)} className='userNameInput userInput'></input>
                                    </div>
                                </div>

                                <div className='flex-col'>
                                    <label>Email</label>
                                    <input type="text" required ref={el => (infoRefs.current.email = el)} className='userInput'></input>
                                </div>

                                <div className='flex-col'>
                                    <label>Password</label>
                                    <input type="password" required ref={el => (infoRefs.current.password = el)} className='userInput'></input>
                                </div>

                                <div className='flex-centered'>
                                    <input type='checkbox' required name='checkboxInput' ref={el => (infoRefs.current.tosAgreement = el)}></input>
                                    <label htmlFor='checkboxInput'>
                                        I agree to the Terms of Service.
                                    </label>
                                </div>
                            </div>
                            <div className='profile-pic-container'>
                                <div className="img-circle-mask">
                                    <img src={patientProfilePicURL} alt='PROFILE PIC' height={100} width={100} className="profile-pic" />
                                </div>
                                <div>Upload Profile Picture</div>
                                <input type="file" style={{ width: "180px" }} onChange={(e) => handleImageFileChange(e, 'Patient')} />
                            </div>
                        </div>
                    </form>

                    <div className='flex-col' style={{ alignItems: "center" }}>
                        <button className='pageBtn' onClick={(e) => goToNextPage(e, 1)}>NEXT</button>
                    </div>
                </div >

                {/* PAGE 2 OF 3 */}
                < div className={`register-form flex-col flex-centered ${pageTwoVisibility}`}>
                    <div className='flex-col flex-centered'>
                        <h1 className='title'>REGISTER</h1>
                        <div className='subtitle'>Health Insurance (OPTIONAL)</div>
                    </div>

                    <div className='flex-col' style={{ gap: '20px', width: '300px' }}>
                        <div className='flex-col'>
                            <label>Insurance Company</label>
                            <input type="text" ref={el => (insuranceRefs.current.company = el)} className='userInput'></input>
                        </div>

                        <div className='flex-col'>
                            <label>Insurance ID</label>
                            <input type="text" ref={el => (insuranceRefs.current.id = el)} className='userInput'></input>
                        </div>

                        <div className='flex-col'>
                            <label>Insurance Tier</label>
                            <input type="text" ref={el => (insuranceRefs.current.tier = el)} className='userInput'></input>
                        </div>
                    </div>

                    <div className='flex-row flex-centered'>
                        <input className='pageBtn' type='button' value={'BACK'} onClick={() => goToPreviousPage()}></input>
                        <input className='pageBtn' type='button' value={'NEXT'} onClick={(e) => goToNextPage(e, 2)}></input>
                    </div>
                </div >

                {/* PAGE 3 OF 3 */}
                < div className={`register-form flex-col ${pageThreeVisibility}`}>
                    <div className='flex-col flex-centered'>
                        <h1 className='title'>REGISTER</h1>
                        <div className='subtitle'>Initial Questionnaire</div>
                    </div>
                    <form onSubmit={registerPatient} ref={el => (formRefs.current.patientRegister = el)}>
                        <div>
                            <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                <label>What is your current weight? (in pounds)</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.weight = el)}></input>
                            </div>

                            <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                <label>How tall are you? (in feet)</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.height = el)}></input>
                            </div>

                            <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                <label>On average, how many calories do you consume per day? (in kcal)</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.calories = el)}></input>
                            </div>

                            <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                <label>How many liters of water do you drink daily?</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.water = el)}></input>
                            </div>

                            <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                <label>How many minutes do you exercise each day on average?</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.exercise = el)}></input>
                            </div>

                            <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                <label>How many hours of sleep do you get per night on average?</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.sleep = el)}></input>
                            </div>

                            <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                <label>On a scale of 1 to 10, how would you rate your energy level this week?</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.energy = el)}></input>
                            </div>

                            <div className='flex-row ' style={{ justifyContent: 'space-between' }}>
                                <label>On a scale of 1 to 10, how would you rate your stress level this week?</label>
                                <input type="number" required className='userIntInput' ref={el => (answersRefs.current.stress = el)}></input>
                            </div>
                        </div>
                    </form>

                    <div className='flex-row flex-centered'>
                        <button className='pageBtn' onClick={() => goToPreviousPage()}>BACK</button>
                        <button className='registerBtn' onClick={(e) => registerPatient(e)}>REGISTER</button>
                    </div>
                </div >
            </div >

            {/* Therapist Registration Form */}
            < div className={therapistFormVisibility} >
                <div className='register-form flex-col'>
                    <div className='register-pic-container'>
                        <div className='flex-col' style={{ alignItems: 'center' }}>
                            <h1 className='title'>REGISTER</h1>
                            <div className='subtitle'>Are you a...</div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <input type='button' value={'PATIENT'} className=' pt-button selected-pt-btn' ref={el => (infoRefs.current.patientBtn = el)} onClick={() => { changeUserRegister(0) }}></input>
                                <input type='button' value={'THERAPIST'} className='pt-button ' ref={el => (infoRefs.current.therapistBtn = el)} onClick={() => { changeUserRegister(1) }}></input>
                            </div>
                        </div>
                        <div className='profile-pic-container'>
                            <div className="img-circle-mask">
                                <img src={therapistProfilePicURL} alt='PROFILE PIC' height={100} width={100} className='profile-pic' />
                            </div>
                            <div>Upload Profile Picture</div>
                            <input type="file" style={{ width: "180px" }} onChange={(e) => handleImageFileChange(e, 'Therapist')} />
                        </div>
                    </div>
                    <form onSubmit={registerTherapist} ref={el => (formRefs.current.therapistRegister = el)}>
                        <div className='therapist-input-container'>
                            <div className='flex-col' style={{ gap: '10px' }}>
                                <div className='flex-col'>
                                    <label>First Name</label>
                                    <input type="text" required ref={el => (infoTherapistRefs.current.fname = el)} className='userInput'></input>
                                </div>

                                <div className='flex-col'>
                                    <label>Last Name</label>
                                    <input type="text" required ref={el => (infoTherapistRefs.current.lname = el)} className='userInput'></input>
                                </div>

                                <div className='flex-col'>
                                    <label>Email</label>
                                    <input type="text" required ref={el => (infoTherapistRefs.current.email = el)} className='userInput'></input>
                                </div>

                                <div className='flex-col'>
                                    <label>Password</label>
                                    <input type="password" required ref={el => (infoTherapistRefs.current.password = el)} className='userInput'></input>
                                </div>
                            </div>

                            <div className='flex-col' style={{ gap: '10px' }}>
                                <div className='flex-col'>
                                    <label>License Number</label>
                                    <input
                                        type="text"
                                        required
                                        ref={el => (infoTherapistRefs.current.license = el)}
                                        className='userInput'
                                        value={licenseValue}
                                        onChange={(e) => handleNumberFieldInput(e)}
                                    />
                                </div>
                                <div>
                                    <label>Specializations</label>
                                    <div className='grid-specs-container' ref={el => (infoTherapistRefs.current.gridContainer = el)}>
                                        <input type='button' value={'Relationship'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                        <input type='button' value={'Depression'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                        <input type='button' value={'Addiction'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                        <input type='button' value={'Anxiety'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                        <input type='button' value={'PTSD'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                        <input type='button' value={'Family Therapy'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                        <input type='button' value={'Anger Mgmt.'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                        <input type='button' value={'Confidence'} className='grid-spec' onClick={(e) => selectedSpecialization(e)}></input>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='flex-centered checkboxInput' style={{ marginTop: '20px' }}>
                            <input type='checkbox' name='checkboxInput' required ref={el => (infoTherapistRefs.current.tosAgreement = el)}></input>
                            <label htmlFor='checkboxInput'>
                                I agree to the Terms of Service.
                            </label>
                        </div>
                    </form>

                    <div className='flex-col flex-centered'>
                        <button className='registerBtn' onClick={(e) => registerTherapist(e)}>REGISTER</button>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Register;