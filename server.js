const express = require('express');
const mercadopago = require('mercadopago'); // ← IMPORTE ASSIM

const app = express();
app.use(express.json());

// ⚠️ CONFIGURE COM SEU ACCESS_TOKEN REAL ⚠️
mercadopago.configure({
    sandbox: true, // true para testes
    access_token: 'APP_USR-1234567890123456-123456-abcdefghijklmnopqrstuvwxyz123456' // ← Cole seu token aqui
});

app.post('/criar-preferencia', async (req, res) => {
    try {
        console.log('📦 Dados recebidos:', req.body);

        const { items } = req.body;

        // Validação
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ 
                error: "Array de items é obrigatório"
            });
        }

        // Preparar itens
        const preferenceItems = items.map(item => ({
            title: item.title || 'Produto',
            unit_price: Number(item.unit_price) || 0,
            quantity: Number(item.quantity) || 1,
            currency_id: item.currency_id || 'BRL'
        }));

        // Criar preferência
        const preference = {
            items: preferenceItems,
            back_urls: {
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending"
            },
            auto_return: "approved"
        };

        console.log('🛒 Criando preferência...');

        // Chamada CORRETA para o Mercado Pago
        const result = await mercadopago.preferences.create(preference);
        
        console.log('✅ Preferência criada! ID:', result.body.id);

        res.json({
            success: true,
            id: result.body.id,
            init_point: result.body.init_point,
            sandbox_init_point: result.body.sandbox_init_point
        });

    } catch (error) {
        console.error('❌ Erro detalhado:', error.message);
        
        res.status(500).json({ 
            error: "Erro ao criar preferência",
            details: error.message
        });
    }
});

// Rota de status para teste
app.get('/status', (req, res) => {
    res.json({ status: 'Servidor rodando!', time: new Date().toISOString() });
});

app.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta 3000');
});