/**
 * ブラックジャックゲームロジック
 * Phase 2: 本格実装
 */

// ゲーム状態定数
const GAME_STATES = {
    INIT: 'init',
    DEALING: 'dealing',
    PLAYER_TURN: 'player_turn',
    DEALER_TURN: 'dealer_turn',
    GAME_OVER: 'game_over'
};

// ゲーム結果定数
const GAME_RESULTS = {
    PLAYER_WIN: 'player_win',
    DEALER_WIN: 'dealer_win',
    PLAYER_BLACKJACK: 'player_blackjack',
    DEALER_BLACKJACK: 'dealer_blackjack',
    PUSH: 'push',
    PLAYER_BUST: 'player_bust',
    DEALER_BUST: 'dealer_bust'
};

// ゲーム設定
const GAME_CONFIG = {
    BLACKJACK_VALUE: 21,
    DEALER_STAND_VALUE: 17,
    INITIAL_CARDS: 2,
    DECK_COUNT: 1,
    AUTO_PLAY_DELAY: 1000,
    ANIMATION_DELAY: 500
};

/**
 * ハンド管理クラス
 */
class Hand {
    constructor(player = 'player') {
        this.cards = [];
        this.player = player;
        this.isBust = false;
        this.isBlackjack = false;
        this.isStanding = false;
    }
    
    /**
     * カードを追加
     * @param {Card} card - 追加するカード
     */
    addCard(card) {
        this.cards.push(card);
        this.updateStatus();
    }
    
    /**
     * ハンドの値を計算
     * @returns {Object} 計算結果 {value, isSoft, aceCount}
     */
    calculateValue() {
        let value = 0;
        let aceCount = 0;
        let isSoft = false;
        
        // エース以外の値を計算
        for (const card of this.cards) {
            if (card.rank === 'A') {
                aceCount++;
            } else {
                value += card.getValue();
            }
        }
        
        // エースの値を最適化
        for (let i = 0; i < aceCount; i++) {
            if (value + 11 <= GAME_CONFIG.BLACKJACK_VALUE && i === 0) {
                value += 11;
                isSoft = true;
            } else {
                value += 1;
                if (i === 0) isSoft = false;
            }
        }
        
        return {
            value: value,
            isSoft: isSoft,
            aceCount: aceCount
        };
    }
    
    /**
     * 表向きカードのみでハンドの値を計算（ディーラー用）
     * @returns {Object} 計算結果 {value, isSoft, aceCount}
     */
    calculateVisibleValue() {
        let value = 0;
        let aceCount = 0;
        let isSoft = false;
        
        // 表向きカードのみを対象とする
        const visibleCards = this.cards.filter(card => card.isVisible);
        
        // エース以外の値を計算
        for (const card of visibleCards) {
            if (card.rank === 'A') {
                aceCount++;
            } else {
                value += card.getValue();
            }
        }
        
        // エースの値を最適化
        for (let i = 0; i < aceCount; i++) {
            if (value + 11 <= GAME_CONFIG.BLACKJACK_VALUE && i === 0) {
                value += 11;
                isSoft = true;
            } else {
                value += 1;
                if (i === 0) isSoft = false;
            }
        }
        
        return {
            value: value,
            isSoft: isSoft,
            aceCount: aceCount
        };
    }
    
    /**
     * ハンドの状態を更新
     */
    updateStatus() {
        const calculation = this.calculateValue();
        const value = calculation.value;
        
        // バスト判定
        this.isBust = value > GAME_CONFIG.BLACKJACK_VALUE;
        
        // ブラックジャック判定（最初の2枚で21）
        this.isBlackjack = this.cards.length === 2 && value === GAME_CONFIG.BLACKJACK_VALUE;
    }
    
    /**
     * ハンドの値を取得
     * @returns {number} ハンドの値
     */
    getValue() {
        // ディーラーで隠しカードがある場合は表向きカードのみで計算
        const hasHiddenCard = this.player === 'dealer' && 
                             this.cards.some(card => !card.isVisible);
        
        return hasHiddenCard ? 
               this.calculateVisibleValue().value : 
               this.calculateValue().value;
    }
    
