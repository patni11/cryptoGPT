import * as React from "react";
import { Web3Button } from "@web3modal/react";

export const Header = () => {
  return (
    <div className="w-screen flex justify-end px-6 pt-4">
      <Web3Button />
    </div>
  );
};
