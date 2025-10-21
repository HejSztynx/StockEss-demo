"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, useEffect} from "react";
import { loginUser, registerUser } from "./AuthService";

interface AuthModalProps { 
  isOpen: boolean,
  onLogIn: () => void,
  onClose: () => void,
  mode: "login" | "register" 
}

export default function AuthModal({ isOpen, onClose, onLogIn, mode }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
      if (isOpen) {
        setEmail("");
        setPassword("");
        setMessage(null);
      }
    }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (mode === "login") {
        const response = await loginUser(email, password);
        setMessage(response.message);
        setIsSuccess(true);
        onLogIn();
      } else {
        const response = await registerUser(email, password);
        setIsSuccess(true);
        setMessage(response.message);
      }

      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.log(err.message);
      setIsSuccess(false);
      setMessage(err.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
          <DialogTitle className="text-lg font-semibold mb-4">{mode === "login" ? "Logowanie" : "Rejestracja"}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <p className={`${isSuccess ? "text-green-600" : "text-red-500"} text-center self-center`}>
              {message || "\u00A0"}
            </p>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-2xl">
              {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
            </button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