    /**
     * ソフトハンドかどうか
     * @returns {boolean} ソフトハンドかどうか
     */
    isSoftHand() {
        // ディーラーで隠しカードがある場合は表向きカードのみで計算
        const hasHiddenCard = this.player === 'dealer' && 
                             this.cards.some(card => !card.isVisible);
        
        return hasHiddenCard ? 
               this.calculateVisibleValue().isSoft : 
               this.calculateValue().isSoft;
    }
    
    /**
     * スプリット可能かどうか
     * @returns {boolean} スプリット可能かどうか
     */
    canSplit() {
        return this.cards.length === 2 && 
               this.cards[0].getValue() === this.cards[1].getValue();
    }
    
    /**
     * ハンドをリセット
     */
    reset() {
        this.cards = [];
        this.isBust = false;
        this.isBlackjack = false;
        this.isStanding = false;
    }
    
    /**
     * ハンドデータをオブジェクトで取得
     * @returns {Object} ハンド情報
     */
    toObject() {
        // ディーラーで隠しカードがある場合は表向きカードのみで計算
        const hasHiddenCard = this.player === 'dealer' && 
                             this.cards.some(card => !card.isVisible);
        
        const calculation = hasHiddenCard ? 
                           this.calculateVisibleValue() : 
                           this.calculateValue();
        
        return {
            cards: this.cards,
            value: calculation.value,
            isSoft: calculation.isSoft,
            aceCount: calculation.aceCount,
            isBust: this.isBust,
            isBlackjack: this.isBlackjack,
            isStanding: this.isStanding,
            canSplit: this.canSplit(),
            hasHiddenCard: hasHiddenCard
        };
    }
}

/**
 * ブラックジャックゲームクラス
 */
class BlackjackGame {
    /**
     * @param {UIManager} uiManager - UI更新を管理するマネージャー
     * @param {StatisticsManager} statisticsManager - 統計を管理するマネージャー
     */
    constructor(uiManager, statisticsManager) {
        this.deck = new Deck(GAME_CONFIG.DECK_COUNT);
        this.playerHands = [];
        this.dealerHand = null;
        this.gameState = GAME_STATES.INIT;
        this.gameResult = null;
        this.gameHistory = [];
        
        // ベットシステム
        this.balance = 1000; // 初期残高
        this.currentBet = 0;
        this.totalProfit = 0;
        this.betHistory = [];
        
        // 戦略評価システム
        this.strategy = new BasicStrategy();
        this.currentGameActions = []; // 現在のゲームでのアクション履歴
        
        // 統計システム（Phase 5）
        this.statisticsManager = statisticsManager;
        this.gameStartTime = null;
        
        // 重複実行防止フラグ
        this.isStartingGame = false;
        this.isProcessingAction = false;
        
        this.statistics = {
            totalGames: 0,
            wins: 0,
            losses: 0,
            pushes: 0,
            blackjacks: 0
        };
        
        // 依存関係の注入
        this.uiManager = uiManager;
        
        this.resetGame();
        
        console.log('ブラックジャックゲームを初期化しました');
    }
    
    /**
     * 統計マネージャーを設定
     * @param {StatisticsManager} statisticsManager - 統計マネージャーインスタンス
     */
    setStatisticsManager(statisticsManager) {
        this.statisticsManager = statisticsManager;
        console.log('ゲームに統計マネージャーを設定しました');
    }
    
