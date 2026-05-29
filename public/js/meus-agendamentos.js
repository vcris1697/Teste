/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/meus-agendamentos.js  (Página: Meus Agendamentos)
   ============================================================ */

import {
  collection, query, where, getDocs,
  doc, updateDoc
} from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';
import { db } from './firebaseConfig.js';

const MONTHS = [
  'JAN','FEV','MAR','ABR','MAI','JUN',
  'JUL','AGO','SET','OUT','NOV','DEZ'
];

/* ============================================================
   VERIFICA SE AINDA PODE CANCELAR (até 24h antes)
   ============================================================ */
function podeCancelar(data, hora, status) {
  if (status !== 'ativo') return false;

  // Monta datetime do agendamento
  const [ano, mes, dia] = data.split('-').map(Number);
  const [h, m]          = hora.split(':').map(Number);
  const dtAgendamento   = new Date(ano, mes - 1, dia, h, m, 0);

  // Prazo limite = horário do agendamento menos 24h
  const limite = new Date(dtAgendamento.getTime() - 24 * 60 * 60 * 1000);

  return new Date() <= limite;
}

/* ============================================================
   BUSCAR AGENDAMENTOS POR CPF
   ============================================================ */
async function buscarAgendamentos() {
  const cpfInput = document.getElementById('cpfBusca');
  if (!cpfInput) return;

  const cpf = cpfInput.value.replace(/\D/g, '');

  if (cpf.length !== 11) {
    alert('Digite um CPF válido com 11 dígitos.');
    return;
  }

  const container = document.getElementById('myAgendContainer');
  container.innerHTML = `
    <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
      Buscando agendamentos...
    </div>`;

  try {
    const q        = query(collection(db, 'agendamentos'), where('cpf', '==', cpf));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `
        <div style="text-align:center;padding:32px;color:var(--text-muted);font-size:14px;">
          Nenhum agendamento encontrado para este CPF.
        </div>`;
      return;
    }

    // Ordena por data mais recente
    const agendamentos = [];
    snapshot.forEach(d => agendamentos.push({ id: d.id, ...d.data() }));
    agendamentos.sort((a, b) => (a.data > b.data ? -1 : 1));

    container.innerHTML = '';
    agendamentos.forEach(a => {
      const [ano, mes, dia] = a.data.split('-');
      const monthName       = MONTHS[parseInt(mes) - 1] || '';

      let statusClass = 'status-confirmed';
      let statusText  = 'Confirmado';
      if (a.status === 'cancelado') { statusClass = 'status-cancelled'; statusText = 'Cancelado'; }
      else if (a.status === 'realizado') { statusClass = 'status-done'; statusText = 'Realizado'; }

      const podeCanc   = podeCancelar(a.data, a.hora, a.status);

      // Calcula tempo restante para cancelar
      let avisoCanc = '';
      if (a.status === 'ativo') {
        const [h, m]        = a.hora.split(':').map(Number);
        const dtAgend       = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), h, m, 0);
        const limite        = new Date(dtAgend.getTime() - 24 * 60 * 60 * 1000);
        const agora         = new Date();

        if (agora > limite) {
          // Passou das 24h — não pode mais cancelar
          avisoCanc = `<div style="font-size:11px;color:#e74c3c;margin-top:4px;">
                         Prazo de cancelamento encerrado
                       </div>`;
        } else {
          // Calcula quanto tempo falta
          const diffMs  = limite - agora;
          const diffH   = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          avisoCanc = `<div style="font-size:11px;color:#27ae60;margin-top:4px;">
                         Cancelamento disponível por mais ${diffH}h ${diffMin}min
                       </div>`;
        }
      }

      container.innerHTML += `
        <div class="myagend-item">
          <div class="myagend-date">
            <div class="day">${dia}</div>
            <div class="month">${monthName}</div>
          </div>
          <div class="myagend-info">
            <h4>${a.ubsNome || 'UBS'}</h4>
            <p>
              ${a.especialidade || 'Consulta'}<br>
              Horário: ${a.hora || '--'} · Protocolo: <strong>${a.protocolo || '--'}</strong>
            </p>
            ${avisoCanc}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
            <span class="status-badge ${statusClass}">${statusText}</span>
            ${podeCanc
              ? `<button class="btn btn-cancel" style="font-size:12px;padding:4px 10px;"
                   onclick="cancelarAgendamento('${a.id}', '${a.protocolo}')">
                   Cancelar
                 </button>`
              : ''}
          </div>
        </div>`;
    });

  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    container.innerHTML = `
      <div style="text-align:center;padding:32px;color:#c0392b;font-size:14px;">
        Erro ao buscar agendamentos. Tente novamente.
      </div>`;
  }
}

/* ============================================================
   CANCELAR AGENDAMENTO
   ============================================================ */
async function cancelarAgendamento(id, protocolo) {
  if (!confirm(`Deseja cancelar o agendamento ${protocolo}?\n\nEsta ação não pode ser desfeita.`)) return;

  try {
    await updateDoc(doc(db, 'agendamentos', id), {
      status: 'cancelado',
      canceladoEm: new Date().toISOString()
    });
    alert('Agendamento cancelado com sucesso.');
    buscarAgendamentos();
  } catch (err) {
    console.error('Erro ao cancelar:', err);
    alert('Erro ao cancelar. Tente novamente.');
  }
}

/* ── MÁSCARA DE CPF ── */
function maskCPF(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  if      (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/^(\d{3})(\d+)/, '$1.$2');
  el.value = v;
}

/* ── EXPÕE FUNÇÕES PARA O HTML ── */
window.buscarAgendamentos    = buscarAgendamentos;
window.cancelarAgendamento   = cancelarAgendamento;
window.maskCPF               = maskCPF;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('cpfBusca');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') buscarAgendamentos();
    });
  }
});