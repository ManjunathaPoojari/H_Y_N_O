import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, Megaphone, Volume2, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const VoiceAssistance: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);

    useEffect(() => {
        if ('speechSynthesis' in window && 'webkitSpeechRecognition' in window) {
            setSpeechSupported(true);
        }
    }, []);

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;

        // Stop any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for better clarity
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const getPageContent = () => {
        const h1 = document.querySelector('h1')?.innerText || '';
        const p = document.querySelector('main p')?.innerText || '';
        return `You are on the ${h1} page. ${p}`;
    };

    const handleReadPage = () => {
        const content = getPageContent();
        speak(content);
        toast.info("Reading page content...");
    };

    const handleListen = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            speak("I am listening. How can I help you?");
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            toast.info(`You said: "${transcript}"`);

            // Basic command processing
            if (transcript.includes('dashboard')) {
                speak("Going to dashboard");
                window.dispatchEvent(new CustomEvent('app-navigate', { detail: '/patient/dashboard' }));
            } else if (transcript.includes('appointment')) {
                speak("Opening appointments");
                window.dispatchEvent(new CustomEvent('app-navigate', { detail: '/patient/appointments' }));
            } else if (transcript.includes('book')) {
                speak("Opening booking page");
                window.dispatchEvent(new CustomEvent('app-navigate', { detail: '/patient/book' }));
            } else if (transcript.includes('event')) {
                speak("Opening health events");
                window.dispatchEvent(new CustomEvent('app-navigate', { detail: '/patient/events' }));
            } else {
                speak("I heard " + transcript + ". I'm still learning more commands.");
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    if (!speechSupported) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 mb-4 w-64 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-semibold text-slate-900 flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                Voice Assistant
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 h-12"
                                onClick={handleReadPage}
                            >
                                <Volume2 className="h-5 w-5 text-emerald-500" />
                                <span>Read this page</span>
                            </Button>

                            <Button
                                variant={isListening ? "destructive" : "outline"}
                                className={`w-full justify-start gap-3 h-12 ${isListening ? 'animate-pulse' : ''}`}
                                onClick={handleListen}
                            >
                                <Mic className={`h-5 w-5 ${isListening ? 'text-white' : 'text-blue-500'}`} />
                                <span>{isListening ? "Listening..." : "Speak a command"}</span>
                            </Button>

                            <p className="text-[10px] text-gray-500 italic text-center px-2">
                                Try saying "Dashboard", "Appointments", or "Events"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="lg"
                className={`h-14 w-14 rounded-full shadow-lg ${isOpen ? 'bg-slate-900' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Megaphone className="h-6 w-6" />}
            </Button>
        </div>
    );
};
