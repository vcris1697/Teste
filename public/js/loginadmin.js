/* ============================================================
   Sistema de Agendamento UBS — Santa Maria DF
   js/loginadmin.js  (Página: Login Admin)
   ============================================================ */

import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';
import { doc, getDoc }               from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';
import { auth, db }                  from './firebaseConfig.js';

async function fazerLogin() {
  const email = document.getElementById('login_email').value.trim();
  const senha  = document.getElementById('login_senha').value;
  const erroEl = document.getElementById('login_erro');

  // Esconde erro anterior
  erroEl.style.display = 'none';

  if (!email || !senha) {
    mostrarErro('Preencha o e-mail e a senha.');
    return;
  }

  try {
    // 1. Autentica no Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, email, senha);
    const user = credential.user;

    // 2. Verifica se o email está na coleção "admins" do Firestore
    const adminDoc = await getDoc(doc(db, 'admins', user.email));

    if (!adminDoc.exists()) {
      // Email autenticado mas NÃO é admin — faz logout e bloqueia
      await auth.signOut();
      mostrarErro('Acesso negado. Este e-mail não tem permissão de administrador.');
      return;
    }

    // 3. É admin — salva sessão e redireciona
    sessionStorage.setItem('adminLogado', 'true');
    sessionStorage.setItem('adminUID',    user.uid);
    sessionStorage.setItem('adminEmail',  user.email);

    window.location.href = 'admin.html';

  } catch (error) {
    console.error('Erro no login:', error.code);

    // Mensagens amigáveis por tipo de erro
    if (
      error.code === 'auth/user-not-found'  ||
      error.code === 'auth/wrong-password'  ||
      error.code === 'auth/invalid-credential'
    ) {
      mostrarErro('E-mail ou senha incorretos. Tente novamente.');
    } else if (error.code === 'auth/too-many-requests') {
      mostrarErro('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
    } else {
      mostrarErro('Erro ao fazer login. Tente novamente.');
    }
  }
}

function mostrarErro(msg) {
  const erroEl = document.getElementById('login_erro');
  erroEl.textContent = msg;
  erroEl.style.display = 'block';
}

// Permite login ao pressionar Enter
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login_senha').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fazerLogin();
  });
  document.getElementById('login_email').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fazerLogin();
  });
});

// Expõe para o onclick do HTML
window.fazerLogin = fazerLogin;