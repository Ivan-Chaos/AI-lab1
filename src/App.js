import {
  BrowserRouter,
  Route,
  Routes,
  Router,
} from 'react-router-dom'
import { routes } from './routes'
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import BaseLayout from './components/BaseLayout/BaseLayout';

import './fonts.css'


function App() {
  return (
    <BaseLayout>
      <Routes>
        {routes.map(route => {

          if (route.isProtected) {
            return (
              <Route key={route.path} path={route.path} element={<PrivateRoute />}>
                <Route key={route.path} path={route.path} exact={route.exact} element={route.element} />
              </Route>
            )
          }

          return (<Route key={route.path} path={route.path} element={route.element} />);
        })}
      </Routes>
    </BaseLayout>
  );
}

export default App;
