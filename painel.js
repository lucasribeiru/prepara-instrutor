/* ==========================================================================
   ACELERA INSTRUTOR - PAINEL ADMINISTRATIVO & ESPAÇO DO CLIENTE (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemes();
  initClientsData();
  checkSession();
  setupURLRoute();
});

// 1. GERENCIAMENTO DE TEMAS
function initThemes() {
  const currentTheme = localStorage.getItem('prepara_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  const toggles = ['themeToggle', 'adminThemeToggle', 'clientThemeToggle'];
  toggles.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    updateThemeIcon(btn, currentTheme);
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('prepara_theme', theme);
  
  const toggles = ['themeToggle', 'adminThemeToggle', 'clientThemeToggle'];
  toggles.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) updateThemeIcon(btn, theme);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

// 2. INICIALIZAÇÃO DE DADOS DE CLIENTES MOCKADOS (LOCALSTORAGE)
function initClientsData() {
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
        created_at: new Date().toLocaleDateString('pt-BR')
      },
      {
        id: '1690000000002',
        name: 'Gabriel Maciel',
        phone: '96981113333',
        city: 'Macapá / AP',
        package: 'vendas',
        status: 'Em Andamento',
        driveLink: 'https://drive.google.com',
        created_at: new Date().toLocaleDateString('pt-BR')
      },
      {
        id: '1690000000003',
        name: 'Sarah Dantas',
        phone: '96981114444',
        city: 'Natal / RN',
        package: 'digital',
        status: 'Pendente',
        driveLink: 'https://drive.google.com',
        created_at: new Date().toLocaleDateString('pt-BR')
      }
    ];
    localStorage.setItem('prepara_clients', JSON.stringify(mockClients));
  }
  populateClientSelect();
}

function getClients() {
  return JSON.parse(localStorage.getItem('prepara_clients')) || [];
}

function saveClients(clients) {
  localStorage.setItem('prepara_clients', JSON.stringify(clients));
  populateClientSelect();
}

// Preenche o seletor da tela de login
function populateClientSelect() {
  const select = document.getElementById('loginClientSelect');
  if (!select) return;
  
  const clients = getClients();
  select.innerHTML = '<option value="">-- Selecione seu nome --</option>' + 
    clients.map(c => `<option value="${c.id}">${c.name} (${c.city})</option>`).join('');
}

// 3. GERENCIAMENTO DE SESSÕES
function checkSession() {
  const role = sessionStorage.getItem('current_user_role');
  const clientId = sessionStorage.getItem('current_client_id');
  
  if (role === 'admin') {
    showAdminPanel();
  } else if (role === 'client' && clientId) {
    showClientSpace(clientId);
  } else {
    showLoginScreen();
  }
}

function setupURLRoute() {
  const params = new URLSearchParams(window.location.search);
  const clientParam = params.get('client');
  
  if (clientParam) {
    const clients = getClients();
    const client = clients.find(c => c.id === clientParam);
    if (client) {
      sessionStorage.setItem('current_user_role', 'client');
      sessionStorage.setItem('current_client_id', client.id);
      
      // Limpa os parâmetros da URL de forma discreta para manter a URL limpa
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({path: cleanUrl}, '', cleanUrl);
      
      showClientSpace(client.id);
    } else {
      showToast('Link de acesso do cliente expirou ou é inválido!', 'error');
    }
  }
}

// 4. SISTEMA DE NOTIFICAÇÃO TOAST
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  
  toastMsg.textContent = message;
  const icon = toast.querySelector('i');
  
  if (type === 'error') {
    toast.style.borderLeftColor = '#E11D48';
    if (icon) icon.className = 'fa-solid fa-circle-exclamation';
    icon.style.color = '#E11D48';
  } else {
    toast.style.borderLeftColor = 'var(--green-bright)';
    if (icon) icon.className = 'fa-solid fa-circle-check';
    icon.style.color = 'var(--green-bright)';
  }
  
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// 5. TELAS E ABAS DO FLUXO DE LOGIN
function switchLoginTab(role) {
  const btnAdmin = document.getElementById('btnTabAdmin');
  const btnClient = document.getElementById('btnTabClient');
  const formAdmin = document.getElementById('loginAdminForm');
  const formClient = document.getElementById('loginClientForm');
  
  if (role === 'admin') {
    btnAdmin.classList.add('active');
    btnClient.classList.remove('active');
    formAdmin.classList.add('active');
    formClient.classList.remove('active');
  } else {
    btnClient.classList.add('active');
    btnAdmin.classList.remove('active');
    formClient.classList.add('active');
    formAdmin.classList.remove('active');
  }
}

function loginAsAdmin() {
  sessionStorage.setItem('current_user_role', 'admin');
  sessionStorage.removeItem('current_client_id');
  showAdminPanel();
  showToast('Acesso administrativo concedido!');
}

function loginAsClient() {
  const select = document.getElementById('loginClientSelect');
  const phoneInput = document.getElementById('loginClientPhone');
  
  let targetClientId = '';
  
  if (select && select.value) {
    targetClientId = select.value;
  } else if (phoneInput && phoneInput.value.trim()) {
    const rawPhone = phoneInput.value.replace(/\D/g, '');
    const clients = getClients();
    const match = clients.find(c => c.phone.replace(/\D/g, '') === rawPhone);
    
    if (match) {
      targetClientId = match.id;
    } else {
      showToast('Nenhum instrutor cadastrado com este telefone!', 'error');
      return;
    }
  } else {
    showToast('Por favor, selecione seu nome ou digite seu telefone.', 'error');
    return;
  }
  
  sessionStorage.setItem('current_user_role', 'client');
  sessionStorage.setItem('current_client_id', targetClientId);
  showClientSpace(targetClientId);
  showToast('Bem-vindo ao seu Espaço do Cliente!');
}

function logout() {
  sessionStorage.clear();
  showLoginScreen();
  showToast('Sessão finalizada com sucesso!');
}

// Exibição das telas
function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('clientSpace').style.display = 'none';
}

function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'grid';
  document.getElementById('clientSpace').style.display = 'none';
  
  switchAdminView('clients');
  renderClientsKPIs();
  renderClientsTable();
}

function showClientSpace(clientId) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('clientSpace').style.display = 'grid';
  
  switchClientView('journey');
  loadClientData(clientId);
}

// 6. CÓDIGO DA INTERFACE DO ADMINISTRADOR
function switchAdminView(viewName) {
  const clientsView = document.getElementById('adminViewClients');
  const registerView = document.getElementById('adminViewRegister');
  const btnClients = document.getElementById('btnAdminViewClients');
  const btnRegister = document.getElementById('btnAdminViewRegister');
  
  if (viewName === 'clients') {
    clientsView.classList.add('active');
    registerView.classList.remove('active');
    btnClients.classList.add('active');
    btnRegister.classList.remove('active');
    renderClientsTable();
  } else {
    registerView.classList.add('active');
    clientsView.classList.remove('active');
    btnRegister.classList.add('active');
    btnClients.classList.remove('active');
  }
}

function renderClientsKPIs() {
  const clients = getClients();
  document.getElementById('kpiTotalClients').textContent = clients.length;
  
  const eliteCount = clients.filter(c => c.package === 'elite').length;
  document.getElementById('kpiEliteClients').textContent = eliteCount;
  
  const approvedCount = clients.filter(c => c.status === 'Aprovado').length;
  document.getElementById('kpiApprovedClients').textContent = approvedCount;
}

function renderClientsTable() {
  const tbody = document.getElementById('clientsTableBody');
  if (!tbody) return;
  
  const clients = getClients();
  
  if (clients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); font-style: italic;">Nenhum cliente cadastrado.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = clients.map(client => {
    let pkgLabel = '';
    switch (client.package) {
      case 'burocracia': pkgLabel = 'Fase 1: Detran'; break;
      case 'digital': pkgLabel = 'Fase 2: Captação'; break;
      case 'vendas': pkgLabel = 'Fase 3: Conversão'; break;
      case 'elite': pkgLabel = 'Elite 360°'; break;
    }
    
    let statusClass = 'status-pendente';
    if (client.status === 'Em Andamento') statusClass = 'status-andamento';
    if (client.status === 'Aprovado') statusClass = 'status-aprovado';
    
    return `
      <tr>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: var(--navy-dark); font-size: 0.95rem;">${client.name}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted);"><i class="fa-brands fa-whatsapp" style="color: #10B981;"></i> ${formatPhone(client.phone)}</span>
          </div>
        </td>
        <td>${client.city}</td>
        <td><span class="badge-brand badge-blue" style="font-size: 0.725rem; padding: 0.25rem 0.65rem;">${pkgLabel}</span></td>
        <td><span class="badge-status ${statusClass}">${client.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action-small btn-action-view" onclick="viewClientSpace('${client.id}')" title="Acessar Espaço do Cliente">
              <i class="fa-solid fa-laptop-code"></i> Espaço
            </button>
            <button class="btn-action-small btn-action-copy" onclick="copyClientLink('${client.id}')" title="Copiar Link de Acesso Exclusivo">
              <i class="fa-solid fa-copy"></i> Copiar Link
            </button>
            <button class="btn-action-small btn-action-delete" onclick="deleteClient('${client.id}')" title="Excluir Cliente">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function handleNewClientSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.replace(/\D/g, '');
  const city = document.getElementById('regCity').value.trim();
  const packageVal = document.getElementById('regPackage').value;
  const status = document.getElementById('regStatus').value;
  const driveLink = document.getElementById('regDrive').value.trim() || 'https://drive.google.com';
  
  if (!name || !phone || !city) {
    showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  const clients = getClients();
  
  // Verifica se o telefone já existe
  if (clients.some(c => c.phone === phone)) {
    showToast('Um cliente com este telefone já está cadastrado!', 'error');
    return;
  }
  
  const newClient = {
    id: Date.now().toString(),
    name,
    phone,
    city,
    package: packageVal,
    status,
    driveLink,
    created_at: new Date().toLocaleDateString('pt-BR')
  };
  
  clients.push(newClient);
  saveClients(clients);
  renderClientsKPIs();
  
  document.getElementById('newClientForm').reset();
  switchAdminView('clients');
  showToast('Novo cliente cadastrado com sucesso!');
}

function deleteClient(id) {
  if (confirm('Tem certeza que deseja remover este cliente? Todos os dados associados a ele serão perdidos no sistema local.')) {
    let clients = getClients();
    clients = clients.filter(c => c.id !== id);
    saveClients(clients);
    renderClientsKPIs();
    renderClientsTable();
    showToast('Cliente removido com sucesso!');
  }
}

function copyClientLink(id) {
  // Cria o link exclusivo contendo o parâmetro client
  const url = window.location.origin + window.location.pathname + '?client=' + id;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link de acesso exclusivo copiado para a área de transferência!');
  }).catch(err => {
    console.error('Erro ao copiar link', err);
    showToast('Falha ao copiar o link.', 'error');
  });
}

function viewClientSpace(id) {
  sessionStorage.setItem('current_user_role', 'client');
  sessionStorage.setItem('current_client_id', id);
  showClientSpace(id);
}

// 7. CÓDIGO DA INTERFACE DO CLIENTE (INSTRUTOR)
let currentClientId = '';

function switchClientView(viewName) {
  const views = ['journey', 'leads', 'downloads', 'goals'];
  views.forEach(v => {
    const el = document.getElementById(`clientView${v.charAt(0).toUpperCase() + v.slice(1)}`);
    const btn = document.getElementById(`btnClientView${v.charAt(0).toUpperCase() + v.slice(1)}`);
    
    if (v === viewName) {
      if (el) el.classList.add('active');
      if (btn) btn.classList.add('active');
    } else {
      if (el) el.classList.remove('active');
      if (btn) btn.classList.remove('active');
    }
  });
  
  if (viewName === 'leads') {
    renderLeadsKanban();
  }
}

function loadClientData(id) {
  currentClientId = id;
  const clients = getClients();
  const client = clients.find(c => c.id === id);
  
  if (!client) {
    showToast('Erro ao carregar dados do cliente.', 'error');
    logout();
    return;
  }
  
  // Header Info
  document.getElementById('clientSpaceWelcome').textContent = `Olá, Instrutor ${client.name}!`;
  document.getElementById('clientSpaceBrandName').textContent = client.name.split(' ')[0];
  
  // Package Label
  let pkgText = 'Fase Especial';
  if (client.package === 'burocracia') pkgText = 'Fase 1: Estruturação Detran';
  if (client.package === 'digital') pkgText = 'Fase 2: Máquina de Captação';
  if (client.package === 'vendas') pkgText = 'Fase 3: Alta Conversão';
  if (client.package === 'elite') pkgText = 'Elite 360° (Premium)';
  
  document.getElementById('clientActivePkgBadge').textContent = pkgText;
  
  // Drive Link
  const driveBtn = document.getElementById('clientDriveLinkBtn');
  if (driveBtn) driveBtn.href = client.driveLink || 'https://drive.google.com';
  
  // Status Detran e Barra de Progresso
  const statusBadge = document.getElementById('clientDetranStatusBadge');
  const progressBar = document.getElementById('clientJourneyProgress');
  
  if (statusBadge) {
    statusBadge.textContent = client.status;
    statusBadge.className = 'badge-status-lg';
    
    if (client.status === 'Pendente') {
      statusBadge.classList.add('text-red');
      progressBar.style.width = '33%';
    } else if (client.status === 'Em Andamento') {
      statusBadge.classList.add('text-yellow');
      progressBar.style.width = '66%';
    } else {
      statusBadge.classList.add('text-green');
      progressBar.style.width = '100%';
    }
  }
  
  // Próximos Passos Checklist
  loadNextSteps(client);
  
  // Carrega Downloads
  loadDownloads(client.package);
  
  // Inicializa o simulador de metas do cliente
  initGoalCalculator();
}

function loadNextSteps(client) {
  const list = document.getElementById('clientNextStepsChecklist');
  if (!list) return;
  
  const step1Check = client.status === 'Aprovado' ? 'fa-square-check' : (client.status === 'Em Andamento' ? 'fa-square-check' : 'fa-square');
  const step2Check = client.status === 'Aprovado' ? 'fa-square-check' : 'fa-square';
  const step3Check = client.status === 'Aprovado' ? 'fa-square-check' : 'fa-square';
  
  let steps = '';
  
  if (client.package === 'burocracia') {
    steps = `
      <li><i class="fa-regular ${step1Check}"></i> <span>Envio de certidões e RG da consultoria</span></li>
      <li><i class="fa-regular ${client.status === 'Aprovado' ? 'fa-square-check' : 'fa-square'}"></i> <span>Protocolo do Ofício Técnico no Detran</span></li>
      <li><i class="fa-regular fa-square"></i> <span>Emissão da Portaria de Credenciamento</span></li>
    `;
  } else if (client.package === 'digital') {
    steps = `
      <li><i class="fa-regular ${step1Check}"></i> <span>Entrega da sua foto para reforma do perfil</span></li>
      <li><i class="fa-regular ${step2Check}"></i> <span>Reforma completa da Bio do Instagram</span></li>
      <li><i class="fa-regular fa-square"></i> <span>Primeira campanha de captação (Meta Ads) no ar</span></li>
    `;
  } else if (client.package === 'vendas') {
    steps = `
      <li><i class="fa-regular ${step1Check}"></i> <span>Agendamento da mentoria individual de WhatsApp</span></li>
      <li><i class="fa-regular ${step2Check}"></i> <span>Download e leitura dos scripts de fechamento</span></li>
      <li><i class="fa-regular fa-square"></i> <span>Auditoria de conversões reais de conversas</span></li>
    `;
  } else { // elite
    steps = `
      <li><i class="fa-regular ${step1Check}"></i> <span>Fase 1: Credenciamento Detran liberado</span></li>
      <li><i class="fa-regular ${step2Check}"></i> <span>Fase 2: Máquina de Captação montada no Instagram</span></li>
      <li><i class="fa-regular ${step3Check}"></i> <span>Fase 3: Tráfego pago ativo e Scripts de vendas rodando</span></li>
    `;
  }
  
  list.innerHTML = steps;
}

function loadDownloads(pkg) {
  const grid = document.getElementById('clientDownloadsGrid');
  if (!grid) return;
  
  // Todos os arquivos mocks possíveis
  const allFiles = {
    burocracia: [
      { name: 'Modelos de Ofícios Detran', desc: 'Kit de minutas técnicas e requerimentos para credenciamento autônomo.', format: 'doc / pdf', icon: 'fa-file-signature' },
      { name: 'Kit Digital de Agenda', desc: 'Planilhas em PDF editável para controle de horários de alunos.', format: 'pdf', icon: 'fa-calendar-days' },
      { name: 'Modelo de Recibos Profissional', desc: 'Documento limpo para emitir comprovantes de pagamentos aos alunos.', format: 'pdf', icon: 'fa-receipt' }
    ],
    digital: [
      { name: 'Reforma de Instagram (Guia)', desc: 'Planejamento estratégico de posições, bio e link WhatsApp ideal.', format: 'pdf', icon: 'fa-instagram' },
      { name: 'Roteiros de Vídeos IA', desc: 'Modelos prontos de scripts persuasivos para gravar ou usar avatares de IA.', format: 'pdf', icon: 'fa-video' },
      { name: 'Arte para Carro (Adesivos)', desc: 'Design pronto em alta resolução de adesivos regulamentados para o veículo.', format: 'zip / pdf', icon: 'fa-car' }
    ],
    vendas: [
      { name: 'Scripts de Fechamento WhatsApp', desc: 'Roteiro de conversação do "Olá" até a matrícula paga.', format: 'pdf', icon: 'fa-comment-dots' },
      { name: 'Quebrando Objeções de Preço', desc: 'Guia de contorno rápido quando o aluno diz que "está caro".', format: 'pdf', icon: 'fa-shield-halved' }
    ]
  };
  
  let filesToShow = [];
  if (pkg === 'elite') {
    filesToShow = [...allFiles.burocracia, ...allFiles.digital, ...allFiles.vendas];
  } else {
    filesToShow = allFiles[pkg] || [];
  }
  
  if (filesToShow.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">Nenhum arquivo disponível para seu pacote.</p>';
    return;
  }
  
  grid.innerHTML = filesToShow.map(file => `
    <div class="service-card">
      <span class="service-category-tag">${file.format}</span>
      <h3 class="service-title" style="display: flex; align-items: center; gap: 0.5rem;">
        <i class="fa-solid ${file.icon}" style="color: var(--blue-brand);"></i> ${file.name}
      </h3>
      <p class="service-desc">${file.desc}</p>
      <div class="download-card-meta">
        <span class="download-format-badge">${file.format.split(' ')[0]}</span>
        <button class="btn-whatsapp" onclick="triggerMockDownload('${file.name}')" style="padding: 0.5rem 1rem; font-size: 0.8rem; gap: 0.35rem;">
          <i class="fa-solid fa-download"></i> Baixar
        </button>
      </div>
    </div>
  `).join('');
}

function triggerMockDownload(fileName) {
  showToast(`Baixando arquivo: "${fileName}"...`);
  setTimeout(() => {
    showToast(`Arquivo "${fileName}" baixado com sucesso!`);
  }, 1200);
}

// 8. CRM DE LEADS (ALUNOS DO INSTRUTOR)
function getLeadsKey() {
  return `prepara_leads_${currentClientId}`;
}

function getLeads() {
  const key = getLeadsKey();
  let leads = localStorage.getItem(key);
  
  if (!leads) {
    // Cria alguns leads padrão fictícios para que o CRM não comece vazio
    const mockLeads = [
      { id: 'lead1', name: 'Julio Cesar', phone: '96999911111', status: 'novo', notes: 'Gostaria de fechar pacote de 15 aulas.', date: new Date().toLocaleDateString('pt-BR') },
      { id: 'lead2', name: 'Mariana Costa', phone: '96999922222', status: 'aula', notes: 'Marcou aula experimental para sábado às 9h.', date: new Date().toLocaleDateString('pt-BR') },
      { id: 'lead3', name: 'Carlos Henrique', phone: '96999933333', status: 'fechado', notes: 'Fechou pacote de 10 aulas. Pago à vista no PIX.', date: new Date().toLocaleDateString('pt-BR') }
    ];
    localStorage.setItem(key, JSON.stringify(mockLeads));
    return mockLeads;
  }
  
  return JSON.parse(leads);
}

function saveLeads(leads) {
  localStorage.setItem(getLeadsKey(), JSON.stringify(leads));
}

function renderLeadsKanban() {
  const leads = getLeads();
  const stages = {
    novo: document.getElementById('area-novo'),
    aula: document.getElementById('area-aula'),
    fechado: document.getElementById('area-fechado'),
    perdido: document.getElementById('area-perdido')
  };
  
  const counts = { novo: 0, aula: 0, fechado: 0, perdido: 0 };
  
  // Limpa as colunas
  Object.keys(stages).forEach(key => {
    if (stages[key]) stages[key].innerHTML = '';
  });
  
  leads.forEach(lead => {
    if (!stages[lead.status]) return;
    
    counts[lead.status]++;
    
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.innerHTML = `
      <h4 class="kanban-card-title">${lead.name}</h4>
      <div class="kanban-card-phone">
        <i class="fa-brands fa-whatsapp" style="color: #10B981;"></i> 
        <a href="https://wa.me/55${lead.phone}" target="_blank" style="color: var(--blue-bright); font-weight: 600;">${formatPhone(lead.phone)}</a>
      </div>
      ${lead.notes ? `<p class="kanban-card-desc">${lead.notes}</p>` : ''}
      
      <div class="kanban-card-meta">
        <span>${lead.date}</span>
        <span onclick="deleteLead('${lead.id}')" style="color: #E11D48; cursor: pointer;" title="Excluir"><i class="fa-solid fa-trash"></i></span>
      </div>
      
      <div class="kanban-card-actions">
        ${lead.status !== 'novo' ? `<button onclick="moveLead('${lead.id}', 'prev')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>` : ''}
        ${lead.status !== 'perdido' && lead.status !== 'fechado' ? `<button onclick="moveLead('${lead.id}', 'next')">Avançar <i class="fa-solid fa-arrow-right"></i></button>` : ''}
        ${lead.status === 'novo' || lead.status === 'aula' ? `<button onclick="setLeadStatus('${lead.id}', 'perdido')" style="color:#E11D48;">Perdido</button>` : ''}
      </div>
    `;
    
    stages[lead.status].appendChild(card);
  });
  
  // Atualiza contadores
  Object.keys(counts).forEach(key => {
    const el = document.getElementById(`count-${key}`);
    if (el) el.textContent = counts[key];
  });
}

function openNewLeadModal() {
  const modal = document.getElementById('newLeadModal');
  if (modal) modal.classList.add('active');
}

function closeNewLeadModal() {
  const modal = document.getElementById('newLeadModal');
  if (modal) modal.classList.remove('active');
  document.getElementById('newLeadForm').reset();
}

function handleNewLeadSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('leadName').value.trim();
  const phone = document.getElementById('leadPhone').value.replace(/\D/g, '');
  const status = document.getElementById('leadStatus').value;
  const notes = document.getElementById('leadNotes').value.trim();
  
  if (!name || !phone) {
    showToast('Preencha os campos obrigatórios.', 'error');
    return;
  }
  
  const leads = getLeads();
  const newLead = {
    id: Date.now().toString(),
    name,
    phone,
    status,
    notes,
    date: new Date().toLocaleDateString('pt-BR')
  };
  
  leads.push(newLead);
  saveLeads(leads);
  renderLeadsKanban();
  closeNewLeadModal();
  showToast('Novo aluno cadastrado no CRM!');
}

function deleteLead(id) {
  if (confirm('Deseja realmente remover este contato do CRM?')) {
    let leads = getLeads();
    leads = leads.filter(l => l.id !== id);
    saveLeads(leads);
    renderLeadsKanban();
    showToast('Lead removido do CRM.');
  }
}

function moveLead(id, direction) {
  const leads = getLeads();
  const lead = leads.find(l => l.id === id);
  if (!lead) return;
  
  const flow = ['novo', 'aula', 'fechado'];
  const currentIndex = flow.indexOf(lead.status);
  
  if (direction === 'next' && currentIndex < flow.length - 1) {
    lead.status = flow[currentIndex + 1];
  } else if (direction === 'prev' && currentIndex > 0) {
    lead.status = flow[currentIndex - 1];
  }
  
  saveLeads(leads);
  renderLeadsKanban();
  showToast(`Status de ${lead.name} atualizado!`);
}

function setLeadStatus(id, newStatus) {
  const leads = getLeads();
  const lead = leads.find(l => l.id === id);
  if (!lead) return;
  
  lead.status = newStatus;
  saveLeads(leads);
  renderLeadsKanban();
  showToast(`Status de ${lead.name} atualizado!`);
}

// 9. CALCULADORA DE METAS INDIVIDUAL
function initGoalCalculator() {
  const hoursInput = document.getElementById('goalHours');
  const rateInput = document.getElementById('goalClassRate');
  const hoursVal = document.getElementById('goalHoursVal');
  const rateVal = document.getElementById('goalClassRateVal');
  const totalVal = document.getElementById('goalTotalVal');
  const totalSummary = document.getElementById('goalTotalSummaryText');
  const reqStudents = document.getElementById('goalRequiredStudents');

  if (!hoursInput || !rateInput) return;

  function updateGoal() {
    const hoursPerDay = parseInt(hoursInput.value);
    const ratePerHour = parseInt(rateInput.value);

    // 20 dias úteis
    const monthlyRevenue = hoursPerDay * ratePerHour * 20;

    hoursVal.textContent = `${hoursPerDay} aulas por dia`;
    rateVal.textContent = `R$ ${ratePerHour},00 por aula`;
    
    const formattedVal = `R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    totalVal.textContent = formattedVal;
    
    if (totalSummary) totalSummary.textContent = formattedVal;
    
    // Supondo um pacote de 10 aulas = R$ 1.000,00 (10x valor da aula)
    const requiredStr = Math.ceil(monthlyRevenue / (ratePerHour * 10));
    if (reqStudents) reqStudents.textContent = `${requiredStr} novos alunos (pacote de 10 aulas)`;
  }

  hoursInput.removeEventListener('input', updateGoal);
  rateInput.removeEventListener('input', updateGoal);
  
  hoursInput.addEventListener('input', updateGoal);
  rateInput.addEventListener('input', updateGoal);

  updateGoal();
}

// 10. FUNÇÕES COMPLEMENTARES (FORMATAÇÕES)
function formatPhone(phone) {
  const p = phone.replace(/\D/g, '');
  if (p.length === 11) {
    return `(${p.substring(0, 2)}) ${p.substring(2, 7)}-${p.substring(7)}`;
  } else if (p.length === 10) {
    return `(${p.substring(0, 2)}) ${p.substring(2, 6)}-${p.substring(6)}`;
  }
  return phone;
}

// Pesquisa e filtro na listagem administrativa
function filterClientsList() {
  const query = document.getElementById('clientSearch').value.toLowerCase();
  const filter = document.getElementById('clientFilterStatus').value;
  const rows = document.querySelectorAll('#clientsTableBody tr');
  
  rows.forEach(row => {
    const name = row.querySelector('strong')?.textContent.toLowerCase() || '';
    const city = row.cells[1]?.textContent.toLowerCase() || '';
    const status = row.querySelector('.badge-status')?.textContent || '';
    
    const matchesSearch = name.includes(query) || city.includes(query);
    const matchesFilter = filter === 'all' || status === filter;
    
    if (matchesSearch && matchesFilter) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}
