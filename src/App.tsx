import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Search from './components/Search';
import Favorites from './components/Favourites';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
         
{/* <nav className="bg-white-500 p-4 flex justify-between items-center">
  <div className="flex items-center">
    <span className="text-blue-500 text-xl pr-2">npm-packages</span>
  </div>
  <div>
    <Link to="/">Search</Link>
    <span className="mx-2">|</span>
    <Link to="/favorites" className="ml-auto">
      Favorites
    </Link>
  </div>
</nav> */}



<nav className="bg-white-500 p-4 flex justify-between items-center">
  <div className="flex items-center">
    <span className="text-black-500 text-xl pr-2">npm-packages</span>
  </div>
  <div>
    <Link to="/">
      <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
        Search
      </button>
    </Link>
    <span className="mx-2"></span>
    <Link to="/favorites">
      <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
        Go to Favorites
      </button>
    </Link>
  </div>
</nav>

          <Switch>
            <Route path="/" exact>
              <Search />
            </Route>
            <Route path="/favorites">
              <Favorites />
            </Route>
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;