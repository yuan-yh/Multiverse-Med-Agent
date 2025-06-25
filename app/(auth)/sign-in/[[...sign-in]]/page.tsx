import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { SignIn } from '@clerk/nextjs'
import 'dotenv/config';

export default function Page() {
    return (
        <div className="w-full] mx-auto rounded-md  h-screen overflow-hidden">
            <Vortex
                backgroundColor="black"
                rangeY={800}
                particleCount={500}
                baseHue={120}
                className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
            >
                <SignIn forceRedirectUrl={process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL} />
            </Vortex>
        </div>
    );
}

