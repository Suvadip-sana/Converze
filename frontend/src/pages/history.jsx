import React, { useContext, useEffect, useState } from 'react'
import { Authcontext } from '../contexts/Authcontext'
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function history() {

    const { getHistoryUser, clearHistory } = useContext(Authcontext);
    const [meetings, setMeetings] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    useEffect(() => {

        const fetchHistory = async () => {
            try {

                const history = await getHistoryUser();
                setMeetings(history);

            } catch (err) {
                console.error(err);
                let message = "Faild to fetch the history!";
                if (err.response) {
                    message = err.response.data.message; // Normal error catch up
                } else if (err.message) {
                    message = err.message; // Special hande to catch "Network error"
                }
                enqueueSnackbar(message, { variant: "error" });
            }
        }

        fetchHistory();

    }, []);


    const deleteHistory = async () => {
        try {
            const result = await clearHistory();
            enqueueSnackbar(result.data.message || "History cleared successfully!", { variant: "success" });
            setMeetings([])

        } catch (err) {
            console.error(err);
            let message = "Faild to delete the history!";
            if (err.response) {
                message = err.response.data.message; // Normal error catch up
            } else if (err.message) {
                message = err.message; // Special hande to catch "Network error"
            }
            enqueueSnackbar(message, { variant: "error" });
        }
    }


    let formatDate = (dateStr) => {

        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 -> 12 for 12 AM

        const formattedDate = `${day}.${month}.${year}`;
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

        return { formattedDate, formattedTime };

    }


    return (
        <>
            <div className="navbar history-navbar">
                <div className='navbar-first-div' onClick={() => { navigate("/") }}>
                    {/* <img className='nav-logo' srcSet="/converze.png" alt="" /> */}
                    <span>C</span>
                    <img className='o-logo' srcSet="/t-logo4.webp" alt="" />
                    <span>nverz</span>
                </div>

                <div className='history-home'>
                    {
                        (meetings.length > 0) ?

                            <Button className='history-delete-btn' onClick={deleteHistory} variant="contained" size="small" startIcon={<DeleteIcon />}>
                                Clear all
                            </Button>
                            :
                            <></>
                    }

                    <IconButton onClick={() => navigate('/home')} className='home-btn'>
                        <HomeIcon className='home-icon' />
                    </IconButton>
                </div>
            </div>

            <div className='display-his'>
                <div className='inner-div'>
                    {
                        (meetings.length !== 0) ? meetings.map((element, indx) => {

                            const { formattedDate, formattedTime } = formatDate(element.date);

                            return (

                                <Card key={indx} variant="outlined" className='his-card'>


                                    <CardContent className='his-box'>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            Meeting Code: <span>{element.meetingcode}</span>
                                        </Typography>

                                        <div className='his-inner-div'>

                                            <Typography sx={{
                                                fontSize: 10,
                                                color: "text.secondary",
                                                display: "flex",
                                                alignItems: "center",  // vertically center icon and text
                                                gap: 0.5,
                                            }}
                                            >
                                                <CalendarMonthIcon className='his-icon' /> <span>{formattedDate}</span>
                                            </Typography>

                                            <Typography sx={{
                                                fontSize: 10,
                                                color: "text.secondary",
                                                display: "flex",
                                                alignItems: "center",  // vertically center icon and text
                                                gap: 0.5,
                                            }}
                                            >
                                                <AccessTimeIcon className='his-icon' /> <span>{formattedTime}</span>
                                            </Typography>

                                        </div>

                                    </CardContent>


                                </Card>
                            )
                        })

                            :

                            <>
                                <div className='no-history'>
                                    <img srcSet="/notfound1.png" alt="" />
                                    <p>No History Found!</p>
                                </div>
                            </>
                    }
                </div>
            </div>
        </>
    )
}
