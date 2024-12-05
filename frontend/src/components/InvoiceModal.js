import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "../pages/styles/Chat.css";

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 200,
	height: 100,
	bgcolor: 'rgba(87, 216, 194)',
	border: '2px solid #000',
	boxShadow: 24,
	textAlign: 'center',
	padding: '0',
	p: 4,
};

export default function BasicModalInvoice({patientId, therapistId}) {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [amount, setAmount] = React.useState('');

	const handleInput = async () => {
		await fetch("http://localhost:5000/sendInvoice", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				patientId: patientId,
				therapistId: therapistId,
				amountDue: amount,
			}),
		});
		handleClose();
	};

	const handleRestrict = (e) => {
		const value = e.target.value;
		if (parseFloat(value) > 0)
		{
			setAmount(value);
		}
	}

	const handlePress = (e) => {
		if (e.key === '-' || e.key === '+') {
			e.preventDefault();
		}
		else if (e.key === 'Enter')
		{
			handleInput();
		}
	}

	return (
		<div>
			<button onClick={handleOpen} className='invoice-button'>Send Invoice</button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="invoice-title"
				aria-describedby="invoice-description"
			>
				<Box sx={style}>
					<>
						<Typography id="modal-modal-title" variant="h5" component="h2">
							Send Invoice
						</Typography>
							<TextField
          					required
          					id="outlined-number"
          					label="Amount Due"
          					defaultValue=""
							type="number"
							onChange={handleRestrict}
							onKeyDown={handlePress}
							slotProps={{
								input: {inputProps: {min: 0}},
							}}
        					/>
					</>
				</Box>
			</Modal>
		</div>
	);
}