    /**
     * 新しいゲームを開始
     */
    startNewGame() {
        // 重複実行防止チェック
        if (this.isStartingGame) {
            console.warn('ゲーム開始処理が既に実行中です');
            return false;
        }
        
        if (this.currentBet <= 0) {
            console.warn('ベットが設定されていません');
            return false;
        }
        
        if (this.currentBet > this.balance) {
            console.warn('残高が不足しています');
            return false;
        }
        
        // ゲーム状態をチェック（INIT または GAME_OVER からのみ開始可能）
        if (this.gameState !== GAME_STATES.INIT && this.gameState !== GAME_STATES.GAME_OVER) {
            console.warn(`ゲーム開始不可: 現在の状態=${this.gameState}`);
            return false;
        }
        
        // 重複実行防止フラグを設定
        this.isStartingGame = true;
        
        console.log(`新しいゲーム開始: 前の状態=${this.gameState} -> DEALING`);
        
        try {
            // ゲーム開始時間を記録
            this.gameStartTime = Date.now();
            
            // ゲーム状態をリセット
            this.gameState = GAME_STATES.DEALING;
            this.gameResult = null;
            this.lastPayout = 0;
            this.currentGameActions = [];
            this.lastActionEvaluation = null;
            
            // ハンドをリセット
            this.playerHands.forEach(hand => hand.reset());
            this.dealerHand.reset();
            
            // デッキの残り枚数をチェック（25%以下でシャッフル）
            if (this.deck.getRemainingCards() < this.deck.getTotalCards() * 0.25) {
                console.log('デッキをシャッフルします');
                this.deck.shuffle();
            }
            
            // UIをリセット（カード配布前）
            if (this.uiManager) {
                this.uiManager.resetForNewGame();
            }
            
            // 初期カードを配布
            this.dealInitialCards();
            
            // カード配布後にUIを更新
            if (this.uiManager) {
                this.uiManager.updateDisplay(this.getGameState());
            }
            
            console.log(`新しいゲームを開始しました - 最終状態: ${this.gameState}, PLAYER_TURN: ${GAME_STATES.PLAYER_TURN}`);
            console.log('getGameState()結果:', this.getGameState());
            
            return true;
            
        } catch (error) {
            console.error('ゲーム開始エラー:', error);
            this.gameState = GAME_STATES.INIT;
            return false;
            
        } finally {
            // 重複実行防止フラグをリセット
            this.isStartingGame = false;
        }
    }
    
    /**
     * 初期カード配布
     */
    dealInitialCards() {
        console.log('初期カード配布を開始します');
        
        // プレイヤーに1枚目
        let card = this.deck.dealCard();
        card.setVisible(true);
        this.playerHands[0].addCard(card);
        
        // ディーラーに1枚目（表向き）
        card = this.deck.dealCard();
        card.setVisible(true);
        this.dealerHand.addCard(card);
        
        // プレイヤーに2枚目
        card = this.deck.dealCard();
        card.setVisible(true);
        this.playerHands[0].addCard(card);
        
        // ディーラーに2枚目（裏向き）
        card = this.deck.dealCard();
        card.setVisible(false); // ホールカード
        this.dealerHand.addCard(card);
        
        console.log(`初期カード配布完了 - プレイヤー: ${this.playerHands[0].getValue()}, ディーラー: ${this.dealerHand.getValue()}`);
        
        // ブラックジャック判定
        this.checkInitialBlackjack();
    }
    
