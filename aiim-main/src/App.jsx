import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Upload from "./pages/Upload";
import Article from "./pages/Article";
import Search from "./pages/Search";
import Delete from "./pages/Delete";
import Footer from "./components/Footer";

// Import Analytics from Vercel
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/delete" element={<Delete />} />
            <Route path="/search" element={<Search />} />
            <Route path="/article/:id" element={<Article />} />
          </Routes>
        </main>
        <Footer />
        {/* Add the Analytics component to track page views */}
        <Analytics />
      </div>
    </BrowserRouter>
  );
}

export default App;
