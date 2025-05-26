import React from "react";
import "../css/navigation.css";

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="nav-logo">EasyPark</div>
      <ul className="nav-links">
        <li><a href="#">דף הבית</a></li>
        <li><a href="#">פרסם חניה</a></li>
        <li><a href="#">חפש חניה</a></li>
        <li><a href="#">אודות</a></li>
        <li><a href="#">התחבר</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;
