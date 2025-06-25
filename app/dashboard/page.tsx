'use client'
import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { SignIn, useUser } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  if (!user) return <SignIn />

  return (
    <div className="w-full] mx-auto rounded-md  h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          BOOM
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          An Instant Voice Agent that&apos;ll Make Patient Care Accessible Again.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Try Now
          </button>
          <button className="px-4 py-2  text-white ">Meet Group</button>
        </div>
      </Vortex>
    </div>
  );
}

