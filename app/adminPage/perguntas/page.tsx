"use client";
import React, { useEffect, useState } from 'react';
import { Header } from '../../sharedComponents/layout/Header';
import { SectionTitle } from '@/app/sharedComponents/ui/SectionTitle';
import { QuestionHandler } from '@/app/sharedComponents/question/QuestionHandler';

export default function AdminPage() {
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://florir-website-back.vercel.app';
    interface PerguntaData {
        _id: string;
        pergunta: string;
        resposta: string;
    }

    const navLinks = [
        //{ label: 'HERO', href: '/adminPage/hero' },
        { label: 'PRODUTOS', href: '/adminPage/produtos' },
        { label: 'PERGUNTAS', href: '/adminPage/perguntas' },
        { label: 'CONTATO', href: '/adminPage/contato' },
        { label: 'VOLTAR', href: '/' },
    ];

    const [perguntas, setPerguntas] = useState<PerguntaData[]>([]);
    const [loadingPerguntas, setLoadingPerguntas] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
    
        const fetchPerguntas = async () => {
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 15000);

            try {
                const response = await fetch(`${API_BASE_URL}/perguntas`, {
                    signal: controller.signal,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            
                const result = await response.json();
            
                if (Array.isArray(result.data)) {
                    const normalized = result.data.map((item: any) => ({
                        _id: item._id,
                        pergunta: item.pergunta ?? item.question ?? '',
                        resposta: item.resposta ?? item.answer ?? ''
                    }));
                    setPerguntas(normalized);
                }
            
                setLoadingPerguntas(false);
            } catch (error) {
                setError('Erro ao carregar perguntas');
                setLoadingPerguntas(false);
            }
        };

        fetchPerguntas();
        return () => controller.abort();
    }, []);



    return (
        <div>
            <Header
                navLinks={navLinks}
            />
            <SectionTitle
                title="Gerenciar Perguntas"
                text="Gerencie as perguntas frequentes exibidas no site aqui."
            />

            {loadingPerguntas ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5E635D] mx-auto mb-4"></div>
                    <p className="text-[#5E635D]">Carregando perguntas frequentes...</p>
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                </div>
            ) : (
                <QuestionHandler
                    perguntas={perguntas.map(p => ({
                        _id:p._id,
                        pergunta: p.pergunta,
                        resposta: p.resposta
                    }))}
                    quantidade={null}
                    mostrarBotaoVerTodas={false}
                    adminEdit={true}
                />
            )}    
        </div>
    );
}