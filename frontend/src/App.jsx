import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SnackbarProvider, closeSnackbar } from 'notistack';
import LandingPage from './pages/landing'
import Authentication from './pages/authentication'
import History from './pages/history.jsx';
import VideoMeetComponent from './pages/videoMeet';
// import VideoMeetComponent from './backups/videoMeet';

import HomeComponent from './pages/home.jsx';
import './App.css'
import { Authprovider } from './contexts/Authcontext.jsx';

function App() {

  return (
    <>
      <SnackbarProvider
        maxSnack={2}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={(key) => (
          <button onClick={() => closeSnackbar(key)} className='close-button-style'>
            ✖
          </button>
        )}
      >

        <Router>
          <Authprovider>
            <Routes>
              {/* <Route path='/home' element></Route> */}
              <Route path='/' element={<LandingPage />} />
              <Route path='/auth' element={<Authentication />} />
              <Route path='/home' element={<HomeComponent/>}/>
              <Route path='/history' element={<History/>}/>
              <Route path='/:url' element={<VideoMeetComponent/>} />
            </Routes>
          </Authprovider>
        </Router>

      </SnackbarProvider>
    </>
  )
}

export default App
