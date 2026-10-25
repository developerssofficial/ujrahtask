// UjrahTask - Production Platform Engine
document.addEventListener('DOMContentLoaded', () => {
  // Authentication State
  let currentUser = JSON.parse(localStorage.getItem('ujrah_user') || 'null');

  // Wallet State (Loaded from user session or initialized to 0.0)
  let userWallet = {
    available: currentUser ? (currentUser.balance || 0.0) : 0.0,
    pending: currentUser ? (currentUser.pending || 0.0) : 0.0,
    withdrawn: currentUser ? (currentUser.withdrawn || 0.0) : 0.0
  };

  // 100% Compliant & Safe Tasks List (No incentivized ratings, no policy-violating tasks)
  let tasks = [
    {
      id: 1,
      taskId: 'UT-101',
      provider: 'Ujrah Direct',
      title: 'একটি শিক্ষণীয় ইসলামিক ওয়েবসাইটের মেনু ও বাটন লিঙ্ক পরীক্ষা',
      category: 'app',
      categoryLabel: 'ওয়েবসাইট টেস্ট',
      reward: 18.0,
      time: '৩ মিনিট',
      desc: 'পার্টনার শিক্ষা পোর্টাল ব্রাউজ করে হোমপেজের ৫টি লিঙ্ক সঠিক পেজে রিডাইরেক্ট হচ্ছে কিনা এবং কোনো ৪০৪ ত্রুটি আছে কিনা যাচাই করুন।',
      steps: [
        'প্রদত্ত ওয়েবসাইটের লিঙ্কে ভিজিট করে হোমপেজ ওপেন করুন।',
        'উপরে থাকা "কোর্সসমূহ", "ব্লগ" ও "যোগাযোগ" বাটনে ক্লিক করে পেজ লোড নিশ্চিত করুন।',
        'পেজের নিচের ফুটারে স্ক্রল করে আপনার ব্রাউজিং হিস্ট্রির স্ক্রিনশট বা লিঙ্ক সাবমিট করুন।'
      ]
    },
    {
      id: 2,
      taskId: 'UT-102',
      provider: 'Ujrah Direct',
      title: 'একটি বাংলা ইসলামিক বইয়ের ৩ পৃষ্ঠার বানান পরীক্ষা ও প্রুফরিডিং',
      category: 'data',
      categoryLabel: 'ডাটা এন্ট্রি ও প্রুফরিড',
      reward: 25.0,
      time: '৫ মিনিট',
      desc: 'টাইপকৃত ৩টি ছোট অনুচ্ছেদের যুক্তবর্ণ ও বানান নির্ভুল কিনা তা যাচাই করে ভুলগুলো চিহ্নিত করে সঠিক বানান লিখে দিন।',
      steps: [
        'আমাদের গুগল ডক ভিউ লিঙ্ক ওপেন করুন এবং অনুচ্ছেদটি মনোযোগ দিয়ে পড়ুন।',
        'ভুল বানানগুলো খুঁজে বের করে সঠিক বানানটি নিচে সাবমিশন বক্সে লিখে দিন।',
        'সব তথ্য যাচাই করে "প্রুফ সাবমিট" বাটনে ক্লিক করুন।'
      ]
    },
    {
      id: 3,
      taskId: 'CPX-804',
      provider: 'CPX Research',
      title: 'দৈনন্দিন লাইফস্টাইল ও অনলাইন শপিং মার্কেট রিসার্চ সার্ভে',
      category: 'survey',
      categoryLabel: 'সার্ভে (শীঘ্রই আসছে)',
      reward: 22.0,
      time: '৪ মিনিট',
      desc: 'আন্তর্জাতিক ব্র্যান্ডের মার্কেট রিসার্চ সার্ভেতে অংশ নিয়ে আপনার অভিমত দিন। সঠিক সম্পন্ন হলে স্বয়ংক্রিয় পোস্টব্যাক ক্রেডিট হবে।',
      steps: [
        '"সার্ভে শুরু করুন" বাটনে ক্লিক করে অফারওয়াল ওপেন করুন।',
        'প্রদত্ত প্রশ্নাবলীর সত্য ও নিরপেক্ষ উত্তর দিন।',
        'সার্ভে সম্পন্ন হওয়ার পর পার্টনার সার্ভার থেকে সরাসরি ব্যালেন্স আপডেট হবে।'
      ]
    },
    {
      id: 4,
      taskId: 'UT-104',
      provider: 'Ujrah Direct',
      title: 'একটি অ্যান্ড্রয়েড লার্নিং অ্যাপের ইউজার ইন্টারফেস (UI) ত্রুটি রিপোর্ট',
      category: 'app',
      categoryLabel: 'অ্যাপ টেস্ট',
      reward: 28.0,
      time: '৪ মিনিট',
      desc: 'প্লে-স্টোর থেকে একটি ফ্রি স্টাডি অ্যাপ টেস্ট করে এর ইন্টারফেসের কোনো বাটন বা টেক্সট কেটে যায় কিনা তা আমাদের ইন্টারনাল ফর্মে রিপোর্ট করুন।',
      steps: [
        'অ্যাপটি ওপেন করে রেজিস্ট্রেশন ও প্রোফাইল পেজ পরীক্ষা করুন।',
        'অ্যাপের ভেতর কোনো বাটন বা মেনুতে সমস্যা থাকলে তা চিহ্নিত করুন।',
        'সমস্যা থাকলে তার স্ক্রিনশট এবং ফোনের মডেল সাবমিশন বক্সে জমা দিন।'
      ]
    },
    {
      id: 5,
      taskId: 'LT-209',
      provider: 'Lootably',
      title: 'কনজিউমার টেকনোলজি ও ডিজিটাল সার্ভিস মতামত পোল',
      category: 'survey',
      categoryLabel: 'সার্ভে (শীঘ্রই আসছে)',
      reward: 15.0,
      time: '৩ মিনিট',
      desc: 'ডিজিটাল সার্ভিস ব্যবহার সম্পর্কিত ছোট রিসার্চ পোল। কোনো প্রকার প্রক্সি বা ভিপিএন ছাড়া সততার সাথে সম্পন্ন করুন।',
      steps: [
        'অফারওয়াল পেজে প্রবেশ করে নির্ধারিত সার্ভে নির্বাচন করুন।',
        'স্ক্রিনিং প্রশ্নের সঠিক উত্তর দিয়ে পোল শেষ করুন।',
        'পোস্টব্যাক নিশ্চিত হলে সিস্টেম থেকে ব্যালেন্সে অর্থ যুক্ত হবে।'
      ]
    },
    {
      id: 6,
      taskId: 'UT-106',
      provider: 'Ujrah Direct',
      title: 'একটি ইকমার্স সাইটের ৫০টি পণ্যের সঠিক ক্যাটাগরি ও ট্যাগ যাচাই',
      category: 'data',
      categoryLabel: 'ডাটা এন্ট্রি',
      reward: 35.0,
      time: '৭ মিনিট',
      desc: '৫০টি নিত্যপ্রয়োজনীয় পণ্যের নামের সাথে প্রদত্ত ক্যাটাগরি (মুদি, মসলা, বেবি কেয়ার) সঠিক আছে কিনা তা টিক মার্ক দিয়ে নিশ্চিত করুন।',
      steps: [
        'প্রদত্ত স্প্রেডশিট লিঙ্ক ওপেন করুন।',
        'তালিকার প্রতিটি আইটেমের ক্যাটাগরি ড্রপডাউন থেকে নির্বাচন করুন।',
        'কাজ সম্পন্ন হলে শিটের ভিউ লিঙ্ক নিচে সাবমিট বক্সে জমা দিন।'
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
  const navAuthActions = document.getElementById('nav-auth-actions');

  // Modal Balance Elements
  const modalAvailableBalance = document.getElementById('modal-available-balance');
  const modalPendingBalance = document.getElementById('modal-pending-balance');
  const modalWithdrawnBalance = document.getElementById('modal-withdrawn-balance');
  const payoutHistoryList = document.getElementById('payout-history-list');

  // Initialize UI & Auth Header
  updateAuthHeader();
  updateWalletUI();
  if (tasksContainer) {
    renderTasks();
  }
  renderCPXSurveyWall();

  // Sync with Supabase Auth if available
  if (window.ujrahAuth && window.ujrahAuth.getCurrentUser) {
    window.ujrahAuth.getCurrentUser().then(user => {
      if (user) {
        currentUser = user;
        userWallet.available = user.balance || 0.0;
        userWallet.pending = user.pending || 0.0;
        userWallet.withdrawn = user.withdrawn || 0.0;
        updateAuthHeader();
        updateWalletUI();
        renderCPXSurveyWall();
      }
    });
  }

  // Auth Header Management
  function updateAuthHeader() {
    // If on pages with #nav-auth-actions
    if (navAuthActions) {
      if (currentUser) {
        navAuthActions.innerHTML = `
          <div class="wallet-pill" id="wallet-pill-trigger" style="cursor: pointer;">
            <i class="fa-solid fa-wallet text-gold"></i>
            <span class="wallet-label">ব্যালেন্স:</span>
            <span class="wallet-amount" id="user-balance">৳ ${userWallet.available.toFixed(2)}</span>
            <button class="btn-quick-withdraw" title="উইথড্র করুন">টাকা তুলুন (মিনিমাম ৳৫০)</button>
          </div>
          <div class="user-profile-badge" style="display: flex; align-items: center; gap: 8px;">
            <div class="avatar"><i class="fa-solid fa-user-check"></i></div>
            <span class="username" style="font-weight: 600; color: #fff;">${currentUser.name || 'আমার অ্যাকাউন্ট'}</span>
            <button id="btn-logout" title="লগআউট" style="background: transparent; border: none; color: var(--text-dim); cursor: pointer; padding: 4px; font-size: 0.9rem;"><i class="fa-solid fa-right-from-bracket"></i></button>
          </div>
        `;
        // Reattach listeners
        const newWalletPill = document.getElementById('wallet-pill-trigger');
        if (newWalletPill && walletModal) {
          newWalletPill.addEventListener('click', () => walletModal.classList.add('active'));
        }
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
          btnLogout.addEventListener('click', logoutUser);
        }
      } else {
        navAuthActions.innerHTML = `
          <a href="login.html" class="btn btn-glass" style="padding: 7px 16px; font-size: 0.88rem;"><i class="fa-solid fa-right-to-bracket"></i> লগইন</a>
          <a href="signup.html" class="btn btn-primary" style="padding: 7px 16px; font-size: 0.88rem;"><i class="fa-solid fa-user-plus"></i> সাইন আপ</a>
        `;
      }
    }

    // Homepage header element check
    const hpUserBadge = document.querySelector('.user-profile-badge');
    const hpWalletPill = document.querySelector('.wallet-pill');
    if (hpUserBadge && !navAuthActions) {
      if (!currentUser) {
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
          navActions.innerHTML = `
            <a href="login.html" class="btn btn-glass" style="padding: 7px 16px; font-size: 0.88rem;"><i class="fa-solid fa-right-to-bracket"></i> লগইন</a>
            <a href="signup.html" class="btn btn-primary" style="padding: 7px 16px; font-size: 0.88rem;"><i class="fa-solid fa-user-plus"></i> সাইন আপ</a>
          `;
        }
      } else {
        const usernameEl = hpUserBadge.querySelector('.username');
        if (usernameEl) usernameEl.textContent = currentUser.name || 'আমার অ্যাকাউন্ট';
      }
    }
  }

  function logoutUser() {
    if (window.ujrahAuth && window.ujrahAuth.signOut) {
      window.ujrahAuth.signOut();
    }
    localStorage.removeItem('ujrah_user');
    currentUser = null;
    showToast('সফলভাবে লগআউট হয়েছে', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  }

  // Filter Event Listeners
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Render Tasks Grid
  function renderTasks() {
    if (!tasksContainer) return;
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
            <div>
              <span class="task-category-badge">${task.categoryLabel}</span>
              <span class="task-provider-badge"><i class="fa-solid fa-shield-halal text-emerald"></i> ${task.provider}</span>
            </div>
            <span class="task-payout">৳ ${task.reward.toFixed(2)}</span>
          </div>
          <h3 class="task-title">${task.title}</h3>
          <p class="task-desc">${task.desc}</p>
        </div>
        <div class="task-footer">
          <div class="task-meta-info">
            <span class="task-id-badge"><i class="fa-solid fa-hashtag"></i> ${task.taskId}</span>
            <span><i class="fa-regular fa-clock"></i> ${task.time}</span>
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
        if (!currentUser) {
          showToast('টাস্ক শুরু করতে অনুগ্রহ করে প্রথমে লগইন বা সাইন আপ করুন।', 'error');
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1200);
          return;
        }
        const id = parseInt(e.currentTarget.dataset.id);
        openTaskModal(id);
      });
    });
  }

  // Open Task Modal
  function openTaskModal(taskId) {
    selectedTask = tasks.find(t => t.id === taskId);
    if (!selectedTask || !taskModal) return;

    document.getElementById('modal-task-title').textContent = selectedTask.title;
    document.getElementById('modal-task-reward').innerHTML = `<i class="fa-solid fa-coins"></i> ৳ ${selectedTask.reward.toFixed(2)}`;
    document.getElementById('modal-task-time').innerHTML = `<i class="fa-regular fa-clock"></i> ${selectedTask.time}`;
    
    const modalTaskId = document.getElementById('modal-task-id');
    if (modalTaskId) {
      modalTaskId.innerHTML = `<i class="fa-solid fa-hashtag"></i> ID: ${selectedTask.taskId}`;
    }

    const stepsContainer = document.getElementById('modal-task-steps');
    let stepsHTML = '<ol>';
    selectedTask.steps.forEach(step => {
      stepsHTML += `<li>${step}</li>`;
    });
    stepsHTML += '</ol>';
    stepsContainer.innerHTML = stepsHTML;

    // Reset form
    if (taskSubmitForm) taskSubmitForm.reset();
    taskModal.classList.add('active');
  }

  // Submit Task Proof
  if (taskSubmitForm) {
    taskSubmitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedTask) return;

      const proofText = document.getElementById('proof-text').value.trim();
      if (!proofText) {
        showToast('অনুগ্রহ করে কাজের বিবরণ বা প্রমাণের প্রমাণ লিখুন', 'error');
        return;
      }

      // Update user pending balance
      userWallet.pending += selectedTask.reward;
      if (currentUser) {
        currentUser.pending = userWallet.pending;
        localStorage.setItem('ujrah_user', JSON.stringify(currentUser));
      }
      updateWalletUI();

      taskModal.classList.remove('active');
      showToast(`আলহামদুলিল্লাহ! আপনার কাজ জমা হয়েছে। বিজ্ঞাপক পর্যালোচনার পর (৭-১৪ দিন) ৳${selectedTask.reward.toFixed(2)} ব্যালেন্সে যুক্ত হবে।`, 'success');
    });
  }

  // Wallet Modal Handlers
  if (walletPillTrigger && walletModal) {
    walletPillTrigger.addEventListener('click', () => {
      if (!currentUser) {
        showToast('ওয়ালেট দেখতে অনুগ্রহ করে প্রথমে লগইন করুন', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
      }
      walletModal.classList.add('active');
    });
  }

  if (closeWalletModal && walletModal) {
    closeWalletModal.addEventListener('click', () => walletModal.classList.remove('active'));
  }

  if (closeTaskModal && taskModal) {
    closeTaskModal.addEventListener('click', () => taskModal.classList.remove('active'));
  }

  // Post Task Modal Handlers
  const openPostModal = () => {
    if (!currentUser) {
      showToast('টাস্ক পোস্ট করতে অনুগ্রহ করে প্রথমে লগইন করুন', 'error');
      setTimeout(() => window.location.href = 'login.html', 1000);
      return;
    }
    if (postTaskModal) postTaskModal.classList.add('active');
  };

  if (btnOpenPostTask) {
    btnOpenPostTask.addEventListener('click', (e) => {
      e.preventDefault();
      openPostModal();
    });
  }
  if (btnHeroPost) btnHeroPost.addEventListener('click', openPostModal);

  if (closePostModal && postTaskModal) {
    closePostModal.addEventListener('click', () => postTaskModal.classList.remove('active'));
  }

  // Close modals on background click
  window.addEventListener('click', (e) => {
    if (e.target === walletModal) walletModal.classList.remove('active');
    if (e.target === taskModal) taskModal.classList.remove('active');
    if (e.target === postTaskModal) postTaskModal.classList.remove('active');
  });

  // Handle Withdrawal Request
  if (withdrawForm) {
    withdrawForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('withdraw-phone').value.trim();
      const amount = parseFloat(document.getElementById('withdraw-amount').value);
      const method = document.querySelector('input[name="paymentMethod"]:checked').value;

      if (!phone || phone.length < 11) {
        showToast('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)', 'error');
        return;
      }

      if (isNaN(amount) || amount < 50) {
        showToast('সর্বনিম্ন উত্তোলন সীমা ৳ ৫০.০০', 'error');
        return;
      }

      if (amount > userWallet.available) {
        showToast('দুঃখিত! আপনার বর্তমান উত্তোলনযোগ্য ব্যালেন্সের চেয়ে বেশি টাকা উইথড্র করা সম্ভব নয়।', 'error');
        return;
      }

      // Process withdrawal
      userWallet.available -= amount;
      userWallet.withdrawn += amount;
      if (currentUser) {
        currentUser.balance = userWallet.available;
        currentUser.withdrawn = userWallet.withdrawn;
        localStorage.setItem('ujrah_user', JSON.stringify(currentUser));
      }
      updateWalletUI();

      // Remove empty notice if present
      if (payoutHistoryList) {
        const emptyNotice = payoutHistoryList.querySelector('.empty-history-notice');
        if (emptyNotice) emptyNotice.remove();

        const maskedPhone = phone.substring(0, 3) + '***' + phone.substring(phone.length - 3);
        const li = document.createElement('li');
        li.innerHTML = `
          <span><i class="fa-solid fa-arrow-down text-emerald"></i> ${method} (${maskedPhone})</span>
          <span class="text-gold font-bold">৳ ${amount.toFixed(2)} (যাচাই ও প্রক্রিয়াধীন)</span>
        `;
        payoutHistoryList.prepend(li);
      }

      withdrawForm.reset();
      showToast(`উইথড্র রিকোয়েস্ট জমা হয়েছে! কোয়ালিটি যাচাই ও পর্যালোচনা শেষে ৳${amount.toFixed(2)} পাঠানো হবে।`, 'success');
    });
  }

  // Offerwall Partner Buttons
  document.querySelectorAll('.offerwall-open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const network = e.currentTarget.dataset.network;
      if (!currentUser) {
        showToast(`${network} অফারওয়াল ওপেন করতে অনুগ্রহ করে লগইন করুন`, 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
      }
      showToast('আমরা Lootably ও CPX Research এর সাথে পার্টনারশিপের জন্য আবেদন প্রক্রিয়ায় আছি; চূড়ান্ত অনুমোদন পাওয়ার পর সার্ভিস চালু হবে।', 'success');
    });
  });

  // Render CPX Survey Wall (Dynamic Server-Generated Iframe for Logged-In Users)
  async function renderCPXSurveyWall() {
    const wallArea = document.getElementById('cpx-wall-render-area');
    if (!wallArea) return;

    if (!currentUser) {
      wallArea.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.5); border-radius: 12px; border: 1px dashed rgba(255, 255, 255, 0.12);">
          <i class="fa-solid fa-lock" style="font-size: 2.2rem; color: #fbbf24; margin-bottom: 14px;"></i>
          <h4 style="font-size: 1.15rem; margin-bottom: 8px; color: #fff;">সার্ভে ওয়ালে অংশ নিতে লগইন প্রয়োজন</h4>
          <p style="color: var(--text-dim); max-width: 480px; margin: 0 auto 20px; font-size: 0.92rem; line-height: 1.5;">
            CPX Research সার্ভে সম্পন্ন করে সঠিক পয়েন্ট ও অর্জিত অর্থ পাওয়ার জন্য আপনার ভেরিফাইড অ্যাকাউন্টে লগইন থাকা আবশ্যক।
          </p>
          <a href="login.html" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-right-to-bracket"></i> লগইন করে সার্ভে শুরু করুন
          </a>
        </div>
      `;
      const liveBadge = document.getElementById('cpx-live-badge');
      if (liveBadge) {
        liveBadge.innerHTML = '<i class="fa-solid fa-lock"></i> লগইন প্রয়োজন';
        liveBadge.style.color = '#fbbf24';
        liveBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
        liveBadge.style.background = 'rgba(245, 158, 11, 0.1)';
      }
      return;
    }

    // User is logged in
    try {
      wallArea.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.2rem; color: var(--emerald); margin-bottom: 12px;"></i>
          <p style="color: var(--text-dim);">সার্ভে ওয়াল সুরক্ষিতভাবে লোড হচ্ছে...</p>
        </div>
      `;

      let iframeUrl = '';
      if (window.ujrahAuth && window.ujrahAuth.getCPXWallUrl) {
        iframeUrl = await window.ujrahAuth.getCPXWallUrl(currentUser.id);
      } else {
        const res = await fetch(`/api/cpx/wall-url?user_id=${encodeURIComponent(currentUser.id)}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'সার্ভার সেশন রেসপন্স দেয়নি');
        }
        iframeUrl = data.url;
      }

      wallArea.innerHTML = `
        <div style="width: 100%; border-radius: 10px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <iframe
            id="cpx-survey-iframe"
            width="100%"
            frameBorder="0"
            height="2000px"
            src="${iframeUrl}"
            title="CPX Research Survey Wall"
            style="display: block; width: 100%; min-height: 800px; border: none; background: #ffffff;">
          </iframe>
        </div>
      `;

      const liveBadge = document.getElementById('cpx-live-badge');
      if (liveBadge) {
        liveBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> সার্ভে অ্যাক্টিভ';
        liveBadge.style.color = '#10b981';
        liveBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        liveBadge.style.background = 'rgba(16, 185, 129, 0.1)';
      }
    } catch (err) {
      console.error('[CPX Wall Render Error]:', err);
      wallArea.innerHTML = `
        <div style="text-align: center; padding: 35px 20px; background: rgba(239, 68, 68, 0.08); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.25);">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: #ef4444; margin-bottom: 12px;"></i>
          <h4 style="font-size: 1.1rem; margin-bottom: 6px; color: #fff;">সার্ভে ওয়াল সেশন তৈরি করা যায়নি</h4>
          <p style="color: var(--text-dim); font-size: 0.9rem; max-width: 520px; margin: 0 auto 14px;">
            ${err.message || 'সার্ভার থেকে সিকিউর সেশন পাওয়া যায়নি।'}
          </p>
          <p style="font-size: 0.82rem; color: var(--text-muted);">
            Vercel Environment Variable এ <code>CPX_SECURE_HASH</code> কনফিগার করা থাকলে এটি স্বয়ংক্রিয়ভাবে লোড হবে।
          </p>
        </div>
      `;
    }
  }

  // Login Form Handler (for login.html)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const alertBox = document.getElementById('auth-alert');
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (!email || !password) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> লগইন হচ্ছে...';
      }

      try {
        let userSession = null;
        if (window.ujrahAuth && window.ujrahAuth.isConfigured && window.ujrahAuth.isConfigured()) {
          userSession = await window.ujrahAuth.signIn(email, password);
        } else {
          // Fallback local session
          let existingUsers = JSON.parse(localStorage.getItem('ujrah_users_db') || '[]');
          let matched = existingUsers.find(u => u.email === email || u.phone === email);
          userSession = matched || {
            id: 'usr_' + Date.now().toString(36),
            name: email.split('@')[0] || 'ব্যবহারকারী',
            email: email,
            phone: '01700000000',
            balance: 0.0,
            pending: 0.0,
            withdrawn: 0.0
          };
          localStorage.setItem('ujrah_user', JSON.stringify(userSession));
        }

        currentUser = userSession;
        showToast('আলহামদুলিল্লাহ! সফলভাবে লগইন হয়েছে। ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...', 'success');
        setTimeout(() => {
          window.location.href = 'tasks.html';
        }, 1000);
      } catch (err) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${err.message || 'লগইন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।'}`;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> লগইন করুন';
        }
      }
    });
  }

  // Signup Form Handler (for signup.html)
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const phone = document.getElementById('signup-phone').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      const alertBox = document.getElementById('signup-alert');
      const submitBtn = signupForm.querySelector('button[type="submit"]');

      if (password !== confirmPassword) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> পাসওয়ার্ড দুটি মেলেনি। অনুগ্রহ করে আবার যাচাই করুন।';
        }
        return;
      }

      if (phone.length < 11) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> অ্যাকাউন্ট তৈরি হচ্ছে...';
      }

      try {
        let newUser = null;
        if (window.ujrahAuth && window.ujrahAuth.isConfigured && window.ujrahAuth.isConfigured()) {
          newUser = await window.ujrahAuth.signUp(email, password, name, phone);
        } else {
          // Fallback local registration
          newUser = {
            id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: name,
            email: email,
            phone: phone,
            password: password,
            balance: 0.0,
            pending: 0.0,
            withdrawn: 0.0,
            joinedAt: new Date().toISOString()
          };
          let existingUsers = JSON.parse(localStorage.getItem('ujrah_users_db') || '[]');
          existingUsers.push(newUser);
          localStorage.setItem('ujrah_users_db', JSON.stringify(existingUsers));
          localStorage.setItem('ujrah_user', JSON.stringify(newUser));
        }

        currentUser = newUser;
        showToast('আলহামদুলিল্লাহ! অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। টাস্ক ড্যাশবোর্ডে স্বাগতম!', 'success');
        setTimeout(() => {
          window.location.href = 'tasks.html';
        }, 1200);
      } catch (err) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${err.message || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।'}`;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> অ্যাকাউন্ট তৈরি করুন';
        }
      }
    });
  }

  // Contact Form Handler
  const contactForm = document.getElementById('contact-us-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = document.getElementById('contact-success-msg');
      if (successMsg) successMsg.style.display = 'block';
      contactForm.reset();
      showToast('ধন্যবাদ! আপনার বার্তাটি আমাদের সাপোর্ট টিমে জমা হয়েছে।', 'success');
    });
  }

  // Update Wallet Numbers
  function updateWalletUI() {
    if (userBalanceEl) userBalanceEl.textContent = `৳ ${userWallet.available.toFixed(2)}`;
    if (modalAvailableBalance) modalAvailableBalance.textContent = `৳ ${userWallet.available.toFixed(2)}`;
    if (modalPendingBalance) modalPendingBalance.textContent = `৳ ${userWallet.pending.toFixed(2)}`;
    if (modalWithdrawnBalance) modalWithdrawnBalance.textContent = `৳ ${userWallet.withdrawn.toFixed(2)}`;
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
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
