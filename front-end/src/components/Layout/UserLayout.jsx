// import React from 'react'
import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet} from 'react-router-dom'

const UserLayout = () => {
  return <>
  {/*header*/}
  <Header />
  {/*main content*/}
  <Outlet />
  <Footer/>
  {/*footer*/}

      
    </>
  
}

export default UserLayout
