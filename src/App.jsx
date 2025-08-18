import { ToastContainer } from 'react-toastify';
import './App.css'
import { Login } from './components/Login '
import { SignUp } from './components/SignUp'
import {createBrowserRouter,RouterProvider} from "react-router";
import { Home } from './components/Dashboard/Home';
import { Dashboard } from './components/Dashboard/Dashboard';
import { MyVideos } from './components/Dashboard/MyVideos';
import { Upload } from './components/Dashboard/Upload';

function App() {
  let router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path:'/SignUp',
    Component: SignUp
  },
  {
    path:'/Home',
    Component:Home
  },
  {
    path:'/dashboard',
    Component:Dashboard,
    children:[
      {
      path:'home',
      Component:Home,
      },
      {
        path:'MyVideos',
        Component:MyVideos
      },
      {
        path:'Upload',
        Component:Upload
      },
  ]
  },
  
]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
