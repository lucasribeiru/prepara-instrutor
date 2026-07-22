# ⚡ Especificação de Funcionalidades - Acelera Instrutor

Este documento detalha o funcionamento técnico e regras de negócio de cada módulo interativo da aplicação **Acelera Instrutor**.

---

## 1. 🧮 Simulador de Ganhos (Calculadora ROI)

### Propósito
Demonstrar visualmente e de forma interativa o potencial de faturamento do instrutor de trânsito ao trabalhar de forma autônoma (cobrando valor justo e sem repassar comissões para autoescolas).

### Regra de Negócio & Equação Matemática
- **Dias Úteis**: 20 dias por mês (Segunda a Sexta, finais de semana e feriados livres).
- **Fórmula**:
  $$\text{Receita Mensal (R\$)} = \text{Horas Diárias} \times \text{Valor da Hora/Aula} \times 20$$

### Parâmetros de Entrada (Inputs):
- `roiHours`: Slider com variação de `2` a `10` horas diárias (Padrão: `6`).
- `roiClassRate`: Slider com variação de `R$ 50` a `R$ 150` por aula (Padrão: `R$ 100`).

### Exemplo de Cálculo:
Com 6 horas/dia cobrando R$ 100,00/aula:
$$6 \times 100 \times 20 = \text{R\$ 12.000,00/mês}$$

---

## 2. 📄 Construtor de Orçamento & Gerador de PDF

### Propósito
Permitir que a consultoria ou o próprio instrutor selecione os serviços desejados em uma lista modular, insira os dados do cliente e gere uma proposta de orçamento corporativa em PDF instantaneamente.

### Tabela de Serviços Modulares Padrão

| Serviço | Descrição resumida |
| :--- | :--- |
| **Pacote Descomplica (Assessoria Detran)** | Elaboração de documentos, certidões e ofícios técnicos para credenciamento. |
| **Kit Digital do Instrutor** | Arte em PDF para adesivos do carro, planilhas de agenda, cartão e recibo. |
| **Reforma de Perfil (Instagram)** | Foto profissional, bio estratégica e link direto para WhatsApp. |
| **Vídeo de Captação (IA)** | Avatar, roteiro persuasivo e animações com inteligência artificial. |
| **Postagem Profissional (Arte Feed)** | Arte estática estratégica para o feed do Instagram. |
| **Ativação Tráfego Local (Meta Ads)** | Anúncios geolocalizados direcionados à região do instrutor. |
| **Treinamento Express (Vendas WhatsApp)** | Sessão prática (30-45 min) para fechamento de alunos no WhatsApp. |

### Ciclo de Operação do PDF:
1. **Seleção de Itens**: Clique nos cards `.service-select-item` alterna o estado da caixa de seleção (`.service-checkbox`) e recalcula o valor total em tempo real.
2. **População de Dados**: Preenchimento do modal `#pdfRenderContainer` com número aleatório de proposta (`PROP-YYYY-XXXX`), data atual formatada e os dados do cliente.
3. **Geração via `html2pdf.js`**:
   - Configurações do arquivo: margens `0.2in`, formato `letter`, escala `2` do HTML2Canvas para alta definição de fontes.

---

## 3. 📦 Modais Interativos de Pacotes de Serviços

### Propósito
Fornecer informações detalhadas dos pacotes sem poluir visualmente a página principal.

### Pacotes Mapeados em `packagesData`:
- **`burocracia`**: Fase 1 - Licenciamento e Estruturação (Ofícios Detran, certidões e kit digital).
- **`digital`**: Fase 2 - Máquina de Captação (Instagram, Vídeos em IA e Meta Ads).
- **`vendas`**: Fase 3 - Alta Conversão (Mentoria de vendas no WhatsApp e scripts).
- **`elite`**: Solução VIP 360° (Combinação completa de todas as fases).

---

## 4. 💬 Gerador de Deep Links do WhatsApp

### Propósito
Direcionar o visitante da landing page diretamente para o chat do WhatsApp da consultoria com o contexto exato da sua navegação.

### Exemplo de Mensagem Formatada para Orçamentos:
```text
Olá! Meu nome é *[Nome do Cliente]* ([Cidade]).

Gostaria de solicitar o plano de serviços selecionado:
• Pacote Descomplica (Assessoria Detran): R$ ...
• Kit Digital do Instrutor: R$ ...

Total Estimado: R$ 1.049,00

Aguardo instruções para iniciar!
```

---

## 5. 🌓 Alternador de Temas (Light / Dark Mode)

### Mecânica:
- Evento de clique no botão `#themeToggle`.
- Alterna a classe do ícone de lua (`fa-moon`) para sol (`fa-sun`).
- Atualiza o atributo `data-theme` na tag `<html>`.
- Salva o valor `'light'` ou `'dark'` na chave `prepara_theme` do `localStorage`.