    /**
     * 初期配布後のブラックジャック判定
     */
    checkInitialBlackjack() {
        // プレイヤーのブラックジャック判定
        const playerHasBlackjack = this.playerHands[0].isBlackjack;
        
        // ディーラーのブラックジャック判定（裏向きカードも含めて）
        const dealerValue = this.dealerHand.calculateValue().value;
        const dealerHasBlackjack = this.dealerHand.cards.length === 2 && dealerValue === 21;
        
        if (playerHasBlackjack || dealerHasBlackjack) {
            // どちらかがブラックジャックの場合は即座に決着
            if (playerHasBlackjack && dealerHasBlackjack) {
                this.gameResult = GAME_RESULTS.PUSH;
            } else if (playerHasBlackjack) {
                this.gameResult = GAME_RESULTS.PLAYER_BLACKJACK;
            } else {
                this.gameResult = GAME_RESULTS.DEALER_BLACKJACK;
            }
            
            // ディーラーの隠しカードを表向きに
            if (this.dealerHand.cards.length >= 2) {
                this.dealerHand.cards[1].setVisible(true);
            }
            
            this.gameState = GAME_STATES.GAME_OVER;
            
            console.log(`ブラックジャック判定: ${this.gameResult}`);
            
            // UIを更新してからゲーム終了処理
            if (this.uiManager) {
                this.uiManager.updateDisplay(this.getGameState());
            }
            
            this.endGame();
            return;
        }
        
        // ブラックジャックがない場合はプレイヤーターンに移行
        this.gameState = GAME_STATES.PLAYER_TURN;
        console.log(`プレイヤーターンに移行します - 設定後の状態: ${this.gameState}, PLAYER_TURN定数: ${GAME_STATES.PLAYER_TURN}`);
    }
    
    /**
     * プレイヤーがヒット
     */
    playerHit() {
        console.log(`playerHit呼び出し: 現在の状態=${this.gameState}, PLAYER_TURN=${GAME_STATES.PLAYER_TURN}`);
        
        // 重複実行防止チェック
        if (this.isProcessingAction) {
            console.warn('アクション処理が既に実行中です');
            return false;
        }
        
        if (this.gameState !== GAME_STATES.PLAYER_TURN) {
            console.warn(`プレイヤーのターンではありません - 現在の状態: ${this.gameState}, 期待される状態: ${GAME_STATES.PLAYER_TURN}`);
            return false;
        }
        
        this.isProcessingAction = true;
        
        try {
            // 戦略評価（カードを引く前に実行）
            this.evaluatePlayerAction('hit');
            
            // カードを1枚引く
            const card = this.deck.dealCard();
            card.setVisible(true);
            this.playerHands[0].addCard(card);
            
            console.log(`プレイヤーがヒット: ${card.toString()}, 合計: ${this.playerHands[0].getValue()}`);
            
            // ゲーム状態を更新
            this.updateGameState();
            
            return true;
            
        } catch (error) {
            console.error('ヒット処理エラー:', error);
            return false;
            
        } finally {
            this.isProcessingAction = false;
        }
    }
    
    /**
     * プレイヤーがスタンド
     */
    playerStand() {
        if (this.gameState !== GAME_STATES.PLAYER_TURN) return;

        this.playerHands[0].isStanding = true;
        this.gameState = GAME_STATES.DEALER_TURN;
        
        // UI更新をトリガー
        if (this.uiManager) {
            this.uiManager.updateDisplay(this.getGameState());
        }
    }
    
    /**
     * プレイヤーのアクションを評価（ハンド終了時のみ）
     * @param {string} action - プレイヤーのアクション
     */
    evaluatePlayerAction(action) {
        if (!this.strategy) return;
        
        // 現在のゲーム状態を取得
        const gameState = this.getGameState();
        
        // 推奨アクションを取得
        const recommendation = this.strategy.getRecommendation(gameState);
        
        // アクションを記録
        this.strategy.recordAction(action, recommendation.action, gameState);
        
        // アクション評価情報を作成
        const actionEvaluation = {
            playerAction: action,
            recommendedAction: recommendation.action,
            isCorrect: action === recommendation.action,
            reason: recommendation.reason,
            playerValue: gameState.playerHands[0].value,
            dealerUpCard: gameState.dealerHand.cards[0]?.getValue() || 0,
            timestamp: new Date()
        };
        
        // 現在のゲームのアクション履歴に追加
        this.currentGameActions.push(actionEvaluation);
        
        // 最後のアクション情報も保存（後方互換性のため）
        this.lastActionEvaluation = actionEvaluation;
        
        console.log(`アクション評価: ${action} (推奨: ${recommendation.action}) - ${action === recommendation.action ? '正解' : '不正解'}`);
    }
    
