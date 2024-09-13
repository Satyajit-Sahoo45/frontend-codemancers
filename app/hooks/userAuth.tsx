import { useSelector } from "react-redux";

export default function UserAuth() {
  const user = localStorage.getItem("accessToken");

  if (user) {
    return true;
  } else {
    return false;
  }
}
