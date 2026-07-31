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
        created_at: new Date().toLocaleDateString('pt-BR'),
        password: '123456',
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
        password: '123456',
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
        password: '123456',
        bio: 'Aulas ministradas com total paciência, empatia e segurança. Especializada em conduzir novos condutores habilitados no trânsito urbano, balizas e controle em rampas.',
        specialties: ['Medo de Dirigir', 'Aulas Noturnas'],
        rate: 110,
        photo: 'assets/logo.jpg'
      }
    ];
    localStorage.setItem('prepara_clients', JSON.stringify(mockClients));
  } else {
    // Garante que todos os clientes existentes tenham uma senha e dados de catálogo válidos
    let clients = JSON.parse(localStorage.getItem('prepara_clients'));
    let altered = false;
    clients.forEach(c => {
      if (!c.password) { c.password = '123456'; altered = true; }
      if (c.rate === undefined) { c.rate = 100; altered = true; }
      if (c.bio === undefined) { c.bio = 'Instrutor credenciado de trânsito focado em aulas personalizadas e humanizadas.'; altered = true; }
      if (c.specialties === undefined) { c.specialties = ['Medo de Dirigir', 'Baliza Fácil']; altered = true; }
      if (c.photo === undefined) { c.photo = 'assets/logo.jpg'; altered = true; }
    });
    if (altered) {
      localStorage.setItem('prepara_clients', JSON.stringify(clients));
    }
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
  const passwordInput = document.getElementById('loginClientPassword');
  
  let targetClient = null;
  const clients = getClients();
  
  if (select && select.value) {
    targetClient = clients.find(c => c.id === select.value);
  } else if (phoneInput && phoneInput.value.trim()) {
    const rawPhone = phoneInput.value.replace(/\D/g, '');
    targetClient = clients.find(c => c.phone.replace(/\D/g, '') === rawPhone);
    if (!targetClient) {
      showToast('Nenhum instrutor cadastrado com este telefone!', 'error');
      return;
    }
  } else {
    showToast('Por favor, selecione seu nome ou digite seu telefone.', 'error');
    return;
  }
  
  const password = passwordInput ? passwordInput.value : '';
  if (!password) {
    showToast('Por favor, digite sua senha de acesso.', 'error');
    return;
  }
  
  const storedPassword = targetClient.password || '123456';
  
  if (password !== storedPassword) {
    showToast('Senha de acesso incorreta!', 'error');
    return;
  }
  
  sessionStorage.setItem('current_user_role', 'client');
  sessionStorage.setItem('current_client_id', targetClient.id);
  
  if (passwordInput) passwordInput.value = '';
  
  showClientSpace(targetClient.id);
  showToast(`Bem-vindo ao seu Espaço do Cliente, ${targetClient.name}!`);
}

// Funções do Modal de Auto-Cadastro
function openRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (modal) modal.classList.add('active');
}

function closeRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('registerForm').reset();
  }
}

function handleAutoRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('signUpName').value.trim();
  const phone = document.getElementById('signUpPhone').value.replace(/\D/g, '');
  const city = document.getElementById('signUpCity').value.trim();
  const password = document.getElementById('signUpPassword').value;
  
  if (!name || !phone || !city || !password) {
    showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  let clients = getClients();
  
  if (clients.some(c => c.phone.replace(/\D/g, '') === phone)) {
    showToast('Este número de telefone já está cadastrado no sistema!', 'error');
    return;
  }
  
  const newClient = {
    id: Date.now().toString(),
    name: name,
    phone: phone,
    city: city,
    password: password,
    package: 'burocracia',
    status: 'Pendente',
    driveLink: 'https://drive.google.com',
    created_at: new Date().toLocaleDateString('pt-BR'),
    bio: 'Olá, sou um instrutor credenciado focado em aulas personalizadas e humanizadas.',
    specialties: ['Medo de Dirigir'],
    rate: 100,
    photo: 'assets/logo.jpg'
  };
  
  clients.push(newClient);
  saveClients(clients);
  
  renderClientsKPIs();
  renderClientsTable();
  
  closeRegisterModal();
  
  const loginPhone = document.getElementById('loginClientPhone');
  const loginPass = document.getElementById('loginClientPassword');
  if (loginPhone) loginPhone.value = phone;
  if (loginPass) loginPass.value = password;
  
  showToast('Cadastro realizado com sucesso! Faça login para preencher seu perfil.');
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
            <button class="btn-action-small btn-action-copy" onclick="openEditClientModal('${client.id}')" title="Editar Dados de Cadastro">
              <i class="fa-solid fa-pen-to-square"></i> Editar
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

function openEditClientModal(id) {
  const clients = getClients();
  const client = clients.find(c => c.id === id);
  if (!client) {
    showToast('Cliente não encontrado!', 'error');
    return;
  }
  
  document.getElementById('editClientId').value = client.id;
  document.getElementById('editName').value = client.name;
  document.getElementById('editPhone').value = client.phone;
  document.getElementById('editCity').value = client.city;
  document.getElementById('editPackage').value = client.package;
  document.getElementById('editStatus').value = client.status;
  document.getElementById('editDrive').value = client.driveLink || '';
  
  const modal = document.getElementById('editClientModal');
  if (modal) modal.classList.add('active');
}

function closeEditClientModal() {
  const modal = document.getElementById('editClientModal');
  if (modal) modal.classList.remove('active');
  document.getElementById('editClientForm').reset();
}

function handleEditClientSubmit(e) {
  e.preventDefault();
  
  const id = document.getElementById('editClientId').value;
  const name = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.replace(/\D/g, '');
  const city = document.getElementById('editCity').value.trim();
  const packageVal = document.getElementById('editPackage').value;
  const status = document.getElementById('editStatus').value;
  const driveLink = document.getElementById('editDrive').value.trim() || 'https://drive.google.com';
  
  if (!name || !phone || !city) {
    showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
    return;
  }
  
  let clients = getClients();
  
  // Verifica se o telefone já existe em outro cliente
  if (clients.some(c => c.phone === phone && c.id !== id)) {
    showToast('Outro cliente com este telefone já está cadastrado!', 'error');
    return;
  }
  
  const clientIndex = clients.findIndex(c => c.id === id);
  if (clientIndex !== -1) {
    clients[clientIndex].name = name;
    clients[clientIndex].phone = phone;
    clients[clientIndex].city = city;
    clients[clientIndex].package = packageVal;
    clients[clientIndex].status = status;
    clients[clientIndex].driveLink = driveLink;
    
    saveClients(clients);
    renderClientsKPIs();
    renderClientsTable();
    closeEditClientModal();
    showToast('Dados do instrutor atualizados com sucesso!');
  } else {
    showToast('Erro ao atualizar dados: instrutor não encontrado.', 'error');
  }
}

// 7. CÓDIGO DA INTERFACE DO CLIENTE (INSTRUTOR)
let currentClientId = '';

function switchClientView(viewName) {
  const views = ['journey', 'leads', 'downloads', 'goals', 'profile'];
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
  
  // Preenche dados de perfil (currículo)
  document.getElementById('profileName').value = client.name || '';
  document.getElementById('profilePhone').value = client.phone || '';
  document.getElementById('profileCity').value = client.city || '';
  document.getElementById('profilePhoto').value = client.photo || '';
  document.getElementById('profileRate').value = client.rate || 100;
  document.getElementById('profileBio').value = client.bio || '';
  document.getElementById('profilePassword').value = '';
  
  const savedSpecs = client.specialties || ['Medo de Dirigir'];
  const specCheckboxes = document.querySelectorAll('input[name="profileSpecs"]');
  specCheckboxes.forEach(cb => {
    cb.checked = savedSpecs.includes(cb.value);
  });
  
  // Próximos Passos Checklist
  loadNextSteps(client);
  
  // Carrega Downloads
  loadDownloads(client.package);
  
  // Inicializa o simulador de metas do cliente
  initGoalCalculator();
}

function handleClientProfileSubmit(e) {
  e.preventDefault();
  
  const id = currentClientId;
  const name = document.getElementById('profileName').value.trim();
  const city = document.getElementById('profileCity').value.trim();
  const photo = document.getElementById('profilePhoto').value.trim() || 'assets/logo.jpg';
  const rate = parseInt(document.getElementById('profileRate').value);
  const password = document.getElementById('profilePassword').value;
  const bio = document.getElementById('profileBio').value.trim();
  
  const selectedSpecs = [];
  const specCheckboxes = document.querySelectorAll('input[name="profileSpecs"]:checked');
  specCheckboxes.forEach(cb => {
    selectedSpecs.push(cb.value);
  });
  
  if (selectedSpecs.length === 0) {
    showToast('Por favor, selecione ao menos uma especialidade para seu currículo.', 'error');
    return;
  }
  
  let clients = getClients();
  const clientIndex = clients.findIndex(c => c.id === id);
  
  if (clientIndex !== -1) {
    clients[clientIndex].name = name;
    clients[clientIndex].city = city;
    clients[clientIndex].photo = photo;
    clients[clientIndex].rate = rate;
    clients[clientIndex].bio = bio;
    clients[clientIndex].specialties = selectedSpecs;
    
    if (password.trim() !== '') {
      clients[clientIndex].password = password;
    }
    
    saveClients(clients);
    
    document.getElementById('clientSpaceWelcome').textContent = `Olá, Instrutor ${name}!`;
    document.getElementById('clientSpaceBrandName').textContent = name.split(' ')[0];
    
    showToast('Perfil de currículo atualizado com sucesso!');
  } else {
    showToast('Erro ao salvar perfil: instrutor não encontrado.', 'error');
  }
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
  showToast(`Preparando download de: "${fileName}"...`);
  
  const fileContents = {
    'Modelos de Ofícios Detran': `MODELO DE OFÍCIO PARA SOLICITAÇÃO DE CREDENCIAMENTO - DETRAN\n\nAo Senhor Diretor do Departamento Estadual de Trânsito (DETRAN)\n\nAssunto: Solicitação de Credenciamento como Instrutor de Trânsito Autônomo\n\nPrezado(a) Diretor(a),\n\nEu, [Nome do Instrutor], portador(a) do RG nº [RG] e CPF nº [CPF], Credencial de Instrutor de Trânsito nº [Credencial], residente e domiciliado(a) na [Endereço Completo], venho respeitosamente, por meio deste, solicitar a Vossa Senhoria o credenciamento para atuar como Instrutor de Trânsito Autônomo na categoria [A/B].\n\nPara fins de instrução deste pedido, anexo as certidões negativas de distribuidor criminal, certidão de regularidade do curso de capacitação de instrutor de trânsito, comprovante de residência e cópia autenticada da CNH com a observação "EAR" (Exerce Atividade Remunerada).\n\nTermos em que peço deferimento.\n\n[Cidade / UF], [Data]\n\n___________________________________\n[Nome do Instrutor]`,
    
    'Kit Digital de Agenda': `KIT DIGITAL DE AGENDA - CONTROLE DE HORÁRIOS DE ALUNOS\n\nSegunda a Sexta-Feira:\n07:00 - 07:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n08:00 - 08:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n09:00 - 09:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n10:00 - 10:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n11:00 - 11:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n\n[Intervalo de Almoço]\n\n14:00 - 14:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n15:00 - 15:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n16:00 - 16:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n17:00 - 17:50 | Aluno(a): ___________________ | Aula nº: __ / 20\n18:00 - 18:50 | Aluno(a): ___________________ | Aula nº: __ / 20`,
    
    'Modelo de Recibos Profissional': `RECIBO DE PAGAMENTO - INSTRUTOR DE TRÂNSITO AUTÔNOMO\n\nValor: R$ _________ (____________________________________________)\n\nRecebi de [Nome do Aluno], inscrito(a) no CPF nº ___________________, a importância supra de R$ _________ referente ao pacote de _______ aulas práticas de direção veicular na Categoria [A / B], ministradas pelo Instrutor Autônomo credenciado [Nome do Instrutor].\n\nPor ser verdade, firmo o presente para que surta seus efeitos.\n\n[Cidade / UF], [Data]\n\n___________________________________\n[Nome do Instrutor]\nCPF/CNPJ: ___________________`,
    
    'Reforma de Instagram (Guia)': `GUIA DE REFORMA DE INSTAGRAM PARA INSTRUTORES AUTÔNOMOS\n\n1. FOTO DO PERFIL\n- Use uma foto de busto para cima, sorrindo e com boa iluminação.\n- Se possível, use o carro de fundo ou camisa polo limpa com seu logo.\n\n2. NOME DO PERFIL (SEO)\n- Mude para: "Instrutor [Seu Nome] - [Sua Cidade]" (Ex: "Instrutor Carlos - Macapá").\n- Evite nomes artísticos difíceis. Alunos buscam por "Instrutor [Cidade]".\n\n3. BIO PERSUASIVA (A Fórmula de 3 Linhas)\n- Linha 1 (Autoridade/Promessa): "Te ajudo a passar de primeira no exame do Detran sem ansiedade."\n- Linha 2 (Diferencial): "Aulas práticas personalizadas e humanizadas para habilitados."\n- Linha 3 (Chamada para Ação): "Clique no link abaixo para agendar sua aula experimental 👇"\n\n4. LINK DA BIO (CTA)\n- Crie um link direto para seu WhatsApp (use o wa.me) com uma mensagem pré-definida.`,
    
    'Roteiros de Vídeos IA': `ROTEIROS DE VÍDEOS PERSUASIVOS (REELS / TIKTOK)\n\nRoteiro 1: "O Medo de Dirigir"\n- Gancho (0-3s): "Você comprou o carro, mas ele vive na garagem pegando poeira por medo do trânsito?"\n- Conteúdo (3-15s): "Esse medo é muito comum e acontece porque na autoescola te ensinaram a passar na prova, não a andar no trânsito real. O segredo é começar em ruas calmas de bairro, dominando primeiro o controle de embreagem e o posicionamento."\n- CTA (15-30s): "Quer perder o medo de uma vez por todas? Digite 'QUERO' nos comentários que eu te envio uma mensagem para começarmos."`,
    
    'Arte para Carro (Adesivos)': `ESPECIFICAÇÕES DE ADESIVAÇÃO DE VEÍCULO - INSTRUTOR AUTÔNOMO\n\n1. ADESIVO LATERAL\n- Texto: "TREINAMENTO PARA HABILITADOS" (Fonte: Montserrat ExtraBold)\n- Subtexto: "Aulas Humanizadas e Perca o Medo de Dirigir"\n- WhatsApp: (XX) 9XXXX-XXXX\n- Tamanho recomendado: 60cm de largura por 30cm de altura.\n\n2. ADESIVO TRASEIRO (Vidro Traseiro)\n- Texto: "Pacientes e credenciados. Perca o medo de dirigir!"\n- Telefone em destaque.\n- Material: Vinil Microperfurado (garante visibilidade de dentro para fora).`,
    
    'Scripts de Fechamento WhatsApp': `SCRIPT DE MATRÍCULA NO WHATSAPP - DO OLÁ AO FECHAMENTO\n\nAluno: "Olá, gostaria de saber os valores das aulas."\n\nInstrutor: "Olá! Tudo bem? Sou o Instrutor [Seu Nome]. Com certeza vou te passar os detalhes! Mas antes, para eu te passar a melhor proposta, você já tem a CNH ou está tirando o processo de primeira habilitação?"\n\nAluno: "Já tenho CNH, mas morro de medo de pegar a rodovia."\n\nInstrutor: "Entendi perfeitamente! Esse bloqueio é muito comum e é exatamente nisso que sou especialista. Nosso treinamento é focado no seu carro, no seu bairro, com total paciência, até você se sentir seguro(a). Para esse caso, recomendo o nosso Pacote de Controle e Autonomia. Qual o melhor dia para fazermos uma avaliação prática?"`,
    
    'Quebrando Objeções de Preço': `GUIA DE CONTORNO DE OBJEÇÕES DE VENDAS\n\nObjeção: "Achei o seu preço alto. A autoescola cobra mais barato."\n\nResposta Estratégica:\n"Eu entendo perfeitamente que o preço seja um fator importante! A diferença é que a autoescola te prepara para a pista fechada do Detran em grupo. O meu serviço é uma mentoria de trânsito real individualizada, no seu próprio veículo se preferir, focada na sua autonomia total para dirigir no trânsito pesado. É o investimento na sua liberdade e segurança de uma vez por todas. Vamos agendar uma aula experimental para você ver a diferença na prática?"`
  };
  
  const content = fileContents[fileName] || `Conteúdo do arquivo "${fileName}" do portal de aceleração.`;
  const sanitizedName = fileName.replace(/\s+/g, '_').replace(/[^\w]/gi, '') + '.txt';
  
  setTimeout(() => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = sanitizedName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Arquivo "${fileName}" baixado com sucesso!`);
    } catch (err) {
      console.error('Erro ao baixar arquivo:', err);
      showToast('Erro ao processar download.', 'error');
    }
  }, 1000);
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