    /**
     * ディーラーのターンを自動プレイ
     */
    async playDealerTurn() {
        console.log('ディーラーのターンを開始します');
        
        // ホールカードを表向きに
        if (this.dealerHand.cards.length >= 2) {
            this.dealerHand.cards[1].setVisible(true);
            this.dealerHand.updateStatus();
        }
        
        // UIを更新（ホールカード表示）
        if (this.uiManager) {
            this.uiManager.updateDisplay(this.getGameState());
        }
        
        // ディーラーは17以上になるまでヒット
        while (this.dealerHand.getValue() < GAME_CONFIG.DEALER_STAND_VALUE && !this.dealerHand.isBust) {
            await this.delay(GAME_CONFIG.AUTO_PLAY_DELAY);
            
            const card = this.deck.dealCard();
            card.setVisible(true);
            this.dealerHand.addCard(card);
            
            console.log(`ディーラーがヒット: ${card.toString()}, 合計: ${this.dealerHand.getValue()}`);
            
            // UIを更新
            if (this.uiManager) {
                this.uiManager.updateDisplay(this.getGameState());
            }
        }
        
        // 最終的な勝敗判定
        this.determineWinner();
        
        console.log('ディーラーのターン終了');
    }
    
    /**
     * プレイヤーがダブルダウン
     */
    playerDouble() {
        console.log(`playerDouble呼び出し: 現在の状態=${this.gameState}, PLAYER_TURN=${GAME_STATES.PLAYER_TURN}`);
        
        // 重複実行防止チェック
        if (this.isProcessingAction) {
            console.warn('アクション処理が既に実行中です');
            return false;
        }
        
        if (this.gameState !== GAME_STATES.PLAYER_TURN) {
            console.warn(`プレイヤーのターンではありません - 現在の状態: ${this.gameState}, 期待される状態: ${GAME_STATES.PLAYER_TURN}`);
            return false;
        }
        
        if (this.playerHands[0].cards.length !== 2) {
            console.warn('ダブルダウンは最初の2枚でのみ可能です');
            return false;
        }
        
        if (this.currentBet > this.balance) {
            console.warn('ダブルダウンに必要な残高が不足しています');
            return false;
        }
        
        this.isProcessingAction = true;
        
        try {
            // 戦略評価（ハンド終了前に実行）
            this.evaluatePlayerAction('double');
            
            // ベット額を倍にして残高から差し引く
            this.balance -= this.currentBet;
            this.currentBet *= 2;
            
            // 1枚だけカードを引く
            const card = this.deck.dealCard();
            card.setVisible(true);
            this.playerHands[0].addCard(card);
            
            console.log(`プレイヤーがダブルダウン: ${card.toString()}, 合計: ${this.playerHands[0].getValue()}`);
            
            // 自動的にスタンド
            this.playerHands[0].isStanding = true;
            
            // ゲーム状態を更新
            this.updateGameState();
            
            // バストしていなければディーラーターンへ
            if (!this.playerHands[0].isBust) {
                this.gameState = GAME_STATES.DEALER_TURN;
                setTimeout(() => {
                    this.playDealerTurn();
                }, GAME_CONFIG.ANIMATION_DELAY);
            }
            
            return true;
            
        } catch (error) {
            console.error('ダブルダウン処理エラー:', error);
            return false;
            
        } finally {
            this.isProcessingAction = false;
        }
    }
    
    /**
     * プレイヤーがスプリット
     */
    playerSplit() {
        if (this.gameState !== GAME_STATES.PLAYER_TURN) {
            console.warn('プレイヤーのターンではありません');
            return false;
        }
        
        if (!this.playerHands[0].canSplit()) {
            console.warn('スプリットできません');
            return false;
        }
        
        if (this.currentBet > this.balance) {
            console.warn('スプリットに必要な残高が不足しています');
            return false;
        }
        
        // 戦略評価
        this.evaluatePlayerAction('SPLIT');
        
        // 現在はスプリット機能は簡易実装（将来の拡張用）
        console.log('スプリット機能は将来のバージョンで実装予定です');
        return false;
    }
    
