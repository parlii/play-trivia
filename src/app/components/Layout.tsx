import Navbar from "./NavBar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
