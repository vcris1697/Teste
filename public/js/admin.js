/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/admin.js  (Página: Painel Admin)
   ============================================================ */

import { signOut }                              from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';
import { doc, getDoc, collection, getDocs,
         deleteDoc, query, where, orderBy,
         updateDoc }                            from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';
import { auth, db }                             from './firebaseConfig.js';

/* ── VERIFICA SE O USUÁRIO LOGADO É ADMIN ── */
function verificarSessao() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) { window.location.href = 'loginadmin.html'; return; }

    const adminDoc = await getDoc(doc(db, 'admins', user.email));
    if (!adminDoc.exists()) {
      await auth.signOut();
      window.location.href = 'loginadmin.html';
      return;
    }

    sessionStorage.setItem('adminLogado', 'true');
    sessionStorage.setItem('adminEmail',  user.email);

    const emailDisplay = document.getElementById('adminEmail');
    if (emailDisplay) emailDisplay.textContent = user.email;

    renderAdminUbsList();
    renderAgendamentos();
  });
}

/* ── LOGOUT ── */
async function logout() {
  try {
    await signOut(auth);
    sessionStorage.clear();
    window.location.href = 'loginadmin.html';
  } catch (err) {
    alert('Erro ao fazer logout. Tente novamente.');
  }
}

/* ============================================================
   LISTA DE UBS
   ============================================================ */
async function renderAdminUbsList() {
  const container = document.getElementById('adminUbsList');
  if (!container) return;

  container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:14px;">Carregando...</div>`;

  try {
    const snapshot = await getDocs(collection(db, 'upas'));

    if (snapshot.empty) {
      container.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
          Nenhuma UBS cadastrada. Clique em "Cadastrar UBS" para adicionar.
        </div>`;
      return;
    }

    container.innerHTML = '';
    let i = 1;
    snapshot.forEach((docSnap) => {
      const u  = docSnap.data();
      const id = docSnap.id;
      const espec = (u.especialidades || []).join(', ') || '—';
      container.innerHTML += `
        <div class="ubs-info-row">
          <div class="ubs-num">${i++}</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:600;color:var(--text-main);margin-bottom:4px;">${u.nome}</div>
            <div style="font-size:13px;color:var(--text-muted);line-height:1.7;">
              Sigla: ${u.codigo} · Tipo: ${u.tipo} · Gestão: ${u.gestao}<br>
              CNES: ${u.cnes} · Horário: ${u.horario}<br>
              Especialidades: ${espec}
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;">
            <button class="btn btn-secondary" style="font-size:12px;padding:5px 12px;"
              onclick="editarUBS('${id}')">✏ Editar</button>
            <button class="btn btn-cancel" style="font-size:12px;padding:5px 12px;"
              onclick="removerUBS('${id}','${u.nome.replace(/'/g,"\\'")}')">Remover</button>
          </div>
        </div>`;
    });
  } catch (err) {
    container.innerHTML = `<div style="text-align:center;padding:32px;color:#c0392b;">Erro ao carregar UBS.</div>`;
  }
}

function editarUBS(id) {
  window.location.href = `cadastrar-ubs.html?id=${id}`;
}

async function removerUBS(id, nome) {
  if (!confirm(`Deseja remover "${nome}"?`)) return;
  try {
    await deleteDoc(doc(db, 'upas', id));
    renderAdminUbsList();
  } catch (err) {
    alert('Erro ao remover. Tente novamente.');
  }
}

/* ============================================================
   AGENDAMENTOS
   ============================================================ */
const MONTHS = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

let filtroStatus = 'ativo'; // filtro atual
let filtroUbs    = '';

async function renderAgendamentos() {
  const container = document.getElementById('agendamentosContainer');
  if (!container) return;

  container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:14px;">Carregando agendamentos...</div>`;

  try {
    // Busca todos ou filtra por status
    let q;
    if (filtroStatus === 'todos') {
      q = collection(db, 'agendamentos');
    } else {
      q = query(collection(db, 'agendamentos'), where('status', '==', filtroStatus));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
          Nenhum agendamento encontrado.
        </div>`;
      return;
    }

    // Monta lista e filtra por UBS se necessário
    let agendamentos = [];
    snapshot.forEach(d => agendamentos.push({ id: d.id, ...d.data() }));

    if (filtroUbs) {
      agendamentos = agendamentos.filter(a => a.ubsId === filtroUbs);
    }

    // Ordena por data + hora
    agendamentos.sort((a, b) => {
      const dtA = a.data + ' ' + a.hora;
      const dtB = b.data + ' ' + b.hora;
      return dtA > dtB ? 1 : -1;
    });

    if (agendamentos.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
          Nenhum agendamento encontrado com os filtros selecionados.
        </div>`;
      return;
    }

    container.innerHTML = '';
    agendamentos.forEach(a => {
      const [ano, mes, dia] = a.data.split('-');
      const monthName       = MONTHS[parseInt(mes) - 1] || '';

      let statusClass = 'status-confirmed';
      let statusText  = 'Confirmado';
      if (a.status === 'cancelado')  { statusClass = 'status-cancelled'; statusText = 'Cancelado'; }
      if (a.status === 'realizado')  { statusClass = 'status-done';      statusText = 'Realizado'; }

      const podeMarcar = a.status === 'ativo';

      container.innerHTML += `
        <div class="myagend-item" id="agend-${a.id}">
          <div class="myagend-date">
            <div class="day">${dia}</div>
            <div class="month">${monthName}</div>
          </div>
          <div class="myagend-info" style="flex:1;">
            <h4>${a.ubsNome || 'UBS'}</h4>
            <p style="margin:0;font-size:13px;color:var(--text-muted);line-height:1.7;">
              <strong>${a.nome || '—'}</strong> · CPF: ${a.cpfFormatado || a.cpf || '—'}<br>
              ${a.especialidade || '—'} · Horário: <strong>${a.hora}</strong><br>
              Protocolo: <strong>${a.protocolo || '—'}</strong>
            </p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;min-width:120px;">
            <span class="status-badge ${statusClass}">${statusText}</span>
            ${podeMarcar ? `
              <button class="btn btn-primary" style="font-size:12px;padding:5px 12px;"
                onclick="marcarRealizado('${a.id}')">
                ✓ Finalizar
              </button>` : ''}
          </div>
        </div>`;
    });

  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err);
    container.innerHTML = `<div style="text-align:center;padding:32px;color:#c0392b;">Erro ao carregar agendamentos.</div>`;
  }
}

