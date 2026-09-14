/* ==========================================================================
   眦 · 摄影作品集  |  main.js
   --------------------------------------------------------------------------
   想换成自己的作品，只需要改下面 WORKS 数组：
     src   图片路径
     title 作品标题
     cat   分类（要和 CATEGORIES 里的名称一致）
     w/h   图片原始宽高（用于占位，避免加载时抖动）
   ========================================================================== */

/* ---------- 分类顺序（第一个是"全部"） ---------- */
const CATEGORIES = ['全部', '风光', '人像', '街拍', '建筑'];

/* ---------- 作品数据 ---------- */
const WORKS = [
  { src: 'images/work-01.jpg', title: '晨雾中的山脊', cat: '风光', w: 1600, h: 1067 },
  { src: 'images/work-02.jpg', title: '侧脸',         cat: '人像', w: 1067, h: 1600 },
  { src: 'images/work-03.jpg', title: '雨后的十字路口', cat: '街拍', w: 1400, h: 1400 },
  { src: 'images/work-04.jpg', title: '混凝土的呼吸', cat: '建筑', w: 1600, h: 1067 },
  { src: 'images/work-05.jpg', title: '落日与海',     cat: '风光', w: 1067, h: 1600 },
  { src: 'images/work-06.jpg', title: '窗边的她',     cat: '人像', w: 1400, h: 1400 },
  { src: 'images/work-07.jpg', title: '夜行',         cat: '街拍', w: 1600, h: 1067 },
  { src: 'images/work-08.jpg', title: '楼梯间',       cat: '建筑', w: 1067, h: 1600 },
  { src: 'images/work-09.jpg', title: '云海之上',     cat: '风光', w: 1400, h: 1400 },
  { src: 'images/work-10.jpg', title: '凝视',         cat: '人像', w: 1600, h: 1067 },
  { src: 'images/work-11.jpg', title: '便利店门口',   cat: '街拍', w: 1067, h: 1600 },
  { src: 'images/work-12.jpg', title: '玻璃幕墙',     cat: '建筑', w: 1400, h: 1400 },
  { src: 'images/work-13.jpg', title: '极地的风',     cat: '风光', w: 1600, h: 1067 },
  { src: 'images/work-14.jpg', title: '逆光少年',     cat: '人像', w: 1067, h: 1600 },
  { src: 'images/work-15.jpg', title: '晚高峰',       cat: '街拍', w: 1400, h: 1400 },
  { src: 'images/work-16.jpg', title: '老城窄巷',     cat: '建筑', w: 1600, h: 1067 },
  { src: 'images/work-17.jpg', title: '荒原',         cat: '风光', w: 1067, h: 1600 },
  { src: 'images/work-18.jpg', title: '沉默的对话',   cat: '人像', w: 1400, h: 1400 }
];

/* ==========================================================================
   DOM
   ========================================================================== */
const gallery      = document.getElementById('gallery');
const galleryEmpty = document.getElementById('galleryEmpty');
const filtersBox   = document.getElementById('filters');
const header       = document.getElementById('siteHeader');
const nav          = document.getElementById('nav');
const navToggle    = document.getElementById('navToggle');

const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbTitle   = document.getElementById('lbTitle');
const lbCat     = document.getElementById('lbCat');
const lbCounter = document.getElementById('lbCounter');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

/* ==========================================================================
   状态
   ========================================================================== */
let activeCat = '全部';   // 当前分类
let visible   = [];       // 当前可见的作品（灯箱按这个数组切换）
let lbIndex   = 0;        // 灯箱当前索引
let lastFocus = null;     // 关闭灯箱后把焦点还给它

/* ==========================================================================
   1. 渲染筛选按钮
   ========================================================================== */
function renderFilters() {
  filtersBox.innerHTML = CATEGORIES.map((cat) => {
    const count = cat === '全部'
      ? WORKS.length
      : WORKS.filter((w) => w.cat === cat).length;

    return `
      <button class="filter${cat === activeCat ? ' is-active' : ''}"
              type="button"
              data-cat="${cat}">
        ${cat}<small>${count}</small>
      </button>`;
  }).join('');
}

