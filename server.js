import express from "express";
import mercadopago from "mercadopago";

const app = express();
app.use(express.json());

// coloque sua chave secreta do Mercado Pago aqui
mercadopago.configure({
  access_token: "SUA_ACCESS_TOKEN_AQUI"
});

// rota para criar a preferência
app.post("/criar-preferencia", async (req, res) => {
  try {
    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: "Cabo de rede",
          unit_price: 10,
          quantity: 1
        }
      ],
      back_urls: {
        success: "http://localhost:5500/sucesso.html",
        failure: "http://localhost:5500/erro.html",
        pending: "http://localhost:5500/pendente.html"
      },
      auto_return: "approved"
    });

    res.json({ id: preference.body.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
