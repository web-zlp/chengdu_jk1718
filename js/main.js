/* ============================================================
   蜀韵·成都 — 首页交互脚本 js/main.js
   功能：全屏轮播图（自动播放 / 左右切换 / 圆点指示）
   ============================================================ */

(function () {
    'use strict';

    /* ---------- 1. 获取轮播相关 DOM 元素 ---------- */
    var slider  = document.getElementById('bannerSlider');  // 轮播容器
    var slides  = slider.querySelectorAll('.banner-slide');  // 所有轮播图
    var dots    = document.querySelectorAll('.banner-dot');  // 指示圆点
    var prevBtn = document.querySelector('.banner-prev');    // 上一张按钮
    var nextBtn = document.querySelector('.banner-next');    // 下一张按钮

    var current  = 0;             // 当前展示的轮播图索引
    var timer    = null;          // 自动播放定时器句柄
    var INTERVAL = 4000;          // 自动轮播间隔（毫秒）
    var COUNT    = slides.length; // 轮播图总数

    // 没有轮播图时直接退出，避免报错
    if (COUNT === 0) { return; }

    /* ---------- 2. 切换到指定索引的轮播图 ---------- */
    function goTo(index) {
        // 处理边界：保证索引始终在有效范围 [0, COUNT-1] 内循环
        current = (index + COUNT) % COUNT;

        // 更新轮播图的显示状态（添加/移除 is-active 类）
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });

        // 同步更新指示圆点的高亮状态
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    /* ---------- 3. 下一张 / 上一张 ---------- */
    function nextSlide() { goTo(current + 1); }
    function prevSlide() { goTo(current - 1); }

    /* ---------- 4. 启动 / 停止自动播放 ---------- */
    function startAuto() { timer = setInterval(nextSlide, INTERVAL); }
    function stopAuto()  { clearInterval(timer); }

    // 手动切换后重新计时，避免刚操作完又立刻自动切换
    function restartAuto() {
        stopAuto();
        startAuto();
    }

    /* ---------- 5. 绑定事件 ---------- */
    // 左右按钮切换
    nextBtn.addEventListener('click', function () { nextSlide(); restartAuto(); });
    prevBtn.addEventListener('click', function () { prevSlide(); restartAuto(); });

    // 指示圆点点击跳转
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            goTo(parseInt(dot.dataset.index, 10));
            restartAuto();
        });
    });

    // 鼠标移入暂停自动播放，移出恢复（提升浏览体验）
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    /* ---------- 6. 初始化：显示第一张并开始自动播放 ---------- */
    goTo(0);
    startAuto();
})();