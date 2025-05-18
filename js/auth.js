import { supabase } from './api.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const msg = document.getElementById('auth-msg');

loginBtn.onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });

  if (error) msg.textContent = 'Ошибка входа: ' + error.message;
  else window.location.href = 'admin.html';
};

// signupBtn.onclick = async () => {
//   const { error } = await supabase.auth.signUp({
//     email: emailInput.value,
//     password: passwordInput.value
//   });

//   if (error) msg.textContent = 'Ошибка регистрации: ' + error.message;
//   else msg.textContent = 'Проверьте почту для подтверждения!';
// };
