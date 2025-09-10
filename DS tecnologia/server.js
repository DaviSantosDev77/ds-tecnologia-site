// Importar a conexão com o banco
const { db } = require('./db/index');
const { posts } = require('./db/schema');

async function testDatabase() {
  try {
    // 1. Inserir um post de exemplo
    console.log('🎯 Inserindo post no banco...');
    const newPost = await db.insert(posts).values({
      title: "Meu primeiro post",
      content: "Conteúdo do post criado via Drizzle!"
    }).returning();
    
    console.log('✅ Post inserido:', newPost[0]);

    // 2. Ler todos os posts
    console.log('📖 Buscando todos os posts...');
    const allPosts = await db.select().from(posts);
    console.log('✅ Posts encontrados:', allPosts);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Executar o teste
testDatabase();