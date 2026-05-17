import "../../globals.css";
import Navbar from "../../components/layout/NavBar";
import TopBar from "../../components/layout/TopBar";
import Footer from "../../components/layout/Footer";
import AdsSidebar from "@/app/components/ui/AdsSidebar";

export const metadata = {
  title: "WCEA Home",
  description: "Dashboard for users to view their health and wellness data, track progress, and access personalized recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <TopBar/> */}
      <Navbar/>
      <main className="grow">
        {children}
      </main>
      <Footer />
      <AdsSidebar />
    </div>
  );
}
