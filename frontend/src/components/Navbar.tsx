import Image from "next/image";
import Link from "next/link";

import Button from "./Button";

import Feedback from "@/icons/Feedback";
import Sun from "@/icons/Sun";
import Tutorial from "@/icons/Tutorial";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between border-b border-border bg-background px-6 py-4">
      <Link className="flex items-center gap-3 hover:cursor-pointer" href="/">
        <Image src="/icon.svg" alt="Icon" width={32} height={32} />
        <h1 className="text-2xl font-bold text-[#181D27]">Webreg++</h1>
      </Link>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
          <Sun size={20} className="hover:cursor-pointer" />
          <Feedback size={20} className="hover:cursor-pointer" />
          <Tutorial size={20} className="hover:cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <Button label="Log in" />
          <Button
            label="Sign up"
            className="border border-border bg-background text-text-dark hover:bg-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
