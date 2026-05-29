/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/postos-de-saude.js  (Página: Postos de Saúde)
   ============================================================ */

import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';
import { db } from './firebaseConfig.js';

/* ============================================================
   RENDERIZAR LISTA DE UBS DO FIRESTORE
   ============================================================ */
async function renderUBSList() {
  const container = document.getElementById('ubs-info-list');
  if (!container) return;

  container.innerHTML = `
    <div class="card-body" style="text-align:center;padding:32px;color:var(--text-muted);">
      Carregando unidades...
    </div>`;

  try {
    const snapshot = await getDocs(collection(db, 'upas'));

    if (snapshot.empty) {
      container.innerHTML = `
        <div class="notice" style="margin:16px;">
          <span>Nenhuma UBS cadastrada no momento. Entre em contato com a administração.</span>
        </div>`;
      return;
    }

    container.innerHTML = '';
    let i = 1;
    snapshot.forEach(docSnap => {
      const u = docSnap.data();
      container.innerHTML += `
        <div class="ubs-info-row">
          <div class="ubs-num">${i++}</div>
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--text-main);margin-bottom:4px;">
              ${u.nome}
            </div>
            <div style="font-size:13px;color:var(--text-muted);line-height:1.7;">
              Sigla: ${u.codigo} · Tipo: ${u.tipo}<br>
              Gestão: ${u.gestao} · CNES: ${u.cnes}<br>
              Horário: ${u.horario}
            </div>
            <span class="ubs-badge badge-green" style="margin-top:6px;">⬤ Vagas disponíveis</span>
          </div>
        </div>`;
    });

  } catch (err) {
    console.error('Erro ao carregar postos:', err);
    container.innerHTML = `
      <div class="notice" style="margin:16px;">
        <span style="color:#c0392b;">Erro ao carregar postos de saúde. Recarregue a página.</span>
      </div>`;
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderUBSList();
});