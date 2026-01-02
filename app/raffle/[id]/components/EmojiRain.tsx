'use client';

import { useEffect, useState } from 'react';

const EMOJIS = ['💰', '🎁', '💎', '💸', '🏆', '⭐', '💵', '🤑'];

interface Particle {
    id: number;
    emoji: string;
    left: number;
    duration: number;
    delay: number;
    size: number;
}

export function EmojiRain() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const particleCount = 25; // Número de emojis "chovendo"
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
                left: Math.random() * 100, // Posição horizontal aleatória %
                duration: 15 + Math.random() * 20, // Duração entre 15s e 35s (bem lento/suave)
                delay: -Math.random() * 20, // Começar em momentos diferentes (negativo para já estar na tela)
                size: 1.5 + Math.random() * 1.5, // Tamanho entre 1.5rem e 3rem
            });
        }

        setParticles(newParticles);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute top-[-10%] animate-fall opacity-0"
                    style={{
                        left: `${particle.left}%`,
                        fontSize: `${particle.size}rem`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                        // Efeito Glass/Liquid: desfoque suave e baixa opacidade
                        filter: 'blur(2px)',
                        opacity: 0.15,
                        textShadow: '0 0 10px rgba(255,255,255,0.3)',
                    }}
                >
                    {particle.emoji}
                </div>
            ))}

            {/* Styles for the animation defined here for simplicity */}
            <style jsx>{`
                @keyframes fall {
                    0% {
                        transform: translateY(-20%) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.2;
                    }
                    90% {
                        opacity: 0.2;
                    }
                    100% {
                        transform: translateY(120vh) rotate(360deg);
                        opacity: 0;
                    }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
}
