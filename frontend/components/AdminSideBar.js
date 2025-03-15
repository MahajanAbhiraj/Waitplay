import { useRouter } from "next/router";
import Image from "next/image";
import { FaChartLine, FaUsers, FaBell, FaCheckCircle, FaUtensilSpoon, FaUserTie } from "react-icons/fa";

const AdminSideBar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="adminsidebar">
      <div className="adminlogo-container">
        <img src="/images/crown.png"  className="admincrownimage"  alt="Crown Logo" />
        <img src="/images/waitplay_logo.jpg"  className="adminlogo-image" alt="WaitPlay Logo" />
      </div>
      <div className="bold-text">WaitPlay</div>
      <ul className="menu">
        <li onClick={() => handleNavigation("/admin/Sales")}>
          <FaChartLine />
          <div className="menu-items">Sales</div>
        </li>
        <li onClick={() => handleNavigation("/admin/restaurants")}>
          <FaUtensilSpoon />
          <div className="menu-items">Restaurants</div>
        </li>
        <li onClick={() => handleNavigation("/admin/users")}>
          <FaUsers />
          <div className="menu-items">Users</div>
        </li>
        <li onClick={() => handleNavigation("/admin/admins")}>
          <FaUserTie />
          <div className="menu-items">Admins</div>
        </li>
        <li onClick={() => handleNavigation("/admin/Notifications")}>
          <FaBell />
          <div className="menu-items">Notifications</div>
        </li>
        <li onClick={() => handleNavigation("/admin/requests")}>
          <FaCheckCircle />
          <div className="menu-items">Approvals</div>
        </li>
      </ul>
      <div className="sidebar-bottom">
        <Image src="/images/devloper.png" width={50} height={50} alt="Developer" />
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
