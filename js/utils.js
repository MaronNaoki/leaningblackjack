/**
 * ユーティリティ関数集
 * Phase 1: 基本的なヘルパー関数
 */

/**
 * 要素が存在するかチェック
 */
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

/**
 * 要素を安全に取得
 */
function safeGetElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`要素が見つかりません: ${selector}`);
    }
    return element;
}

/**
 * デバイス判定
 */
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

/**
 * タッチデバイス判定
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 簡単な遅延実行
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ランダムな整数を生成
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 配列をシャッフル（Fisher-Yates アルゴリズム）
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * 数値を範囲内にクランプ
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

console.log('utils.js が読み込まれました'); 