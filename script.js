// Tab switching
const tabSignin = document.getElementById('tab-signin');
const tabSignup = document.getElementById('tab-signup');
const formSignin = document.getElementById('form-signin');
const formSignup = document.getElementById('form-signup');

function showSignin() {
  tabSignin.classList.add('active');
  tabSignup.classList.remove('active');
  formSignin.classList.add('visible');
  formSignup.classList.remove('visible');
}
function showSignup() {
  tabSignup.classList.add('active');
  tabSignin.classList.remove('active');
  formSignup.classList.add('visible');
  formSignin.classList.remove('visible');
}
tabSignin.addEventListener('click', showSignin);
tabSignup.addEventListener('click', showSignup);

// Eye toggles
document.querySelectorAll('.toggle-eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    target.type = target.type === 'password' ? 'text' : 'password';
  });
});

// Simple validators
const emailOk = (v) => /\S+@\S+\.\S+/.test(v);

// Sign In submit
formSignin.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('si-email').value.trim();
  const pass  = document.getElementById('si-password').value;

  if (!email || !pass) return alert('Please fill in all fields.');
  if (!emailOk(email)) return alert('Please enter a valid email.');
  alert(`Signed in as ${email}`);
});

// Sign Up submit
formSignup.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const pass  = document.getElementById('su-password').value;
  const pass2 = document.getElementById('su-confirm').value;

  if (!name || !email || !pass || !pass2) return alert('Please fill in all fields.');
  if (!emailOk(email)) return alert('Please enter a valid email.');
  if (pass.length < 8) return alert('Password must be at least 8 characters.');
  if (pass !== pass2) return alert('Passwords do not match.');
  alert(`Account created for ${name}!`);
});
