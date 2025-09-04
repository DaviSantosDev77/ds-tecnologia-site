import express from "express";
import mercadopago from "mercadopago";
import cors from "cors"; // Importa o CORS

const app = express();
app.use(express.json());
app.use(cors()); // Adiciona o CORS para permitir a comunicação entre o teu site e este servidor

// MUDANÇA 1: Ler a chave secreta de uma variável de ambiente
// Isto torna o teu código muito mais seguro.
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Rota para criar a preferência de pagamento
app.post("/criar-preferencia", async (req, res) => {
  try {
    // MUDANÇA 2: Ler os itens do carrinho que o front-end enviou
    const { itens } = req.body;

    // Validação para garantir que recebemos os itens
    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'A lista de itens é inválida ou está vazia.' });
    }

    // Prepara os itens no formato que o Mercado Pago espera
    const items_mercadopago = itens.map(item => ({
      title: item.nome,
      unit_price: item.preco,
      quantity: item.quantidade,
      currency_id: 'BRL'
    }));

    const preference = await mercadopago.preferences.create({
      items: items_mercadopago, // Usa a lista de itens dinâmica
      
      // MUDANÇA 3: URLs que apontam para o teu site real
      back_urls: {
        success: "https://ds-tecnologia.netlify.app/sucesso.html", // Altere se necessário
        failure: "https://ds-tecnologia.netlify.app/falha.html",   // Altere se necessário
        pending: "https://ds-tecnologia.netlify.app/pendente.html" // Altere se necessário
      },
      auto_return: "approved"
    });

    res.json({ id: preference.body.id });

  } catch (erro) { // MUDANÇA 4: Correção do nome da variável de erro
    console.error(erro); // Mostra o erro detalhado no console do servidor
    res.status(500).json({ error: "Erro ao criar preferência de pagamento." });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
