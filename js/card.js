/**
 * カード関連機能
 * Phase 2: 本格実装（リファクタリング済み）
 */

// カード設定定数
const CARD_CONFIG = {
    // カードスート定義
    SUITS: {
        hearts: 'hearts',
        diamonds: 'diamonds', 
        clubs: 'clubs',
        spades: 'spades'
    },
    
    // カードランク定義
    RANKS: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
    
    // スートシンボル
    SUIT_SYMBOLS: {
        hearts: '♥',
        diamonds: '♦', 
        clubs: '♣',
        spades: '♠'
    },
    
    // スート色
    SUIT_COLORS: {
        hearts: 'red',
        diamonds: 'red',
        clubs: 'black', 
        spades: 'black'
    },
    
    // カード表示設定
    DISPLAY: {
        width: '70px',
        height: '100px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.25s ease'
    },
    
    // 裏向きカード設定
    BACK_CARD: {
        background: 'linear-gradient(135deg, #1a472a 0%, #0f2e1a 100%)',
        border: '2px solid #d4af37',
        color: '#d4af37',
        symbol: '?'
    },
    
    // 表向きカード設定
    FRONT_CARD: {
        background: 'white',
        border: '2px solid #333',
        redColor: '#d50000',
        blackColor: '#000000'
    }
};

// 後方互換性のため既存の定数も維持
const SUITS = CARD_CONFIG.SUITS;
const RANKS = CARD_CONFIG.RANKS;
const SUIT_SYMBOLS = CARD_CONFIG.SUIT_SYMBOLS;
const SUIT_COLORS = CARD_CONFIG.SUIT_COLORS;

/**
 * カードクラス
 */
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.isVisible = false;
        this.id = `${suit}-${rank}`;
    }
    
    /**
     * カードの値を取得（ブラックジャック用）
     * @param {number} currentTotal - 現在のハンドの合計値
     * @returns {number} カードの値
     */
    getValue(currentTotal = 0) {
        if (this.rank === 'A') {
            // エースは1か11の有利な方を選択
            return (currentTotal + 11 <= 21) ? 11 : 1;
        } else if (['J', 'Q', 'K'].includes(this.rank)) {
            return 10;
        } else {
            return parseInt(this.rank);
        }
    }
    
    /**
     * 表示用の値を取得
     * @returns {string} 表示用文字列
     */
    getDisplayValue() {
        return this.rank;
    }
    
    /**
     * スートのシンボルを取得
     * @returns {string} スートシンボル
     */
    getSuitSymbol() {
        return SUIT_SYMBOLS[this.suit];
    }
    
    /**
     * スートの色を取得
     * @returns {string} 色（'red' または 'black'）
     */
    getSuitColor() {
        return SUIT_COLORS[this.suit];
    }
    
    /**
     * カードの可視状態を設定
     * @param {boolean} visible - 可視状態
     */
    setVisible(visible) {
        this.isVisible = visible;
    }
    
    /**
     * カードのコピーを作成
     * @returns {Card} カードのコピー
     */
    clone() {
        const card = new Card(this.suit, this.rank);
        card.isVisible = this.isVisible;
        return card;
    }
    
    /**
     * 文字列表現
     * @returns {string} カードの文字列表現
     */
    toString() {
        return `${this.rank} of ${this.suit}`;
    }
    
    /**
     * 等価比較
     * @param {Card} other - 比較対象のカード
     * @returns {boolean} 等価かどうか
     */
    equals(other) {
        return other instanceof Card && 
               this.suit === other.suit && 
               this.rank === other.rank;
    }
    
    /**
     * カード表示要素を作成
     * @param {boolean} faceDown - 裏向きかどうか
     * @returns {HTMLElement} カード要素
     */
    createCardElement(faceDown = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.setAttribute('data-card-id', this.id);
        
        if (faceDown || !this.isVisible) {
            // 裏向きカード
            cardEl.classList.add('card-back');
            applyBackCardStyles(cardEl);
        } else {
            // 表向きカード
            cardEl.classList.add('card-front', `card-${this.getSuitColor()}`);
            applyFrontCardStyles(cardEl, this);
        }
        
        return cardEl;
    }
    
    /**
     * カード要素を更新（裏から表に変更など）
     * @param {HTMLElement} cardElement - 更新するカード要素
     * @param {boolean} faceDown - 裏向きかどうか
     */
    updateCardElement(cardElement, faceDown = false) {
        // 既存の内容をクリア
        cardElement.innerHTML = '';
        cardElement.className = 'card';
        cardElement.setAttribute('data-card-id', this.id);
        
        if (faceDown || !this.isVisible) {
            // 裏向きカード
            cardElement.classList.add('card-back');
            applyBackCardStyles(cardElement);
        } else {
            // 表向きカード
            cardElement.classList.add('card-front', `card-${this.getSuitColor()}`);
            applyFrontCardStyles(cardElement, this);
        }
    }
}

/**
 * 裏向きカード用の共通スタイル設定
 * CSS競合を回避するため、JavaScriptで直接スタイルを設定
 */
function applyBackCardStyles(element) {
    // 基本スタイル設定（設定オブジェクトを活用）
    const styles = {
        ...CARD_CONFIG.DISPLAY,
        cursor: 'pointer',
        backfaceVisibility: 'hidden',
        background: CARD_CONFIG.BACK_CARD.background,
        border: CARD_CONFIG.BACK_CARD.border,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: '0',
        zIndex: '1',
        position: 'relative',
        margin: '2px',
        color: CARD_CONFIG.BACK_CARD.color,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
    };
    
    // スタイルを適用
    Object.assign(element.style, styles);
    
    // CSS競合回避: transformプロパティを明示的にリセット
    element.style.setProperty('transform', 'none', 'important');
    
    // 内容設定
    element.textContent = CARD_CONFIG.BACK_CARD.symbol;
}

