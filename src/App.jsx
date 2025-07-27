// src/App.jsx
import React, { useState } from "react";
import UploadXml from "./pages/UploadXml.jsx";
import ListaPage from "./pages/ListaPage.jsx";

export default function App() {
  const [reload, setReload] = useState(0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-semibold">📄 Sistema de NF‑e</h1>

      <section className="mb-12 space-y-4">
        <h2 className="text-xl font-medium">
          1. Enviar XML&nbsp;+&nbsp;Gerar PDF
        </h2>
        <UploadXml onSuccess={() => setReload((r) => r + 1)} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">2. Listagem de Notas</h2>
        <ListaPage reload={reload} />
      </section>
    </div>
  );
}

