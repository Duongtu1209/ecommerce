import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import Default from "./components/Default/Default";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function App() {
  const fetchApi = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product`);
    return res.data;
  };
  const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowheader ? Default : Fragment;
            return (
              <Route
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
