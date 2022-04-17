import { Navigate, Route, Outlet } from 'react-router-dom'
import {onAuthStateChanged} from 'firebase/auth'
import { auth } from '../../firebase-config';
import { useState } from 'react';

const PrivateRoute = () => {

    const [user, setUser] = useState(true);
    onAuthStateChanged(auth, (currentUser)=>{
        debugger;
        setUser(currentUser);
    })

    return user ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoute;