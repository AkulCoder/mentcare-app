import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../presets.css';
import './styles/Login.css';

function Login() {
    const inputRefs = useRef({
        email: null,
        password: null
    });

    //  Need this to redirect user to their dashboard page
    const navigate = useNavigate();

    function checkLogin(e) {
        e.preventDefault();
        const email = inputRefs.current.email.value;
        const password = inputRefs.current.password.value;
        console.log(email);
        console.log(password);

        /*
        // Here, you can add your login logic (e.g., checking email and password)
        if (email === 'test@example.com' && password === 'password123') {
            // On successful login, redirect to dashboard
            navigate('/dashboard');
        } else {
            // Handle incorrect credentials (e.g., show an error message)
            alert('Invalid credentials');
        }
        */

        fetch('http://localhost:5000/patientOrTherapist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.userType);
                console.log(data.realUserID);
                console.log(data.userID);
                // if (data.userType === 'Patient' || data.userType === 'Therapist') {
                //     if (data.userType === 'Therapist') {
                //         localStorage.setItem('isActive', data.isActive);
                //         if (data.isActive === 0) {
                //             navigate('/deactivated');
                //             return;
                //         }
                //     }
                //     localStorage.setItem('userType', data.userType);
                //     localStorage.setItem('userID', data.userID);
                //     localStorage.setItem('realUserID', data.realUserID)
                //     console.log(localStorage.getItem('userID'));
                //     navigate('/dashboard');
                // }


                if (data.userType === 'Patient') {
                    localStorage.setItem('userType', data.userType);
                    localStorage.setItem('userID', data.userID);
                    localStorage.setItem('realUserID', data.realUserID)
                    console.log(localStorage.getItem('userID'));
                    navigate('/dashboard');
                }
                else if (data.userType === 'Therapist') {
                    localStorage.setItem('userType', data.userType);
                    localStorage.setItem('userID', data.userID);
                    localStorage.setItem('realUserID', data.realUserID)
                    localStorage.setItem('isActive', data.isActive);
                    if (data.isActive === 0) {
                        navigate('/deactivated');
                    }
                    else {
                        navigate('/dashboard');
                    }
                }
            })
            .catch(err => console.error('Error fetching data:', err));
    }

    return (
        <div className="default-form-container">
            <h1>LOG IN</h1>
            <form>
                <div className='flex-col emailInput'>
                    <label>Email</label>
                    <input type="text" ref={el => (inputRefs.current.email = el)} required={true}></input>
                </div>

                <div className='flex-col passInput'>
                    <label>Password</label>
                    <input type="password" ref={el => (inputRefs.current.password = el)}></input>
                    <Link to={'/forgot_password'}>Forgot Password?</Link>
                </div>

                <div className='flex-col flex-centered margin-top-15'>
                    <input className='loginBtn' type='submit' value={'LOG IN'} onClick={(e) => checkLogin(e)}></input>
                    <div className='flex-row flex-centered'>
                        New to MentCare?&nbsp;
                        <Link to={'/register'}>Register Now</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;