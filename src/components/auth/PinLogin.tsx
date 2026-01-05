"use client";

import { useState } from "react";
import { useAuth, ROLE_LABELS } from "@/context/AuthContext";
import { Delete, LogIn, Fingerprint, ShieldCheck, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PinLogin() {
    const { login, loginAsUser, users } = useAuth();
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const handleDigit = (digit: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + digit);
            setError(false);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    const handleSubmit = () => {
        if (pin.length === 4 && selectedUserId) {
            // Find the selected user and verify their PIN matches
            const selectedUser = users.find(u => u.id === selectedUserId);
            if (selectedUser && selectedUser.pin === pin) {
                // PIN matches the selected user - log them in
                loginAsUser(selectedUserId);
            } else {
                // Wrong PIN for the selected user
                setError(true);
                setPin("");
            }
        }
    };

    const handleQuickLogin = (userId: string) => {
        setSelectedUserId(userId);
        // Direct login via user selection (for demo purposes)
        const user = users.find(u => u.id === userId);
        if (user) {
            // Show PIN entry for this user
            setPin("");
            setError(false);
        }
    };

    const handleBackToSelection = () => {
        setSelectedUserId(null);
        setPin("");
        setError(false);
    };

    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "delete", "0", "submit"];
    const selectedUser = users.find(u => u.id === selectedUserId);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00D764] rounded-full blur-[150px] opacity-10" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00D764] rounded-full blur-[150px] opacity-10" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="w-full max-w-2xl z-10 px-6">
                {/* Branding */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
                        <div className="w-4 h-4 rounded-full bg-[#00D764] animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Executive Access</h1>
                    <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-[0.3em]">Identification du Personnel</p>
                </div>

                {/* Glass Card */}
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                    {!selectedUserId ? (
                        <>
                            {/* User Selection Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {users.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleQuickLogin(user.id)}
                                        className={cn(
                                            "flex flex-col items-center gap-3 p-4 rounded-[2rem] transition-all duration-500",
                                            "bg-white/5 text-[#ADB5BD] hover:bg-white/10 hover:scale-105"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black bg-white/5">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight">
                                            {user.name.split(' ')[0]}
                                            <br />
                                            {user.name.split(' ')[1]}
                                        </span>
                                        <span className="text-[8px] font-bold text-[#00D764]/70 uppercase tracking-wider">
                                            {ROLE_LABELS[user.role]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Back Button & Selected User */}
                            <div className="flex items-center justify-between mb-8">
                                <button
                                    onClick={handleBackToSelection}
                                    className="flex items-center gap-2 text-[#ADB5BD] hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase">Retour</span>
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold">
                                        {selectedUser?.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-bold text-sm">{selectedUser?.name}</p>
                                        <p className="text-[9px] text-[#00D764] font-bold uppercase">
                                            {selectedUser ? ROLE_LABELS[selectedUser.role] : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Masked PIN Input */}
                            <div className="flex justify-center gap-4 mb-10">
                                {[0, 1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-16 h-16 rounded-[1.5rem] border flex items-center justify-center text-2xl transition-all duration-500",
                                            error
                                                ? "border-red-500/50 bg-red-500/10 animate-shake"
                                                : pin.length > i
                                                    ? "border-[#00D764] bg-[#00D764]/10"
                                                    : "border-white/10 bg-white/5"
                                        )}
                                    >
                                        {pin.length > i ? (
                                            <div className="w-3 h-3 rounded-full bg-[#00D764] shadow-[0_0_10px_#00D764]" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Aesthetic Keypad */}
                            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                                {digits.map((digit, i) => (
                                    digit === "delete" ? (
                                        <button
                                            key={i}
                                            onClick={handleDelete}
                                            className="h-16 rounded-2xl bg-white/5 text-[#ADB5BD] flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
                                        >
                                            <Delete className="w-6 h-6" />
                                        </button>
                                    ) : digit === "submit" ? (
                                        <button
                                            key={i}
                                            onClick={handleSubmit}
                                            disabled={pin.length !== 4}
                                            className={cn(
                                                "h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl",
                                                pin.length === 4
                                                    ? "bg-[#00D764] text-white hover:bg-[#00B956] shadow-[#00D764]/20"
                                                    : "bg-white/5 text-[#333] cursor-not-allowed"
                                            )}
                                        >
                                            <LogIn className="w-6 h-6" />
                                        </button>
                                    ) : (
                                        <button
                                            key={i}
                                            onClick={() => handleDigit(digit)}
                                            className="h-16 rounded-2xl bg-white/5 text-white text-2xl font-black hover:bg-white/10 active:scale-95 transition-all flex flex-col items-center justify-center"
                                        >
                                            {digit}
                                            <span className="text-[8px] opacity-20 font-bold tracking-tighter">
                                                {digit === "1" && "SEC"}
                                                {digit === "2" && "ABC"}
                                                {digit === "3" && "DEF"}
                                                {digit === "4" && "GHI"}
                                                {digit === "5" && "JKL"}
                                                {digit === "6" && "MNO"}
                                                {digit === "7" && "PQRS"}
                                                {digit === "8" && "TUV"}
                                                {digit === "9" && "WXYZ"}
                                            </span>
                                        </button>
                                    )
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Security Footer */}
                <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md">
                        <ShieldCheck className="w-4 h-4 text-[#00D764]" />
                        <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-[0.2em]">Système de Sécurité Chiffré</span>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-[#ADB5BD] hover:text-white">
                            <Fingerprint className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase">Bio-Access</span>
                        </button>
                    </div>

                    <p className="text-[9px] font-bold text-[#333] text-center mt-4">
                        CODES PIN : ADMIN 1234 | MANAGER 5678 | SERVEUR 0000 | CHEF 9999 | BARMAN 1111 | RESP.SALLE 2222
                    </p>
                </div>
            </div>
        </div>
    );
}
