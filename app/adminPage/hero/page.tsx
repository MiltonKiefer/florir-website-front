"use client";
import React, { useEffect } from 'react';
import { Header } from '../../sharedComponents/layout/Header';
import { SectionTitle } from '@/app/sharedComponents/ui/SectionTitle';

export default function AdminPage() {
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            window.location.href = "/login";
        }
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
                title="Hero Section"
                text="Essa página está em desenvolvimento e será implementada em breve."
            />
        </div>
    );
}