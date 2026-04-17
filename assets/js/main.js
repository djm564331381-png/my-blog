/**
 * 博客主脚本 v2 — 从 posts.json 动态加载文章
 */

const config = {
    postsPerPage: 5,
    currentPage: 1,
    currentCategory: null,
    searchQuery: '',
    postsJsonUrl: 'posts.json'
};

// 缓存文章数据
let _postsCache = null;

/** 加载文章数据（带缓存） */
async function fetchPosts() {
    if (_postsCache) return _postsCache;
    try {
        const res = await fetch(config.postsJsonUrl + '?t=' + Date.now());
        if (!res.ok) throw new Error('Failed to fetch posts.json');
        _postsCache = await res.json();
        // 按日期倒序
        _postsCache.sort((a, b) => new Date(b.date) - new Date(a.date));
        return _postsCache;
    } catch (e) {
        console.error('加载文章失败:', e);
        return [];
    }
}

/** 格式化日期 */
function formatDate(dateString) {
    const d = new Date(dateString);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 获取 URL 参数 */
function getUrlParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

// ── 首页 & 文章列表页 ──────────────────────────────────────

async function loadPostList() {
    const container = document.getElementById('posts-container');
    if (!container) return;

    container.innerHTML = '<p style="color:#999;text-align:center;padding:2rem;">加载中...</p>';

    let posts = await fetchPosts();

    // 分类筛选
    const catParam = getUrlParam('category');
    if (catParam) {
        posts = posts.filter(p => p.category === catParam);
        const title = document.querySelector('.page-title');
        if (title) title.textContent = '分类：' + catParam;
    }

    // 搜索筛选
    if (config.searchQuery) {
        const q = config.searchQuery.toLowerCase();
        posts = posts.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            (p.tags || []).some(t => t.toLowerCase().includes(q))
        );
    }

    const totalPages = Math.ceil(posts.length / config.postsPerPage);
    const slice = posts.slice(
        (config.currentPage - 1) * config.postsPerPage,
        config.currentPage * config.postsPerPage
    );

    if (slice.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center;padding:2rem;">暂无文章</p>';
    } else {
        container.innerHTML = slice.map(post => `
            <article class="post-item">
                <header class="post-header">
                    <div class="post-meta">
                        <a href="posts.html?category=${encodeURIComponent(post.category)}" class="post-category">${post.category}</a>
                        <span class="post-date">${formatDate(post.date)}</span>
                    </div>
                    <h2 class="post-title">
                        <a href="post.html?id=${post.id}">${post.title}</a>
                    </h2>
                </header>
                <div class="post-excerpt"><p>${post.excerpt}</p></div>
                <a href="post.html?id=${post.id}" class="read-more">阅读更多</a>
            </article>
        `).join('');
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const el = document.getElementById('pagination');
    if (!el || totalPages <= 1) { if (el) el.innerHTML = ''; return; }

    let html = '';
    if (config.currentPage > 1)
        html += `<a href="#" class="prev" data-page="${config.currentPage - 1}">← 上一页</a>`;
    for (let i = 1; i <= totalPages; i++)
        html += i === config.currentPage
            ? `<span class="current">${i}</span>`
            : `<a href="#" data-page="${i}">${i}</a>`;
    if (config.currentPage < totalPages)
        html += `<a href="#" class="next" data-page="${config.currentPage + 1}">下一页 →</a>`;

    el.innerHTML = html;
    el.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            config.currentPage = +a.dataset.page;
            _postsCache = null; // 清缓存强制刷新
            loadPostList();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ── 侧边栏 ────────────────────────────────────────────────

async function loadSidebar() {
    const posts = await fetchPosts();

    // 分类
    const catEl = document.getElementById('category-list');
    if (catEl) {
        const cats = {};
        posts.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
        catEl.innerHTML = Object.entries(cats).map(([c, n]) =>
            `<li><a href="posts.html?category=${encodeURIComponent(c)}">${c}<span class="category-count">${n}</span></a></li>`
        ).join('');
    }

    // 近期文章
    const recEl = document.getElementById('recent-posts');
    if (recEl) {
        recEl.innerHTML = posts.slice(0, 5).map(p =>
            `<li><a href="post.html?id=${p.id}">${p.title}<span class="recent-post-date">${formatDate(p.date)}</span></a></li>`
        ).join('');
    }
}

// ── 文章详情页 ────────────────────────────────────────────

async function loadSinglePost() {
    const id = getUrlParam('id');
    if (!id) return;

    const posts = await fetchPosts();
    const post = posts.find(p => String(p.id) === String(id));
    if (!post) {
        document.querySelector('.post-content').innerHTML = '<p>文章不存在</p>';
        return;
    }

    document.title = post.title + ' - 新原野';

    const metaEl = document.querySelector('.post-meta');
    if (metaEl) metaEl.innerHTML = `
        <a href="posts.html?category=${encodeURIComponent(post.category)}" class="post-category">${post.category}</a>
        <span class="post-date">${formatDate(post.date)}</span>
    `;

    const titleEl = document.querySelector('.post-title');
    if (titleEl) titleEl.textContent = post.title;

    // Markdown 渲染（如果加载了 marked.js 就用，否则当 HTML 处理）
    const contentEl = document.querySelector('.post-content');
    if (contentEl) {
        if (window.marked) {
            contentEl.innerHTML = marked.parse(post.content || '');
        } else {
            // 将换行转为段落的简单降级处理
            contentEl.innerHTML = post.content
                ? post.content.split('\n\n').map(p => `<p>${p.replace(/\n/g,'<br>')}</p>`).join('')
                : '';
        }
    }

    const tagEl = document.querySelector('.tag-list');
    if (tagEl) {
        tagEl.innerHTML = (post.tags || []).map(t =>
            `<li><a href="posts.html?tag=${encodeURIComponent(t)}">#${t}</a></li>`
        ).join('');
    }

    // 上下篇导航
    const idx = posts.findIndex(p => String(p.id) === String(id));
    const prev = posts[idx + 1], next = posts[idx - 1];
    const navEl = document.querySelector('.post-navigation');
    if (navEl) {
        navEl.innerHTML =
            (prev ? `<div class="nav-previous"><span class="nav-label">← 上一篇</span><a href="post.html?id=${prev.id}" class="nav-title">${prev.title}</a></div>` : '<div></div>') +
            (next ? `<div class="nav-next"><span class="nav-label">下一篇 →</span><a href="post.html?id=${next.id}" class="nav-title">${next.title}</a></div>` : '<div></div>');
    }
}

// ── 搜索 & 菜单 & 返回顶部 ────────────────────────────────

function bindCommonEvents() {
    const sf = document.getElementById('search-form');
    const si = document.getElementById('search-input');
    if (sf && si) {
        sf.addEventListener('submit', e => {
            e.preventDefault();
            config.searchQuery = si.value.trim();
            config.currentPage = 1;
            _postsCache = null;
            if (document.getElementById('posts-container')) {
                loadPostList();
            } else {
                window.location.href = 'posts.html?q=' + encodeURIComponent(config.searchQuery);
            }
        });
    }

    const mt = document.querySelector('.menu-toggle');
    const nm = document.querySelector('.nav-menu');
    if (mt && nm) {
        mt.addEventListener('click', () => {
            const open = mt.getAttribute('aria-expanded') === 'true';
            mt.setAttribute('aria-expanded', !open);
            nm.classList.toggle('active');
        });
    }

    const btn = document.getElementById('back-to-top');
    if (btn) {
        window.addEventListener('scroll', () =>
            btn.classList.toggle('visible', window.scrollY > 300));
        btn.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}

// ── 入口 ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    bindCommonEvents();
    await loadSidebar();

    if (document.body.classList.contains('single-post')) {
        await loadSinglePost();
    } else {
        // 从 URL 读取搜索词
        const q = getUrlParam('q');
        if (q) { config.searchQuery = q; document.getElementById('search-input').value = q; }
        await loadPostList();
    }
});

// 暴露工具函数
window.blogUtils = { fetchPosts, formatDate, getUrlParam };
