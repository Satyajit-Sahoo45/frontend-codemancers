import Link from "next/link";
import React from "react";

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Products",
    url: "/products",
  },
  {
    name: "Cart",
    url: "/cart",
  },
  {
    name: "Your Orders",
    url: "/orders",
  },
  {
    name: "Admin Dashboard",
    url: "/admin/products",
  },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
  userData?: { role: string }; // Adjust based on your user data structure
  isLoggedIn: boolean; // New prop to check if the user is logged in
};

const NavItems: React.FC<Props> = ({
  activeItem,
  isMobile,
  userData,
  isLoggedIn,
}) => {
  // Determine which items to show based on user role and authentication status
  const filteredNavItems = (() => {
    if (!isLoggedIn) {
      return navItemsData.filter(
        (item) => item.name === "Home" || item.name === "Products"
      );
    }
    if (userData?.role === "admin") {
      return navItemsData.filter(
        (item) =>
          item.name === "Home" ||
          item.name === "Products" ||
          item.name === "Admin Dashboard"
      );
    }
    return navItemsData.filter(
      (item) =>
        item.name === "Home" ||
        item.name === "Products" ||
        item.name === "Cart" ||
        item.name === "Your Orders"
    );
  })();

  return (
    <>
      <div className="hidden md:flex">
        {filteredNavItems &&
          filteredNavItems.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <span
                className={`${
                  activeItem === index
                    ? "dark:text-[#37a39a] text-[crimson]"
                    : "dark:text-white text-black"
                } text-[18px] px-6 font-[400] font-sans`}
              >
                {item.name}
              </span>
            </Link>
          ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href="/" passHref>
              <span
                className={`text-[25px] font-sans font-[500] text-black dark:text-white`}
              >
                LMS
              </span>
            </Link>
          </div>
          {filteredNavItems &&
            filteredNavItems.map((item, index) => (
              <Link href={item.url} key={index} passHref>
                <span
                  className={`${
                    activeItem === index
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } block py-5 text-[18px] px-6 font-[400] font-sans`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