/**
 * 表向きカード用の共通スタイル設定
 */
function applyFrontCardStyles(element, card) {
    const styles = {
        ...CARD_CONFIG.DISPLAY,
        cursor: 'pointer',
        backfaceVisibility: 'hidden',
        background: CARD_CONFIG.FRONT_CARD.background,
        border: CARD_CONFIG.FRONT_CARD.border,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: '0',
        zIndex: '1',
        position: 'relative',
        margin: '2px'
    };
    
    Object.assign(element.style, styles);
    
    const color = card.getSuitColor() === 'red' 
        ? CARD_CONFIG.FRONT_CARD.redColor 
        : CARD_CONFIG.FRONT_CARD.blackColor;
        
    element.innerHTML = `
        <div style="width: 100%; height: 100%; background: ${CARD_CONFIG.FRONT_CARD.background}; border: ${CARD_CONFIG.FRONT_CARD.border}; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between; padding: 4px; color: ${color}; font-family: Arial, sans-serif;">
            <div style="font-size: 10px; font-weight: bold; text-align: left; line-height: 1;">
                ${card.getDisplayValue()}<br>${card.getSuitSymbol()}
            </div>
            <div style="font-size: 20px; text-align: center; flex: 1; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${card.getSuitSymbol()}
            </div>
            <div style="font-size: 10px; font-weight: bold; text-align: right; transform: rotate(180deg); line-height: 1;">
                ${card.getDisplayValue()}<br>${card.getSuitSymbol()}
            </div>
        </div>
    `;
}

/**
 * カード表示要素を作成
 * @param {Card} card - 表示するカード
 * @param {boolean} faceDown - 裏向きかどうか
 * @returns {HTMLElement} カード要素
 */
function createCardElement(card, faceDown = false) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.setAttribute('data-card-id', card.id);
    
    if (faceDown || !card.isVisible) {
        // 裏向きカード
        cardEl.classList.add('card-back');
        applyBackCardStyles(cardEl);
    } else {
        // 表向きカード
        cardEl.classList.add('card-front', `card-${card.getSuitColor()}`);
        applyFrontCardStyles(cardEl, card);
    }
    
    return cardEl;
}

/**
 * カード要素を更新（裏から表に変更など）
 * @param {HTMLElement} cardElement - 更新するカード要素
 * @param {Card} card - カードデータ
 * @param {boolean} faceDown - 裏向きかどうか
 */
function updateCardElement(cardElement, card, faceDown = false) {
    // 既存の内容をクリア
    cardElement.innerHTML = '';
    cardElement.className = 'card';
    cardElement.setAttribute('data-card-id', card.id);
    
    if (faceDown || !card.isVisible) {
        // 裏向きカード
        cardElement.classList.add('card-back');
        applyBackCardStyles(cardElement);
    } else {
        // 表向きカード
        cardElement.classList.add('card-front', `card-${card.getSuitColor()}`);
        applyFrontCardStyles(cardElement, card);
    }
}

/**
 * カードのアニメーション効果を追加
 * @param {HTMLElement} cardElement - カード要素
 * @param {string} animation - アニメーション種類
 * @returns {Promise} アニメーション完了Promise
 */
function animateCard(cardElement, animation) {
    return new Promise((resolve) => {
        cardElement.classList.add(`card--${animation}`);
        
        const handleAnimationEnd = () => {
            cardElement.classList.remove(`card--${animation}`);
            cardElement.removeEventListener('animationend', handleAnimationEnd);
            resolve();
        };
        
        cardElement.addEventListener('animationend', handleAnimationEnd);
        
        // フォールバック（1秒後に強制完了）
        setTimeout(() => {
            if (cardElement.classList.contains(`card--${animation}`)) {
                handleAnimationEnd();
            }
        }, 1000);
    });
}

/**
 * ランダムなカードを生成（テスト用）
 * @returns {Card} ランダムなカード
 */
function createRandomCard() {
    const suits = Object.keys(CARD_CONFIG.SUITS);
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomRank = CARD_CONFIG.RANKS[Math.floor(Math.random() * CARD_CONFIG.RANKS.length)];
    
    const card = new Card(randomSuit, randomRank);
    card.setVisible(true);
    return card;
}

/**
 * テスト用の簡単な裏向きカード作成
 * @returns {HTMLElement} 裏向きカード要素
 */
function createTestBackCard() {
    const cardEl = document.createElement('div');
    
    // 設定オブジェクトを使用してスタイル設定
    Object.assign(cardEl.style, {
        ...CARD_CONFIG.DISPLAY,
        backgroundColor: 'green',
        border: '2px solid gold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'gold',
        fontSize: '24px',
        fontWeight: 'bold'
    });
    
    cardEl.textContent = CARD_CONFIG.BACK_CARD.symbol;
    return cardEl;
}

// グローバルに公開
window.Card = Card;
window.CARD_CONFIG = CARD_CONFIG;
window.createCardElement = createCardElement;
window.updateCardElement = updateCardElement;
window.animateCard = animateCard;
window.createRandomCard = createRandomCard;
window.createTestBackCard = createTestBackCard;

console.log('card.js が読み込まれました (Phase 2: リファクタリング完了)'); 