    /**
     * ゲーム状態を更新
     */
    updateGameState() {
        // プレイヤーがバスト
        if (this.playerHands[0].isBust) {
            this.gameResult = GAME_RESULTS.PLAYER_BUST;
            this.gameState = GAME_STATES.GAME_OVER;
            this.endGame();
            return;
        }
        
        // プレイヤーが21に到達（ブラックジャック以外）
        if (this.gameState === GAME_STATES.PLAYER_TURN && 
            this.playerHands[0].getValue() === 21 && 
            !this.playerHands[0].isBlackjack) {
            // 21に到達したら自動的にスタンド
            console.log('プレイヤーが21に到達しました。自動的にスタンドします。');
            this.playerHands[0].isStanding = true;
            this.gameState = GAME_STATES.DEALER_TURN;
            this.playDealerTurn();
            return;
        }
        
        // ディーラーがバスト
        if (this.dealerHand.isBust) {
            this.gameResult = GAME_RESULTS.DEALER_BUST;
            this.gameState = GAME_STATES.GAME_OVER;
            this.endGame();
            return;
        }
        
        // ディーラーのターンが終了している場合の勝敗判定
        if (this.gameState === GAME_STATES.DEALER_TURN && 
            this.dealerHand.getValue() >= GAME_CONFIG.DEALER_STAND_VALUE) {
            this.determineWinner();
            return;
        }
        
        // 通常のプレイヤーターン継続
        if (this.gameState === GAME_STATES.DEALING) {
            this.gameState = GAME_STATES.PLAYER_TURN;
        }
        
        // UI更新をトリガー
        if (this.uiManager) {
            this.uiManager.updateDisplay(this.getGameState());
        }
    }
    
    /**
     * 勝敗を判定
     */
    determineWinner() {
        const playerValue = this.playerHands[0].getValue();
        const dealerValue = this.dealerHand.getValue();
        
        if (playerValue > dealerValue) {
            this.gameResult = GAME_RESULTS.PLAYER_WIN;
        } else if (dealerValue > playerValue) {
            this.gameResult = GAME_RESULTS.DEALER_WIN;
        } else {
            this.gameResult = GAME_RESULTS.PUSH;
        }
        
        this.gameState = GAME_STATES.GAME_OVER;
        this.endGame();
    }
    
    /**
     * ゲーム終了処理
     */
    endGame() {
        // ゲーム時間を計算
        const gameDuration = this.gameStartTime ? Date.now() - this.gameStartTime : 0;
        
        // ベット結果を計算
        this.calculatePayoff();
        
        // 統計を更新
        this.updateStatistics();
        
        // 戦略フィードバックを表示
        this.showStrategyFeedback();
        
        // 統計マネージャーにゲーム結果を記録（Phase 5）
        if (this.statisticsManager) {
            const gameData = {
                playerHands: this.playerHands.map(hand => hand.toObject()),
                dealerHand: this.dealerHand.toObject(),
                result: this.gameResult,
                bet: this.currentBet,
                payout: this.lastPayout || 0,
                actions: [...this.currentGameActions],
                duration: gameDuration
            };
            
            this.statisticsManager.recordGame(gameData);
        }
        
        // ゲーム履歴に追加
        this.gameHistory.push({
            playerHands: this.playerHands.map(hand => hand.toObject()),
            dealerHand: this.dealerHand.toObject(),
            result: this.gameResult,
            bet: this.currentBet,
            payout: this.lastPayout || 0,
            actions: [...this.currentGameActions],
            timestamp: new Date(),
            duration: gameDuration
        });
        
        // ベットは継続（リセットしない）
        // this.currentBet = 0; // ← この行をコメントアウト
        
        console.log(`ゲーム終了: ${this.gameResult}, 支払い: $${this.lastPayout || 0}, 次回ベット: $${this.currentBet}, 時間: ${gameDuration}ms`);
        
        // ゲーム状態はGAME_OVERのまま維持
        // プレイヤーが「新しいゲーム」ボタンを押すまで状態を保持
    }
    
