import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import Default from "./components/Default/Default";
import { isJsonString } from "./services/utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService';
import { updateUser } from "./redux/sliders/userSlider";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token');
    let decoded = {}   
        
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData);
    }    
    
    return { decoded, storageData };
  };

  const handleGetDetailsUser = async (id, token) => {    
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  
  UserService.axiosJWT.interceptors.request.use(async function (config) {        
    
    const currentTime = new Date();
    const { decoded } = handleDecoded();    
    if (decoded?.exp < currentTime.getTime() / 1000) {      
      const data = await UserService.refreshToken();
      config.headers['token'] = `Bearer ${data?.access_token}`;
    }
    
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowheader ? Default : Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