/* ==========================================================================
   2. 渲染作品网格
   ========================================================================== */
function renderGallery() {
  visible = activeCat === '全部'
    ? WORKS.slice()
    : WORKS.filter((w) => w.cat === activeCat);

  galleryEmpty.hidden = visible.length > 0;

  gallery.innerHTML = visible.map((work, i) => `
    <article class="card" tabindex="0" role="button"
             aria-label="查看作品：${work.title}"
             data-index="${i}">
      <img src="${work.src}"
           alt="${work.title} —— ${work.cat}"
           width="${work.w}" height="${work.h}"
           ${i < 3 ? 'fetchpriority="high"' : 'loading="lazy"'}
           decoding="async" />
      <span class="card-zoom" aria-hidden="true">&#43;</span>
      <div class="card-info">
        <h3 class="card-title">${work.title}</h3>
        <p class="card-meta">${work.cat}</p>
      </div>
    </article>`).join('');

  observeCards();
}

/* ==========================================================================
   3. 滚动出现动画
   ========================================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

function observeCards() {
  gallery.querySelectorAll('.card').forEach((card, i) => {
    // 首屏附近的作品错开一点出现，视觉上更自然
    card.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    revealObserver.observe(card);
  });
}

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ==========================================================================
   4. 分类筛选
   ========================================================================== */
filtersBox.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter');
  if (!btn || btn.dataset.cat === activeCat) return;

  activeCat = btn.dataset.cat;

  filtersBox.querySelectorAll('.filter').forEach((b) => {
    b.classList.toggle('is-active', b === btn);
  });

  renderGallery();
});

/* ==========================================================================
   5. 灯箱
   ========================================================================== */
function openLightbox(index) {
  lbIndex = index;
  lastFocus = document.activeElement;

  updateLightbox();

  lightbox.hidden = false;
  document.body.classList.add('no-scroll');

  // 让 opacity 过渡生效
  requestAnimationFrame(() => lightbox.classList.add('is-open'));

  lbClose.focus({ preventScroll: true });
}

function updateLightbox() {
  const work = visible[lbIndex];
  if (!work) return;

  lbImg.src = work.src;
  lbImg.alt = work.title;
  lbTitle.textContent = work.title;
  lbCat.textContent = work.cat;
  lbCounter.textContent =
    `${String(lbIndex + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.classList.remove('no-scroll');

  window.setTimeout(() => {
    lightbox.hidden = true;
    lbImg.src = '';
  }, 320);

  if (lastFocus) lastFocus.focus({ preventScroll: true });
}

function stepLightbox(delta) {
  if (!visible.length) return;
  lbIndex = (lbIndex + delta + visible.length) % visible.length;
  updateLightbox();
}

/* 点击卡片打开 */
gallery.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (card) openLightbox(Number(card.dataset.index));
});

/* 键盘打开 */
gallery.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.card');
  if (!card) return;
  e.preventDefault();
  openLightbox(Number(card.dataset.index));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => stepLightbox(-1));
lbNext.addEventListener('click', () => stepLightbox(1));

/* 点击背景关闭 */
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* 键盘：Esc 关闭，左右切换 */
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;

  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
});

/* 移动端滑动切换 */
let touchX = null;

lightbox.addEventListener('touchstart', (e) => {
  touchX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 55) stepLightbox(dx > 0 ? -1 : 1);
  touchX = null;
}, { passive: true });

/* ==========================================================================
   6. 导航：滚动变实、移动端菜单
   ========================================================================== */
function onScroll() {
  header.classList.toggle('is-stuck', window.scrollY > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  document.body.classList.toggle('no-scroll', open);
});

/* 点菜单项后自动收起 */
nav.addEventListener('click', (e) => {
  if (!e.target.closest('a')) return;
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', '打开菜单');
  document.body.classList.remove('no-scroll');
});

/* ==========================================================================
   7. 初始化
   ========================================================================== */
renderFilters();
renderGallery();

document.getElementById('year').textContent = new Date().getFullYear();
