import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
// import { IconButton } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useSnackbar } from 'notistack'; // Import Notistack
import { Authcontext } from '../contexts/Authcontext';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIcon from '@mui/icons-material/ChevronLeftRounded';
import IconButton from '@mui/material/IconButton';




function homeComponent() {

    const [meetingCode, setMeetingCode] = useState("");
    const { enqueueSnackbar } = useSnackbar(); // Get snackbar function

    let navigate = useNavigate();


    const { addToUserHistory } = useContext(Authcontext);

    let handleJoinVideoCall = async () => {

        if (meetingCode.length === 0) {
            return enqueueSnackbar("Please enter meeting code to join meeting!", { variant: "error" });
        }

        if (meetingCode.length > 15) {
            return enqueueSnackbar("Meeting code cannot exceed 15 characters!", { variant: "error" });
        }

        try {
            const result = await addToUserHistory(meetingCode);
        } catch (err) {
            console.error(err);
            let message = "Faild to update history!";
            if (err.response) {
                message = err.response.data.message; // Normal error catch up
            } else if (err.message) {
                message = err.message; // Special hande to catch "Network error"
            }
            enqueueSnackbar(message, { variant: "error" });
        }
        navigate(`/${meetingCode}`);
    }


    return (
        <>
            <div className="navbar">
                <div className='navbar-first-div'>
                    {/* <img className='nav-logo' srcSet="/converze.png" alt="" /> */}
                    <span>C</span>
                    <img className='o-logo' srcSet="/t-logo4.png" alt="" />
                    <span>nverz</span>
                </div>

                <div className='navbar-second-div'>

                    <Button className='back-btn' variant="outlined" size="small" onClick={() => navigate("/")} startIcon={<ArrowBackIcon />}>
                        Back
                    </Button>

                    <Button className='history-btn' onClick={() => navigate('/history')} size="small" variant="outlined" startIcon={<RestoreIcon />}>
                        History
                    </Button>

                    <Button size="small" className='logout-btn' onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("id");
                        localStorage.removeItem("user");
                        enqueueSnackbar("You are logged out now!", { variant: "success" });
                        navigate("/auth");
                    }}>
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meet-container">

                <div className="left-side-panel">
                    <div className='left-side-inner-div'>
                        <span className='bbbb'>Providing</span><h2> Quality Video Call</h2>
                        <div className="left-inner-div">
                            <TextField
                                onChange={e => setMeetingCode(e.target.value)}
                                label="Enter meeting code"
                                variant="filled"
                                size='small'
                                InputLabelProps={{
                                    sx: {
                                        // color: "#5e49c8", // Placeholder color when focused
                                        "&.Mui-focused": { color: "#5e49c8" } // Ensures color stays on focus
                                    }
                                }}
                                InputProps={{
                                    sx: {
                                        // "&:before": { borderBottomColor: "#5e49c8" }, // Default border color
                                        "&:after": { borderBottomColor: "#5e49c8" }   // Focused border color
                                    }
                                }}
                            ></TextField>
                            <Button onClick={handleJoinVideoCall} variant='contained' size='small'>Join call</Button>
                        </div>
                    </div>
                </div>

                <div className="right-side-panel">
                    <img srcSet="/logo4.png" alt="" />
                </div>

            </div>
        </>
    )
}


export default withAuth(homeComponent);