import { useState } from "react";

export default function CepLookup() {
  const [cep, setCep] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateCep = (cep) => /^[0-9]{8}$/.test(cep);

  const fetchCep = async () => {
    if (!validateCep(cep)) {
      setError("CEP inválido. Insira um CEP com 8 dígitos numéricos.");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const result = await response.json();
      if (result.erro) {
        throw new Error("CEP não encontrado.");
      }
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Digite o CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button 
          onClick={fetchCep} 
          disabled={loading || !cep.trim()}
          style={{ padding: "8px 16px", borderRadius: "4px", backgroundColor: "#007BFF", color: "white", border: "none", cursor: "pointer" }}
        >
          {loading ? "Carregando..." : "Buscar"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "4px", maxWidth: "300px", backgroundColor: "blue" }}>
          <p><strong>Logradouro:</strong> {data.logradouro}</p>
          <p><strong>Bairro:</strong> {data.bairro}</p>
          <p><strong>Cidade:</strong> {data.localidade}</p>
          <p><strong>Estado:</strong> {data.uf}</p>
        </div>
      )}
    </div>
  );
}
