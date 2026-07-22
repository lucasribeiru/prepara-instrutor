/* ==========================================================================
   PREPARA INSTRUTOR - INTERACTIVE JAVASCRIPT (B2B NEGÓCIOS & PDF GENERATOR)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initServiceFilters();
  initRoiCalculator();
  initProposalBuilder();
  initPackageModals();
  initFaqAccordion();
});


/* 1. Theme Toggle (Light / Dark) */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('prepara_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('prepara_theme', theme);
    updateThemeIcon(toggleBtn, theme);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

/* 2. Service Category Filtering */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.service-filter');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;

      serviceCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 3. ROI Simulator for Driving Instructors */
function initRoiCalculator() {
  const hoursInput = document.getElementById('roiHours');
  const rateInput = document.getElementById('roiClassRate');
  const hoursVal = document.getElementById('roiHoursVal');
  const rateVal = document.getElementById('roiClassRateVal');
  const totalVal = document.getElementById('roiTotalVal');

  if (!hoursInput || !rateInput) return;

  function updateRoi() {
    const hoursPerDay = parseInt(hoursInput.value);
    const ratePerHour = parseInt(rateInput.value);

    // Calculado sobre 20 dias úteis no mês (Segunda a Sexta, sem sábados, domingos e feriados)
    const monthlyRevenue = hoursPerDay * ratePerHour * 20;

    hoursVal.textContent = `${hoursPerDay} horas por dia`;
    rateVal.textContent = `R$ ${ratePerHour},00 por aula`;
    totalVal.textContent = `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  hoursInput.addEventListener('input', updateRoi);
  rateInput.addEventListener('input', updateRoi);

  updateRoi();
}

/* 4. Proposal Builder & Interactive PDF Modal */
function initProposalBuilder() {
  const items = document.querySelectorAll('.service-select-item');
  const propSelectedList = document.getElementById('propSelectedList');
  const propTotalPrice = document.getElementById('propTotalPrice');
  const btnGeneratePdf = document.getElementById('btnGeneratePdf');
  const btnSendPropWhatsapp = document.getElementById('btnSendPropWhatsapp');

  const pdfModal = document.getElementById('pdfRenderContainer');
  const btnPdfClose = document.getElementById('btnPdfClose');
  const btnPdfPrint = document.getElementById('btnPdfPrint');
  const btnPdfDownloadDirect = document.getElementById('btnPdfDownloadDirect');

  if (!items.length) return;

  const serviceDescriptions = {
    "Pacote Descomplica (Assessoria Detran)": "Elaboração de documentos, certidões, declarações e redação de ofícios técnicos direcionados ao Detran.",
    "Kit Digital do Instrutor": "Pacote em PDF: arte para adesivos do carro (normas Detran), planilhas de agenda, cartão e recibo.",
    "Reforma de Perfil (Instagram)": "Organização do Instagram: foto profissional, bio estratégica e link direto para WhatsApp.",
    "Vídeo de Captação (IA)": "Produção ágil com inteligência artificial: avatar, roteiro persuasivo e animações para reter atenção.",
    "Postagem Profissional (Arte Feed)": "Criação de 1 arte estática estratégica e persuasiva para o feed do Instagram.",
    "Ativação Tráfego Local (Meta Ads)": "Setup e configuração profissional de anúncios geolocalizados direcionados à região do instrutor.",
    "Treinamento Express (Vendas WhatsApp)": "Sessão direta (30 a 45 min) ensinando marketing prático, atendimento e fechamento no WhatsApp."
  };

  function calculateProposal() {
    let total = 0;
    const selectedServices = [];

    items.forEach(item => {
      const checkbox = item.querySelector('.service-checkbox');
      const price = parseFloat(item.dataset.price);
      const name = item.dataset.name;

      if (checkbox && checkbox.checked) {
        item.classList.add('selected');
        total += price;
        selectedServices.push({ 
          name, 
          price, 
          desc: serviceDescriptions[name] || "Solução modular sob demanda para aceleração de faturamento." 
        });
      } else {
        item.classList.remove('selected');
      }
    });

    if (propSelectedList) {
      if (selectedServices.length === 0) {
        propSelectedList.innerHTML = '<li style="color: var(--text-muted); font-style: italic;">Nenhum serviço selecionado.</li>';
      } else {
        propSelectedList.innerHTML = selectedServices
          .map(s => `<li><i class="fa-solid fa-check" style="color: var(--green-brand); margin-right: 6px;"></i> <strong>${s.name}</strong> - R$ ${s.price.toFixed(2)}</li>`)
          .join('');
      }
    }

    if (propTotalPrice) {
      propTotalPrice.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return { total, selectedServices };
  }

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        const checkbox = item.querySelector('.service-checkbox');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          calculateProposal();
        }
      } else {
        calculateProposal();
      }
    });
  });

  calculateProposal();

  // Helper to populate proposal modal content
  function populatePdfData() {
    const { total, selectedServices } = calculateProposal();

    const clientName = document.getElementById('propName').value.trim() || 'Instrutor Parceiro';
    const clientPhone = document.getElementById('propPhone').value.trim() || '(96) 98146-1881';
    const clientCity = document.getElementById('propCity').value.trim() || 'Macapá / AP';
    const today = new Date().toLocaleDateString('pt-BR');
    const propNum = `PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    document.getElementById('pdfPropClientName').textContent = clientName;
    document.getElementById('pdfPropClientPhone').textContent = clientPhone;
    document.getElementById('pdfPropClientCity').textContent = clientCity;
    document.getElementById('pdfPropDate').textContent = `Data: ${today}`;
    document.getElementById('pdfPropNumber').textContent = `Ref: ${propNum}`;

    const pdfTableBody = document.getElementById('pdfTableBody');
    pdfTableBody.innerHTML = selectedServices
      .map(s => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px 8px; font-weight: 700; color: #0B1E36;">${s.name}</td>
          <td style="padding: 10px 8px; color: #475569; font-size: 10px;">${s.desc}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: 800; color: #0047AB; white-space: nowrap;">R$ ${s.price.toFixed(2)}</td>
        </tr>
      `).join('');

    document.getElementById('pdfTotalVal').textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return clientName;
  }

  // Generate & Open PDF Modal
  if (btnGeneratePdf) {
    btnGeneratePdf.addEventListener('click', () => {
      const { selectedServices } = calculateProposal();

      if (selectedServices.length === 0) {
        alert('Por favor, selecione ao menos 1 serviço para gerar o orçamento.');
        return;
      }

      populatePdfData();
      if (pdfModal) pdfModal.classList.add('active');
    });
  }

  // Modal Controls
  if (btnPdfClose) {
    btnPdfClose.addEventListener('click', () => {
      if (pdfModal) pdfModal.classList.remove('active');
    });
  }

  if (pdfModal) {
    pdfModal.addEventListener('click', (e) => {
      if (e.target === pdfModal) pdfModal.classList.remove('active');
    });
  }

  // Native Print / Save as PDF
  if (btnPdfPrint) {
    btnPdfPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Direct File Download via html2pdf
  if (btnPdfDownloadDirect) {
    btnPdfDownloadDirect.addEventListener('click', () => {
      const clientName = populatePdfData();
      const pdfContent = document.getElementById('pdfContent');

      btnPdfDownloadDirect.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gerando Arquivo...';

      const opt = {
        margin:       [0.2, 0.2, 0.2, 0.2],
        filename:     `Orçamento_Acelera_Instrutor_${clientName.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(pdfContent).save().then(() => {
        btnPdfDownloadDirect.innerHTML = '<i class="fa-solid fa-download"></i> Baixar Arquivo PDF';
      }).catch(err => {
        console.error(err);
        btnPdfDownloadDirect.innerHTML = '<i class="fa-solid fa-download"></i> Baixar Arquivo PDF';
        window.print();
      });
    });
  }

  // Send WhatsApp Action
  if (btnSendPropWhatsapp) {
    btnSendPropWhatsapp.addEventListener('click', () => {
      const { total, selectedServices } = calculateProposal();

      if (selectedServices.length === 0) {
        alert('Por favor, selecione ao menos 1 serviço antes de enviar pelo WhatsApp.');
        return;
      }

      const clientName = document.getElementById('propName').value.trim() || 'Instrutor';
      const clientCity = document.getElementById('propCity').value.trim() || 'Não informada';

      const itemsText = selectedServices.map(s => `• ${s.name}: R$ ${s.price.toFixed(2)}`).join('%0A');
      const message = `Ol%C3%A1!%20Meu%20nome%20%C3%A9%20*${encodeURIComponent(clientName)}*%20(${encodeURIComponent(clientCity)}).%0A%0AGostaria%20de%20solicitar%20o%20plano%20de%20servi%C3%A7os%20selecionado%3A%0A${itemsText}%0A%0A*Total%20Estimado%3A%20R%24%20${total.toFixed(2)}*%0A%0AAguardo%20instru%C3%A7%C3%B5es%20para%20iniciar!`;

      window.open(`https://wa.me/5596981461881?text=${message}`, '_blank');
    });
  }
}

/* 5. Interactive Package Details Modal (Saiba Mais / Ver Detalhes) */
function initPackageModals() {
  const modal = document.getElementById('packageDetailModal');
  const closeBtn = document.getElementById('pkgModalCloseBtn');
  const closeFooter = document.getElementById('pkgModalCloseFooter');
  const detailBtns = document.querySelectorAll('.package-detail-btn');

  if (!modal) return;

  const packagesData = {
    burocracia: {
      category: 'Fase 1: Licenciamento',
      title: 'Fase 1: Estruturação e Licenciamento',
      iconClass: 'fa-solid fa-file-signature',
      description: 'Sua licença autônoma operando rápido e dentro da lei. Tiramos toda a burocracia do Detran do seu caminho e cuidamos das documentações para que você foque apenas no volante.',
      deliverables: [
        'Redação e protocolo técnico de Ofícios para o Detran',
        'Emissão e acompanhamento de Certidões Obrigatórias',
        'Modelos de declarações e apoio ao credenciamento',
        'Kit Digital em PDF com modelos de recibos e agenda'
      ],
      audience: 'Instrutores autônomos que desejam eliminar a burocracia do Detran com total segurança jurídica.',
      whatsappMsg: 'Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20a%20*Fase%201%3A%20Estrutura%C3%A7%C3%A3o%20e%20Licenciamento*.'
    },
    digital: {
      category: 'Fase 2: Captação',
      title: 'Fase 2: Máquina de Captação',
      iconClass: 'fa-solid fa-bullhorn',
      description: 'Alunos da sua região pedindo orçamento todos os dias no seu WhatsApp. Blindamos o seu posicionamento digital e ativamos campanhas estratégicas para que você nunca mais sofra com a agenda vazia.',
      deliverables: [
        'Reforma completa do perfil no Instagram (Bio, Foto e WhatsApp)',
        'Vídeo de Captação Profissional produzido com Inteligência Artificial',
        'Design de artes estáticas estratégicas para o Feed',
        'Ativação e setup de Tráfego Pago Geolocalizado (Meta Ads)'
      ],
      audience: 'Instrutores que precisam preencher lacunas na agenda com fluxo constante de alunos pelo Instagram.',
      whatsappMsg: 'Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20a%20*Fase%202%3A%20M%C3%A1quina%20de%20Capta%C3%A7%C3%A3o*.'
    },
    vendas: {
      category: 'Fase 3: Conversão',
      title: 'Fase 3: Alta Conversão',
      iconClass: 'fa-solid fa-chart-line',
      description: 'O passo a passo prático para fechar matrículas de alto valor. Aprenda a conduzir o atendimento no WhatsApp e fechar pacotes inteiros de aulas sem precisar baratear o seu serviço ou dar descontos desnecessários.',
      deliverables: [
        'Mentoria Individual Express (30 a 45 min) online ou presencial',
        'Scripts prontos de atendimento e contorno de objeções de preço',
        'Técnicas de valorização do serviço frente a autoescolas tradicionais',
        'Guia prático de acompanhamento e fechamento de novos alunos'
      ],
      audience: 'Instrutores que recebem contatos no WhatsApp mas perdem orçamentos por falta de técnica de vendas.',
      whatsappMsg: 'Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20a%20*Fase%203%3A%20Alta%20Convers%C3%A3o*.'
    },
    elite: {
      category: 'Solução VIP 360°',
      title: 'Pacote Premium: Aceleração 360°',
      iconClass: 'fa-solid fa-crown',
      description: 'O ecossistema completo rodando para você. A união perfeita entre a aprovação rápida no Detran, captação automática de alunos e técnicas avançadas de vendas para transformar você no instrutor mais requisitado da sua cidade.',
      deliverables: [
        'Assessoria Burocrática Detran Completa + Protocolo de Ofícios',
        'Presença Digital 360° (Instagram, Vídeos IA e Meta Ads Local)',
        'Kit Digital do Instrutor (Adesivos para o carro, recibos e agenda)',
        'Mentoria Exclusiva de Vendas e Fechamento no WhatsApp'
      ],
      audience: 'Instrutores que buscam transformação total, delegando burocracia e marketing para focar no volante.',
      whatsappMsg: 'Ol%C3%A1!%20Tenho%20interesse%20no%20*Pacote%20Premium%20360%C2%B0*!'
    }
  };

  function openPackageModal(pkgKey) {
    const data = packagesData[pkgKey];
    if (!data) return;

    const catEl = document.getElementById('pkgModalCategory');
    if (catEl) catEl.textContent = data.category;
    document.getElementById('pkgModalTitle').textContent = data.title;
    document.getElementById('pkgModalDescription').textContent = data.description;
    document.getElementById('pkgModalAudience').textContent = data.audience;

    const iconEl = document.getElementById('pkgModalIcon');
    if (iconEl) iconEl.className = data.iconClass;

    const deliverablesList = document.getElementById('pkgModalDeliverables');
    if (deliverablesList) {
      deliverablesList.innerHTML = data.deliverables
        .map(item => `<li><i class="fa-solid fa-circle-check"></i> ${item}</li>`)
        .join('');
    }

    const whatsappBtn = document.getElementById('pkgModalWhatsappBtn');
    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/5596981461881?text=${data.whatsappMsg}`;
    }

    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkgKey = btn.dataset.package;
      openPackageModal(pkgKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooter) closeFooter.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* 6. FAQ Accordion */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = question.nextElementSibling;
      
      // Close other active FAQ items if any
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      
      // Toggle active class on current FAQ item
      faqItem.classList.toggle('active');
      
      if (faqItem.classList.contains('active')) {
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + "px";
      } else {
        faqAnswer.style.maxHeight = null;
      }
    });
  });
}

