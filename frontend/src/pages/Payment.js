import { Row, Col } from 'react-grid-system';
import { Button, TextField } from '@mui/material';
import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import "./styles/Payment.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Payment() {
    const location = useLocation(); // Get the location object
    const { invoiceID, amountDue, therapistName } = location.state || {}
    const notifySuccess = () => {
        toast('Payment Success!', {
          autoClose: false,
        });
      };
    const notifyFail = () => toast("Payment Failed!");
    // console.log(invoiceID);
    // console.log(amountDue);
    // console.log(therapistName);
    const [formInput, setFormInput] = useState({
        patientId: localStorage.getItem('userID'),
        amount: amountDue,
        cardNum: '',
        cvc: '',
        month: '',
        year: '',
        firstName: '',
        lastName: '',
        city: '',
        billingAddress: '',
        state: '',
        country: '',
        zip: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async () => {
        console.log(formInput);
        const patientId = localStorage.getItem('userID');
        let phone;
        if (formInput.phone) {
            phone = formInput.phone;
        }
        else {
            phone = null;
        }

        const date = new Date(formInput.year, formInput.month, 0);
        const formDate = date.toLocaleDateString('en-CA');
        
        console.log(formDate); 

        const response = await fetch("http://localhost:5000/submitPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                patientId: patientId,
                invoiceId: invoiceID,
                amount: amountDue,
                cardNum: formInput.cardNum,
                cvc: formInput.cvc,
                expDate: formDate,
                firstName: formInput.firstName,
                lastName: formInput.lastName,
                city: formInput.city,
                billingAddress: formInput.billingAddress,
                state: formInput.state,
                country: formInput.country,
                zip: formInput.zip,
                phone: phone,
            }),
        });

        if (response.ok)
        {
            notifySuccess();
            <ToastContainer />
            window.location = "http://localhost:3000";
        }
        else {
            notifyFail();
            <ToastContainer />
        }
        // Handle datepaid on the backend.
    }


    return (
        <div className="payment-page">
            <div className="main-container payment-page">
                <Grid>
                    <Row className="row-spacing title">
                        <Col><h1>Payment</h1></Col>
                    </Row>
                    <Row className="row-spacing title">
                        <Col><h2 style={{ color: 'black' }}>Invoice to: {therapistName}<br/>Amount: {amountDue}$</h2></Col>
                    </Row>
                    <Row>
                        <Col><h2 style={{ color: 'black' }}>Payment Method</h2></Col>
                    </Row>
                    <Row gutterWidth={50}>
                        <Col>Card Number:<br /><TextField required name='cardNum' value={formInput.cardNum} onChange={handleChange} variant='filled' label="Card" /></Col>
                        <Col>Expiration Date:<br />
                            <div style={{ display: "flex", gap: "10px" }}>
                                <TextField required name='month' value={formInput.month} onChange={handleChange} variant='filled' label="Month" size='small'/>
                                <TextField required name='year' value={formInput.year} onChange={handleChange} variant='filled' label="Year" size='small' />
                            </div></Col>
                        <Col>Security Code:<br /><TextField required name='cvc' value={formInput.cvc} onChange={handleChange} variant='filled' size='small' label='Code' /></Col>
                    </Row>
                    <Row gutterWidth={50}>
                        <Col>First Name and Last Name:<br />
                            <div style={{ display: "flex", gap: "10px" }}>
                                <TextField required name='firstName' value={formInput.firstName} onChange={handleChange} variant='filled' label="First" />
                                <TextField required name='lastName' value={formInput.lastName} onChange={handleChange} variant='filled' label="Last" />
                            </div>
                        </Col>
                        <Col>City:<br /><TextField required name='city' value={formInput.city} onChange={handleChange} variant='filled' label='City' /></Col>
                    </Row>
                    <Row gutterWidth={50}>
                        <Col>Billing Address:<br /><TextField required name='billingAddress' value={formInput.billingAddress} onChange={handleChange} variant='filled' label='Billing' /></Col>
                        <Col>State/Province:<br /><TextField required name='state' value={formInput.state} onChange={handleChange} variant='filled' label='Place' /></Col>
                    </Row>
                    <Row gutterWidth={50}>
                        <Col>Country:<br /><TextField required name='country' value={formInput.country} onChange={handleChange} variant='filled' label='Country' /></Col>
                        <Col>Zip or Postal Code:<br /><TextField name='zip' required value={formInput.zip} onChange={handleChange} variant='filled' label='Post' /></Col>
                    </Row>
                    <Row gutterWidth={50} className='row-spacing title'>
                        <Col>Phone Number:<br /><TextField name='phone' value={formInput.phone} onChange={handleChange} variant='filled' label="Number" /></Col>
                    </Row>
                </Grid>
                <Button style={{ marginTop: '20px' }} variant='contained' onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    );
}


export default Payment;