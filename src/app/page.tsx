import Logout from "@/components/Logout";
import { logOut } from "@/lib/actions";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hi!</h1>
      <Logout />
      <h1>View Lost Item</h1>
    </main>
  );
}
