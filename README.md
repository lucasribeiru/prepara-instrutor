# 🚀 Acelera Instrutor

> **Central Estratégica B2B & Inteligência de Dados para Instrutores de Trânsito Autônomos**

O **Acelera Instrutor** é uma plataforma web desenvolvida para atuar como a primeira aceleradora de negócios focada exclusivamente em alavancar a carreira e o faturamento de instrutores de trânsito autônomos. A aplicação transforma tarefas burocráticas em produtividade, permite simulações financeiras em tempo real, gera orçamentos personalizados em PDF e facilita a captação direta de alunos via WhatsApp sem intermediários ou cobrança de comissões.

---

## 📋 Sumário de Documentação

- [📖 README.md](README.md) - Visão Geral, Tecnologias e Instalação (este arquivo)
- [🖥️ APRESENTACAO_VENDAS.html](APRESENTACAO_VENDAS.html) - Pitch Deck de Vendas Comercial (Slides Interativos em HTML/PDF)
- [🎨 MANUAL_IDENTIDADE_VISUAL.html](MANUAL_IDENTIDADE_VISUAL.html) - Guia de Marca & Manual de ID Visual Oficial (PDF/Web)
- [🏗️ ARCHITECTURE.md](ARCHITECTURE.md) - Arquitetura Frontend, Diagramas Mermaid e Fluxo de Dados
- [⚡ FEATURES.md](FEATURES.md) - Especificação Funcional dos Módulos (Calculadora ROI, PDF, Modais)
- [🛠️ GUIA_DE_MANUTENCAO.md](GUIA_DE_MANUTENCAO.md) - Manual do Desenvolvedor para Alterações de Preços, Contatos e Textos

---

## ✨ Funcionalidades Principais

1. **🧮 Simulador de Ganhos (Calculadora ROI)**:
   - Permite ao instrutor simular seu potencial de faturamento mensal ajustando as horas diárias trabalhadas e o valor da hora/aula.
   - Cálculo baseado em 20 dias úteis mensais (segunda a sexta-feira), evidenciando a proposta de 100% de lucro ao instrutor.

2. **📄 Construtor de Orçamento & Gerador de PDF**:
   - Seleção interativa de serviços modulares (Assessoria Detran, Kit Digital, Marketing no Instagram, Vídeos em IA, Tráfego Pago Meta Ads e Mentoria de Vendas).
   - Cálculo dinâmico do valor total da proposta.
   - Visualização prévia da folha de orçamento corporativa.
   - Exportação direta em PDF via `html2pdf.js` ou impressora nativa do sistema (`window.print`).

3. **📦 Modais Interativos de Pacotes de Serviços**:
   - Modais responsivos para detalhamento completo das entregas de cada fase do método de aceleração (Licenciamento, Captação, Conversão e Pacote Premium 360°).

4. **🌓 Alternador de Tema (Light / Dark Mode)**:
   - Suporte completo a tema claro e tema escuro com persistência da preferência do usuário no `localStorage`.

5. **💬 Integração Direta com WhatsApp**:
   - Links com mensagens pré-formatadas e personalizadas para orçamentos, dúvidas sobre pacotes e atendimento comercial direto (`wa.me`).

6. **❓ Acordeão de FAQ & Prova Social**:
   - Seção interativa de perguntas frequentes para quebra de objeções e apresentação de casos de sucesso reais.

---

## 🛠️ Stack Tecnológica

- **Core**: HTML5 Semântico, CSS3 Moderno (Custom Properties/Tokens), JavaScript Vanilla (ES6+ DOM).
- **Estilização e Design System**:
  - Paleta de cores corporativa personalizada (Navy Blue `#0B1E36`, Gold `#F4A900`, Emerald Green `#008744`).
  - Tipografia: Google Font **Montserrat**.
  - Ícones: **FontAwesome v6.5.1**.
- **Bibliotecas Externas**:
  - `html2pdf.js v0.10.1` (Geração de PDFs no navegador).

---

## 📁 Estrutura de Arquivos

```text
prepara-instrutor/
├── index.html            # Estrutura principal da página web (Markup semântico)
├── styles.css            # Design System, variáveis CSS, temas e responsividade
├── app.js                # Lógica interativa JS (Calculadoras, PDF, Modais, Temas)
├── assets/               # Imagens e recursos visuais
│   ├── logo.jpg          # Logo quadrada do Acelera Instrutor
│   └── logo-horizontal.jpg # Logo horizontal para cabeçalhos e documentos
├── README.md             # Documentação principal
├── ARCHITECTURE.md       # Documentação de Arquitetura
├── FEATURES.md           # Especificação das Funcionalidades
└── GUIA_DE_MANUTENCAO.md # Guia de Manutenção e Edição
```

---

## 🚀 Como Executar Localmente

Como a plataforma é baseada em web estática de alta performance, ela não necessita de servidores backend nem de instalação de dependências `npm`.

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/lucasribeiru/prepara-instrutor.git
   cd prepara-instrutor
   ```

2. **Abrir no Navegador**:
   - Basta abrir o arquivo `index.html` em qualquer navegador moderno.
   - Ou utilize uma extensão de servidor local como o **Live Server** (VS Code) para recarregamento automático.

---

## 🌐 Publicação (Deploy)

A plataforma pode ser hospedada gratuitamente em qualquer serviço de hospedagem estática:

- **GitHub Pages**: Selecione a branch `main` nas configurações do repositório em *Pages*.
- **Vercel / Netlify**: Conecte o repositório GitHub e selecione o diretório raiz para deploy instantâneo.
