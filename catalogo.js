/* ==========================================================================
   ACELERA INSTRUTOR - PÁGINA PÚBLICA DE CATÁLOGO (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCatalogData();
  renderCatalog();
});

// 1. GERENCIAMENTO DE TEMA
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

// 2. INICIALIZAÇÃO DE DADOS (LOCALSTORAGE)
function initCatalogData() {
  // Se o LocalStorage estiver vazio, preenche com mocks completos de currículo
  if (!localStorage.getItem('prepara_clients')) {
    const mockClients = [
      {
        id: '1690000000001',
        name: 'Zani Reis',
        phone: '96981112222',
        city: 'Macapá / AP',
        package: 'elite',
        status: 'Aprovado',
        driveLink: 'https://drive.google.com',
        created_at: new Date().toLocaleDateString('pt-BR'),
        // Dados de Currículo / Catálogo
        bio: 'Mais de 10 anos de experiência credenciada. Especialista em ajudar motoristas habilitados que possuem fobia do trânsito ou inseguranças a alcançarem sua independência completa no volante.',
        specialties: ['Medo de Dirigir', 'Baliza Fácil'],
        rate: 120,
        photo: 'assets/logo.jpg'
      },
      {
        id: '1690000000002',
        name: 'Gabriel Maciel',
        phone: '96981113333',
        city: 'Macapá / AP',
        package: 'vendas',
        status: 'Em Andamento',
        driveLink: 'https://drive.google.com',
        created_at: new Date().toLocaleDateString('pt-BR'),
        bio: 'Didática focada em aprovação rápida e segura. Treinamento prático intensivo simulando o circuito oficial do Detran para garantir que você passe de primeira com tranquilidade.',
        specialties: ['Preparação para Exame', 'Baliza Fácil'],
        rate: 100,
        photo: 'assets/logo.jpg'
      },
      {
        id: '1690000000003',
        name: 'Sarah Dantas',
        phone: '96981114444',
        city: 'Natal / RN',
        package: 'digital',
        status: 'Pendente',
        driveLink: 'https://drive.google.com',
        created_at: new Date().toLocaleDateString('pt-BR'),
        bio: 'Aulas ministradas com total paciência, empatia e segurança. Especializada em conduzir novos condutores habilitados no trânsito urbano, balizas e controle em rampas.',
        specialties: ['Medo de Dirigir', 'Aulas Noturnas'],
        rate: 110,
        photo: 'assets/logo.jpg'
      }
    ];
    localStorage.setItem('prepara_clients', JSON.stringify(mockClients));
  } else {
    // Caso já existam clientes mas sem dados de catálogo, garante a existência dos campos
    let clients = JSON.parse(localStorage.getItem('prepara_clients'));
    let altered = false;
    clients.forEach(c => {
      if (c.rate === undefined) { c.rate = 100; altered = true; }
      if (c.bio === undefined) { c.bio = 'Instrutor credenciado de trânsito focado em aulas personalizadas e humanizadas.'; altered = true; }
      if (c.specialties === undefined) { c.specialties = ['Medo de Dirigir', 'Baliza Fácil']; altered = true; }
      if (c.photo === undefined) { c.photo = 'assets/logo.jpg'; altered = true; }
    });
    if (altered) {
      localStorage.setItem('prepara_clients', JSON.stringify(clients));
    }
  }
}

function getCatalogClients() {
  return JSON.parse(localStorage.getItem('prepara_clients')) || [];
}

// 3. RENDERIZAR GRID DE CARDS
function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  
  const clients = getCatalogClients();
  
  if (clients.length === 0) {
    grid.innerHTML = '';
    document.getElementById('catalogEmptyMessage').style.display = 'block';
    return;
  }
  
  document.getElementById('catalogEmptyMessage').style.display = 'none';
  
  grid.innerHTML = clients.map(client => {
    const specialtiesBadges = (client.specialties || ['Medo de Dirigir'])
      .map(s => `<span class="quick-tag" style="background: var(--blue-light); color: var(--blue-brand); border: none; font-size: 0.7rem; font-weight: 700;">${s}</span>`)
      .join('');
      
    const photoSrc = client.photo || 'assets/logo.jpg';
    const rateFormatted = client.rate ? `R$ ${parseInt(client.rate)},00` : 'R$ 100,00';
    
    return `
      <div class="service-card" data-id="${client.id}" data-name="${client.name.toLowerCase()}" data-city="${client.city.toLowerCase()}" data-specialties="${(client.specialties || []).join(',').toLowerCase()}">
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
          <img src="${photoSrc}" alt="${client.name}" style="width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 3px solid var(--border-color);">
          <div>
            <h3 class="service-title" style="margin-bottom: 0.15rem; font-size: 1.15rem;">${client.name}</h3>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">
              <i class="fa-solid fa-location-dot" style="color: var(--blue-bright);"></i> ${client.city}
            </span>
          </div>
        </div>
        
        <p class="service-desc" style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.25rem; font-style: italic; color: var(--text-muted);">
          "${limitText(client.bio || 'Foco em aulas humanizadas e sob demanda.', 105)}"
        </p>

        <div style="margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; margin-bottom: 0.4rem;">Especialidades:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${specialtiesBadges}
          </div>
        </div>

        <div class="service-price-row" style="margin-top: auto; padding-top: 1rem; border-top: 1px dashed var(--border-color);">
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700;">Valor da Aula:</span>
            <span style="font-size: 1.35rem; font-weight: 900; color: var(--green-brand);">${rateFormatted}</span>
          </div>
          <button class="btn-primary" onclick="openCvModal('${client.id}')" style="padding: 0.55rem 1.1rem; font-size: 0.8rem; gap: 0.35rem; border-radius: 6px;">
            <i class="fa-solid fa-address-card"></i> Ver Currículo
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 4. SISTEMA DE BUSCA E FILTROS DINÂMICOS
function filterCatalog() {
  const query = document.getElementById('catalogSearch').value.toLowerCase().trim();
  const specialty = document.getElementById('catalogSpecialtyFilter').value.toLowerCase();
  
  const cards = document.querySelectorAll('#catalogGrid .service-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const name = card.dataset.name;
    const city = card.dataset.city;
    const cardSpecs = card.dataset.specialties;
    
    const matchesSearch = name.includes(query) || city.includes(query);
    const matchesSpecialty = specialty === 'all' || cardSpecs.includes(specialty);
    
    if (matchesSearch && matchesSpecialty) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  const emptyMsg = document.getElementById('catalogEmptyMessage');
  if (visibleCount === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
  }
}

function setQuickSpecialty(spec) {
  const filter = document.getElementById('catalogSpecialtyFilter');
  if (filter) {
    filter.value = spec;
    filterCatalog();
  }
}

// 5. GERENCIAMENTO DO MODAL DE CURRÍCULO
function openCvModal(id) {
  const clients = getCatalogClients();
  const client = clients.find(c => c.id === id);
  if (!client) return;
  
  document.getElementById('cvModalName').textContent = client.name;
  document.getElementById('cvModalLocation').innerHTML = `<i class="fa-solid fa-location-dot" style="color: var(--blue-bright);"></i> ${client.city}`;
  document.getElementById('cvModalPhoto').src = client.photo || 'assets/logo.jpg';
  document.getElementById('cvModalBio').textContent = client.bio || 'Instrutor credenciado focado em aulas personalizadas.';
  document.getElementById('cvModalRate').textContent = client.rate ? `R$ ${parseInt(client.rate)},00` : 'R$ 100,00';
  
  const specsDiv = document.getElementById('cvModalSpecialties');
  if (specsDiv) {
    specsDiv.innerHTML = (client.specialties || ['Medo de Dirigir'])
      .map(s => `<span class="badge-brand badge-blue" style="font-size: 0.75rem; padding: 0.3rem 0.75rem;">${s}</span>`)
      .join('');
  }
  
  const waBtn = document.getElementById('cvModalWhatsappBtn');
  if (waBtn) {
    const waMsg = encodeURIComponent(`Olá, Instrutor ${client.name}! Vi seu currículo no Catálogo do Acelera Instrutor e gostaria de solicitar um orçamento para minhas aulas práticas.`);
    waBtn.href = `https://wa.me/55${client.phone}?text=${waMsg}`;
  }
  
  const modal = document.getElementById('cvModal');
  if (modal) modal.classList.add('active');
}

function closeCvModal() {
  const modal = document.getElementById('cvModal');
  if (modal) modal.classList.remove('active');
}

// Helper para limitar texto
function limitText(text, limit) {
  if (text.length > limit) {
    return text.substring(0, limit) + '...';
  }
  return text;
}
