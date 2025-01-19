import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Article from './pages/Article';
import Home from './pages/Home';
import Submit from './pages/Submit';
import Search from './pages/Search'; //Xander added this line

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Test connection to backend
    axios.get('/health')
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Backend connection error:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Connecting to server...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-2xl font-bold text-blue-900">AIIM</a>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a href="/" className="inline-flex items-center px-1 pt-1 text-gray-900">
                    Home
                  </a>
                  <a href="/submit" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900">
                    Submit Article
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/search" element={<Search />} /> {/*Xander added this line*/}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;