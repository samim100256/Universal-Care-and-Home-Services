// Basic UI helpers
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('mobile-toggle').addEventListener('click', ()=> document.getElementById('mobile-menu').classList.toggle('hidden'));
if(window.lucide) lucide.createIcons();

// Local storage helpers
function saveLocalBooking(obj){ const arr = JSON.parse(localStorage.getItem('uc_bookings')||'[]'); arr.push(obj); localStorage.setItem('uc_bookings', JSON.stringify(arr)); }
function saveLocalWorker(obj){ const arr = JSON.parse(localStorage.getItem('uc_workers')||'[]'); arr.push(obj); localStorage.setItem('uc_workers', JSON.stringify(arr)); }
function renderAdminData(){ const bookings = JSON.parse(localStorage.getItem('uc_bookings')||'[]'); const workers = JSON.parse(localStorage.getItem('uc_workers')||'[]'); const c = document.getElementById('admin-data'); if(!bookings.length && !workers.length){ c.innerHTML = '<div class=\"text-gray-500\">কোনো ডেটা নেই — লোকাল মোড</div>'; return; } let html = ''; if(bookings.length){ html += '<div class=\"mb-2\"><strong>Bookings</strong></div>'; bookings.slice().reverse().forEach(b=>{ html += <div class=\"p-2 bg-white rounded border\"><div class=\"font-medium\">${escapeHtml(b.clientName)}</div><div class=\"text-xs text-gray-600\">${escapeHtml(b.serviceType)} • ${escapeHtml(b.phone)}</div><div class=\"text-xs text-gray-400\">${new Date(b.ts).toLocaleString()}</div></div>; }); } if(workers.length){ html += '<div class=\"mt-3 mb-2\"><strong>Workers</strong></div>'; workers.slice().reverse().forEach(w=>{ html += <div class=\"p-2 bg-white rounded border\"><div class=\"font-medium\">${escapeHtml(w.name)}</div><div class=\"text-xs text-gray-600\">${escapeHtml(w.skill)} • ${escapeHtml(w.phone||w.nid||'')}</div><div class=\"text-xs text-gray-400\">${new Date(w.ts).toLocaleString()}</div></div>; }); } c.innerHTML = html; }
function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

// Payment UI
function showPayment(method){ const details = document.getElementById('payment-details'); details.classList.remove('hidden'); if(method==='bkash'){ details.innerHTML = <div class="font-semibold text-red-600">bKash</div><div class="text-sm text-gray-700 mt-2">Merchant / Personal: +8801XXXXXXXXX</div><div class="mt-2 text-sm">ট্রান্সফার করে TXID এখানে শেয়ার করুন।</div>; } else { details.innerHTML = <div class="font-semibold text-orange-600">Nagad</div><div class="text-sm text-gray-700 mt-2">Merchant / Personal: +8801XXXXXXXXX</div><div class="mt-2 text-sm">ট্রান্সফার করে TXID এখানে শেয়ার করুন।</div>; } details.scrollIntoView({behavior:'smooth', block:'center'}); }

// Booking form logic
const bookingForm = document.getElementById('booking-form');
const bookingBtn = document.getElementById('booking-submit');
const bookingMsg = document.getElementById('booking-message');
bookingBtn.disabled = false;
bookingForm.addEventListener('submit', function(e){
  e.preventDefault();
  bookingBtn.disabled = true;
  document.getElementById('booking-spinner').classList.remove('hidden');
  const data = {
    clientName: document.getElementById('client-name').value.trim(),
    phone: document.getElementById('client-phone').value.trim(),
    address: document.getElementById('client-address').value.trim(),
    serviceType: document.getElementById('service-type').value,
    ts: Date.now()
  };
  saveLocalBooking(data);
  bookingMsg.className = 'mt-4 p-3 rounded text-sm bg-emerald-100 text-emerald-800';
  bookingMsg.innerText = ধন্যবাদ ${data.clientName}! আপনার ${data.serviceType} বুকিং গ্রহণ করা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।;
  bookingForm.reset();
  bookingBtn.disabled = false;
  document.getElementById('booking-spinner').classList.add('hidden');
  renderAdminData();
  setTimeout(()=> bookingMsg.classList.add('hidden'),6000);
});

// Quick hero booking
document.getElementById('quick-book').addEventListener('submit', function(e){
  e.preventDefault();
  const data = {
    clientName: document.getElementById('q-name').value.trim(),
    phone: document.getElementById('q-phone').value.trim(),
    serviceType: document.getElementById('q-service').value,
    ts: Date.now()
  };
  saveLocalBooking(data);
  showToast('বুকিং রেকর্ড করা হয়েছে (লোকাল) — আমরা কল করব।', 'success');
  const text = encodeURIComponent(Booking: ${data.serviceType} - ${data.clientName} - ${data.phone});
  window.open('https://wa.me/8801605888672?text='+text, '_blank');
  this.reset();
  renderAdminData();
});

// Worker public registration
document.getElementById('worker-reg').addEventListener('submit', function(e){
  e.preventDefault();
  const w = {
    name: document.getElementById('w-name').value.trim(),
    phone: document.getElementById('w-phone').value.trim(),
    nid: document.getElementById('w-nid').value.trim(),
    skill: document.getElementById('w-skill').value,
    ts: Date.now()
  };
  saveLocalWorker(w);
  showToast('ধন্যবাদ — রেজিস্ট্রেশন নেওয়া হয়েছে।', 'success');
  this.reset();
  renderAdminData();
});

// Admin worker add (panel)
document.getElementById('admin-worker-form').addEventListener('submit', function(e){
  e.preventDefault();
  const w = {
    name: document.getElementById('adm-w-name').value.trim(),
    skill: document.getElementById('adm-w-skill').value.trim(),
    nid: document.getElementById('adm-w-nid').value.trim(),
    ts: Date.now()
  };
  saveLocalWorker(w);
  showToast('Admin: নতুন কর্মী যোগ করা হয়েছে', 'success');
  this.reset();
  renderAdminData();
});

// Admin modal / panel
document.getElementById('open-admin').addEventListener('click', ()=> { document.getElementById('admin-modal').classList.remove('hidden'); document.getElementById('admin-modal').classList.add('flex','items-center','justify-center'); });
document.getElementById('admin-close').addEventListener('click', ()=> { document.getElementById('admin-modal').classList.add('hidden'); document.getElementById('admin-modal').classList.remove('flex','items-center','justify-center'); });
document.getElementById('admin-login-btn').addEventListener('click', ()=> { const pass = document.getElementById('admin-pass').value; if(pass === 'admin123'){ document.getElementById('admin-modal').classList.add('hidden'); document.getElementById('admin-panel').classList.remove('hidden'); renderAdminData(); } else { showToast('পাসওয়ার্ড ভুল।', 'error'); } document.getElementById('admin-pass').value = ''; });
document.getElementById('admin-close-panel').addEventListener('click', ()=> { document.getElementById('admin-panel').classList.add('hidden'); });
document.getElementById('admin-logout').addEventListener('click', ()=> { document.getElementById('admin-panel').classList.add('hidden'); showToast('Logged out', 'info'); });

// Toast helper
function showToast(msg, type='info'){ const d = document.createElement('div'); d.className = 'fixed right-4 top-4 p-3 rounded shadow-lg text-white font-medium z-50'; if(type==='success') d.style.background = '#10b981'; else if(type==='error') d.style.background = '#ef4444'; else d.style.background = '#3b82f6'; d.textContent = msg; document.body.appendChild(d); setTimeout(()=> { d.style.opacity = 0; setTimeout(()=> d.remove(),300); }, 3000); }

// Render on load
window.addEventListener('load', ()=> { renderAdminData(); if(window.lucide) lucide.createIcons(); });
