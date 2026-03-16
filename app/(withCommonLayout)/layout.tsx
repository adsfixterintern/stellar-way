
import Baneer from "@/components/home/Baneer";
import Footer from "@/components/shared/Footer";
import React from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
     <Baneer></Baneer>
      <main>{children}</main>
      <Footer></Footer>
    </div>
  );
}