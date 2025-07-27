
import React from "react"; 
// src/pages/ListaPage.jsx
import { useEffect, useState } from "react";
import { buscarNotas } from "../services/notaService";

export default function ListaPage({ reload }) {
  const [notas, setNotas] = useState([]);
  const [busca, setBusca] = useState("");

  async function carregar() {
    const res = await buscarNotas(busca);
    setNotas(res);
  }

  useEffect(() => {
    carregar();
  }, [reload]); // recarrega quando “reload” mudar

  /* Pressionar Enter também dispara busca */
  const handleKey = (e) => e.key === "Enter" && carregar();

  return (
    <section className="container mx-auto px-4 py-6">
      {/* Barra de busca */}
      <div className="sticky top-0 z-10 mb-6 flex gap-2 rounded-lg border bg-white/70 p-4 backdrop-blur">
        <input
          type="text"
          placeholder="🔍 Buscar por número da nota..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={carregar}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Buscar
        </button>
      </div>

      {/* Grid de notas */}
      {notas.length === 0 ? (
        <p className="text-center text-slate-500">Nenhuma nota encontrada.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notas.map((nota) => (
            <article
              key={nota._id}
              className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
            >
              {/* Cabeçalho */}
              <header className="border-b p-4">
                <h3 className="text-lg font-medium">NF‑e&nbsp;{nota.numero}</h3>
                <time className="block text-xs text-slate-500">
                  {new Date(nota.dataEmissao).toLocaleString()}
                </time>
              </header>

              {/* Corpo */}
              <div className="flex-1 space-y-1 p-4 text-sm">
                <p>
                  <span className="font-semibold">Emitente:</span>{" "}
                  {nota.remetente?.xNome}
                </p>
                <p>
                  <span className="font-semibold">Destinatário:</span>{" "}
                  {nota.destinatario?.xNome}
                </p>
                {nota.transportadora && (
                  <p>
                    <span className="font-semibold">Transportadora:</span>{" "}
                    {nota.transportadora.xNome}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Valor Total:</span> R${" "}
                  {nota.valorTotal}
                </p>

                {/* Produtos */}
                <details className="mt-2">
                  <summary className="cursor-pointer select-none text-indigo-600 hover:underline">
                    Produtos ({nota.produtos.length})
                  </summary>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {nota.produtos.map((p, i) => (
                      <li key={i}>
                        {p.cProd} – {p.xProd} × {p.qCom} = R$ {p.vProd}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {/* Rodapé */}
              <footer className="flex gap-2 border-t p-4">
                <a
                  href={`http://localhost:3001${nota.pdfUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  📄 Visualizar
                </a>
                <a
                  href={`http://localhost:3001${nota.pdfUrl}`}
                  download
                  className="flex-1 rounded-md border border-emerald-600 px-3 py-2 text-center text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                >
                  ⬇️ Baixar
                </a>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

