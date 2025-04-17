// Estrutura de dados para armazenar registros de manutenção
let manutencaoRecords = JSON.parse(localStorage.getItem('manutencaoRecords')) || [];

// Itens padrão da lista de verificação
const defaultChecklistItems = [
  'Freios',
  'Motor',
  'Faróis',
  'Suspensão',
  'Pneus',
  'Ar Condicionado',
  'Sistema Elétrico',
  'Fluidos',
  'Filtros',
  'Bateria'
];

// Função para lidar com a navegação entre páginas
function showPage(pageId) {
  const paginas = document.querySelectorAll('.pagina');
  paginas.forEach(pagina => pagina.style.display = 'none');
  document.getElementById(pageId).style.display = 'block';
  
  // Se estiver indo para a página de checklist e não há cliente selecionado,
  // mostra a lista padrão
  if (pageId === 'checklist' && !document.querySelector('.dashboard-header h1').textContent.includes('Lista de Verificação -')) {
    initializeDefaultChecklist();
  }
}

// Inicializar a lista de verificação padrão
function initializeDefaultChecklist() {
  const checklistItems = document.getElementById('checklistItems');
  checklistItems.innerHTML = ''; // Limpa a lista atual
  
  defaultChecklistItems.forEach(item => {
    const itemElement = createChecklistItem(item);
    checklistItems.appendChild(itemElement);
  });
}

// Inicializar os itens da lista de verificação para um cliente específico
function initializeClientChecklist(clientId) {
  const checklistItems = document.getElementById('checklistItems');
  checklistItems.innerHTML = ''; // Limpa a lista atual
  
  const record = manutencaoRecords.find(r => r.id === clientId);
  if (!record) return;
  
  // Se o cliente não tem uma checklist, cria uma nova com os itens padrão
  if (!record.checklist) {
    record.checklist = {};
    defaultChecklistItems.forEach(item => {
      record.checklist[item] = { status: null, comentario: '' };
    });
    localStorage.setItem('manutencaoRecords', JSON.stringify(manutencaoRecords));
  }

  // Adiciona os itens da checklist do cliente
  Object.keys(record.checklist).forEach(itemName => {
    const itemElement = createChecklistItem(itemName, record.checklist[itemName]);
    checklistItems.appendChild(itemElement);
  });
}

// Criar um novo item da lista de verificação
function createChecklistItem(itemName, itemData = { status: null, comentario: '' }) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'checklist-item animate-slide';
  
  const header = document.createElement('div');
  header.className = 'item-header';
  
  const nameSpan = document.createElement('span');
  nameSpan.className = 'item-name';
  nameSpan.textContent = itemName;
  
  const actions = document.createElement('div');
  actions.className = 'item-actions';
  
  const goodBtn = document.createElement('button');
  goodBtn.className = 'status-btn good';
  goodBtn.innerHTML = '<i class="fas fa-circle-check"></i>';
  
  const badBtn = document.createElement('button');
  badBtn.className = 'status-btn bad';
  badBtn.innerHTML = '<i class="fas fa-triangle-exclamation"></i>';

  const deleteItemBtn = document.createElement('button');
  deleteItemBtn.className = 'status-btn delete';
  deleteItemBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteItemBtn.style.display = 'none';
  
  actions.appendChild(goodBtn);
  actions.appendChild(badBtn);
  actions.appendChild(deleteItemBtn);
  
  header.appendChild(nameSpan);
  header.appendChild(actions);
  
  const detalhe = document.createElement('div');
  detalhe.className = 'item-detalhe';
  detalhe.style.display = 'none';
  
  const comentarioContainer = document.createElement('div');
  comentarioContainer.className = 'comentario-container';
  
  const comentario = document.createElement('textarea');
  comentario.className = 'item-comentario';
  comentario.placeholder = 'Descreva o problema...';
  
  const salvarcomentario = document.createElement('div');
  salvarcomentario.className = 'salvar-comentario';
  salvarcomentario.style.display = 'none';
  
  const comentarioText = document.createElement('p');
  salvarcomentario.appendChild(comentarioText);
  
  const comentarioActions = document.createElement('div');
  comentarioActions.className = 'comentario-actions';
  
  const editcomentarioBtn = document.createElement('button');
  editcomentarioBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editcomentarioBtn.className = 'edit-comentario-btn';
  
  const deletecomentarioBtn = document.createElement('button');
  deletecomentarioBtn.innerHTML = '<i class="fas fa-times"></i>';
  deletecomentarioBtn.className = 'delete-comentario-btn';
  
  comentarioActions.appendChild(editcomentarioBtn);
  comentarioActions.appendChild(deletecomentarioBtn);
  salvarcomentario.appendChild(comentarioActions);
  
  const savecomentarioBtn = document.createElement('button');
  savecomentarioBtn.className = 'save-comentario-btn';
  savecomentarioBtn.innerHTML = '<i class="fas fa-check"></i>';
  
  comentarioContainer.appendChild(comentario);
  comentarioContainer.appendChild(savecomentarioBtn);
  comentarioContainer.appendChild(salvarcomentario);
  
  detalhe.appendChild(comentarioContainer);
  
  itemDiv.appendChild(header);
  itemDiv.appendChild(detalhe);

