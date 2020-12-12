import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const path = useLocation();

  // if other link pressed
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path.pathname]);

  // if same link pressed
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [path.key]);

  return null;
}