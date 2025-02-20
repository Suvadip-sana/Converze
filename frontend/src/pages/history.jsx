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
                console.log(err.response.data);
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
            setMeetings([])
            console.log("Delete: ", result);

        } catch (err) {
            console.log(err.response.data);
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

        return `${day}.${month}.${year}`

    }


    return (
        <>
            <div className="navbar history-navbar">
                <div className='navbar-first-div'>
                    <h2>Converz</h2>
                </div>

                <div className='history-home'>
                    {
                        (meetings.length > 0) ?
                            // <IconButton onClick={deleteHistory} className='home-btn'>
                            //     <DeleteIcon className='home-icon' />
                            // </IconButton>
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
                        return (
                            // <React.Fragment key={indx}>
                            //     <div>
                            //         <p>Code: {element.meetingcode}</p>
                            //         <span>Date: {formatDate(element.date)}</span>
                            //     </div>
                            //     <hr />
                            // </React.Fragment>

                            <Card key={indx} variant="outlined" className='his-card'>


                                <CardContent className='his-box'>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Meeting Code: <span>{element.meetingcode}</span>
                                    </Typography>

                                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                                        Date: <span>{formatDate(element.date)}</span>
                                    </Typography>

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
