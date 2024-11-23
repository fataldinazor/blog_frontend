import {useAuth} from '../context/AuthContext.jsx'
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoute({allowedRoles}) {
    const {auth} = useAuth();

    if(!auth.isAuthenticated){
       return(<Navigate to="/login" />)
    }

    if(!allowedRoles.includes(auth.userInfo.role)){
        return (<Navigate to="/"/>)
    } 

  return <Outlet/>
}

export default ProtectedRoute
