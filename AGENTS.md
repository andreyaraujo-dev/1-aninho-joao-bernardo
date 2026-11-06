# Diretrizes do projeto

Aplicação web do convite de 1 ano do João Bernardo. O projeto é um monólito
full-stack em Next.js, com convite público, confirmação de presença por link
individual e área administrativa para gerenciar convidados e dados do evento.

## Stack e versões

- Node.js 22 e pnpm 10.34.3, definidos em `.mise.toml`.
- Next.js 16 com App Router, React 19 e React DOM 19.
- TypeScript 5.7 em modo estrito, com alias `@/*` apontando para `src/*`.
- Tailwind CSS 4 via `@tailwindcss/postcss`.
- shadcn/ui com preset `base-nova`, componentes próprios em
  `src/components/ui` e ícones Lucide.
- Prisma 6.19 com MongoDB e cliente gerado em `generated/prisma`.
- Zod para validação, `bcryptjs` para senhas e `jose` para sessões JWT.
- `next-themes` e `sonner` para tema e notificações.
- Biome para lint e Prettier para formatação.
- Lefthook executa formatação e lint nos arquivos staged durante o commit.

Não adicione dependências sem necessidade. Use pnpm e atualize
`package.json` e `pnpm-lock.yaml` juntos quando uma dependência for realmente
necessária.

## Estrutura principal

```text
.
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions de autenticação, evento e convidados
│   │   ├── admin/            # Login e telas protegidas da administração
│   │   ├── layout.tsx        # Layout raiz, metadata, tema e providers
│   │   └── page.tsx          # Entrada pública do convite
│   ├── components/
│   │   ├── admin/            # Componentes da área administrativa
│   │   ├── ui/               # Componentes shadcn/base-nova
│   │   └── *.tsx             # Seções do convite público
│   ├── config/               # Configurações estáticas da experiência
│   ├── hooks/                # Hooks de interação e responsividade
│   ├── lib/                  # Prisma, sessão, evento, tokens e validação
│   ├── App.tsx               # Composição da página pública
│   ├── index.css             # Tailwind, fontes e estilos globais
│   └── proxy.ts              # Proteção de rotas /admin
├── prisma/
│   ├── schema.prisma         # Modelos MongoDB e enums
│   └── seed.ts               # Usuário administrador e evento inicial
├── generated/prisma/         # Saída gerada pelo Prisma; não editar manualmente
├── public/                   # Assets públicos e favicon
├── next.config.ts            # Configuração do Next e tracing do Prisma
├── postcss.config.mjs        # Plugin Tailwind CSS 4
├── components.json           # Configuração e aliases do shadcn/ui
├── biome.json                # Regras de lint
├── .prettierrc.json          # Regras de formatação
└── lefthook.yml              # Hooks de pre-commit
```

Arquivos gerados ou de saída (`.next`, `dist`, `generated/prisma`,
`node_modules`) não devem ser editados nem incluídos em mudanças manuais.

## Arquitetura e fluxos

### Convite público

- `src/app/page.tsx` busca o evento no servidor e renderiza `src/App.tsx`.
- A página é dinâmica (`force-dynamic`) porque lê o evento e o parâmetro
  `?guest=<token>`.
- `App.tsx` compõe as seções Hero, convite, presentes, RSVP, localização e
  rodapé. O `useReveal` controla as animações de entrada e a navegação usa
  scroll suave por âncoras.
- O RSVP usa o token individual do convidado. `getGuestByToken` carrega o
  convidado e `respondGuestAction` aceita somente `CONFIRMADO` ou
  `NAO_CONFIRMADO`, registrando também a data da resposta.

### Administração

- Rotas em `src/app/admin`:
  - `/admin/login`: autenticação.
  - `/admin`: painel inicial.
  - `/admin/convidados`: criação, edição, exclusão e status dos convidados.
  - `/admin/evento`: edição da data e mensagem do evento.
- `src/app/actions/auth.ts` centraliza login, logout e `requireUser`.
- `src/proxy.ts` protege todas as rotas `/admin` exceto `/admin/login` e
  redireciona sessões inválidas.
- A sessão usa JWT HS256 em cookie `access_token`, assinado e verificado em
  `src/lib/access-token.ts`. O cookie é `httpOnly`, `sameSite=lax`, `secure`
  em produção e dura 8 horas.
- O acesso administrativo é encerrado depois do fim do dia do evento no fuso
  `America/Sao_Paulo`. Preserve essa regra ao alterar autenticação ou rotas.
