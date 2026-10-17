// UjrahTask - Interactive Platform Engine
document.addEventListener('DOMContentLoaded', () => {
  // State Management (Fresh account with zero fake balances)
  let userWallet = {
    available: 0.0,
    pending: 0.0,
    withdrawn: 0.0
  };

  // Initial Sample Tasks (100% Halal Verified)
  let tasks = [
    {
      id: 1,
      title: 'একটি শিক্ষণীয় ইসলামিক ওয়েবসাইটের স্পিড ও বাটন টেস্ট করুন',
      category: 'app',
      categoryLabel: 'ওয়েবসাইট টেস্ট',
      reward: 18.0,
      time: '৩ মিনিট',
      slotsTotal: 100,
      slotsLeft: 64,
      desc: 'আমাদের পার্টনার শিক্ষা প্ল্যাটফর্ম ভিজিট করে হোমপেজের ৩টি লিংকে ক্লিক করে সঠিক পেজে যাচ্ছে কিনা পরীক্ষা করুন।',
      steps: [
        'প্রদত্ত ওয়েবসাইটের লিংকে ভিজিট করুন এবং মোবাইল ভিউতে হোমপেজ ওপেন করুন।',
        'উপরে থাকা "কোর্সসমূহ" ও "আমাদের সম্পর্কে" বাটনে ক্লিক করে পেজ লোড হয় কিনা চেক করুন।',
        'পেজের একদম নিচে স্ক্রল করে একটি ফুল স্ক্রিনশট নিন অথবা আপনার ব্রাউজারের হিস্ট্রি লিংক দিন।'
      ]
    },
    {
      id: 2,
      title: 'একটি বাংলা ইসলামিক বইয়ের ৩ পৃষ্ঠার বানান পরীক্ষা ও সংশোধন',
      category: 'data',
      categoryLabel: 'ডাটা এন্ট্রি ও প্রুফরিড',
      reward: 25.0,
      time: '৫ মিনিট',
      slotsTotal: 50,
      slotsLeft: 12,
      desc: 'বাংলা টাইপ করা ৩টি ছোট অনুচ্ছেদ দেওয়া হবে। তাতে কোনো যুক্তবর্ণের ভুল থাকলে তা চিহ্নিত করে সঠিক বানান লিখুন।',
      steps: [
        'আমাদের গুগল ডক লিংকে যান এবং অনুচ্ছেদটি মনোযোগ দিয়ে পড়ুন।',
        'ভুল বানানগুলো খুঁজে বের করে সঠিক রূপটি নিচে সাবমিশন বক্সে লিখে দিন।',
        'সব ঠিক থাকলে "সাবমিট" বাটনে ক্লিক করে প্রুফ পাঠান।'
      ]
    },
    {
      id: 3,
      title: 'একটি স্থানীয় মুদি দোকানের পণ্যের তালিকা গুগলে মিলিয়ে দেখা',
      category: 'youtube',
      categoryLabel: 'তথ্য ও রিসার্চ',
      reward: 15.0,
      time: '২ মিনিট',
      slotsTotal: 150,
      slotsLeft: 89,
      desc: 'গুগল ম্যাপসে প্রদত্ত দোকানের ফোন নাম্বার ও ঠিকানার সঠিকতা যাচাই করে কনফার্ম করুন।',
      steps: [
        'গুগল ম্যাপে "রহমান জেনারেল স্টোর" সার্চ করুন।',
        'দোকানের খোলার সময় এবং লোকেশন সঠিক আছে কিনা দেখে রিপোর্ট দিন।',
        'সাবমিট বক্সে স্টোরের লোকেশন বা দোকানের নাম লিখে কনফার্ম করুন।'
      ]
    },
    {
      id: 4,
      title: 'নতুন অ্যান্ড্রয়েড অ্যাপ ডাউনলোড ও সাইন-আপ রিভিউ',
      category: 'app',
      categoryLabel: 'অ্যাপ টেস্ট',
      reward: 30.0,
      time: '৪ মিনিট',
      slotsTotal: 80,
      slotsLeft: 35,
      desc: 'প্লে-স্টোর থেকে একটি ফ্রি স্টাডি অ্যাপ ইনস্টল করে একটি ফ্রি একাউন্ট তৈরি করুন এবং ৩ স্টার বা তার বেশি সততাপূর্ণ রিভিউ দিন।',
      steps: [
        'গুগল প্লে স্টোর থেকে অ্যাপটি ডাউনলোড ও ইনস্টল করুন।',
        'আপনার নাম ও ইমেইল দিয়ে ফ্রি সাইন-আপ সম্পন্ন করুন।',
        'প্রোফাইল স্ক্রিনের একটি স্ক্রিনশট লিংক প্রমাণ হিসেবে দিন।'
      ]
    },
    {
      id: 5,
      title: 'ইউটিউবে একটি শিক্ষণীয় ক্যারিয়ার গাইডলাইন ভিডিও দেখা ও মতামত',
      category: 'youtube',
      categoryLabel: 'তথ্য ও রিসার্চ',
      reward: 12.0,
      time: '২ মিনিট',
      slotsTotal: 200,
      slotsLeft: 142,
      desc: 'ভিডিওটি সম্পূর্ণ দেখে ভিডিও থেকে আপনার সবচেয়ে প্রিয় পরামর্শটি সাবমিশন বক্সে লিখে জানান।',
      steps: [
        'প্রদত্ত ইউটিউব লিংক ওপেন করুন এবং ন্যূনতম ২ মিনিট শুনুন।',
        'ভিডিওর একটি শিক্ষণীয় কথা বা আপনার অনুভূতি সংক্ষেপে লিখুন।',
        'সাবমিট বক্সে আপনার ইউটিউব ইউজারনেম ও কমেন্ট লিখুন।'
      ]
    },
    {
      id: 6,
      title: 'একটি ইকমার্স পণ্যের ৫০টি আইটেমের বাংলা ক্যাটাগরি ম্যাপিং',
      category: 'data',
      categoryLabel: 'ডাটা এন্ট্রি',
      reward: 35.0,
      time: '৭ মিনিট',
      slotsTotal: 40,
      slotsLeft: 8,
      desc: '৫০টি নিত্যপ্রয়োজনীয় পণ্যের নামের পাশে সঠিক ক্যাটাগরি (মুদি, প্রসাধন, বা মসলা) সিলেক্ট করতে হবে।',
      steps: [
        'প্রদত্ত শিট ওপেন করুন এবং প্রতিটি পণ্যের পাশে ক্যাটাগরি ড্রপডাউন সিলেক্ট করুন।',
        'কাজ সম্পন্ন হলে শিট লিংকের ভিউ লিংক সাবমিট করুন।'
      ]
    }
  ];

  let selectedTask = null;
  let currentFilter = 'all';

  // DOM Elements
  const tasksContainer = document.getElementById('tasks-container');
  const userBalanceEl = document.getElementById('user-balance');
  const walletPillTrigger = document.getElementById('wallet-pill-trigger');
  const walletModal = document.getElementById('wallet-modal');
  const closeWalletModal = document.getElementById('close-wallet-modal');
  const taskModal = document.getElementById('task-modal');
  const closeTaskModal = document.getElementById('close-task-modal');
  const postTaskModal = document.getElementById('post-task-modal');
  const closePostModal = document.getElementById('close-post-modal');
  const btnOpenPostTask = document.getElementById('btn-open-post-task');
  const btnHeroPost = document.getElementById('btn-hero-post');
  const taskSubmitForm = document.getElementById('task-submit-form');
  const withdrawForm = document.getElementById('withdraw-form');
  const createTaskForm = document.getElementById('create-task-form');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Modal Balance Elements
  const modalAvailableBalance = document.getElementById('modal-available-balance');
  const modalPendingBalance = document.getElementById('modal-pending-balance');
  const modalWithdrawnBalance = document.getElementById('modal-withdrawn-balance');
  const payoutHistoryList = document.getElementById('payout-history-list');

  // Initialize UI
  updateWalletUI();
  renderTasks();

  // Filter Event Listeners
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Render Tasks
  function renderTasks() {
    tasksContainer.innerHTML = '';

    const filtered = tasks.filter(task => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'high') return task.reward >= 20.0;
      return task.category === currentFilter;
    });

    if (filtered.length === 0) {
      tasksContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--emerald);"></i>
          <p>এই ক্যাটাগরিতে বর্তমানে কোনো কাজ খালি নেই। অন্য ক্যাটাগরি চেক করুন।</p>
        </div>
      `;
      return;
    }

    filtered.forEach(task => {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.innerHTML = `
        <div>
          <div class="task-top">
            <span class="task-category-badge">${task.categoryLabel}</span>
            <span class="task-payout">৳ ${task.reward.toFixed(2)}</span>
          </div>
          <h3 class="task-title">${task.title}</h3>
          <p class="task-desc">${task.desc}</p>
        </div>
        <div class="task-footer">
          <div class="task-meta-info">
            <span><i class="fa-regular fa-clock"></i> ${task.time}</span>
            <span><i class="fa-solid fa-users"></i> ${task.slotsLeft}/${task.slotsTotal} বাকি</span>
          </div>
          <button class="btn-start-task" data-id="${task.id}">
            <i class="fa-solid fa-play"></i> শুরু করুন
          </button>
        </div>
      `;
      tasksContainer.appendChild(card);
    });

    // Attach click handlers to start task buttons
    document.querySelectorAll('.btn-start-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        openTaskModal(id);
      });
    });
  }

  // Open Task Modal
  function openTaskModal(taskId) {
    selectedTask = tasks.find(t => t.id === taskId);
    if (!selectedTask) return;

    document.getElementById('modal-task-title').textContent = selectedTask.title;
    document.getElementById('modal-task-reward').innerHTML = `<i class="fa-solid fa-coins"></i> ৳ ${selectedTask.reward.toFixed(2)}`;
    document.getElementById('modal-task-time').innerHTML = `<i class="fa-regular fa-clock"></i> ${selectedTask.time}`;
    document.getElementById('modal-task-slots').innerHTML = `<i class="fa-solid fa-user-group"></i> ${selectedTask.slotsLeft}/${selectedTask.slotsTotal} খালি`;

    const stepsContainer = document.getElementById('modal-task-steps');
    let stepsHTML = '<ol>';
    selectedTask.steps.forEach(step => {
      stepsHTML += `<li>${step}</li>`;
    });
    stepsHTML += '</ol>';
    stepsContainer.innerHTML = stepsHTML;

    // Reset form
    taskSubmitForm.reset();
    taskModal.classList.add('active');
  }

  // Submit Task Proof
  taskSubmitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    const proofText = document.getElementById('proof-text').value.trim();
    if (!proofText) {
      showToast('অনুগ্রহ করে কাজের বিবরণ বা প্রমাণের প্রমাণ লিখুন', 'error');
      return;
    }

    // Update slots and user pending balance
    selectedTask.slotsLeft = Math.max(0, selectedTask.slotsLeft - 1);
    userWallet.pending += selectedTask.reward;
    updateWalletUI();
    renderTasks();

    taskModal.classList.remove('active');
    showToast(`আলহামদুলিল্লাহ! আপনার কাজ জমা হয়েছে। বিজ্ঞাপক ও নেটওয়ার্ক পর্যালোচনার পর (৭-১৪ দিন) ৳${selectedTask.reward.toFixed(2)} ব্যালেন্সে যুক্ত হবে।`, 'success');
  });

  // Wallet Modal Handlers
  walletPillTrigger.addEventListener('click', () => {
    walletModal.classList.add('active');
  });

  closeWalletModal.addEventListener('click', () => {
    walletModal.classList.remove('active');
  });

  closeTaskModal.addEventListener('click', () => {
    taskModal.classList.remove('active');
  });

  // Post Task Modal Handlers
  const openPostModal = () => postTaskModal.classList.add('active');
  btnOpenPostTask.addEventListener('click', (e) => {
    e.preventDefault();
    openPostModal();
  });
  btnHeroPost.addEventListener('click', openPostModal);

  closePostModal.addEventListener('click', () => {
    postTaskModal.classList.remove('active');
  });

  // Close modals on background click
  window.addEventListener('click', (e) => {
    if (e.target === walletModal) walletModal.classList.remove('active');
    if (e.target === taskModal) taskModal.classList.remove('active');
    if (e.target === postTaskModal) postTaskModal.classList.remove('active');
  });

  // Handle Withdrawal Request
  withdrawForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('withdraw-phone').value.trim();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const method = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (!phone || phone.length < 11) {
      showToast('সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন (যেমন 017XXXXXXXX)', 'error');
      return;
    }

    if (isNaN(amount) || amount < 50) {
      showToast('সর্বনিম্ন উইথড্র সীমা ৳ ৫০.০০', 'error');
      return;
    }

    if (amount > userWallet.available) {
      showToast('দুঃখিত! আপনার বর্তমান ব্যালেন্সের চেয়ে বেশি টাকা উইথড্র করা সম্ভব নয়।', 'error');
      return;
    }

    // Process withdrawal
    userWallet.available -= amount;
    userWallet.withdrawn += amount;
    updateWalletUI();

    // Remove empty notice if present
    const emptyNotice = payoutHistoryList.querySelector('.empty-history-notice');
    if (emptyNotice) emptyNotice.remove();

    // Add to history list
    const maskedPhone = phone.substring(0, 3) + '***' + phone.substring(phone.length - 3);
    const li = document.createElement('li');
    li.innerHTML = `
      <span><i class="fa-solid fa-arrow-down text-emerald"></i> ${method} (${maskedPhone})</span>
      <span class="text-gold font-bold">৳ ${amount.toFixed(2)} (যাচাই ও প্রক্রিয়াধীন)</span>
    `;
    payoutHistoryList.prepend(li);

    withdrawForm.reset();
    showToast(`উইথড্র রিকোয়েস্ট জমা হয়েছে! টাস্ক কোয়ালিটি যাচাই ও রিভিউ শেষে ৳${amount.toFixed(2)} পাঠানো হবে।`, 'success');
  });

  // Handle Post New Task
  createTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('new-task-title').value.trim();
    const category = document.getElementById('new-task-category').value;
    const pay = parseFloat(document.getElementById('new-task-pay').value);
    const slots = parseInt(document.getElementById('new-task-slots').value);
    const time = document.getElementById('new-task-time').value.trim();
    const instructions = document.getElementById('new-task-instructions').value.trim();

    const categoryNames = {
      'app': 'অ্যাপ ও ওয়েবসাইট টেস্ট',
      'youtube': 'তথ্য ও রিসার্চ',
      'data': 'ডাটা এন্ট্রি',
      'social': 'সোশ্যাল টাস্ক'
    };

    const newTask = {
      id: tasks.length + 1,
      title: title,
      category: category,
      categoryLabel: categoryNames[category] || 'সাধারণ কাজ',
      reward: pay,
      time: time,
      slotsTotal: slots,
      slotsLeft: slots,
      desc: instructions.length > 90 ? instructions.substring(0, 90) + '...' : instructions,
      steps: instructions.split('\n').filter(s => s.trim().length > 0)
    };

    tasks.unshift(newTask);
    renderTasks();
    postTaskModal.classList.remove('active');
    createTaskForm.reset();
    showToast('মাশাআল্লাহ! আপনার নতুন হালাল টাস্কটি লাইভ পাবলিশ করা হয়েছে।', 'success');
  });

  // Update Wallet Numbers
  function updateWalletUI() {
    userBalanceEl.textContent = `৳ ${userWallet.available.toFixed(2)}`;
    modalAvailableBalance.textContent = `৳ ${userWallet.available.toFixed(2)}`;
    modalPendingBalance.textContent = `৳ ${userWallet.pending.toFixed(2)}`;
    modalWithdrawnBalance.textContent = `৳ ${userWallet.withdrawn.toFixed(2)}`;
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-circle-check text-emerald' : 'fa-circle-exclamation text-danger';
    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
});
