/* ============================================
   科科机器人科技团队 - 交互脚本
   多页面切换 · 轮播图 · 数字动画
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ---- DOM 引用 ----
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const pageContainer = document.getElementById('pageContainer');

    // ==================== 页面切换系统 ====================
    function switchPage(pageName, anchorId) {
        // 隐藏所有页面
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(function (p) { p.classList.remove('active'); });

        // 显示目标页面
        const targetPage = document.getElementById('page-' + pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // 更新导航高亮
        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageName) {
                link.classList.add('active');
            }
        });

        // 关闭移动端菜单
        menuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');

        // 如果切换到首页，重置轮播
        if (pageName === 'home') {
            currentSlide = 0;
            updateCarousel();
            resetAutoPlay();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (anchorId) {
            // 等页面切换完成（display:block 生效 + 布局计算完成）后精准定位
            setTimeout(function () {
                var anchorEl = document.getElementById(anchorId);
                if (anchorEl) {
                    var navHeight = navbar.offsetHeight + 20;
                    var rect = anchorEl.getBoundingClientRect();
                    var scrollTarget = window.pageYOffset + rect.top - navHeight;
                    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 300);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // 绑定所有带 data-page 的导航元素
    document.querySelectorAll('[data-page]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            const anchorId = this.getAttribute('data-anchor');
            switchPage(pageName, anchorId);
        });
    });

    // ==================== 导航栏滚动效果 ====================
    function updateNavbar() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // ==================== 移动端菜单 ====================
    menuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // ==================== 轮播图 ====================
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const totalSlides = carouselDots.length;
    let currentSlide = 0;
    let autoPlayTimer = null;

    function updateCarousel() {
        // 移动轨道
        if (carouselTrack) {
            carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }

        // 更新圆点
        carouselDots.forEach(function (dot, index) {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // 圆点点击
    carouselDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            currentSlide = parseInt(this.getAttribute('data-index'));
            updateCarousel();
            resetAutoPlay();
        });
    });

    // 箭头点击
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            prevSlide();
            resetAutoPlay();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            nextSlide();
            resetAutoPlay();
        });
    }

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.getElementById('heroCarousel');

    if (carousel) {
        carousel.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 60) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoPlay();
            }
        });
    }

    // 键盘左右键
    document.addEventListener('keydown', function (e) {
        const homePage = document.getElementById('page-home');
        if (homePage && homePage.classList.contains('active')) {
            if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
            if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
        }
    });

    // 初始启动自动播放
    startAutoPlay();

    // ==================== 数字滚动动画 ====================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-num');
        counters.forEach(function (counter) {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out
                const current = Math.floor(eased * target);
                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
            requestAnimationFrame(update);
        });
    }

    // IntersectionObserver 监听统计区
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        statsObserver.observe(statsGrid);
    }

    // ==================== 滚动渐入动画 ====================
    const fadeElements = document.querySelectorAll(
        '.field-card, .culture-card, .advisor-card, .timeline-card, .news-card'
    );

    const fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // ==================== 联系表单提交 ====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = '⏳ 发送中…';
            btn.disabled = true;

            setTimeout(function () {
                btn.textContent = '✓ 发送成功！我们将在24小时内回复';
                btn.style.background = '#10b981';
                contactForm.reset();

                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1200);
        });
    }

    // ==================== 加载更多新闻 ====================
    const loadMoreBtn = document.querySelector('.news-more .btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            this.textContent = '没有更多了';
            this.disabled = true;
            this.style.opacity = '0.5';
        });
    }

});
