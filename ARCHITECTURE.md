# 🏗️ Arquitetura do Sistema - Acelera Instrutor

Este documento descreve a arquitetura técnica, os padrões de design de código, os fluxos de dados e as convenções adotadas na aplicação web **Acelera Instrutor**.

---

## 🏛️ Visão Geral da Arquitetura

O sistema adota uma arquitetura **Single Page Application (SPA) Estática baseada em Vanilla JS**. A escolha por não utilizar frameworks pesados (como React, Angular ou Vue) garante os seguintes benefícios estratégicos:

1. **Desempenho Extremo**: Tempo de carregamento inferior a 1 segundo em conexões móveis (3G/4G).
2. **Custo de Hospedagem Zero**: Compatibilidade total com hospedagem estática (GitHub Pages, Netlify, Vercel).
3. **Facilidade de Manutenção**: Código JS modular sem necessidade de etapas complexas de compilação ou bundlers (`webpack`, `vite`).

---

## 📊 Diagramas de Arquitetura (Mermaid)

### 1. Estrutura da Aplicação & Componentes DOM

```mermaid
graph TD
    A[Navegador / Cliente] --> B[index.html]
    B --> C[styles.css - Design System & Tokens]
    B --> D[app.js - Lógica e Eventos]
    B --> E[Recursos Externos]
    
    E --> E1[FontAwesome Icons]
    E --> E2[Google Fonts Montserrat]
    E --> E3[html2pdf.js Bundle]

    subgraph Módulos em app.js
        D --> D1[Theme Toggle & LocalStorage]
        D --> D2[Filter Services]
        D --> D3[ROI Calculator]
        D --> D4[Proposal Builder & PDF Generator]
        D --> D5[Package Detail Modals]
        D --> D6[FAQ Accordion]
    end
```

---

### 2. Fluxo da Calculadora de ROI e Estado em Tempo Real

```mermaid
sequenceDiagram
    autonumber
    actor Instrutor as Instrutor Autônomo
    participant SliderH as Slider Horas (#roiHours)
    participant SliderV as Slider Valor (#roiClassRate)
    participant JS as Handler initRoiCalculator()
    participant DOM as Elemento Total (#roiTotalVal)

    Instrutor->>SliderH: Ajusta horas por dia (2 a 10h)
    SliderH->>JS: Dispara evento 'input'
    Instrutor->>SliderV: Ajusta valor por aula (R$ 50 a R$ 150)
    SliderV->>JS: Dispara evento 'input'
    JS->>JS: Receita Mensal = Horas * Valor * 20 dias
    JS->>DOM: Atualiza texto formatado em R$ (pt-BR)
```

---

### 3. Pipeline de Construtor de Orçamento e Exportação de PDF

```mermaid
flowchart TD
    A[Instrutor seleciona serviços modulares] --> B{Itens selecionados > 0?}
    B -- Não --> C[Exibe alerta de validação]
    B -- Sim --> D[Preenche dados do cliente: Nome, Telefone, Cidade]
    D --> E[Clica em 'Gerar PDF / Imprimir']
    E --> F[Função populatePdfData constrói a tabela HTML em #pdfRenderContainer]
    F --> G[Modal #pdfRenderContainer recebe classe .active]
    
    G --> H{Ação do Usuário}
    H -- Baixar PDF Direto --> I[Função html2pdf processa #pdfContent em Canvas/jsPDF]
    H -- Imprimir / Salvar Nativo --> J[Executa window.print com CSS de impressão]
    H -- Enviar via WhatsApp --> K[Abre link wa.me com mensagem codificada]
```

---

## 🎨 Design System e Tokens CSS

Toda a identidade visual é controlada via **Custom Properties (Variáveis CSS)** no arquivo `styles.css`. Isso permite alterações de marca globais instantâneas.

### Principais Tokens Globais:
- `--navy-dark` (`#0B1E36`): Cor corporativa primária (Confiança e Autoridade).
- `--blue-brand` (`#0047AB`): Azul institucional para destaques e botões secundários.
- `--yellow-brand` (`#F4A900`): Amarelo ouro para badges, destaques e alertas.
- `--green-brand` (`#008744`): Verde esmeralda para botões de conversão e WhatsApp.
- `--font-main`: `'Montserrat', sans-serif`.

### Gerenciamento de Tema (Light / Dark Mode):
O tema é alternado dinamicamente pela alteração do atributo `data-theme` no elemento `<html>`:
```javascript
// Leitura do estado inicial no localStorage
const currentTheme = localStorage.getItem('prepara_theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
```

As variáveis de fundo e texto são sobrescritas no bloco `[data-theme="dark"]` em `styles.css`:
```css
[data-theme="dark"] {
  --bg-primary: #06111E;
  --bg-surface: #0B1E36;
  --bg-card: #0E223D;
  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
}
```

---

## 🔒 Segurança e Privacidade de Dados

- **Sem Coleta de Dados no Server-Side**: Como o aplicativo é estático e cliente-side, nenhum dado digitado no simulador ou no gerador de orçamentos é enviado para servidores externos.
- **Segurança de Links Externos**: Todos os links dinâmicos do WhatsApp utilizam `target="_blank"` e codificação de URL segura via `encodeURIComponent()`.
