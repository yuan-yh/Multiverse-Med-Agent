import React from 'react';
import Image from 'next/image';
import { Check, User } from 'lucide-react';
import type { medicalAgent } from './MedicalAgentCard';

interface Props {
    agent: medicalAgent;
    selectedDoctor: medicalAgent | undefined;
    setSelectedDoctor: (agent: medicalAgent) => void;
}

export function SuggestAgentCard({ agent, selectedDoctor, setSelectedDoctor }: Props) {
    const isSelected = selectedDoctor?.id === agent.id;

    return (
        <div
            className={`
                relative group flex flex-col items-center justify-between 
                border-2 rounded-xl p-4 cursor-pointer
                transition-all duration-200 ease-in-out
                ${isSelected
                    ? 'border-blue-400 bg-gradient-to-b from-blue-50 to-blue-100/50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
                }
            `}
            onClick={() => setSelectedDoctor(agent)}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
            )}

            {/* Avatar container with subtle animation */}
            <div className={`
                relative mb-3 p-1 rounded-full
                ${isSelected ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gray-100'}
                transition-all duration-200
            `}>
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
                    {agent.image ? (
                        <Image
                            src={agent.image}
                            alt={agent.specialist}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content section */}
            <div className="text-center space-y-1 flex-1 flex flex-col justify-between">
                <h3 className={`
                    font-semibold text-sm leading-tight
                    ${isSelected ? 'text-blue-900' : 'text-gray-800'}
                    transition-colors duration-200
                `}>
                    {agent.specialist}
                </h3>

                <p className={`
                    text-xs leading-relaxed line-clamp-3
                    ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                    transition-colors duration-200
                `}>
                    {agent.description}
                </p>
            </div>

            {/* Optional: Add a subtle bottom accent */}
            {/* <div className={`
                absolute bottom-0 left-0 right-0 h-1 rounded-b-xl
                bg-gradient-to-r from-blue-300 to-blue-400
                transform origin-bottom transition-transform duration-200
                ${isSelected ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}
            `} /> */}
        </div>
    );
}