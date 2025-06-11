/**
 * デッキ関連機能
 * Phase 2: 本格実装
 */

/**
 * デッキクラス
 */
class Deck {
    constructor(numDecks = 1) {
        this.numDecks = numDecks;
        this.cards = [];
        this.discardPile = [];
        this.reset();
    }
    
    /**
     * デッキをリセット（新しいカードで満たす）
     */
    reset() {
        this.cards = [];
        this.discardPile = [];
        
        // 指定されたデッキ数分のカードを作成
        for (let deckNum = 0; deckNum < this.numDecks; deckNum++) {
            for (const suit of Object.keys(SUITS)) {
                for (const rank of RANKS) {
                    this.cards.push(new Card(suit, rank));
                }
            }
        }
        
        this.shuffle();
        console.log(`デッキをリセットしました (${this.numDecks}デッキ、${this.cards.length}枚)`);
    }
    
    /**
     * デッキをシャッフル（Fisher-Yatesアルゴリズム）
     */
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        console.log('デッキをシャッフルしました');
    }
    
    /**
     * カードを1枚配る
     * @returns {Card|null} 配ったカード（カードがない場合はnull）
     */
    dealCard() {
        if (this.cards.length === 0) {
            // カードがない場合は捨て札をシャッフルして戻す
            if (this.discardPile.length > 0) {
                console.log('デッキが空になったため、捨て札をシャッフルして戻します');
                this.cards = [...this.discardPile];
                this.discardPile = [];
                this.shuffle();
            } else {
                console.warn('配るカードがありません');
                return null;
            }
        }
        
        const card = this.cards.pop();
        console.log(`カードを配りました: ${card.toString()}`);
        return card;
    }
    
    /**
     * 複数枚のカードを配る
     * @param {number} count - 配る枚数
     * @returns {Card[]} 配ったカードの配列
     */
    dealCards(count) {
        const dealtCards = [];
        for (let i = 0; i < count; i++) {
            const card = this.dealCard();
            if (card) {
                dealtCards.push(card);
            } else {
                break;
            }
        }
        return dealtCards;
    }
    
    /**
     * カードを捨て札に追加
     * @param {Card|Card[]} cards - 捨てるカード（1枚または配列）
     */
    discard(cards) {
        if (Array.isArray(cards)) {
            this.discardPile.push(...cards);
            console.log(`${cards.length}枚のカードを捨て札に追加しました`);
        } else {
            this.discardPile.push(cards);
            console.log(`カードを捨て札に追加しました: ${cards.toString()}`);
        }
    }
    
    /**
     * 残りカード数を取得
     * @returns {number} 残りカード数
     */
    getRemainingCards() {
        return this.cards.length;
    }
    
    /**
     * 捨て札の枚数を取得
     * @returns {number} 捨て札の枚数
     */
    getDiscardedCards() {
        return this.discardPile.length;
    }
    
    /**
     * デッキの合計カード数を取得
     * @returns {number} 合計カード数
     */
    getTotalCards() {
        return this.numDecks * 52;
    }
    
    /**
     * デッキの使用率を取得（0-1の範囲）
     * @returns {number} 使用率
     */
    getUsageRate() {
        const totalCards = this.getTotalCards();
        const usedCards = totalCards - this.cards.length;
        return usedCards / totalCards;
    }
    
    /**
     * デッキの状態を取得
     * @returns {Object} デッキの状態情報
     */
    getStatus() {
        return {
            numDecks: this.numDecks,
            remainingCards: this.getRemainingCards(),
            discardedCards: this.getDiscardedCards(),
            totalCards: this.getTotalCards(),
            usageRate: Math.round(this.getUsageRate() * 100)
        };
    }
    
    /**
     * デッキが空かどうか判定
     * @returns {boolean} デッキが空かどうか
     */
    isEmpty() {
        return this.cards.length === 0 && this.discardPile.length === 0;
    }
    
    /**
     * デッキをリシャッフルすべきかどうか判定
     * @param {number} threshold - リシャッフルする閾値（使用率、デフォルト0.75）
     * @returns {boolean} リシャッフルすべきかどうか
     */
    shouldReshuffle(threshold = 0.75) {
        return this.getUsageRate() >= threshold;
    }
    
    /**
     * 特定のカードがデッキに残っているか確認
     * @param {string} suit - スート
     * @param {string} rank - ランク
     * @returns {boolean} カードが残っているかどうか
     */
    hasCard(suit, rank) {
        return this.cards.some(card => card.suit === suit && card.rank === rank);
    }
    
    /**
     * デッキの複製を作成
     * @returns {Deck} デッキのコピー
     */
    clone() {
        const newDeck = new Deck(this.numDecks);
        newDeck.cards = this.cards.map(card => card.clone());
        newDeck.discardPile = this.discardPile.map(card => card.clone());
        return newDeck;
    }
    
    /**
     * デッキの詳細情報を文字列で取得
     * @returns {string} デッキの詳細情報
     */
    toString() {
        const status = this.getStatus();
        return `Deck: ${status.numDecks} deck(s), ${status.remainingCards}/${status.totalCards} cards remaining (${status.usageRate}% used)`;
    }
}

/**
 * カード計数用のヘルパー関数
 * @param {Card[]} cards - カードの配列
 * @returns {Object} スートとランク別の集計
 */
function countCards(cards) {
    const count = {
        bySuit: { hearts: 0, diamonds: 0, clubs: 0, spades: 0 },
        byRank: {}
    };
    
    // ランクの初期化
    RANKS.forEach(rank => {
        count.byRank[rank] = 0;
    });
    
    // カードを集計
    cards.forEach(card => {
        count.bySuit[card.suit]++;
        count.byRank[card.rank]++;
    });
    
    return count;
}

/**
 * デッキの統計情報を取得
 * @param {Deck} deck - 対象のデッキ
 * @returns {Object} 統計情報
 */
function getDeckStatistics(deck) {
    const remainingCount = countCards(deck.cards);
    const discardedCount = countCards(deck.discardPile);
    
    return {
        remaining: remainingCount,
        discarded: discardedCount,
        status: deck.getStatus()
    };
}

// グローバルに公開
window.Deck = Deck;
window.countCards = countCards;
window.getDeckStatistics = getDeckStatistics;

console.log('deck.js が読み込まれました (Phase 2: 本格実装完了)'); 