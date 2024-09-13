"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { MdExitToApp, MdGroup, MdReceipt, MdShoppingBag } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (value: string) => void;
  isCollapsed: boolean;
}

const Item: FC<ItemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  isCollapsed,
}) => {
  return (
    <div
      className={`flex items-center py-2 px-4 text-lg cursor-pointer ${
        selected === title ? "text-gray-200 dark:text-blue-300" : ""
      }`}
      onClick={() => setSelected(title)}
    >
      <span className="mr-4">{icon}</span>
      {!isCollapsed && (
        <Link href={to} className="text-base font-medium">
          {title}
        </Link>
      )}
    </div>
  );
};

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const router = useRouter();
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <nav className="bg-white dark:bg-[#111C43] shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h3 className="text-[25px] font-sans uppercase dark:text-white text-black">
          Ecommerce
        </h3>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-black dark:text-white md:hidden"
        >
          {isMenuOpen ? <HiX /> : <HiMenuAlt2 />}
        </button>
        <div
          className={`lg:flex lg:items-center lg:space-x-4 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <Item
            title="Create Product"
            to="/admin/create-product"
            icon={<MdShoppingBag />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={false}
          />
          <Item
            title="Owned Products"
            to="/admin/products"
            icon={<MdGroup />}
            selected={selected}
            setSelected={setSelected}
            isCollapsed={false}
          />
          <div onClick={logoutHandler}>
            <Item
              title="Logout"
              to="/"
              icon={<MdExitToApp />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={false}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
