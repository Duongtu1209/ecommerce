import React, { Fragment } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { routes } from './routes'
import Default from './components/Default/Default'
function App() {
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const Layout = route.isShowheader ? Default: Fragment
            return (
              <Route path={route.path} element={
                <Layout>
                   <Page/>
                </Layout>
            }/>
            )
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App