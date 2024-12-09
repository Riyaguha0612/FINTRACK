import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Workspace.css";
import { UserContext } from "./UserContext";

const Workspace = () => {
  const { username } = useContext(UserContext);
  const location = useLocation();

  // Define the menu items with their corresponding paths and emoji icons
  const menuItems = [
    { path: "/home/dashboard", icon: "📒", label: "Dashboard" },
    { path: "/home/balance", icon: "💶", label: "Balance" },
    { path: "/home/transaction", icon: "💸", label: "Transaction" },
    { path: "/home/bills", icon: "🧾", label: "Bills" },
    { path: "/home/expenses", icon: "📈", label: "Expenses" },
    { path: "/home/goals", icon: "📝", label: "Goals" },
  ];

  return (
    <React.Fragment>
      <div className="ws-container">
        <div className="menu-list">
          <nav>
            <ul>
              {menuItems.map((item) => (
                <Link to={item.path} key={item.path}>
                  <li className={location.pathname === item.path ? "active" : ""}>
                    <span className="menu-icon">{item.icon}</span>
                    <h4>{item.label}</h4>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
        <div className="account-centre">
          <div className="accounts">
            <span className="profile-icon">👤 </span><h5>{username}</h5>
            
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Workspace;