// Definindo o estado inicial
if (itemData.status === 'good') {
    itemDiv.className = 'checklist-item status-good animate-slide';
    goodBtn.classList.add('active');
  } else if (itemData.status === 'bad') {
    itemDiv.className = 'checklist-item status-bad animate-slide';
    detalhe.style.display = 'block';
    deleteItemBtn.style.display = 'block';
    badBtn.classList.add('active');
    if (itemData.comentario) {
      comentarioText.textContent = itemData.comentario;
      comentario.style.display = 'none';
      salvarcomentario.style.display = 'block';
    }
  }
  
  // Event listeners
  goodBtn.addEventListener('click', () => {
    itemDiv.className = 'checklist-item status-good animate-slide';
    detalhe.style.display = 'none';
    deleteItemBtn.style.display = 'none';
    goodBtn.classList.add('active');
    badBtn.classList.remove('active');
    saveChecklistState();
  });
  
  badBtn.addEventListener('click', () => {
    itemDiv.className = 'checklist-item status-bad animate-slide';
    detalhe.style.display = 'block';
    deleteItemBtn.style.display = 'block';
    badBtn.classList.add('active');
    goodBtn.classList.remove('active');
    saveChecklistState();
  });
  
  savecomentarioBtn.addEventListener('click', () => {
    if (!comentario.value.trim()) {
      showErrorMessage('É necessário descrever o problema');
      return;
    }
    
    comentarioText.textContent = comentario.value;
    comentario.style.display = 'none';
    savecomentarioBtn.style.display = 'none';
    salvarcomentario.style.display = 'block';
    saveChecklistState();
    showsucessoMessage('Comentário salvo com sucesso!');
  });
  
  editcomentarioBtn.addEventListener('click', () => {
    comentario.value = comentarioText.textContent;
    comentario.style.display = 'block';
    savecomentarioBtn.style.display = 'block';
    salvarcomentario.style.display = 'none';
  });
  
  deletecomentarioBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja excluir este comentário?')) {
      comentario.value = '';
      comentario.style.display = 'block';
      savecomentarioBtn.style.display = 'block';
      salvarcomentario.style.display = 'none';
      saveChecklistState();
      showsucessoMessage('Comentário excluído com sucesso!');
    }
  });
  
  deleteItemBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      itemDiv.remove();
      saveChecklistState();
      showsucessoMessage('Item excluído com sucesso!');
    }
  });
  
  return itemDiv;
}

// Adicionar novo item à lista de verificação
function adicionarNovoItem() {
  const input = document.getElementById('novoItem');
  const value = input.value.trim();
  
  if (!value) {
    showErrorMessage('É necessário digitar um novo serviço');
    return;
  }
  
  const checklistItems = document.getElementById('checklistItems');
  const itemElement = createChecklistItem(value);
  checklistItems.appendChild(itemElement);
  
  input.value = '';
  hideErrorMessage();
  saveChecklistState();
}

