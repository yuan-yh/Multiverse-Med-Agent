"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from 'next/image'
import { medicalAgent } from "./MedicalAgentCard";

type Props = {
    agent: medicalAgent,
    setSelectedDoctor: any,
};

export function SuggestAgentCard({ agent, setSelectedDoctor }: Props) {
    return (
        <div className="flex flex-col items-center justify-between border rounded-2xl shadow p-5 hover:border-blue-300 cursor-pointer"
            onClick={() => setSelectedDoctor(agent)}>
            <Image
                src={agent.image}
                alt={agent.specialist}
                width={70}
                height={70}
                className="w-[50px] h-[50px] rounded-4xl object-cover"
            />
            <h2 className="font-bold text-sm text-center">{agent.specialist}</h2>
            <p className="text-xs text-center line-clamp-2">{agent.description}</p>
        </div>
    );
}

