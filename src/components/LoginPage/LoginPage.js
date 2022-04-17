import { Button, TextField } from "@mui/material";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import classes from './LoginPage.module.scss'

const LoginPage = () => {
    const navigate = useNavigate();


    const [password, setPassword] = useState(undefined);
    const [username, setUsername] = useState(undefined);

    const [error, setError] = useState(undefined);

    onAuthStateChanged(auth, (currentUser) => {
        debugger;
        if(currentUser)
            navigate('/');
    });


    const register = async ()=>{
        try{
            const user = await createUserWithEmailAndPassword(
                auth,
                username+'@lab1.com',
                password
            )
            
        } catch(error) {
            debugger
            if(error?.code?.includes('weak-password')){
                setError("Password should be at least 6 symbols");
            }else if(error?.code?.includes('invalid-email')){
                setError("Incorrect username")
            }else if(error?.code?.includes('email-already-in-use')){
                setError("Username is taken")
            }
        }
    }

    const login = async ()=>{
        try{
            const user = await signInWithEmailAndPassword(
                auth,
                username+'@lab1.com',
                password
            )
        } catch (error){
            if(error?.code?.includes('user-not-found')){
                setError("Username does not exist");
            }else if('user-not-found'){
                setError('Inccorrect password')
            }
        }
    }

    return (<div className={classes.LoginPage}>
        <div className={classes.LoginPanel}>
            <header>
                <h1>
                    Login
                </h1>
            </header>
            <hr />
            <main>
                <TextField
                    className={classes.inputs}
                    label="Login"
                    onChange={(e) => {
                        setError(undefined);
                        setUsername(e.target.value);
                    }}
                />

                <TextField
                    className={classes.inputs}
                    label="Password"
                    type="password"
                    onChange={(e) => {
                        setError(undefined);
                        setPassword(e.target.value);
                    }}
                />
                <p>{error}</p>
            </main>

            <footer>
                <Button 
                    className={classes.buttons} 
                    variant="outlined"
                    onClick={()=>register()}
                >
                        Sign up
                </Button>

                <Button 
                    className={classes.buttons} 
                    variant="contained"
                    onClick={()=>login()}
                >
                    Login
                </Button>
            </footer>
        </div>
    </div>);
}

export default LoginPage;