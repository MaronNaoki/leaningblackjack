/**
 * カードアニメーション制御システム
 * Phase 3: 本格実装
 */

// アニメーション設定
const ANIMATION_CONFIG = {
    // 基本タイミング
    CARD_DEAL_DURATION: 800,
    CARD_FLIP_DURATION: 600,
    CARD_REVEAL_DURATION: 800,
    STAGGER_DELAY: 200, // 複数カード配布時の遅延
    
    // パフォーマンス設定
    MAX_CONCURRENT_ANIMATIONS: 4,
    FRAME_BUDGET: 16.67, // 60FPS対応
    
    // イージング
    EASING: {
        CARD_DEAL: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        CARD_FLIP: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        SMOOTH: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
};

/**
 * アニメーション管理クラス
 */
class AnimationManager {
    constructor() {
        this.animationQueue = [];
        this.activeAnimations = new Set();
        this.isProcessing = false;
        this.isAnimationsEnabled = true;
        
        // パフォーマンス監視
        this.performanceMonitor = {
            frameDrops: 0,
            lastFrameTime: 0,
            avgFrameTime: 0
        };
        
        // アクセシビリティ設定チェック
        this.checkAccessibilityPreferences();
        
        console.log('AnimationManager が初期化されました');
    }
    
    /**
     * アクセシビリティ設定をチェック
     */
    checkAccessibilityPreferences() {
        // prefers-reduced-motionメディアクエリをチェック
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isAnimationsEnabled = false;
            console.log('アニメーション無効化モード (アクセシビリティ設定)');
        }
    }
    
    /**
     * カード配布アニメーション
     * @param {HTMLElement} cardElement - カード要素
     * @param {string} target - 配布先 ('player' | 'dealer')
     * @param {number} index - カードのインデックス（遅延計算用）
     * @returns {Promise} アニメーション完了Promise
     */
    dealCard(cardElement, target, index = 0) {
        return new Promise((resolve) => {
            if (!this.isAnimationsEnabled) {
                resolve();
                return;
            }
            
            const animationClass = target === 'player' ? 'card--dealing-to-player' : 'card--dealing-to-dealer';
            const delay = index * ANIMATION_CONFIG.STAGGER_DELAY;
            
            // 初期状態を設定
            cardElement.style.opacity = '0';
            cardElement.style.transform = target === 'player' 
                ? 'translateY(150px) scale(0.8) rotateZ(5deg)'
                : 'translateY(-150px) scale(0.8) rotateZ(-5deg)';
            
            // 遅延後にアニメーション開始
            setTimeout(() => {
                cardElement.classList.add(animationClass);
                this.activeAnimations.add(cardElement);
                
                // アニメーション終了処理
                const handleAnimationEnd = () => {
                    cardElement.classList.remove(animationClass);
                    cardElement.classList.add('card--animation-complete');
                    this.activeAnimations.delete(cardElement);
                    cardElement.style.opacity = '';
                    cardElement.style.transform = '';
                    resolve();
                };
                
                cardElement.addEventListener('animationend', handleAnimationEnd, { once: true });
            }, delay);
        });
    }
    
    /**
     * カードフリップアニメーション
     * @param {HTMLElement} cardElement - カード要素
     * @param {boolean} reveal - 表向きにするかどうか
     * @returns {Promise} アニメーション完了Promise
     */
    flipCard(cardElement, reveal = true) {
        return new Promise((resolve) => {
            if (!this.isAnimationsEnabled) {
                // アニメーション無効時は即座に状態変更
                if (reveal) {
                    cardElement.classList.remove('card--back');
                    cardElement.classList.add('card--front');
                }
                resolve();
                return;
            }
            
            cardElement.classList.add('card--flipping');
            this.activeAnimations.add(cardElement);
            
            // フリップ中間地点でカード内容を変更
            setTimeout(() => {
                if (reveal) {
                    cardElement.classList.remove('card--back');
                    cardElement.classList.add('card--front');
                }
            }, ANIMATION_CONFIG.CARD_FLIP_DURATION / 2);
            
            // アニメーション終了処理
            setTimeout(() => {
                cardElement.classList.remove('card--flipping');
                cardElement.classList.add('card--animation-complete');
                this.activeAnimations.delete(cardElement);
                resolve();
            }, ANIMATION_CONFIG.CARD_FLIP_DURATION);
        });
    }
    
    /**
     * カード表示アニメーション（フリップ+表示）
     * @param {HTMLElement} cardElement - カード要素
     * @returns {Promise} アニメーション完了Promise
     */
    revealCard(cardElement) {
        return new Promise((resolve) => {
            if (!this.isAnimationsEnabled) {
                cardElement.classList.remove('card--back');
                cardElement.classList.add('card--front');
                resolve();
                return;
            }
            
            cardElement.classList.add('card--revealing');
            this.activeAnimations.add(cardElement);
            
            // 中間地点でカード内容変更
            setTimeout(() => {
                cardElement.classList.remove('card--back');
                cardElement.classList.add('card--front');
            }, ANIMATION_CONFIG.CARD_REVEAL_DURATION / 2);
            
            // アニメーション終了処理
            const handleAnimationEnd = () => {
                cardElement.classList.remove('card--revealing');
                cardElement.classList.add('card--animation-complete');
                this.activeAnimations.delete(cardElement);
                resolve();
            };
            
            cardElement.addEventListener('animationend', handleAnimationEnd, { once: true });
        });
    }
    
    /**
     * ゲーム結果アニメーション
     * @param {HTMLElement[]} cardElements - 対象カード要素配列
     * @param {string} result - 結果タイプ ('victory' | 'defeat' | 'blackjack' | 'push')
     */
    playResultAnimation(cardElements, result) {
        if (!this.isAnimationsEnabled) return;
        
        const animationClass = this.getResultAnimationClass(result);
        if (!animationClass) return;
        
        cardElements.forEach((cardElement, index) => {
            setTimeout(() => {
                cardElement.classList.add(animationClass);
                this.activeAnimations.add(cardElement);
                
                // 結果アニメーションは自動で終了
                setTimeout(() => {
                    cardElement.classList.remove(animationClass);
                    this.activeAnimations.delete(cardElement);
                }, this.getResultAnimationDuration(result));
            }, index * 100); // カードごとに少し遅延
        });
    }
    
    /**
     * 結果アニメーションクラスを取得
     * @param {string} result - 結果タイプ
     * @returns {string} CSSクラス名
     */
    getResultAnimationClass(result) {
        switch (result) {
            case 'victory':
            case 'dealer_bust':
                return 'card--victory';
            case 'defeat':
            case 'player_bust':
                return 'card--defeat';
            case 'blackjack':
            case 'player_blackjack':
                return 'card--blackjack';
            default:
                return null;
        }
    }
    
    /**
     * 結果アニメーション継続時間を取得
     * @param {string} result - 結果タイプ
     * @returns {number} 継続時間（ミリ秒）
     */
    getResultAnimationDuration(result) {
        switch (result) {
            case 'blackjack':
            case 'player_blackjack':
                return 4000; // ブラックジャックは長めに
            case 'victory':
            case 'dealer_bust':
                return 2000;
            case 'defeat':
            case 'player_bust':
                return 800;
            default:
                return 1000;
        }
    }
    
    /**
     * インタラクションアニメーション
     * @param {HTMLElement} element - 対象要素
     * @param {string} type - アニメーションタイプ ('hover' | 'press' | 'highlight')
     */
    playInteractionAnimation(element, type) {
        if (!this.isAnimationsEnabled) return;
        
        const animationClass = `${element.tagName.toLowerCase()}--${type}`;
        
        element.classList.add(animationClass);
        this.activeAnimations.add(element);
        
        // インタラクションアニメーションは短時間で終了
        setTimeout(() => {
            element.classList.remove(animationClass);
            this.activeAnimations.delete(element);
        }, 300);
    }
    
    /**
     * すべてのアニメーションを停止
     */
    stopAllAnimations() {
        this.activeAnimations.forEach(element => {
            // すべてのアニメーションクラスを削除
            const classes = Array.from(element.classList);
            classes.forEach(className => {
                if (className.includes('--')) {
                    element.classList.remove(className);
                }
            });
        });
        
        this.activeAnimations.clear();
        this.animationQueue = [];
        
        console.log('すべてのアニメーションを停止しました');
    }
    
    /**
     * アニメーション有効/無効を切り替え
     * @param {boolean} enabled - 有効かどうか
     */
    setAnimationsEnabled(enabled) {
        this.isAnimationsEnabled = enabled;
        
        if (!enabled) {
            this.stopAllAnimations();
        }
        
        console.log(`アニメーション ${enabled ? '有効' : '無効'} に設定されました`);
    }
    
    /**
     * パフォーマンス統計を取得
     * @returns {Object} パフォーマンス情報
     */
    getPerformanceStats() {
        return {
            activeAnimations: this.activeAnimations.size,
            queuedAnimations: this.animationQueue.length,
            isEnabled: this.isAnimationsEnabled,
            frameDrops: this.performanceMonitor.frameDrops,
            avgFrameTime: this.performanceMonitor.avgFrameTime
        };
    }
}

