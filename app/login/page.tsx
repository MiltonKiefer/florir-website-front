"use client";
import React, { useState } from 'react';
import { TextField } from './components/TextField';
import { SectionTitle } from '../sharedComponents/ui/SectionTitle';
import { Button } from '../sharedComponents/ui/Button';
import Image from 'next/image';
import { Header } from '../sharedComponents/layout/Header';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        console.log(API_BASE_URL);
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: senha })
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                localStorage.setItem("authToken", data.data.token); // Salva o token
                localStorage.setItem("userId", data.data.userId);
                localStorage.setItem("username", data.data.username);
                
                alert("Login realizado com sucesso!");
                window.location.href = "/adminPage/produtos"; // Redireciona
            } else {
                alert("E-mail ou senha inválidos.");
            }
        } catch (err) {
            alert("Erro ao conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    }

    const navLinks = [
        { label: 'VOLTAR', href: '/' },
    ];

    return (
        <div>
            <Header
                navLinks={navLinks}
            />
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary">
                <SectionTitle
                    title="Login de Usuário"
                    text="Faça Login para gerenciar as informações do site"
                />
                <div className="flex flex-row bg-[#DDB7AB] rounded-3xl
                    p-8 mb-20 gap-8 mt-8 shadow-lg max-w-3xl
                    md:w-full justify-center items-center">
                    {/* Formulário */}
                    <form onSubmit={handleLogin} className="flex flex-col">
                        <div className="bg-white rounded-2xl p-8 gap-4 w-[320px] min-w-[280px] max-w-[350px]">
                            <TextField
                                title="E-mail:"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="exemplo@email.com"
                            />
                            <TextField
                                title="Senha:"
                                type="password"
                                required
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <Button text={loading ? "Entrando..." : "Login"} buttonColor="light" />
                        </div>
                    </form>
                    {/* Imagem */}
                    <div className="hidden md:block">
                        <Image
                            src="/images/Bolo Florido.jpeg"
                            alt="Login Visual"
                            width={260}
                            height={260}
                            className="rounded-2xl object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}