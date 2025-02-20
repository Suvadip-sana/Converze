import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import styles from "../styles/videoComponent.module.css"
import { IconButton } from '@mui/material';
import Badge, { badgeClasses } from '@mui/material/Badge';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShareOutlined';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShareOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import TelegramIcon from '@mui/icons-material/Telegram';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


const server_url = "http://localhost:7000";

let connections = {};

const peerConfigConnections = {

    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]

}
const videoMeetComponent = () => {

    let socketRef = useRef();
    let socketIdRef = useRef(); // To store My socket id
    let localVideoRef = useRef(); // To store my video
    let [videoAvailable, setVideoAvailable] = useState(true); // To check is my hardwarewisw camera access was there or not. Default true
    let [audioAvailable, setAudioAvailable] = useState(true); // To check is my hardwarewisw microphone access or not. Default true
    let [video, setVideo] = useState([]); // To handel video on off feature
    let [audio, setAudio] = useState(); // To handel audio on off feature
    let [screen, setScreen] = useState() // To handel screen sharing feature
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState(); // To check is screen share available or not
    let [messages, setMessages] = useState([]);
    let [message, setMessage] = useState("");  // Which message we gonna write
    let [newMessages, setNewMessages] = useState(0); // To show the notifications one by one
    let [askForUsername, setAskForUsername] = useState(true) // It helps when user wants to join as guest
    let [username, setUsername] = useState(localStorage.getItem("user") || "Anonymous") // If user join as not guest then it handel this
    let [meetingCode, setMeetingCode] = useState('');
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);

    // if(isChrome() === false){

    // }

    let routeTo = useNavigate();

    // To get the permission to access the video, audio and screen sharing hardware. 
    const getPermissions = async () => {
        try {

            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            // console.log("Video Permit: ", videoPermission);
            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            // console.log("Audio Permit: ", audioPermission);
            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                // console.log("User Media: ", userMediaStream);

                if (userMediaStream) {

                    window.localStream = userMediaStream;

                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getPermissions();
    }, []);


    // TODO 
    // This func is responsible for --> If I mute my camera or audio then this func is call to mute camera or audio in the all other computer present in the same socket room. 
    let getUserMediaSuccess = (stream) => {
        try {

            window.localStream.getTracks().forEach(track => track.stop()) // First clear all previous track of audio video

        } catch (error) {
            console.log(error);
        }

        window.localStream = stream; // After that new stream was initialized.
        localVideoRef.current.srcObject = stream; // Also ste local video ref into stream. Menas if we stop video then this will not visible anymore.


        for (let id in connections) { // This 'id' and the 'idto' was same 

            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch(e => console.log(e));
            })

        }


        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                console.log("Tracks: ", tracks);

                tracks.forEach(track => track.stop())
            } catch (error) {
                console.log(error);
            }


            // TODO BlackSilence

            let blackSlience = (...args) => new MediaStream([black(...args), silence()]);
            console.log("Black Slience: ", blackSlience);
            window.localStream = blackSlience();
            localVideoRef.current.srcObject = window.localStream;



            for (let id in connections) {
                console.log("Connections ID :", connections[id]);
                connections[id].addStream(window.localStream);
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        }).catch(e => console.log(e));
                })
            }
        });

    }


    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();

        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume();

        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }


    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });

        canvas.getContext('2d').fillRect(0, 0, width, height);

        let stream = canvas.captureStream();

        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }


    // If we on off the audio video permission manually then this func handel this.
    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess) // Will be done latter ---> Get user media success
                .then((stream) => { })
                .catch((e) => {
                    console.log(e);
                })
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (error) {
                console.log(error);
            }
        }
    }


    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [audio, video]);


    // TODO
    let gotMessageFromServer = (fromId, message) => {
        let signal = JSON.parse(message);

        // console.log("Signal: ", signal)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)) // his fromId basically that id which was iterated from the bellow function as "idto"
                    .then(() => {
                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                                }).catch(e => console.log(e));
                            }).catch(e => console.log(e));
                        }
                    }).catch(e => console.log(e));
            }

            if (signal.ice) {
                // console.log("Ice: ", signal.ice)
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }


    // TODO
    let addMessage = (data, sender, socketIdSender) => {

        console.log("Data: ",data);
        console.log("Sende: ", sender);
        console.log("Socket id sender: ", socketIdSender);
        
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data, socketIdSender: socketIdSender }
        ]);

        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1)
        }

    }


    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on("connect", () => {

            socketRef.current.emit("join-call", window.location.href);

            socketIdRef.current = socketRef.current.id; // Set the current user socket id into 'socketIdRef'

            socketRef.current.on("chat-message", addMessage);

            socketRef.current.on("user-left", (id) => {

                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });

            socketRef.current.on("user-joined", (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    connections[socketListId].onicecandidate = (event) => {
                        if (event.candidate != null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ "ice": event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {

                        let videoExists = videoRef.current.find(video => video.socketId == socketListId);
                        // console.log("Video exist: ", videoExists);
                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId == socketListId ? { ...video, stream: event.stream } : video
                                );

                                videoRef.current = updatedVideos;

                                return updatedVideos;
                            })
                        } else {

                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }

                    };

                    if (window.localStream != undefined && window.localStream != null) {
                        connections[socketListId].addStream(window.localStream);
                        // console.log("Window localstream: ", window.localStream);
                    } else {

                        // TODO blackSlience

                        let blackSlience = (...args) => new MediaStream([black(...args), silence()]);

                        window.localStream = blackSlience();
                        connections[socketListId].addStream(window.localStream);

                    }

                })

                if (id === socketIdRef.current) {
                    for (let idto in connections) {
                        if (idto === socketIdRef.current) continue

                        try {
                            connections[idto].addStream(window.localStream);
                        } catch (error) {

                        }

                        connections[idto].createOffer().then((description) => {

                            connections[idto].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit("signal", idto, JSON.stringify({ "sdp": connections[idto].localDescription })) // This generate an letter and send it back to the peer to established the WebRTC connection. This is an crucial part.
                                })
                                .catch((err) => {
                                    console.log(err);
                                });

                        })
                    }
                }
            })
        })
    }


    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);

        connectToSocketServer();
    }


    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    let handleVideo = () => {
        setVideo(!video);
    }

    let handleAudio = () => {
        setAudio(!audio);
    }

    let sendMessage = () => {
        socketRef.current.emit("chat-message", message, username);
        setMessage("");
    }

    let getDisplayMediaSuccess = (stream) => {

        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (error) {
            console.log(error);
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)
            connections[id].createOffer().then((description) => [
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            ])
        }


        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (error) {
                console.log(error);
            }


            // TODO BlackSilence

            let blackSlience = (...args) => new MediaStream([black(...args), silence()]);

            window.localStream = blackSlience();
            localVideoRef.current.srcObject = window.localStream;

            getUserMedia();

        });


    }

    let getDisplayMediaa = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .then((stream) => { })
                    .catch(e => console.log(e))
            }
        }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMediaa();
        }
    }, [screen]);

    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        } catch (error) {
            console.log(error);
        }

        routeTo("/home");
    }


    const chatDisplayRef = useRef(null); // Ref for the chat container

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages]); // Auto-scroll when messages update

    useEffect(() => {
        const code = getMeetingCode();
        setMeetingCode(code);
    }, []);

    const getMeetingCode = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        return parts[parts.length - 1];
        // setMeetingCode(parts.length - 1);
    };

    const MessageBadge = styled(Badge)`
        & .${badgeClasses.badge}{
        top: -15px;
        right: -6px;
        font-size: 12px;
        background-color: #25d366;}`;

    return (
        <div>
            {askForUsername === true ?
                <div className={styles.lobby}>
                    <div className={styles.leftLobby}>
                        <h2 className={styles.lobbyHeading}>Enter into <span>Lobby</span></h2>
                        <div className={styles.details}>
                            <TextField 
                                className={styles.lobbyTextfield} 
                                id="filled-basic" 
                                label="Username" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                size="small" 
                                variant="outlined" 
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#5e49c8" }, // Default outline color
                                        "&:hover fieldset": { borderColor: "#5e49c8" }, // Hover outline color
                                        "&.Mui-focused fieldset": { borderColor: "#5e49c8" }, // Focus outline color
                                    },
                                    "& .MuiInputLabel-root": { color: "#5e49c8" }, // Default label color
                                    "& .MuiInputLabel-root.Mui-focused": { color: "#5e49c8" }, // Focused label color
                                    "& .MuiInputBase-input::placeholder": { color: "#5e49c8" }, // Placeholder color
                                    input: { color: "#5e49c8" },
                                }}
                            />
                            <Button className={styles.lobbyButton} variant="contained" onClick={connect}>Connect</Button>
                        </div>

                        <div className={styles.meetingCode}>
                            <p>Your Meeting Code: <span>{meetingCode}</span></p>
                        </div>

                    </div>
                    

                    <div className={styles.lobbyVideodiv}>
                        <video  className={styles.lobbyVideo} ref={localVideoRef} autoPlay muted></video>
                    </div>

                </div>

                :

                <div className={styles.videoMeetingContainer}>

                    {showModal ?

                        <div className={styles.chatWindow}>
                            <div className={styles.chatContainer}>
                                <div className={styles.chatHead}>
                                    <h2>Converze</h2>
                                    <TelegramIcon/>
                                </div>

                                <div className={styles.chatDisplay} ref={chatDisplayRef}>

                                    {messages.length !== 0 ? messages.map((item, index) => {
                                        const isSender = item.socketIdSender === socketIdRef.current;
                                        return (
                                            <div className={`${styles.chats} ${isSender ? styles.sender : styles.receiver}`} key={index}>
                                                <p className={styles.senderName}>{item.sender}</p>
                                                <p className={styles.data}>{item.data}</p>
                                            </div>
                                        );
                                    }) : (
                                        <div className={styles.noMessage}>
                                            <p>No Messages Yet</p>
                                        </div>
                                    )}

                                </div>

                                <div className={styles.chattingTextfield}>
                                    <TextField 
                                        fullWidth 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)} 
                                        id="fullWidth" 
                                        size="small" 
                                        label="Enter your chat..." 
                                        variant="filled" 
                                        className={styles.chatField}
                                        InputLabelProps={{
                                            sx: {
                                                color: "#9d82ff", // Placeholder color when focused
                                                "&.Mui-focused": { color: "#9274fd" } // Ensures color stays on focus
                                            }
                                        }}
                                        InputProps={{
                                            sx: {
                                                color: "#624ccc",
                                                "&:before": { borderBottomColor: "#624ccc" }, // Default border color
                                                "&:after": { borderBottomColor: "#624ccc" }   // Focused border color
                                            }
                                        }}
                                    />
                                    <Button onClick={sendMessage} disabled={message.trim() === ""} variant="contained" size="medium">Send</Button>
                                </div>
                            </div>
                        </div>

                        :

                        <></>
                    }


                    <div className={styles.buttonContainer}>
                        <IconButton onClick={handleVideo}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} className={styles.CallEndButton}>
                            <CallEndIcon />
                        </IconButton>
                        <IconButton onClick={handleAudio}>
                            {(audio === true) ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton>
                            :
                            <></>
                        }

                        {/* <Badge className={styles.chatBadge} badgeContent={newMessages} max={999} > */}
                        <IconButton onClick={() => setModal(!showModal)}>
                            <ChatIcon />
                            <MessageBadge badgeContent={newMessages} max={999} overlap="circular" color="primary" />
                        </IconButton>
                        {/* </Badge> */}
                    </div>


                    <video className={styles.userMeetingVideo} ref={localVideoRef} autoPlay muted></video>
                    <div className={styles.conferenceView}>
                        {videos.map((video) => (

                            <div className={styles.conferenceInnerDiv} key={video.socketId}>
                                {/* <h2>{video.socketId}</h2> */}
                                <video
                                    data-socket={video.socketId} //'data-socket is not any attribute. Only an variable
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                ></video>
                            </div>

                        ))}
                    </div>

                </div>
            }
        </div>
    );
};

export default videoMeetComponent;