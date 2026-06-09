"use client";
import React, { useEffect, useState } from 'react';
import { Header } from '../../sharedComponents/layout/Header';
import { ProdutoGrid } from '@/app/sharedComponents/produto/ProdutoGrid';
import RecomendadoCard from '@/app/sectionPages/produtos/components/RecomendadoCard';
import { SectionTitle } from '@/app/sharedComponents/ui/SectionTitle';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProdutosAdmin() {
    const [loading, setLoading] = useState(true);
    const [produtos, setProdutos] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        async function fetchProdutos() {
            try {
                const res = await fetch(`${API_BASE_URL}/produtos`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                    },
                });

                if (!res.ok) throw new Error("Erro ao buscar produtos");

                const data = await res.json();
                const produtosData = Array.isArray(data)
                    ? data
                    : Array.isArray(data.produtos)
                    ? data.produtos
                    : Array.isArray(data.data)
                    ? data.data
                    : [];

                setProdutos(produtosData);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProdutos();
    }, []);

    const navLinks = [
        //{ label: 'HERO', href: '/adminPage/hero' },
        { label: 'PRODUTOS', href: '/adminPage/produtos' },
        { label: 'PERGUNTAS', href: '/adminPage/perguntas' },
        { label: 'CONTATO', href: '/adminPage/contato' },
        { label: 'VOLTAR', href: '/' },
    ];

    return (
        <div>
            <Header
                navLinks={navLinks}
            />
            <SectionTitle
                title="Gerenciar Produtos"
                text="Edite seu catálgo de produtos aqui. Adicione, remova
                    ou modifique produtos conforme necessário."
            />

            {loading ? (
                <p className="text-center text-gray-500 py-10">Carregando produtos...</p>
            ) : produtos.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Nenhum produto encontrado.</p>
            ) : (
                <>
                    <RecomendadoCard
                        produtos={produtos.filter((p: any) => p.recomendado)}
                        adminEdit={true}
                    />

                    <ProdutoGrid
                        produtos={produtos}
                        quantidade={null}
                        mostrarBotaoVerTodos={false}
                        topMenu={true}
                        adminEdit={true}
                    />
                </>
            )}
        </div>
    );
}