/* ── MARCAR COMO REALIZADO ── */
async function marcarRealizado(id) {
  if (!confirm('Marcar este agendamento como realizado?')) return;
  try {
    await updateDoc(doc(db, 'agendamentos', id), {
      status: 'realizado',
      finalizadoEm: new Date().toISOString()
    });
    renderAgendamentos();
  } catch (err) {
    alert('Erro ao finalizar agendamento.');
  }
}

/* ── FILTROS ── */
function setFiltroStatus(status, el) {
  filtroStatus = status;
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderAgendamentos();
}

async function carregarFiltroUBS() {
  const sel = document.getElementById('filtroUbs');
  if (!sel) return;

  const snapshot = await getDocs(collection(db, 'upas'));
  sel.innerHTML  = '<option value="">Todas as UBS</option>';
  snapshot.forEach(d => {
    sel.innerHTML += `<option value="${d.id}">${d.data().nome}</option>`;
  });
}

function aplicarFiltroUbs() {
  filtroUbs = document.getElementById('filtroUbs').value;
  renderAgendamentos();
}

/* ── EXPÕE FUNÇÕES ── */
window.logout                   = logout;
window.editarUBS                = editarUBS;
window.removerUBS               = removerUBS;
window.marcarRealizado          = marcarRealizado;
window.setFiltroStatus          = setFiltroStatus;
window.aplicarFiltroUbs         = aplicarFiltroUbs;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  verificarSessao();
  carregarFiltroUBS();
});