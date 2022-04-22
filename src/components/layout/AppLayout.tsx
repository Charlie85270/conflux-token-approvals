import AppHeader from "./header/AppHeader";
import { Footer } from "./footer/Footer";

interface Props {
  title: string;
  desc: string;
  children: React.ReactNode;
}

const AppLayout = ({ title, desc, children }: Props) => {
  return (
    <div className="flex flex-col font-sans antialiased text-gray-600 bg-gray-100">
      <AppHeader />
      <main className="w-full min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