- Toda Server Action administrativa deve chamar `requireUser()` antes de
  acessar ou alterar dados.

### Persistência

- O banco é MongoDB configurado por `DATABASE_URL`.
- Os modelos estão em `prisma/schema.prisma`: `User`, `Guest`, `GuestLink` e
  `Event`, além dos enums de status.
- `src/lib/prisma.ts` mantém uma instância global em desenvolvimento para
  evitar múltiplas conexões durante hot reload.
- `src/lib/event.ts` garante a existência de um evento e centraliza a regra de
  evento encerrado.
- Tokens de convidados são gerados com `randomBytes(...).toString("base64url")`;
  não substitua por identificadores previsíveis.

## Variáveis de ambiente

Use `.env.example` como referência. Nunca comite valores reais, credenciais ou
segredos.

- `DATABASE_URL`: conexão com o MongoDB.
- `SESSION_SECRET`: segredo da sessão; em produção deve ter pelo menos 32
  caracteres.
- `NEXT_PUBLIC_SITE_URL`: URL pública usada para gerar/compartilhar links.
- `ADMIN_LOGIN` e `ADMIN_PASSWORD`: credenciais usadas pelo seed inicial.
- `EVENT_DATE`: data padrão do evento em formato ISO.
- `EVENT_MESSAGE`: mensagem padrão exibida no convite.

O seed usa valores de desenvolvimento quando variáveis opcionais não estão
definidas. Não use esses defaults em produção.

## Comandos

Instale as dependências com:

```bash
pnpm install
```

Desenvolvimento:

```bash
pnpm dev
```

No ambiente Figma Make, o servidor de desenvolvimento normalmente já está
rodando em `$PORT` (padrão `8443`); não inicie outro servidor sem necessidade.
O hot reload atualiza o preview automaticamente.

Validação e produção:

```bash
pnpm lint              # Biome
pnpm lint:fix          # Corrige problemas do Biome
pnpm format            # Prettier
pnpm format:check      # Verifica formatação
pnpm build             # Gera Prisma e executa next build
pnpm start             # Serve o build de produção
```

Banco e Prisma:

```bash
pnpm db:generate       # Gera generated/prisma
pnpm db:migrate        # Executa prisma db push (não é uma migration versionada)
pnpm db:seed           # Executa prisma db seed
```

Não há suíte de testes automatizados configurada atualmente. Para mudanças de
comportamento, valide ao menos com `pnpm lint` e `pnpm build`, além de testar
manualmente o fluxo afetado no preview.

## Convenções de implementação

- Prefira Server Components por padrão. Use `"use client"` somente para
  interatividade, estado ou APIs do navegador.
- Server Actions devem validar toda entrada com os schemas de
  `src/lib/validation.ts` e retornar mensagens explícitas no padrão existente.
- Não confie em validação feita apenas no cliente; a validação do servidor é a
  fonte de verdade.
- Revalide as rotas afetadas com `revalidatePath` após mutações.
- Use os aliases `@/...` em imports internos.
- Preserve o estilo existente: aspas duplas, sem ponto e vírgula e trailing
  commas conforme `.prettierrc.json`.
- Use utilitários Tailwind diretamente no JSX. Customizações globais ficam em
  `src/index.css`, com imports CSS primeiro.
- Estilos globais de elementos devem ficar dentro de `@layer base` para que
  utilitários Tailwind possam sobrescrevê-los.
- Reutilize componentes de `src/components/ui` e utilitários existentes antes
  de criar variantes duplicadas.
- Mantenha textos voltados ao usuário em português do Brasil e preserve
  acessibilidade, responsividade e suporte a teclado.
- Ao alterar o schema Prisma, gere o cliente e verifique os impactos nas
  Server Actions, seed e tipos derivados.
- Não exponha `SESSION_SECRET`, senhas, tokens de convidados ou dados pessoais
  em logs, mensagens de erro, código cliente ou commits.

## Checklist para mudanças

1. Leia os arquivos relacionados e preserve alterações locais existentes.
2. Siga os fluxos e helpers já centralizados para sessão, evento, validação e
   Prisma.
3. Atualize documentação diretamente relacionada quando contratos ou comandos
   mudarem.
4. Rode o menor comando de validação que cubra a alteração; para mudanças
   estruturais, rode também `pnpm lint` e `pnpm build`.
5. Verifique o diff e não inclua `.env`, artefatos gerados ou arquivos
   temporários.
