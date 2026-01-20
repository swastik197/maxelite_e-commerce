import Navbar from "@/components/Navbar";
import Offers from "@/components/offers";

export default function MainLayout({ children }) {
  return (
    <>
      <Offers />
      <Navbar />
      {children}
    </>
  );
}
