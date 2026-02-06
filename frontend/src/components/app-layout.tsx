import AppNavbar from "@/components/AppNavbar";
import Footer from "./footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppNavbar />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
