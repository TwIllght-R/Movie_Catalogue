import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorPage from './components/ErrorPage';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Movies from './components/Movies';
import Movie from './components/Movie';
import Genres from './components/Genres';
import EditMovie from './components/EditMovie';
import ManageCatalogue from './components/ManageCatalogue';
import GraphQL from './components/Graphql';
import Login from './components/Login';
const router = createBrowserRouter([
  { path: '/', 
  element: <App />, 
  errorElement:<ErrorPage/>,
  children: [
  {index: true, element: <Home />},
  { path: '/movies', element: <Movies /> },
  { path: '/movie/:id', element: <Movie /> },
  { path: '/genres', element: <Genres /> },  
  { path: '/admin/movie/0', element: <EditMovie /> },
  { path: '/manage-catalogue', element: <ManageCatalogue /> },
  { path: '/graphql', element: <GraphQL />},
  { path: '/login', element: <Login /> },
  ] },
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router}/>
  </React.StrictMode>
);