    /**
     * 戦略フィードバックを表示
     */
    showStrategyFeedback() {
        if (!this.uiManager) return;
        
        const feedback = {
            isGameOver: true,
            allActions: [...this.currentGameActions], // 全アクションの評価
            lastAction: this.lastActionEvaluation, // 最後のアクション（後方互換性）
            statistics: this.getStrategyStatistics()
        };
        
        this.uiManager.showStrategyFeedback(feedback);
        
        // 次のゲーム用にリセット
        this.currentGameActions = [];
        this.lastActionEvaluation = null;
    }
    
    /**
     * ベット結果を計算
     */
    calculatePayoff() {
        if (this.currentBet <= 0) {
            this.lastPayout = 0;
            return;
        }
        
        let payout = 0;
        
        switch (this.gameResult) {
            case GAME_RESULTS.PLAYER_BLACKJACK:
                // ブラックジャックは1.5倍
                payout = Math.floor(this.currentBet * 2.5);
                break;
            case GAME_RESULTS.PLAYER_WIN:
            case GAME_RESULTS.DEALER_BUST:
                // 通常勝利は2倍
                payout = this.currentBet * 2;
                break;
            case GAME_RESULTS.PUSH:
                // 引き分けはベット額を返金
                payout = this.currentBet;
                break;
            case GAME_RESULTS.DEALER_WIN:
            case GAME_RESULTS.DEALER_BLACKJACK:
            case GAME_RESULTS.PLAYER_BUST:
                // 負けは没収
                payout = 0;
                break;
        }
        
        // 残高とトータル収支を更新
        const profit = payout - this.currentBet;
        this.balance += payout;
        this.totalProfit += profit;
        this.lastPayout = payout;
        
        // ベット履歴に追加
        this.betHistory.push({
            bet: this.currentBet,
            payout: payout,
            profit: profit,
            result: this.gameResult,
            timestamp: new Date()
        });
        
        console.log(`ベット計算: ベット$${this.currentBet} → 支払い$${payout} (利益: $${profit})`);
    }
    
    /**
     * 統計を更新
     */
    updateStatistics() {
        this.statistics.totalGames++;
        
        switch (this.gameResult) {
            case GAME_RESULTS.PLAYER_WIN:
            case GAME_RESULTS.DEALER_BUST:
                this.statistics.wins++;
                break;
            case GAME_RESULTS.PLAYER_BLACKJACK:
                this.statistics.wins++;
                this.statistics.blackjacks++;
                break;
            case GAME_RESULTS.DEALER_WIN:
            case GAME_RESULTS.DEALER_BLACKJACK:
            case GAME_RESULTS.PLAYER_BUST:
                this.statistics.losses++;
                break;
            case GAME_RESULTS.PUSH:
                this.statistics.pushes++;
                break;
        }
    }
    
    /**
     * 利用可能なアクションを取得
     * @returns {Object} 利用可能なアクション
     */
    getAvailableActions() {
        const isPlayerTurn = this.gameState === GAME_STATES.PLAYER_TURN;
        const hasInitialCards = this.playerHands[0].cards.length === 2;
        const hasValidBet = this.currentBet > 0;
        const isGameOver = this.gameState === GAME_STATES.GAME_OVER;
        const isInitState = this.gameState === GAME_STATES.INIT;
        
        return {
            canHit: isPlayerTurn && !this.playerHands[0].isBust,
            canStand: isPlayerTurn,
            canDouble: isPlayerTurn && hasInitialCards,
            canSplit: isPlayerTurn && hasInitialCards && this.playerHands[0].canSplit(),
            canNewGame: (isGameOver || (isInitState && hasValidBet))
        };
    }
    
