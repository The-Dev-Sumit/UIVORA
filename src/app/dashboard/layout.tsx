"use client";

import { ReactNode } from "react";

const DashboardLayout = ({children}: {children: ReactNode}) => {
    return (
      <>
        <main>{children}</main>
      </>
    );
};

export default DashboardLayout;
