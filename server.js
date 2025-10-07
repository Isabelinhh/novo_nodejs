const express = require('express');
const path = require('path');

// Importar rotas
const usersRoutes = require('./routes/users');
const filesRoutes = require('./routes/files');
const messagesRoutes = require('./routes/messages');
const metricsRoutes = require('./routes/metrics');

// Importar dados
const { users } = require('./data/users');
const { files } = require('./data/files');
const { messages } = require('./data/messages');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE BÁSICO =====

// Middleware para parsing JSON
app.use(express.json());

// Middleware para parsing URL encoded
app.use(express.urlencoded({ extended: true }));

// Middleware de log básico
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// ===== ROTAS PRINCIPAIS =====

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'API REST Simples - Exercício 32',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            files: '/api/files',
            messages: '/api/messages',
            metrics: '/api/metrics'
        },
        documentation: 'Consulte o README.md para mais informações'
    });
});

// Rota de status
app.get('/status', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// ===== ROTAS DA API =====

// Configurar rotas da API
app.use('/api/users', usersRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/metrics', metricsRoutes);

// ===== TRATAMENTO DE ERROS =====

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Middleware de tratamento de erros global
app.use((error, req, res, next) => {
    console.error('Erro no servidor:', error);
    
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====

const server = app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 SERVIDOR INICIADO COM SUCESSO!');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));
    console.log('📋 Endpoints disponíveis:');
    console.log(`   GET  /                    - Informações da API`);
    console.log(`   GET  /status             - Status do servidor`);
    console.log(`   GET  /api/users          - Listar usuários`);
    console.log(`   POST /api/users          - Criar usuário`);
    console.log(`   GET  /api/files          - Listar arquivos`);
    console.log(`   POST /api/files          - Simular upload`);
    console.log(`   GET  /api/messages       - Listar mensagens`);
    console.log(`   POST /api/messages       - Criar mensagem`);
    console.log(`   GET  /api/metrics        - Métricas do sistema`);
    console.log('='.repeat(50));
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
    console.log('\\n🛑 Recebido SIGTERM. Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com sucesso.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\\n🛑 Recebido SIGINT. Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado com sucesso.');
        process.exit(0);
    });
});

module.exports = app;