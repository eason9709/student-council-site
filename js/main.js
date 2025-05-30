// 主題切換功能
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// 檢查本地存儲的主題設置
const currentTheme = localStorage.getItem('theme') || 
                     (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);



// 動態加載新聞和活動
document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const eventsContainer = document.getElementById('events-container');
    
    // 添加手機選單切換按鈕
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', '選單開關');
    menuToggle.innerHTML = '☰';
    
    const headerContainer = document.querySelector('header .container');
    headerContainer.appendChild(menuToggle);
    
    const nav = document.querySelector('nav');
    const navList = document.querySelector('nav ul');
    
    // 切換選單顯示/隱藏
    const toggleMenu = () => {
        if (!nav.classList.contains('active')) {
            // 開啟選單
            nav.classList.add('active');
            nav.classList.remove('closing');
            menuToggle.textContent = '✕';
            document.body.style.overflow = 'hidden';
        } else {
            // 關閉選單，先加 closing
            nav.classList.add('closing');
            nav.classList.remove('active');
            menuToggle.textContent = '☰';
            document.body.style.overflow = '';
            // 等動畫結束後移除 closing
            const handleAnimationEnd = () => {
                nav.classList.remove('closing');
                nav.removeEventListener('animationend', handleAnimationEnd);
            };
            nav.addEventListener('animationend', handleAnimationEnd);
        }
    };
    
    // 點擊選單按鈕
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // 點擊頁面其他區域關閉選單
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !e.target.closest('nav') && 
            e.target !== menuToggle) {
            toggleMenu();
        }
    });
    
    // 點擊導航連結後關閉選單
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });
    
    // 視窗大小改變時檢查是否需要隱藏選單
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                menuToggle.textContent = '☰';
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    // 渲染新聞
    newsData.news.forEach(item => {
        const newsItem = createCard(item);
        newsContainer.appendChild(newsItem);
    });

    // 渲染活動
    eventsData.events.forEach(item => {
        const eventItem = createCard(item, true);
        eventsContainer.appendChild(eventItem);
    });

    // 表單提交處理
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('感謝您的訊息，我們會盡快回覆您！');
            contactForm.reset();
        });
    }
});

// 創建卡片元素
function createCard(data, isEvent = false) {
    const card = document.createElement('div');
    card.className = 'card';

    let image = '';
    if (data.image) {
        image = `<img src="${data.image}" alt="${data.title}">`;
    }

    const date = isEvent ? 
        `日期: ${new Date(data.date).toLocaleDateString()}` : 
        `發布日期: ${new Date(data.date).toLocaleDateString()}`;

    card.innerHTML = `
        ${image}
        <div class="card-content">
            <h3>${data.title}</h3>
            <p class="date">${date}</p>
            <p>${data.description}</p>
            ${data.id ? `<a href="news-detail.html?id=${data.id}" class="btn">${isEvent ? '查看詳情' : '閱讀更多'}</a>` : (data.link ? `<a href="${data.link}" class="btn">${isEvent ? '查看詳情' : '閱讀更多'}</a>` : '')}
        </div>
    `;

    return card;
}