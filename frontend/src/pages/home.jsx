import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useSnackbar } from 'notistack'; // Import Notistack
import { Authcontext } from '../contexts/Authcontext';
import ArrowBackIcon from '@mui/icons-material/ChevronLeftRounded';
import IconButton from '@mui/material/IconButton';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';

function homeComponent() {

    const [meetingCode, setMeetingCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const { enqueueSnackbar } = useSnackbar(); // Get snackbar function

    let navigate = useNavigate();

    const { addToUserHistory } = useContext(Authcontext);

    let handleJoinVideoCall = async () => {

        if (meetingCode.length === 0) {
            return enqueueSnackbar("Please enter meeting code to join meeting!", { variant: "error" });
        }

        if (meetingCode.length > 20) {
            return enqueueSnackbar("Meeting code cannot exceed 20 characters!", { variant: "warning" });
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

    function meetingCodeGenerator() {
        const chars = "abcdefghijkmnopqrstuvwxyz123456789";

        const randomPart = (length) => {
            let result = "";
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        const code = `${randomPart(6)}-${randomPart(6)}-${randomPart(6)}`;

        return code;
    }

    const generateMeetingCode = () => {
        const randomCode = meetingCodeGenerator();
        setGeneratedCode(randomCode);     // Show below
        setMeetingCode(randomCode);       // Auto-fill input
    };

    return (
        <>
            <div className="navbar">
                <div className='navbar-first-div' onClick={() => { navigate("/") }}>
                    {/* <img className='nav-logo' srcSet="/converze.png" alt="" /> */}
                    <span>C</span>
                    <img className='o-logo' srcSet="/t-logo.avif" alt="" />
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
                            {/* <TextField
                                value={meetingCode}
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
                            ></TextField> */}

                            <TextField
                                value={meetingCode}
                                onChange={e => setMeetingCode(e.target.value)}
                                label="Enter meeting code"
                                variant="filled"
                                size="small"
                                className='codeInput'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="Generate code">
                                                <IconButton
                                                    onClick={generateMeetingCode}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "rgba(219, 219, 219, 0.83)",   // circle color
                                                        color: "#5e49c8",                        // icon color (purple)
                                                        borderRadius: "50%",
                                                        width: 36,
                                                        height: 36,
                                                        "&:hover": {
                                                            backgroundColor: "rgba(185, 185, 185, 0.83)"   // slightly darker on hover
                                                        }
                                                    }}

                                                >
                                                    <AutoAwesomeIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        "&:after": { borderBottomColor: "#5e49c8" }
                                    }
                                }}
                            />

                            <Button
                                className='joinCallButton'
                                onClick={handleJoinVideoCall}
                                variant='contained'
                                size='small'
                            >
                                Join call
                            </Button>

                        </div>

                    </div>
                </div>

                <div className="right-side-panel">
                    <img srcSet="/logo.avif" alt="" />
                </div>

            </div>
        </>
    )
}

export default withAuth(homeComponent);