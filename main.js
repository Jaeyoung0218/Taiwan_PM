/**
 * 指南(Jinam) in Jamsil - K-VIBE 蠶室指南
 * UI interactions: tabs, filters, detail view, language, share
 */

(function () {
    'use strict';
  
    const DOM = {
      headerTitle: document.getElementById('headerTitle'),
      panels: document.querySelectorAll('.panel'),
      tabItems: document.querySelectorAll('.tab-item'),
      btnEmergencyMap: document.getElementById('btnEmergencyMap'),
      langEn: document.getElementById('langEn'),
      langZh: document.getElementById('langZh'),
      langKo: document.getElementById('langKo'),
      setLangEn: document.getElementById('setLangEn'),
      setLangZh: document.getElementById('setLangZh'),
      setLangKo: document.getElementById('setLangKo'),
      viewDashboard: document.getElementById('view-dashboard'),
      viewDetail: document.getElementById('view-detail'),
      btnBackFromDetail: document.getElementById('btnBackFromDetail'),
      concertList: document.getElementById('concertList'),
      feedList: document.getElementById('feedList'),
      liveConcertFilter: document.getElementById('liveConcertFilter'),
      btnGoToLive: document.getElementById('btnGoToLive'),
    };
  
    const TAB_TITLES = {
      en: { concerts: 'Concert', live: 'Live', map: 'Map', more: 'More' },
      zh: { concerts: '蠶室指南', live: '現場實況', map: '生存地圖', more: '更多 / 設定' },
      ko: { concerts: '잠실 가이드', live: '현장 실황', map: '생존 지도', more: '더보기 / 설정' },
    };
    const TAB_LABELS = {
      en: { concerts: 'Concert', live: 'Live', map: 'Map', more: 'More' },
      zh: { concerts: '演唱會', live: '現場', map: '生存地圖', more: '更多' },
      ko: { concerts: '공연', live: '현장', map: '생존지도', more: '더보기' },
    };
  
    let currentLang = 'zh';
    let currentConcertIdForLive = null; // from detail "Go to Live"
  
    // ---------- Tab switching ----------
    function switchPanel(panelId) {
      DOM.panels.forEach(function (p) {
        p.classList.toggle('active', p.dataset.panel === panelId);
      });
      DOM.tabItems.forEach(function (t) {
        const selected = t.dataset.tab === panelId;
        t.classList.toggle('active', selected);
        t.setAttribute('aria-selected', selected);
      });
      var titles = TAB_TITLES[currentLang];
      var title = titles && (titles[panelId] || titles.concerts);
      if (DOM.headerTitle && title) DOM.headerTitle.textContent = title;
      updateTabLabels();
  
      if (panelId === 'live' && currentConcertIdForLive != null && DOM.liveConcertFilter) {
        DOM.liveConcertFilter.value = String(currentConcertIdForLive);
        filterFeedCards();
        currentConcertIdForLive = null;
      }
    }
  
    DOM.tabItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const tab = this.dataset.tab;
        if (tab) switchPanel(tab);
      });
    });
  
    if (DOM.btnEmergencyMap) {
      DOM.btnEmergencyMap.addEventListener('click', function () {
        switchPanel('map');
      });
    }
  
    // ---------- Concert Dashboard: venue filter chips ----------
    document.querySelectorAll('.filter-chips .chip[data-venue]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const venue = this.dataset.venue;
        document.querySelectorAll('.filter-chips .chip[data-venue]').forEach(function (c) {
          c.classList.toggle('active', c.dataset.venue === venue);
        });
        const cards = document.querySelectorAll('.concert-list .concert-card');
        cards.forEach(function (card) {
          const show = venue === 'all' || card.dataset.venue === venue;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  
    // ---------- Concert card click → CON-002 Detail ----------
    const CONCERTS_DATA = {
      1: {
        artist: 'LE SSERAFIM',
        title: '2025 LE SSERAFIM WORLD TOUR',
        dday: 'D-3',
        date: '2025.02.11 (二) 19:00',
        venue: 'KSPO DOME (蠶室室內體育館)',
        address: '首爾松坡區奧林匹克路424',
        ticketLink: '#',
        officialLink: '#',
      },
      2: {
        artist: '(G)I-DLE',
        title: '2025 (G)I-DLE WORLD TOUR',
        dday: 'D-7',
        date: '2025.02.15 (六) 18:00',
        venue: 'SK Handball Stadium (手球競技場)',
        address: '首爾松坡區奧林匹克路424',
        ticketLink: '#',
        officialLink: '#',
      },
      3: {
        artist: 'aespa',
        title: '2025 aespa LIVE TOUR',
        dday: 'D-Day',
        date: '2025.02.08 (六) 18:00',
        venue: 'KSPO DOME (蠶室室內體育館)',
        address: '首爾松坡區奧林匹克路424',
        ticketLink: '#',
        officialLink: '#',
      },
    };
  
    function openConcertDetail(concertId) {
      const data = CONCERTS_DATA[concertId];
      if (!data) return;
      document.getElementById('detailDday').textContent = data.dday;
      document.getElementById('detailArtist').textContent = data.artist;
      document.getElementById('detailTitle').textContent = data.title;
      document.getElementById('detailDate').textContent = data.date;
      document.getElementById('detailVenue').textContent = data.venue;
      document.getElementById('detailAddress').textContent = data.address;
      document.getElementById('detailTicketLink').href = data.ticketLink;
      document.getElementById('detailOfficialLink').href = data.officialLink;
      document.getElementById('btnGoToLive').dataset.concertId = String(concertId);
      if (DOM.viewDashboard) DOM.viewDashboard.style.display = 'none';
      if (DOM.viewDetail) DOM.viewDetail.style.display = 'block';
    }
  
    function closeConcertDetail() {
      if (DOM.viewDashboard) DOM.viewDashboard.style.display = '';
      if (DOM.viewDetail) DOM.viewDetail.style.display = 'none';
    }
  
    document.querySelectorAll('.concert-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.btn-view-detail') || e.target.closest('.concert-card')) {
          const id = this.dataset.concertId;
          if (id) openConcertDetail(id);
        }
      });
      card.querySelector('.btn-view-detail')?.addEventListener('click', function (e) {
        e.preventDefault();
        openConcertDetail(card.dataset.concertId);
      });
    });
  
    if (DOM.btnBackFromDetail) {
      DOM.btnBackFromDetail.addEventListener('click', closeConcertDetail);
    }
  
    if (DOM.btnGoToLive) {
      DOM.btnGoToLive.addEventListener('click', function () {
        const id = this.dataset.concertId;
        currentConcertIdForLive = id ? id : null;
        closeConcertDetail();
        switchPanel('live');
      });
    }
  
    // ---------- Live Feed: filters + Share to Threads ----------
    function filterFeedCards() {
      const concertVal = DOM.liveConcertFilter ? DOM.liveConcertFilter.value : 'all';
      const categoryActive = document.querySelector('.live-filter-row .chip[data-category].active');
      const category = categoryActive ? categoryActive.dataset.category : 'all';
      const cards = document.querySelectorAll('.feed-list .feed-card');
      cards.forEach(function (card) {
        const matchConcert = concertVal === 'all' || card.dataset.concertId === concertVal;
        const matchCategory = category === 'all' || card.dataset.category === category;
        card.style.display = matchConcert && matchCategory ? '' : 'none';
      });
    }
  
    document.querySelectorAll('.live-filter-row .chip[data-category]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.live-filter-row .chip[data-category]').forEach(function (c) {
          c.classList.toggle('active', c === chip);
        });
        filterFeedCards();
      });
    });
  
    if (DOM.liveConcertFilter) {
      DOM.liveConcertFilter.addEventListener('change', filterFeedCards);
    }
  
    function buildShareUrl(type, text, url) {
      url = url || (typeof window !== 'undefined' && window.location ? window.location.href : '');
      if (type === 'threads') return 'https://threads.net/intent/post?text=' + encodeURIComponent(text);
      if (type === 'line') return 'https://line.me/R/msg/text/?' + encodeURIComponent(text + (url ? ' ' + url : ''));
      return '#';
    }
    document.querySelectorAll('.btn-share[data-share-type="threads"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var text = this.dataset.shareText || document.title;
        this.href = buildShareUrl('threads', text);
      });
    });
    document.querySelectorAll('.btn-share[data-share-type="line"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var text = this.dataset.shareText || document.title;
        this.href = buildShareUrl('line', text);
      });
    });
    document.querySelectorAll('.btn-share-native').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = this.dataset.shareText || document.title;
        var url = this.dataset.shareUrl || (window.location && window.location.href);
        if (navigator.share) {
          navigator.share({ title: document.title, text: text, url: url }).catch(function () {});
        } else {
          navigator.clipboard && navigator.clipboard.writeText(text + ' ' + url).then(function () {
            var label = btn.getAttribute('aria-label');
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Share'; btn.setAttribute('aria-label', label); }, 1500);
          });
        }
      });
    });
  
    function updateTabLabels() {
      var labels = TAB_LABELS[currentLang];
      if (!labels) return;
      document.querySelectorAll('[data-tab-label]').forEach(function (span) {
        var tab = span.dataset.tabLabel;
        if (labels[tab]) span.textContent = labels[tab];
      });
    }
  
    // ---------- Language switcher (KO, EN, ZH-TW) ----------
    function setLanguage(lang) {
      currentLang = lang;
      DOM.langEn?.classList.toggle('active', lang === 'en');
      DOM.langZh?.classList.toggle('active', lang === 'zh');
      DOM.langKo?.classList.toggle('active', lang === 'ko');
      DOM.langEn?.setAttribute('aria-pressed', lang === 'en');
      DOM.langZh?.setAttribute('aria-pressed', lang === 'zh');
      DOM.langKo?.setAttribute('aria-pressed', lang === 'ko');
      DOM.setLangEn?.classList.toggle('active', lang === 'en');
      DOM.setLangZh?.classList.toggle('active', lang === 'zh');
      DOM.setLangKo?.classList.toggle('active', lang === 'ko');
      var titles = TAB_TITLES[currentLang];
      var activePanel = document.querySelector('.panel.active');
      if (activePanel && DOM.headerTitle && titles) {
        DOM.headerTitle.textContent = titles[activePanel.dataset.panel] || titles.concerts;
      }
      updateTabLabels();
      // Today banner: keep count number
      var bannerEl = document.querySelector('[data-i18n="todayBanner"]');
      if (bannerEl && I18N[currentLang]) {
        var count = 2;
        if (currentLang === 'zh') bannerEl.innerHTML = '今天在奧林匹克公園有 <strong>' + count + '</strong> 場演唱會';
        else if (currentLang === 'ko') bannerEl.innerHTML = '오늘 올림픽공원 공연 <strong>' + count + '</strong>건';
        else bannerEl.innerHTML = '<strong>' + count + '</strong> concerts at Olympic Park today';
      }
      // Update other data-i18n elements (skip nodes with important children)
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        if (el.dataset.i18n === 'todayBanner') return;
        var key = el.dataset.i18n;
        var text = I18N[currentLang] && I18N[currentLang][key];
        if (text && !el.querySelector('*')) el.textContent = text;
      });
    }
  
    const I18N = {
      en: {
        todayBanner: '2 concerts at Olympic Park today',
        viewDetail: 'View detail',
        back: 'Back',
        detailDate: 'Date',
        detailVenue: 'Venue',
        detailAddress: 'Address',
        ticketLink: 'Ticket',
        officialSite: 'Official site',
        goToLive: 'Go to Live feed',
        mapComingSoon: 'Survival Map – Coming soon',
        mapDesc: 'Interactive map · Jamsil area',
        mapLockers: 'Subway lockers (Available / Full)',
        mapWater: 'Water stations',
        mapMerch: 'Official merch booths',
        settingsLanguage: 'Language',
        communityDesc: 'Join our community for real-time updates',
        settingsInfo: 'Info',
        faq: 'FAQ',
        about: 'About K-VIBE',
        privacy: 'Privacy Policy',
        footerTz: 'Date/Time: Asia/Seoul · Currency: KRW / TWD',
      },
      zh: {
        todayBanner: '今天在奧林匹克公園有 2 場演唱會',
        viewDetail: '查看詳細',
        back: '返回',
        detailDate: '日期',
        detailVenue: '場地',
        detailAddress: '地址',
        ticketLink: '購票連結',
        officialSite: '官方網站',
        goToLive: 'Live 現場實況 바로가기',
        mapComingSoon: '生存地圖 - 即將推出',
        mapDesc: '互動地圖 · 蠶室一帶',
        mapLockers: '地鐵置物櫃 (即時：有空/滿)',
        mapWater: '飲水機',
        mapMerch: '官方周邊攤位',
        settingsLanguage: '語言 / 設定',
        communityDesc: '加入我們的社群，獲取實時現場資訊',
        settingsInfo: '資訊',
        faq: '常見問題 FAQ',
        about: '關於 K-VIBE',
        privacy: '隱私權政策',
        footerTz: '時間：Asia/Seoul · 貨幣：KRW / TWD',
      },
      ko: {
        todayBanner: '오늘 올림픽공원 공연 2건',
        viewDetail: '자세히 보기',
        back: '돌아가기',
        detailDate: '일시',
        detailVenue: '장소',
        detailAddress: '주소',
        ticketLink: '예매 링크',
        officialSite: '공식 사이트',
        goToLive: 'Live 현장 실황 바로가기',
        mapComingSoon: '생존 지도 - 준비 중',
        mapDesc: '인터랙티브 지도 · 잠실 일대',
        mapLockers: '지하철 락커 (실시간: 여유/만실)',
        mapWater: '급수대',
        mapMerch: '공식 굿즈 부스',
        settingsLanguage: '언어 / 설정',
        communityDesc: '커뮤니티에 참여해 실시간 현장 정보를 받아보세요',
        settingsInfo: '정보',
        faq: '자주 묻는 질문 FAQ',
        about: 'K-VIBE 소개',
        privacy: '개인정보처리방침',
        footerTz: '일시: Asia/Seoul · 통화: KRW / TWD',
      },
    };
  
    DOM.langEn?.addEventListener('click', function () { setLanguage('en'); });
    DOM.langZh?.addEventListener('click', function () { setLanguage('zh'); });
    DOM.langKo?.addEventListener('click', function () { setLanguage('ko'); });
    DOM.setLangEn?.addEventListener('click', function () { setLanguage('en'); });
    DOM.setLangZh?.addEventListener('click', function () { setLanguage('zh'); });
    DOM.setLangKo?.addEventListener('click', function () { setLanguage('ko'); });
  
    // Copy link (feed cards)
    document.querySelectorAll('.feed-card .icon-btn[aria-label="Copy link"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const card = this.closest('.feed-card');
        const text = card ? card.querySelector('.card-desc')?.textContent || '' : '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            var label = btn.getAttribute('aria-label');
            btn.setAttribute('aria-label', '已複製');
            setTimeout(function () { btn.setAttribute('aria-label', label); }, 1500);
          });
        }
      });
    });
  
    // Initial header title & tab labels
    if (DOM.headerTitle && TAB_TITLES[currentLang]) DOM.headerTitle.textContent = TAB_TITLES[currentLang].concerts;
    updateTabLabels();
  })();
  