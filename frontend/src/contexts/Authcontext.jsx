/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import server from "../environment";

export const Authcontext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v2/users`,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const Authprovider = ({children}) => {

    const authContext = useContext(Authcontext);

    const [userData, setUserData] = useState(authContext);

    const router = useNavigate();

    const handleRegister = async(name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })

            if(request.status === httpStatus.CREATED){
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async(username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            })

            // console.log(request.data);

            if(request.status === httpStatus.OK){
                localStorage.setItem("token", request.data.token);

                // Store the user's MongoDB _id in localStorage
                localStorage.setItem('id', request.data.userId);

                // Optionally, store other user data (e.g., username)
                localStorage.setItem('user', request.data.user);

                return request.data.message;                
            }

        } catch (err) {
            throw err;
        }
    }


    const getHistoryUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data;
        } catch (error) {
            throw error;
        }
    }


    const addToUserHistory = async (meetingCode) => {

        try{
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meetingcode: meetingCode
            })
            return request;
        } catch(error){
            throw error;
        }
    }

    const clearHistory = async () => {
        try{
            let request = await client.delete("/clear_history", {
                data: {
                    token: localStorage.getItem("token")
                }
            })
            return request;
        } catch (error){
            throw error;
        }
    }

    const data = {
        userData, setUserData, handleRegister, handleLogin, getHistoryUser, addToUserHistory, clearHistory
    }

    return (
        <Authcontext.Provider value={data}>
            {children}
        </Authcontext.Provider>
    )
}