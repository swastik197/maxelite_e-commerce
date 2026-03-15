import Bar1 from "@/components/Bar1";
import Offers from "@/components/offers";

export default function MainLayout({ children }) {
  return (
    <>
      <Offers />
      <Bar1/>
      {children}
    </>
  );
}
