# 🛠️ Guia de Manutenção e Edição - Acelera Instrutor

Este manual destina-se a desenvolvedores, designers e administradores que precisam fazer alterações de texto, preços, contatos ou novos deploys no projeto **Acelera Instrutor**.

---

## 📱 1. Alterar Número de Telefone / WhatsApp

Os links de WhatsApp estão presentes em diversos botões ao longo do arquivo `index.html` e no script `app.js`.

### No arquivo `index.html`:
Procure por links com o formato `https://wa.me/5596981461881` e substitua pelo novo número com DDD:
```html
<!-- Exemplo no cabeçalho e rodapé -->
<a href="https://wa.me/55SEUDDDENUMERO?text=Sua%20mensagem" target="_blank" class="btn-whatsapp">
```

### No arquivo `app.js`:
Altere as ocorrências de fallback do telefone nas funções de orçamento e modal:
```javascript
// Linhas ~176 e ~278 no app.js
const clientPhone = document.getElementById('propPhone').value.trim() || '(96) 98146-1881';
window.open(`https://wa.me/5596981461881?text=${message}`, '_blank');
```

---

## 💰 2. Alterar Preços dos Serviços Modulares

Os preços dos serviços individuais exibidos no formulário de orçamento são definidos diretamente nos atributos `data-price` do HTML em `index.html`.

### No arquivo `index.html`:
```html
<!-- Exemplo de item de serviço -->
<div class="service-select-item" data-name="Pacote Descomplica (Assessoria Detran)" data-price="450.00">
  <input type="checkbox" class="service-checkbox">
  <span>Pacote Descomplica - R$ 450,00</span>
</div>
```
Para alterar o preço, basta modificar o valor no atributo `data-price="NOVO_VALOR"`.

---

## 📦 3. Editar Entregáveis dos Pacotes Comerciais

As informações exibidas nos modais da seção "Fases de Aceleração" são gerenciadas no objeto `packagesData` dentro do arquivo `app.js`.

### No arquivo `app.js` (linha ~292):
```javascript
const packagesData = {
  burocracia: {
    title: 'Fase 1: Estruturação e Licenciamento',
    description: 'Sua licença autônoma operando rápido e dentro da lei...',
    deliverables: [
      'Redação e protocolo técnico de Ofícios para o Detran',
      'Emissão e acompanhamento de Certidões Obrigatórias',
      'Modelos de declarações e apoio ao credenciamento'
    ],
    audience: 'Instrutores autônomos que desejam eliminar a burocracia...'
  }
};
```
Basta editar os textos nos arrays de `deliverables` ou nas propriedades de descrição.

---

## 🎨 4. Personalizar Cores da Marca e Temas

Todas as cores da interface estão definidas como variáveis globais no início de `styles.css`.

```css
:root {
  /* Altere estas variáveis para mudar a identidade visual */
  --navy-dark: #0B1E36;    /* Cor principal (Cabeçalhos e textos) */
  --blue-brand: #0047AB;   /* Azul de contraste */
  --yellow-brand: #F4A900; /* Amarelo de destaques */
  --green-brand: #008744;  /* Verde de botões de conversão */
}
```

---

## 🖼️ 5. Atualizar Imagens e Logomarca

As imagens da marca ficam armazenadas na pasta `assets/`:
- `assets/logo.jpg`: Logo em formato quadrado (utilizada no header, favicons e cards).
- `assets/logo-horizontal.jpg`: Logo horizontal (utilizada em propostas impresas/PDF).

Para trocar as imagens, substitua os arquivos mantendo o mesmo nome ou atualize as referências na tag `<img>` do `index.html`.

---

## 🔍 Resolução de Problemas Frequentes (Troubleshooting)

### O PDF baixado está cortando linhas ou desalinhado:
- Verifique a escala na chamada do `html2pdf` no `app.js` (parâmetro `html2canvas: { scale: 2 }`).
- Garanta que a janela do navegador esteja visível durante a captura.

### Os ícones do FontAwesome não aparecem:
- Verifique se a conexão com a internet está ativa, pois a biblioteca é carregada via CDN no `<head>` do `index.html`:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  ```
