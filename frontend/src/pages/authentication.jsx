import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSnackbar } from 'notistack'; // Import Notistack
import { Authcontext } from '../contexts/Authcontext';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';



// Default MUI theme
const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar(); // Get snackbar function
    const { handleRegister, handleLogin } = React.useContext(Authcontext);

    const router = useNavigate();


    // Placeholder functions for authentication
    const handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password);
                enqueueSnackbar(result || "Login successful!", { variant: "success" });
                router("/home");

            } else {
                let result = await handleRegister(name, username, password);
                enqueueSnackbar(result || "Registration successful!", { variant: "success" });
                setFormState(0);
                setUsername('');
                setPassword('');
                setName('');
                setError('');
            }
            setError('');
        } catch (err) {

            // // For debugging
            // console.log(err);
            // console.log(err.message);
            // return;

            console.error(err.response.data);
            let message = "An unexpected error occured!";
            if (err.response) {
                message = err.response.data.message; // Normal error catch up
            } else if (err.message) {
                message = err.message; // Special hande to catch "Network error"
            }
            enqueueSnackbar(message, { variant: "error" });
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://picsum.photos/1920/1080)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

                    <IconButton
                        onClick={() => router("/")}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            color: 'white',
                            backgroundColor: 'rgba(94, 73, 200, 0.56)',
                            '&:hover': {
                                backgroundColor: 'rgba(152, 152, 152, 0.56)',
                                color: 'rgb(61, 43, 151)',
                            }
                        }}
                    >
                        <ArrowBackIcon fontSize='medium'/>
                    </IconButton>

                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative'

                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <div>
                            <Button
                                className="signin-auth-btn"
                                variant={formState === 0 ? "contained" : "outlined"}
                                onClick={() => setFormState(0)}
                                sx={{
                                    background: formState === 0 ? "linear-gradient(to top left,rgb(177, 155, 255), #5e49c8)" : "transparent",
                                    color: formState === 0 ? "white" : "inherit",
                                    border: formState === 0 ? "none" : "none", // Ensures no border
                                    boxShadow: formState === 0 ? "0px 4px 10px rgba(0,0,0,0.2)" : "none",
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                className="signup-auth-btn"
                                variant={formState === 1 ? "contained" : "outlined"}
                                onClick={() => setFormState(1)}
                                sx={{
                                    background: formState === 1 ? "linear-gradient(to top right, rgb(177, 155, 255), #5e49c8)" : "transparent",
                                    color: formState === 1 ? "white" : "inherit",
                                    border: formState === 1 ? "none" : "none", // Ensures no border
                                    boxShadow: formState === 1 ? "0px 4px 10px rgba(0,0,0,0.2)" : "none",
                                }}
                            >
                                Sign Up
                            </Button>
                        </div>


                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    variant="filled"
                                    size="small"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
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
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                variant="filled"
                                size="small"
                                value={username}
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}
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
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                variant="filled"
                                size="small"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            />

                            <p style={{ color: "red" }}>{error}</p>

                            <Button
                                className='auth-buttons'
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

        </ThemeProvider>
    );
}