    /**
     * 戦略統計情報を取得
     * @returns {Object} 戦略統計情報
     */
    getStrategyStatistics() {
        if (!this.strategy) {
            return {
                accuracy: 0,
                totalActions: 0,
                correctActions: 0,
                currentStreak: 0
            };
        }
        
        return this.strategy.getStatistics();
    }
    
    /**
     * ゲーム状態を取得
     * @returns {Object} ゲームの現在の状態
     */
    getGameState() {
        return {
            state: this.state,
            playerHands: this.playerHands.map(hand => hand.toObject()),
            dealerHand: this.dealerHand.toObject(),
            availableActions: this.getAvailableActions(),
            deckCardsRemaining: this.deck.getRemainingCards(),
            betInfo: this.getBetInfo(),
            strategyStats: this.getStrategyStatistics(),
            lastPayout: this.lastPayout || 0
        };
    }
    
    /**
     * 統計情報を取得
     * @returns {Object} 統計情報
     */
    getStatistics() {
        const winRate = this.statistics.totalGames > 0 
            ? Math.round((this.statistics.wins / this.statistics.totalGames) * 100)
            : 0;
            
        return {
            ...this.statistics,
            winRate: winRate
        };
    }
    
    /**
     * ゲームリセット
     */
    resetGame() {
        // ハンドを初期化
        this.playerHands = [new Hand('player')];
        this.dealerHand = new Hand('dealer');
        
        // ゲーム状態をリセット
        this.gameState = GAME_STATES.INIT;
        this.gameResult = null;
        this.currentHandIndex = 0;
        this.lastPayout = 0;
        
        console.log('ゲームをリセットしました');
    }
    
    /**
     * ベット情報を取得
     * @returns {Object} ベット情報
     */
    getBetInfo() {
        return {
            balance: this.balance,
            currentBet: this.currentBet,
            totalProfit: this.totalProfit,
            lastPayout: this.lastPayout || 0,
            canBet: this.gameState === GAME_STATES.INIT || this.gameState === GAME_STATES.GAME_OVER,
            minBet: 10,
            maxBet: Math.min(1000, this.balance)
        };
    }
    
    /**
     * ベットを設定
     * @param {number} amount - ベット額
     * @param {boolean} isCustom - カスタムベットかどうか
     * @returns {boolean} 設定成功かどうか
     */
    setBet(amount, isCustom = false) {
        if (this.gameState === GAME_STATES.INIT || this.gameState === GAME_STATES.GAME_OVER) {
            if (amount > 0 && amount <= this.balance) {
                this.currentBet = amount;
                console.log(`ベット額が ${amount} に設定されました。`);
                
                // UI更新をトリガー
                if (this.uiManager) {
                    this.uiManager.updateDisplay(this.getGameState());
                }
                return true;
            }
        }
        return false;
    }
    
    /**
     * ベットをクリア
     */
    clearBet() {
        if (this.gameState === GAME_STATES.INIT || this.gameState === GAME_STATES.GAME_OVER) {
            this.currentBet = 0;
            // UI更新をトリガー
            if (this.uiManager) {
                this.uiManager.updateDisplay(this.getGameState());
            }
            return true;
        }
        return false;
    }
    
    /**
     * ベットを確定し、ゲームを開始
     */
    placeBet() {
        if ((this.gameState === GAME_STATES.INIT || this.gameState === GAME_STATES.GAME_OVER) && this.currentBet > 0) {
            this.balance -= this.currentBet;
            this.startNewGame();
            return true;
        }
        return false;
    }
    
    /**
     * 遅延処理用ヘルパー
     * @param {number} ms - 遅延時間（ミリ秒）
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// グローバルに公開
window.GAME_STATES = GAME_STATES;
window.GAME_RESULTS = GAME_RESULTS;
window.GAME_CONFIG = GAME_CONFIG;
window.Hand = Hand;
window.BlackjackGame = BlackjackGame;

console.log('game.js が読み込まれました (Phase 2: ゲームロジック実装完了)'); 