// Mostrar mensagem de erro
function showErrorMessage(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

// Ocultar mensagem de erro
function hideErrorMessage() {
  document.getElementById('errorMessage').style.display = 'none';
}

// Lidar com o envio do formulário de manutenção
document.getElementById('manutencaoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const manutencao = {
    id: Date.now(),
    nome: this.nome.value,
    modelo: this.modelo.value,
    placa: this.placa.value,
    servico: this.servico.value,
    contato: this.contato.value,
    mecanico: this.mecanico.value,
   principalMecanico: this.mecanico.value,
    status: 'naoiniciado',
    data: new Date().toLocaleDateString(),
    checklist: {}
  };
  
  // Inicializa a checklist com os itens padrão
  defaultChecklistItems.forEach(item => {
    manutencao.checklist[item] = { status: null, comentario: '' };
  });
  
  manutencaoRecords.unshift(manutencao);
  localStorage.setItem('manutencaoRecords', JSON.stringify(manutencaoRecords));
  
  updatemanutencaoTable();
  showsucessoMessage('Manutenção agendada com sucesso!');
  this.reset();
  
  showPage('dashboard');
});

// Atualizar a tabela de manutenções
function updatemanutencaoTable() {
  const tbody = document.querySelector('.dashboard-tabela tbody');
  tbody.innerHTML = '';
  
  if (manutencaoRecords.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="4" style="text-align: center;">Nenhum serviço em andamento</td>';
    tbody.appendChild(tr);
    return;
  }
  
  manutencaoRecords.forEach(record => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.onclick = () => showmanutencaoChecklist(record.id);
    tr.innerHTML = `
      <td>${record.nome}</td>
      <td>${record.modelo}</td>
      <td>${record.servico}</td>
      <td>${getStatusDisplay(record.status)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function getStatusDisplay(status) {
  const statusMap = {
    'naoiniciado': 'Não iniciado',
    'em andamento': 'Em andamento',
    'pendente': 'Pendente',
    'concluido': 'Concluído',
    'nao concluido': 'Não Concluído',
    'parado': 'Parado'
  };
  return statusMap[status] || status;
}

// Exibir a lista de verificação para um registro de manutenção específico
function showmanutencaoChecklist(id) {
  showPage('checklist');
  const record = manutencaoRecords.find(r => r.id === parseInt(id));
  if (record) {
    document.querySelector('.dashboard-header h1').textContent = 
      `Lista de Verificação - ${record.nome} (${record.modelo})`;
    
    const mecanicoSelect = document.createElement('select');
    mecanicoSelect.innerHTML = `
      <option value="mecanico1" ${record.mecanico === 'mecanico1' ? 'selected' : ''}>Fernando Ferreira</option>
      <option value="mecanico2" ${record.mecanico === 'mecanico2' ? 'selected' : ''}>Ramon Barbosa</option>
      <option value="mecanico3" ${record.mecanico === 'mecanico3' ? 'selected' : ''}>Lucas Martins</option>
    `;
    mecanicoSelect.onchange = (e) => updatemecanico(record.id, e.target.value);
    
    const statusSelect = document.createElement('select');
    statusSelect.innerHTML = `
      <option value="naoiniciado" ${record.status === 'naoiniciado' ? 'selected' : ''}>Não iniciado</option>
      <option value="em andamento" ${record.status === 'em andamento' ? 'selected' : ''}>Em andamento</option>
      <option value="pendente" ${record.status === 'pendente' ? 'selected' : ''}>Pendente</option>
      <option value="concluido" ${record.status === 'concluido' ? 'selected' : ''}>Concluído</option>
      <option value="nao concluido" ${record.status === 'nao concluido' ? 'selected' : ''}>Não Concluído</option>
      <option value="parado" ${record.status === 'parado' ? 'selected' : ''}>Parado</option>
    `;
    statusSelect.onchange = (e) => {
      updatemanutencaoStatus(record.id, e.target.value);
      updatemanutencaoTable();
    };
    
    const mecanicoInfo = document.createElement('div');
    mecanicoInfo.className = 'mecanico-info';
    mecanicoInfo.innerHTML = `
      <h3>Informações da Manutenção</h3>
      <p><strong>Nome:</strong> ${record.nome}</p>
      <p><strong>Veículo:</strong> ${record.modelo}</p>
      <p><strong>Serviço:</strong> ${record.servico}</p>
      <p><strong>Mecânico Principal:</strong> ${getMecanicoName(record.principalMecanico)}</p>
      <p><strong>Status:</strong></p>
      <p><strong>Mecânico Atual:</strong></p>
    `;
    
    const statusContainer = mecanicoInfo.querySelector('p:nth-last-child(2)');
    const mecanicoContainer = mecanicoInfo.querySelector('p:last-child');
    
    statusContainer.appendChild(statusSelect);
    mecanicoContainer.appendChild(mecanicoSelect);
    
    const container = document.querySelector('.checklist-container');
    const existingInfo = container.querySelector('.mecanico-info');
    if (existingInfo) {
      existingInfo.remove();
    }
    container.insertBefore(mecanicoInfo, container.firstChild);
    
    // // Inicializar checklist do cliente
    initializeClientChecklist(record.id);
  }
}

function getMecanicoName(value) {
  const mecanicos = {
    'mecanico1': 'Fernando Ferreira',
    'mecanico2': 'Ramon Barbosa',
    'mecanico3': 'Lucas Martins'
  };
  return mecanicos[value] || value;
}

// Atualizar status da manutenção
function updatemanutencaoStatus(id, status) {
  const record = manutencaoRecords.find(r => r.id === parseInt(id));
  if (record) {
    record.status = status;
    localStorage.setItem('manutencaoRecords', JSON.stringify(manutencaoRecords));
    showsucessoMessage('Status atualizado com sucesso!');
  }
}

// Atualizar mecânico
function updatemecanico(id, mecanico) {
  const record = manutencaoRecords.find(r => r.id === parseInt(id));
  if (record) {
    record.mecanico = mecanico;
    localStorage.setItem('manutencaoRecords', JSON.stringify(manutencaoRecords));
    showsucessoMessage('Mecânico atualizado com sucesso!');
  }
}

// Salvar o estado da lista de verificação
function saveChecklistState() {
  const title = document.querySelector('.dashboard-header h1').textContent;
  const currentRecord = manutencaoRecords.find(r => 
    title.includes(r.nome) && title.includes(r.modelo)
  );
  
  if (currentRecord) {
    const items = document.querySelectorAll('.checklist-item');
    const state = {};
    
    items.forEach(item => {
      const name = item.querySelector('.item-name').textContent;
      const status = item.classList.contains('status-good') ? 'good' : 
                    item.classList.contains('status-bad') ? 'bad' : null;
      const salvarcomentario = item.querySelector('.salvar-comentario p');
      const comentario = salvarcomentario ? salvarcomentario.textContent : '';
      
      state[name] = { status, comentario };
    });
    
    currentRecord.checklist = state;
    localStorage.setItem('manutencaoRecords', JSON.stringify(manutencaoRecords));
  }
}

// Exibir mensagem de sucesso
function showsucessoMessage(message) {
  const div = document.createElement('div');
  div.className = 'sucesso-message animate-slide';
  div.textContent = message;
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.remove();
  }, 3000);
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
  updatemanutencaoTable();
  
  // Se estiver na página de checklist sem cliente selecionado, mostra a lista padrão
  if (document.getElementById('checklist').style.display !== 'none' && 
      !document.querySelector('.dashboard-header h1').textContent.includes('Lista de Verificação -')) {
    initializeDefaultChecklist();
  }
});