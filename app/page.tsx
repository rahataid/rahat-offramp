"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import React from "react";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/offramp");
  }, [router]);

  return <h1>Redirecting...</h1>;
};

export default Page;
