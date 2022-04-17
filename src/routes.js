import LoginPage from "./components/LoginPage/LoginPage";
import Quiz from "./components/Quiz/Quiz";
import Stats from "./components/Stats/Stats";
import UserMainPage from "./components/UserMainPage/UserMainPage";

export const routes = [
    {
        path: '/',
        exact: true,
        element: <UserMainPage />,
        isProtected: true
    },

    {
        path: '/quiz',
        exact: true,
        element: <Quiz />,
        isProtected: true
    },

    {
        path: '/stats',
        exact: true, 
        element: <Stats />,
        isProtected: false
    },

    {
        path: '/login',
        exact: true,
        element: <LoginPage />,
        isProtected: false
    }
]