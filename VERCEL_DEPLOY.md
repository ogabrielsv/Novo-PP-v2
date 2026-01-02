# Guia de Deploy na Vercel

Este projeto está configurado e pronto para deploy na Vercel. Siga os passos abaixo para garantir que tudo funcione corretamente.

## 1. Importação do Projeto
1. Acesse o dashboard da Vercel: [https://vercel.com/new](https://vercel.com/new)
2. Importe o repositório do GitHub: `Novo-PP-v2`

## 2. Configurações de Build (Framework Preset)
A Vercel geralmente detecta automaticamente que é um projeto Next.js.
Porém, como o projeto está em uma subpasta (`raffle-system`), você precisa configurar o **Root Directory**.

1. Na tela de configuração ("Configure Project"):
2. Busque a opção **Root Directory** e clique em "Edit".
3. Selecione a pasta `raffle-system`.

## 3. Variáveis de Ambiente (Environment Variables)
Você precisa adicionar as chaves secretas para que o banco de dados e autenticação funcionem em produção.

Adicione as seguintes variáveis na seção **Environment Variables**:

| Variável | Valor (Exemplo/Descrição) |
|----------|---------------------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?pgbouncer=true` (Sua URL de conexão pooling) |
| `DIRECT_URL` | `postgresql://user:pass@host:5432/db` (Sua URL de conexão direta) |
| `JWT_SECRET` | Gere um hash seguro (ex: `openssl rand -base64 32`) |

> **Nota:** Se você estiver usando Supabase, certifique-se de usar a connection string "Transaction Mode" para o `DATABASE_URL` (Port 6543) e "Session Mode" para `DIRECT_URL` (Port 5432) se necessário, ou siga a documentação do seu provedor.

## 4. Deploy
Clique em **Deploy**.

- A Vercel irá instalar as dependências.
- O script `postinstall` rodará `prisma generate` automaticamente (adicionado no package.json).
- O build do Next.js será executado.

Se tudo estiver correto, seu site estará no ar em minutos!
