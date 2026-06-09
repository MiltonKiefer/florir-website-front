"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Header } from "@/app/sharedComponents/layout/Header";
import { SectionTitle } from "@/app/sharedComponents/ui/SectionTitle";

type NavLink = {
  label: string;
  href: string;
};

type ContatoFormData = {
  instagram: string;
  tiktok: string;
  email: string;
  telefone: string;
  whatsappQRCode: string;
  altText: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://florir-website-back.vercel.app";

const CONTACT_PATH_CANDIDATES = ["contatos", "Contato"];

export default function ContatoAdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [contatoId, setContatoId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContatoFormData>({
    instagram: "",
    tiktok: "",
    email: "",
    telefone: "",
    whatsappQRCode: "",
    altText: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [resourcePath, setResourcePath] = useState<string>(CONTACT_PATH_CANDIDATES[0]);

  const navLinks = [
    //{ label: 'HERO', href: '/adminPage/hero' },
    { label: 'PRODUTOS', href: '/adminPage/produtos' },
    { label: 'PERGUNTAS', href: '/adminPage/perguntas' },
    { label: 'CONTATO', href: '/adminPage/contato' },
    { label: 'VOLTAR', href: '/' },
  ];

  const buildAuthorizationHeader = (value: string) =>
    value.startsWith("Bearer ") ? value : `Bearer ${value}`;

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      window.location.href = "/login";
      return;
    }

    setToken(storedToken);

    const fetchContato = async () => {
      try {
        setLoading(true);
        const authorization = buildAuthorizationHeader(storedToken);
        let lastError: unknown = null;
        let sucesso = false;

        for (const path of CONTACT_PATH_CANDIDATES) {
          try {
            const response = await fetch(`${API_BASE_URL}/${path}`, {
              headers: {
                Authorization: authorization,
              },
            });

            if (response.ok) {
              const json = await response.json();
              const contato = json?.data?.[0];

              if (!contato?._id) {
                throw new Error("Nenhum registro de contato encontrado.");
              }

              setResourcePath(path);
              setContatoId(contato._id);
              setFormData({
                instagram: contato.instagram ?? "",
                tiktok: contato.tiktok ?? "",
                email: contato.email ?? "",
                telefone: contato.telefone ?? "",
                whatsappQRCode: contato.whatsappQRCode ?? "",
                altText: contato.altText ?? "",
              });

              sucesso = true;
              break;
            }

            lastError = await response.json().catch(() => response.statusText);
          } catch (erroInterno) {
            lastError = erroInterno;
          }
        }

        if (!sucesso) {
          throw lastError instanceof Error
            ? lastError
            : new Error("Não foi possível carregar os dados de contato.");
        }

      } catch (error) {
        console.error(error);
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Erro inesperado ao carregar o contato.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContato();
  }, []);

  function handleChange<K extends keyof ContatoFormData>(field: K, value: ContatoFormData[K]) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setFeedback({
        type: "error",
        message: "Sessão expirada. Faça login novamente.",
      });
      return;
    }

    if (!contatoId) {
      setFeedback({
        type: "error",
        message: "Nenhum registro de contato foi encontrado para atualização.",
      });
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);
      const authorization = buildAuthorizationHeader(token);

      const response = await fetch(`${API_BASE_URL}/${resourcePath}/${contatoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const errorMessage =
          errorBody?.message ?? "Não foi possível atualizar os dados de contato.";
        throw new Error(errorMessage);
      }

      setFeedback({
        type: "success",
        message: "Dados atualizados com sucesso!",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao salvar as alterações.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F3]">
      <Header navLinks={navLinks} />
      <SectionTitle
          title="Gerenciar Contato"
          text="Atualize os dados exibidos na página de contato. As alterações são salvas diretamente no banco de dados."
      />

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {loading ? (
          <div className="mt-10 w-full flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5E635D]"></div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-12 bg-white rounded-3xl shadow-lg p-8 grid grid-cols-1 gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-[#5E635D] mb-2">
                Instagram (link completo)
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(event) => handleChange("instagram", event.target.value)}
                className="w-full rounded-xl border border-[#DDB7AB] px-4 py-3 bg-[#FAF6F3] text-[#5E635D] focus:outline-none focus:ring-2 focus:ring-[#DDB7AB]"
                placeholder="https://instagram.com/seu_perfil"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5E635D] mb-2">
                TikTok (link completo)
              </label>
              <input
                type="url"
                value={formData.tiktok}
                onChange={(event) => handleChange("tiktok", event.target.value)}
                className="w-full rounded-xl border border-[#DDB7AB] px-4 py-3 bg-[#FAF6F3] text-[#5E635D] focus:outline-none focus:ring-2 focus:ring-[#DDB7AB]"
                placeholder="https://www.tiktok.com/@seu_usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5E635D] mb-2">
                E-mail de contato
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="w-full rounded-xl border border-[#DDB7AB] px-4 py-3 bg-[#FAF6F3] text-[#5E635D] focus:outline-none focus:ring-2 focus:ring-[#DDB7AB]"
                placeholder="contato@florir.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5E635D] mb-2">
                Telefone (somente números)
              </label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(event) => handleChange("telefone", event.target.value)}
                inputMode="numeric"
                className="w-full rounded-xl border border-[#DDB7AB] px-4 py-3 bg-[#FAF6F3] text-[#5E635D] focus:outline-none focus:ring-2 focus:ring-[#DDB7AB]"
                placeholder="71999999999"
                pattern="[0-9]{10,11}"
              />
              <p className="text-xs text-[#6b6f69] mt-2">
                Utilize DDD seguido do número (ex: 71912255528).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5E635D] mb-2">
                WhatsApp QR Code (URL da imagem)
              </label>
              <input
                type="url"
                value={formData.whatsappQRCode}
                onChange={(event) => handleChange("whatsappQRCode", event.target.value)}
                className="w-full rounded-xl border border-[#DDB7AB] px-4 py-3 bg-[#FAF6F3] text-[#5E635D] focus:outline-none focus:ring-2 focus:ring-[#DDB7AB]"
                placeholder="https://exemplo.com/qr-code.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5E635D] mb-2">
                Texto alternativo do QR Code
              </label>
              <input
                type="text"
                value={formData.altText}
                onChange={(event) => handleChange("altText", event.target.value)}
                className="w-full rounded-xl border border-[#DDB7AB] px-4 py-3 bg-[#FAF6F3] text-[#5E635D] focus:outline-none focus:ring-2 focus:ring-[#DDB7AB]"
                placeholder="QR Code para contato via WhatsApp"
              />
            </div>

            {feedback && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  feedback.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-full bg-[#5E635D] text-white font-medium tracking-wide transition duration-300 hover:bg-[#4A4E47] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
