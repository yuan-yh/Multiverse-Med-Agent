import React from "react";
import Link from 'next/link'
import { Vortex } from '@/components/ui/vortex';

export default function Landing() {

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
                    Revolutionize Cancer Treatment
                </h2>
                <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
                    An Instant Voice Agent that Brings Expert-Level Analysis to Every Clinic.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <Link href="/sign-in">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
                            Agent Now
                        </button>
                    </Link>
                    <Link href="https://github.com/yuan-yh/Multiverse-Med-Agent">
                        <button className="px-4 py-2 text-white border border-white hover:border-gray-300 hover:text-gray-300 transition duration-200 rounded-lg">
                            Meet Group
                        </button>
                    </Link>
                </div>
            </Vortex>
        </div>
    );
}

