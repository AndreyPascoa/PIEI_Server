
# 🧠 PIEI_Server — Back-end da Plataforma PIEI

Este repositório contém a **API back-end** da plataforma [PIEI](https://github.com/AndreyPascoa/PIEI), um sistema Kanban inteligente que gerencia operações de pequenas empresas, como MEIs, com o suporte da assistente virtual **Hanna**.

> 🌐 Repositório do Front-end: [PIEI (Next.js)](https://github.com/AndreyPascoa/PIEI)

---

## 🚀 Principais Tecnologias

- **Node.js** + **Express.js**
- **TypeScript**
- **Socket.IO** para comunicação em tempo real
- **MySQL** e **MSSQL** para persistência de dados
- **OpenAI API** para integração com a assistente Hanna
- Arquitetura modular com `controllers`, `services`, `routes`, `middlewares`

---

## ⚙️ Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/AndreyPascoa/PIEI_Server.git
cd PIEI_Server

# Configure variáveis de ambiente
cp .env.example .env

# Instale as dependências
npm install

# Rode o servidor
npm run dev
```

A API será iniciada em `http://localhost:5000` por padrão.

---

## 📁 Estrutura do Projeto

```
PIEI_Server/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── routes/          # Definição das rotas
│   ├── services/        # Lógica de negócio
│   ├── middlewares/     # Middlewares (validação, autenticação, etc)
│   └── index.ts         # Ponto de entrada da aplicação
├── .env                 # Configurações do ambiente
├── package.json         # Dependências e scripts
```

---

## 🧠 Sobre a Hanna

A **Hanna** é uma assistente de IA integrada à plataforma que ajuda você com:

- Consultas sobre operações, vendas, estoques e finanças
- Avisos inteligentes e lembretes

---

## 📌 Próximos Passos

- [ ] Logs e monitoramento em produção
- [ ] Testes automatizados
- [ ] IA personalizada por área da empresa

- [ ] Previsões de falhas e insights empresariais baseados em IA
- [ ] Logs e monitoramento em produção
- [ ] Testes automatizados
- [ ] IA personalizada por área da empresa

---

## 🧑‍💻 Autor

Desenvolvido por [Andrey Pascoa](https://github.com/AndreyPascoa)

Sinta-se à vontade para contribuir, reportar problemas ou dar sugestões! 🚀