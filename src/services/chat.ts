import OpenAI from "openai";
import dotenv from 'dotenv';
import { db } from "../controllers/database";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
    throw new Error('A chave de API do OpenAI não está definida. Por favor, defina a variável de ambiente OPENAI_API_KEY.');
}

export async function GPT(message: string) {

    const databaseSchema = await tables();

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente SQL. Com base na estrutura do banco de dados fornecida, gere apenas o comando SQL em MySQL (somente SELECT). Retorne **apenas** o código, sem explicações. Caso a pergunta não envolva banco de dados, comporte-se como um assistente comum.",
                },
                {
                    role: "system",
                    content: databaseSchema,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        const sql: string = response.choices[0].message.content || '';
        const sqlCurrent = sql.replace(/```sql\s*/gi, '').replace(/```/g, '');

        if (!sqlCurrent.trim()) {
            throw new Error('Nenhum comando SQL foi gerado. Verifique a entrada e tente novamente.');
        }

        const resposta = await executeSQL(sqlCurrent.trim(), message);

        return resposta;
    } catch (error) {
        throw new Error(`Erro ao chamar a API do OpenAI: ${error}`);
    }
}

export async function tables() {

    const [rows] = await db.query(
        `SELECT 
            TABLE_NAME,
            COLUMN_NAME,
            DATA_TYPE,
            CHARACTER_MAXIMUM_LENGTH,
            IS_NULLABLE,
            COLUMN_KEY,
            COLUMN_TYPE,
            EXTRA
        FROM 
            INFORMATION_SCHEMA.COLUMNS
        WHERE 
            TABLE_SCHEMA = ?
        ORDER BY 
            TABLE_NAME, ORDINAL_POSITION;`,
        [process.env.DB_NAME]
    );

    const tables: { [key: string]: any[] } = {};

    for (const row of rows as any) {
        if (!tables[row.TABLE_NAME]) {
            tables[row.TABLE_NAME] = [];
        }
        tables[row.TABLE_NAME].push(row);
    }

    let schemaText = 'Estrutura do Banco de Dados:\n\n';
    for (const [tabela, colunas] of Object.entries(tables)) {
        schemaText += `Tabela: ${tabela}\n`;
        for (const col of colunas as any[]) {
            schemaText += `  - Coluna: ${col.COLUMN_NAME}, Tipo: ${col.DATA_TYPE}, Tamanho: ${col.CHARACTER_MAXIMUM_LENGTH}, Nulo: ${col.IS_NULLABLE}, Chave: ${col.COLUMN_KEY}, Tipo de Coluna: ${col.COLUMN_TYPE}, Extra: ${col.EXTRA}\n`;
        }
        schemaText += '\n';
    }

    return schemaText;
}

export async function executeSQL(sql: string, mensagem: string) {
    try {
        const [rows] = await db.query(sql);
        const isArray = Array.isArray(rows);
        const hasResults = isArray && rows.length > 0;

        const resultText = hasResults
            ? `Resultado da consulta:\n${JSON.stringify(rows, null, 2).slice(0, 4000)}`
            : "Nenhum resultado encontrado.";

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente que executa comandos SQL e responde de forma clara, objetiva e direta os resultados.",
                },
                {
                    role: "system",
                    content: resultText,
                },
                {
                    role: "user",
                    content: mensagem,
                },
            ],
        });

        return response.choices[0].message.content || 'Sem resposta do modelo.';
    } catch (error: any) {
        console.error("Erro ao executar SQL:", error);
        throw new Error(`Erro ao executar SQL: ${error.message || error}`);
    }
}
