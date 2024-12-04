"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/providers");
  }, [router]);

  return <div>Please wait...</div>;
};

export default Page;
