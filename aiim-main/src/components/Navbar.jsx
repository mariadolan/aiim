import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function StyledLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `hover:text-orange-600 transition-colors ${
          isActive ? "font-underline" : ""
        }`
      }>
      {children}
    </NavLink>
  );
}

function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // Add this hook at the top

  const style = `transition-colors p-3 rounded-lg 
   ${search ? "bg-blue-500 text-white " : ""}`;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && search) {
      navigate(`/search?q=${search}`);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Link className={style} to={`/search?q=${search}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
      <input
        type="text"
        placeholder="Search For Articles"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded-lg p-2"
      />
    </div>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`flex justify-between items-center py-4 px-page sticky top-0 bg-white border-b border-gray-200 ${
        isScrolled ? "shadow-md" : ""
      }`}>
      <img
        src="/logo.png"
        alt="AIIM"
        className="object-cover aspect-[2/1] h-16"
      />
      <nav className="flex space-x-4 items-center">
        <SearchBar />
        <StyledLink to="/" element="Home">
          Home
        </StyledLink>{" "}
        <StyledLink to="/advanced-search" element="Advanced Search">
          Advanced Search
        </StyledLink>
        <StyledLink to="/about" element="About">
          About
        </StyledLink>
        {/* <StyledLink to="/contact" element="Contact">
          Contact
        </StyledLink> */}
      </nav>
    </div>
  );
}

export default Navbar;