/**
 * カードアニメーションヘルパー関数
 */
class CardAnimationHelpers {
    /**
     * 複数カードの段階的配布
     * @param {HTMLElement[]} cardElements - カード要素配列
     * @param {string} target - 配布先
     * @param {AnimationManager} animationManager - アニメーションマネージャー
     * @returns {Promise} 全てのアニメーション完了Promise
     */
    static async dealCards(cardElements, target, animationManager) {
        const promises = cardElements.map((cardElement, index) => 
            animationManager.dealCard(cardElement, target, index)
        );
        
        return Promise.all(promises);
    }
    
    /**
     * カード要素にホバー効果を追加
     * @param {HTMLElement} cardElement - カード要素
     * @param {AnimationManager} animationManager - アニメーションマネージャー
     */
    static addHoverEffects(cardElement, animationManager) {
        cardElement.addEventListener('mouseenter', () => {
            animationManager.playInteractionAnimation(cardElement, 'hovering');
        });
        
        cardElement.addEventListener('mouseleave', () => {
            cardElement.classList.remove('card--hovering');
        });
    }
    
    /**
     * ボタンにプレス効果を追加
     * @param {HTMLElement} buttonElement - ボタン要素
     * @param {AnimationManager} animationManager - アニメーションマネージャー
     */
    static addButtonPressEffect(buttonElement, animationManager) {
        buttonElement.addEventListener('click', () => {
            animationManager.playInteractionAnimation(buttonElement, 'pressed');
        });
    }
}

// グローバルに公開
window.ANIMATION_CONFIG = ANIMATION_CONFIG;
window.AnimationManager = AnimationManager;
window.CardAnimationHelpers = CardAnimationHelpers;

console.log('animations.js が読み込まれました (Phase 3: アニメーション制御システム実装完了)'); 