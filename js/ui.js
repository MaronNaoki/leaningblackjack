/**
 * UI制御機能
 * Phase 3: アニメーション統合実装
 */

/**
 * UI管理クラス
 */
class UIManager {
    constructor() {
        this.game = null;
        this.animationQueue = [];
        this.isAnimating = false;
        
        // Phase 3: アニメーションマネージャーを統合
        this.animationManager = new AnimationManager();
        
        // アニメーション状態管理
        this.animationState = {
            isDealingCards: false,
            pendingAnimations: []
        };
        
        // ボタンを動的に生成
        this._createGameButtons();
        
        // UI要素をキャッシュ
        this.initializeUIElements();
        
        // Phase 6: キーボードナビゲーション追加
        this.keyboardNavigation = {
            focusableElements: [],
            currentFocusIndex: 0,
            isEnabled: true
        };
        
        this.setupEventListeners();
        this.initializeKeyboardNavigation(); // Phase 6: 追加
        
        console.log('UIManager を初期化しました (Phase 3: アニメーション統合版)');
    }
    
    /**
     * UI要素を初期化
     */
    initializeUIElements() {
        console.log('UI要素の初期化を開始します...');
        
        // ボタンは静的にHTMLに配置されているため、生成処理は不要
        
        // 重要な要素の存在確認
        const criticalElements = {
            playerCards: document.getElementById('playerCards'),
            dealerCards: document.getElementById('dealerCards'),
            playerTotal: document.getElementById('playerTotal'),
            dealerTotal: document.getElementById('dealerTotal')
        };
        
        // 重要な要素が存在しない場合は警告
        Object.entries(criticalElements).forEach(([key, element]) => {
            if (!element) {
                console.error(`重要なUI要素が見つかりません: ${key}`);
            } else {
                console.log(`✓ ${key}: 正常に取得`);
            }
        });
        
        // window.UIオブジェクトを初期化
        window.UI = {
            // カード表示エリア
            playerCards: document.getElementById('playerCards'),
            dealerCards: document.getElementById('dealerCards'),
            
            // 合計値表示
            playerTotal: document.getElementById('playerTotal'),
            dealerTotal: document.getElementById('dealerTotal'),
            
            // ゲーム操作ボタン
            hitBtn: document.getElementById('hitBtn'),
            standBtn: document.getElementById('standBtn'),
            doubleBtn: document.getElementById('doubleBtn'),
            splitBtn: document.getElementById('splitBtn'),
            newGameBtn: document.getElementById('newGameBtn'),
            
            // ベット関連
            balance: document.getElementById('balance'),
            currentBet: document.getElementById('currentBet'),
            totalProfit: document.getElementById('totalProfit'),
            betControls: document.getElementById('betControls'),
            
            // フィードバック関連
            gameMessage: document.getElementById('gameMessage'),
            feedbackMessage: document.getElementById('feedbackMessage'),
            feedbackArea: document.getElementById('feedbackArea'),
            strategyHint: document.getElementById('strategyHint'),
            
            // 戦略統計
            strategyAccuracy: document.getElementById('strategyAccuracy'),
            strategyCount: document.getElementById('strategyCount'),
            strategyStreak: document.getElementById('strategyStreak')
        };
        
        // elements プロパティも設定（後方互換性のため）
        this.elements = window.UI;
        
        // null要素のチェックとログ出力
        const nullElements = [];
        Object.entries(window.UI).forEach(([key, element]) => {
            if (!element) {
                nullElements.push(key);
            }
        });
        
        if (nullElements.length > 0) {
            console.warn('以下のUI要素が見つかりませんでした:', nullElements);
        } else {
            console.log('✅ すべてのUI要素が正常に初期化されました');
        }
        
        // HTML要素の存在確認（デバッグ用）
        console.log('HTML内のID要素確認:');
        ['playerCards', 'dealerCards', 'playerTotal', 'dealerTotal'].forEach(id => {
            const element = document.getElementById(id);
            console.log(`- ${id}: ${element ? 'Found' : 'NOT FOUND'}`);
        });
    }
    
    /**
     * ゲーム操作ボタンを動的に作成してDOMに追加
     * @private
     */
    _createGameButtons() {
        const controlsContainer = document.getElementById('game-controls');
        if (!controlsContainer) {
            console.error('ゲームコントロールのコンテナが見つかりません: #game-controls');
            return;
        }

        // コンテナをクリア
        controlsContainer.innerHTML = '';

        const actionButtonsWrapper = document.createElement('div');
        actionButtonsWrapper.className = 'action-buttons';

        const buttonConfigs = [
            { id: 'hitBtn', text: 'ヒット', key: 'H', className: 'control-btn--hit' },
            { id: 'standBtn', text: 'スタンド', key: 'S', className: 'control-btn--stand' },
            { id: 'doubleBtn', text: 'ダブル', key: 'D', className: 'control-btn--double' },
            { id: 'splitBtn', text: 'スプリット', key: 'P', className: 'control-btn--split' }
        ];

        buttonConfigs.forEach(config => {
            const button = document.createElement('button');
            button.id = config.id;
            button.className = `control-btn ${config.className}`;
            button.innerHTML = `${config.text} <span class="hotkey">(${config.key})</span>`;
            actionButtonsWrapper.appendChild(button);
        });

        controlsContainer.appendChild(actionButtonsWrapper);

        const newGameButton = document.createElement('button');
        newGameButton.id = 'newGameBtn';
        newGameButton.className = 'control-btn control-btn--new-game';
        newGameButton.innerHTML = `新しいゲーム <span class="hotkey">(N)</span>`;
        
        controlsContainer.appendChild(newGameButton);

        console.log('✅ ゲーム操作ボタンを動的に作成しました。');
    }
    
    /**
     * UIシステムを初期化
     */
    initialize() {
        this.setupInteractionAnimations();
        console.log('UI システムが初期化されました');
    }
    
    /**
     * インタラクションアニメーションを設定
     */
    setupInteractionAnimations() {
        // ボタンにプレス効果を追加
        const buttons = [
            window.UI?.hitBtn,
            window.UI?.standBtn,
            window.UI?.doubleBtn,
            window.UI?.splitBtn,
            window.UI?.newGameBtn
        ];
        
        buttons.forEach(button => {
            if (button) {
                CardAnimationHelpers.addButtonPressEffect(button, this.animationManager);
            }
        });
        
        console.log('インタラクションアニメーションを設定しました');
    }
    
    /**
     * ゲームインスタンスを設定
     * @param {BlackjackGame} game - ゲームインスタンス
     */
    setGame(game) {
        this.game = game;
        console.log('ゲームインスタンスを設定しました');
    }
    
    /**
     * ゲーム画面の更新（アニメーション統合版）
     * @param {Object} gameState - ゲーム状態（オプション）
     */
    async updateDisplay(gameState = null) {
        if (!this.game) {
            console.warn('ゲームインスタンスが設定されていません');
            return;
        }
        
        const currentGameState = gameState || this.game.getGameState();
        
        // アニメーション処理が必要かチェック
        const needsAnimation = this.checkAnimationNeeds(currentGameState);
        
        if (needsAnimation) {
            await this.updateDisplayWithAnimations(currentGameState);
        } else {
            this.updateDisplayInstant(currentGameState);
        }
    }
    
    /**
     * アニメーションが必要かチェック
     * @param {Object} gameState - ゲーム状態
     * @returns {boolean} アニメーションが必要かどうか
     */
    checkAnimationNeeds(gameState) {
        return gameState.state === GAME_STATES.DEALING || 
               gameState.state === GAME_STATES.DEALER_TURN ||
               gameState.state === GAME_STATES.GAME_OVER;
    }
    
    /**
     * アニメーション付きで画面を更新
     * @param {Object} gameState - ゲーム状態
     */
    async updateDisplayWithAnimations(gameState) {
        // カード配布・表示のアニメーション
        if (gameState.state === GAME_STATES.DEALING) {
            await this.animateInitialDeal(gameState);
        } else if (gameState.state === GAME_STATES.DEALER_TURN) {
            await this.animateDealerTurn(gameState);
        } else if (gameState.state === GAME_STATES.GAME_OVER) {
            await this.animateGameResult(gameState);
        }
        
        // 通常の表示更新
        this.updateDisplayInstant(gameState);
    }
    
    /**
     * 初期カード配布アニメーション
     * @param {Object} gameState - ゲーム状態
     */
    async animateInitialDeal(gameState) {
        this.animationState.isDealingCards = true;
        
        try {
            // プレイヤーカードの取得と配布アニメーション
            const playerCards = window.UI.playerCards.children;
            if (playerCards.length > 0) {
                await CardAnimationHelpers.dealCards(
                    Array.from(playerCards), 
                    'player', 
                    this.animationManager
                );
            }
            
            // ディーラーカードの配布アニメーション（少し遅延）
            setTimeout(async () => {
                const dealerCards = window.UI.dealerCards.children;
                if (dealerCards.length > 0) {
                    await CardAnimationHelpers.dealCards(
                        Array.from(dealerCards), 
                        'dealer', 
                        this.animationManager
                    );
                }
                
                this.animationState.isDealingCards = false;
            }, 300);
            
        } catch (error) {
            console.error('初期配布アニメーションエラー:', error);
            this.animationState.isDealingCards = false;
        }
    }
    
    /**
     * ディーラーターンアニメーション
     * @param {Object} gameState - ゲーム状態
     */
    async animateDealerTurn(gameState) {
        try {
            // ディーラーの隠しカード（2枚目）をフリップ
            const dealerCards = window.UI.dealerCards.children;
            if (dealerCards.length >= 2) {
                const hiddenCard = dealerCards[1];
                if (hiddenCard.classList.contains('card-back')) {
                    await this.animationManager.revealCard(hiddenCard);
                }
            }
            
            // 追加カードがある場合はアニメーション
            const additionalCards = Array.from(dealerCards).slice(2);
            for (let i = 0; i < additionalCards.length; i++) {
                await this.animationManager.dealCard(additionalCards[i], 'dealer', i);
            }
            
        } catch (error) {
            console.error('ディーラーターンアニメーションエラー:', error);
        }
    }
    
    /**
     * ゲーム結果アニメーション
     * @param {Object} gameState - ゲーム状態
     */
    async animateGameResult(gameState) {
        try {
            let targetCards = [];
            
            // 結果に応じてアニメーション対象を決定
            switch (gameState.result) {
                case GAME_RESULTS.PLAYER_WIN:
                case GAME_RESULTS.PLAYER_BLACKJACK:
                case GAME_RESULTS.DEALER_BUST:
                    targetCards = Array.from(window.UI.playerCards.children);
                    break;
                case GAME_RESULTS.DEALER_WIN:
                case GAME_RESULTS.DEALER_BLACKJACK:
                case GAME_RESULTS.PLAYER_BUST:
                    targetCards = Array.from(window.UI.dealerCards.children);
                    break;
                case GAME_RESULTS.PUSH:
                    // 引き分けの場合は両方のカードを軽くハイライト
                    targetCards = [
                        ...Array.from(window.UI.playerCards.children),
                        ...Array.from(window.UI.dealerCards.children)
                    ];
                    break;
            }
            
            if (targetCards.length > 0) {
                this.animationManager.playResultAnimation(targetCards, gameState.result);
            }
            
        } catch (error) {
            console.error('結果アニメーションエラー:', error);
        }
    }
    
    /**
     * 即座に画面を更新（従来方式）
     * @param {Object} gameState - ゲーム状態
     */
    updateDisplayInstant(gameState) {
        // プレイヤーとディーラーのハンド表示を更新
        this.updateHandDisplay('player', gameState.playerHand);
        this.updateHandDisplay('dealer', gameState.dealerHand);
        
        // ボタン状態を更新
        this.updateButtonStates(gameState.availableActions);
        
        // ベット情報を更新
        this.updateBetInfo(gameState.betInfo);
        
        // 戦略統計を更新
        this.updateStrategyInfo(gameState.strategyStats);
        
        // ゲーム結果の表示
        if (gameState.state === GAME_STATES.GAME_OVER && gameState.result) {
            this.showGameResult(gameState.result, gameState.lastPayout);
        }
        
        // フィードバック表示
        this.updateFeedbackArea(gameState);
    }
    
    /**
     * ハンド表示の更新
     * @param {string} player - 'player' または 'dealer'
     * @param {Object} handData - ハンドデータ
     */
    updateHandDisplay(player, handData) {
        // UI要素を取得（window.UIとdocument.getElementByIdの両方を試行）
        let container = window.UI?.[`${player}Cards`];
        let totalElement = window.UI?.[`${player}Total`];
        
        // window.UIで取得できない場合は直接取得を試行
        if (!container) {
            container = document.getElementById(`${player}Cards`);
            console.log(`直接取得を試行: ${player}Cards -> ${container ? '成功' : '失敗'}`);
        }
        
        if (!totalElement) {
            totalElement = document.getElementById(`${player}Total`);
            console.log(`直接取得を試行: ${player}Total -> ${totalElement ? '成功' : '失敗'}`);
        }
        
        if (!container || !totalElement) {
            console.warn(`${player}の表示要素が見つかりません - container: ${!!container}, totalElement: ${!!totalElement}`);
            
            // デバッグ情報を出力
            console.log('デバッグ情報:');
            console.log('- window.UI:', window.UI);
            console.log(`- window.UI.${player}Cards:`, window.UI?.[`${player}Cards`]);
            console.log(`- window.UI.${player}Total:`, window.UI?.[`${player}Total`]);
            console.log(`- document.getElementById('${player}Cards'):`, document.getElementById(`${player}Cards`));
            console.log(`- document.getElementById('${player}Total'):`, document.getElementById(`${player}Total`));
            
            return;
        }
        
        console.log(`${player}の表示要素が正常に取得されました`);
        
        // 合計値を更新（アニメーション付き）
        this.updateTotalWithAnimation(totalElement, handData.value, handData.isSoft, handData.hasHiddenCard);
        
        // カード表示を更新
        this.updateCardsInContainer(container, handData.cards, player === 'dealer');
    }
    
    /**
     * 合計値をアニメーション付きで更新
     * @param {HTMLElement} element - 合計表示要素
     * @param {number} newValue - 新しい値
     * @param {boolean} isSoft - ソフトハンドかどうか
     * @param {boolean} hasHiddenCard - 隠しカードがあるかどうか
     */
    updateTotalWithAnimation(element, newValue, isSoft, hasHiddenCard = false) {
        // 隠しカードがある場合は1枚目のカードの値のみを表示
        if (hasHiddenCard && this.game) {
            const dealerHand = this.game.dealerHand;
            if (dealerHand.cards.length > 0) {
                const firstCardValue = dealerHand.cards[0].getValue();
                element.textContent = firstCardValue.toString();
                return;
            }
        }
        
        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue !== newValue) {
            // 値変更アニメーション
            element.classList.add('stat--updating');
            setTimeout(() => {
                element.classList.remove('stat--updating');
            }, 500);
        }
        
        // 表示テキストを設定
        let displayText = newValue.toString();
        if (isSoft && newValue !== 21) {
            displayText += ' (ソフト)';
        }
        
        element.textContent = displayText;
    }
    
    /**
     * カードコンテナ内のカード表示を更新
     * @param {HTMLElement} container - カードコンテナ
     * @param {Card[]} cards - カードの配列
     * @param {boolean} isDealer - ディーラーかどうか
     */
    updateCardsInContainer(container, cards, isDealer = false) {
        if (!container || !cards) {
            console.warn('カードコンテナまたはカード配列が無効です', { container, cards });
            return;
        }

        console.log(`カード表示更新: ${isDealer ? 'ディーラー' : 'プレイヤー'}, カード数: ${cards.length}`);

        // 既存のカード要素数を取得
        const existingCardCount = container.children.length;
        
        // 新しいカードのみを追加
        for (let index = existingCardCount; index < cards.length; index++) {
            const card = cards[index];
            const faceDown = isDealer && index === 1 && !card.isVisible;
            
            console.log(`新しいカード要素を作成: ${card.toString()}, 裏向き: ${faceDown}`);
            
            let cardElement;
            try {
                // カードオブジェクトのメソッドを優先使用
                if (typeof card.createCardElement === 'function') {
                    cardElement = card.createCardElement(faceDown);
                    console.log('カードオブジェクトのメソッドで作成成功');
                } else if (typeof window.createCardElement === 'function') {
                    // グローバル関数をフォールバック
                    cardElement = window.createCardElement(card, faceDown);
                    console.log('グローバル関数で作成成功');
                } else {
                    console.error('カード要素作成関数が見つかりません');
                    continue;
                }
            } catch (error) {
                console.error('カード要素作成エラー:', error);
                continue;
            }
            
            if (!cardElement) {
                console.error('カード要素の作成に失敗しました');
                continue;
            }
            
            console.log('カード要素をコンテナに追加');
            
            // ホバー効果を追加
            if (this.animationManager && typeof CardAnimationHelpers !== 'undefined') {
                CardAnimationHelpers.addHoverEffects(cardElement, this.animationManager);
            }
            
            container.appendChild(cardElement);
            
            // 新しく追加されたカードのみアニメーション
            if (!faceDown && !this.animationState.isDealingCards && this.animationManager) {
                this.animationManager.dealCard(cardElement, isDealer ? 'dealer' : 'player', index);
            }
        }
        
        // 既存のカードで表示状態が変更されたものを更新（ディーラーの隠しカードなど）
        for (let index = 0; index < Math.min(existingCardCount, cards.length); index++) {
            const card = cards[index];
            const cardElement = container.children[index];
            const shouldBeFaceDown = isDealer && index === 1 && !card.isVisible;
            const isFaceDown = cardElement.classList.contains('card-back');
            
            // 表示状態が変更された場合のみ更新
            if (shouldBeFaceDown !== isFaceDown) {
                console.log(`既存カードの表示状態を更新: ${card.toString()}, 裏向き: ${shouldBeFaceDown}`);
                
                try {
                    if (typeof card.updateCardElement === 'function') {
                        card.updateCardElement(cardElement, shouldBeFaceDown);
                        console.log('カードオブジェクトのメソッドで更新成功');
                    } else if (typeof window.updateCardElement === 'function') {
                        window.updateCardElement(cardElement, card, shouldBeFaceDown);
                        console.log('グローバル関数で更新成功');
                    }
                    
                    // カードが表示された場合のアニメーション
                    if (!shouldBeFaceDown && isFaceDown && this.animationManager) {
                        this.animationManager.revealCard(cardElement);
                    }
                } catch (error) {
                    console.error('カード要素更新エラー:', error);
                }
            }
        }
        
        // 不要なカード要素を削除（カード数が減った場合）
        while (container.children.length > cards.length) {
            const lastChild = container.lastElementChild;
            if (lastChild) {
                container.removeChild(lastChild);
            }
        }
        
        console.log(`カード表示更新完了: コンテナ内のカード数 ${container.children.length}`);
    }
    
    /**
     * ボタン状態の更新
     * @param {Object} availableActions - 利用可能なアクション
     */
    updateButtonStates(availableActions) {
        const actionButtonsContainer = document.getElementById('action-buttons');
        const newGameBtn = window.UI?.newGameBtn;

        if (!actionButtonsContainer || !newGameBtn) {
            console.warn('ボタンコンテナが見つかりません。');
            return;
        }

        const gameState = this.game.getGameState().state;

        // ゲーム状態に応じてコンテナの表示を切り替え
        if (gameState === GAME_STATES.PLAYER_TURN) {
            actionButtonsContainer.style.display = 'grid';
            newGameBtn.style.display = 'none';
        } else if (gameState === GAME_STATES.BETTING || gameState === GAME_STATES.GAME_OVER || gameState === GAME_STATES.INIT) {
            actionButtonsContainer.style.display = 'none';
            newGameBtn.style.display = 'block';
        } else {
            // DEALINGなど、操作不能な状態
            actionButtonsContainer.style.display = 'none';
            newGameBtn.style.display = 'none';
        }

        // 個々のボタンの有効/無効状態を設定
        if (window.UI?.hitBtn) window.UI.hitBtn.disabled = !availableActions.canHit;
        if (window.UI?.standBtn) window.UI.standBtn.disabled = !availableActions.canStand;
        if (window.UI?.doubleBtn) window.UI.doubleBtn.disabled = !availableActions.canDouble;
        if (window.UI?.splitBtn) window.UI.splitBtn.disabled = !availableActions.canSplit;
        if (newGameBtn) newGameBtn.disabled = !availableActions.canNewGame;
    }
    
    /**
     * ボタンの視覚的状態を更新
     */
    updateButtonVisuals() {
        const buttons = [
            window.UI?.hitBtn,
            window.UI?.standBtn, 
            window.UI?.doubleBtn,
            window.UI?.splitBtn,
            window.UI?.newGameBtn
        ];
        
        buttons.forEach(button => {
            if (button) {
                if (button.disabled) {
                    button.classList.add('disabled');
                } else {
                    button.classList.remove('disabled');
                }
            }
        });
    }
    
    /**
     * ベット情報を更新
     * @param {Object} betInfo - ベット情報
     */
    updateBetInfo(betInfo) {
        if (!betInfo) return;
        
        // 残高表示
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = `$${betInfo.balance}`;
        }
        
        // 現在のベット表示
        const currentBetElement = document.getElementById('currentBet');
        if (currentBetElement) {
            currentBetElement.textContent = `$${betInfo.currentBet}`;
        }
        
        // 収支表示
        const totalProfitElement = document.getElementById('totalProfit');
        if (totalProfitElement) {
            totalProfitElement.textContent = `$${betInfo.totalProfit >= 0 ? '+' : ''}${betInfo.totalProfit}`;
            totalProfitElement.className = `value profit-value ${betInfo.totalProfit >= 0 ? 'profit-positive' : 'profit-negative'}`;
        }
        
        // ベットボタンの状態更新
        this.updateBetButtons(betInfo);
    }
    
    /**
     * ベットボタンの状態を更新
     * @param {Object} betInfo - ベット情報
     */
    updateBetButtons(betInfo) {
        const betButtons = document.querySelectorAll('.bet-btn[data-amount]');
        const placeBetBtn = document.getElementById('placeBetBtn');
        const clearBetBtn = document.getElementById('clearBetBtn');
        
        betButtons.forEach(btn => {
            const amount = parseInt(btn.dataset.amount);
            btn.disabled = !betInfo.canBet || amount > betInfo.balance;
            
            // 現在のベット額をハイライト
            if (amount === betInfo.currentBet) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
        
        if (placeBetBtn) {
            placeBetBtn.disabled = !betInfo.canBet || betInfo.currentBet <= 0;
        }
        
        if (clearBetBtn) {
            clearBetBtn.style.display = betInfo.currentBet > 0 ? 'block' : 'none';
        }
    }
    
    /**
     * 戦略情報を更新
     * @param {Object} strategyStats - 戦略統計
     */
    updateStrategyInfo(strategyStats) {
        if (!strategyStats) return;
        
        // 正解率表示
        const accuracyElement = document.getElementById('strategyAccuracy');
        if (accuracyElement) {
            accuracyElement.textContent = `${strategyStats.accuracy}%`;
        }
        
        // 判定数表示
        const countElement = document.getElementById('strategyCount');
        if (countElement) {
            countElement.textContent = strategyStats.totalActions;
        }
        
        // 連続正解表示
        const streakElement = document.getElementById('strategyStreak');
        if (streakElement) {
            streakElement.textContent = strategyStats.currentStreak;
        }
    }
    
    /**
     * フィードバックエリアを更新
     * @param {Object} gameState - ゲーム状態
     */
    updateFeedbackArea(gameState) {
        const gameMessageElement = document.getElementById('gameMessage');
        const feedbackMessageElement = document.getElementById('feedbackMessage');
        const strategyHintElement = document.getElementById('strategyHint');
        
        // ゲームメッセージ
        if (gameMessageElement) {
            let message = '';
            switch (gameState.state) {
                case GAME_STATES.INIT:
                    message = gameState.betInfo?.currentBet > 0 ? 'ゲームを開始してください' : 'ベットを設定してください';
                    break;
                case GAME_STATES.DEALING:
                    message = 'カードを配布中...';
                    break;
                case GAME_STATES.PLAYER_TURN:
                    message = 'あなたのターンです';
                    break;
                case GAME_STATES.DEALER_TURN:
                    message = 'ディーラーのターン';
                    break;
                case GAME_STATES.GAME_OVER:
                    message = this.getResultMessage(gameState.result);
                    break;
                default:
                    message = '新しいゲームを開始してください';
            }
            gameMessageElement.textContent = message;
        }
        
        // 戦略ヒント（プレイヤーターンのみ）
        if (strategyHintElement && gameState.state === GAME_STATES.PLAYER_TURN) {
            try {
                const recommendation = this.game.basicStrategy?.getRecommendation(gameState);
                if (recommendation) {
                    const actionNames = {
                        'HIT': 'ヒット',
                        'STAND': 'スタンド',
                        'DOUBLE': 'ダブルダウン',
                        'SPLIT': 'スプリット'
                    };
                    strategyHintElement.textContent = `推奨: ${actionNames[recommendation.action]} - ${recommendation.reason}`;
                } else {
                    strategyHintElement.textContent = '';
                }
            } catch (error) {
                strategyHintElement.textContent = '';
            }
        } else if (strategyHintElement) {
            strategyHintElement.textContent = '';
        }
    }
    
    /**
     * 結果メッセージを取得
     * @param {string} result - ゲーム結果
     * @returns {string} 結果メッセージ
     */
    getResultMessage(result) {
        switch (result) {
            case GAME_RESULTS.PLAYER_WIN:
                return '🎉 あなたの勝利！';
            case GAME_RESULTS.PLAYER_BLACKJACK:
                return '🎊 ブラックジャック！';
            case GAME_RESULTS.DEALER_WIN:
                return '😔 ディーラーの勝利';
            case GAME_RESULTS.DEALER_BLACKJACK:
                return '😔 ディーラーのブラックジャック';
            case GAME_RESULTS.PLAYER_BUST:
                return '💥 バスト！';
            case GAME_RESULTS.DEALER_BUST:
                return '🎉 ディーラーがバスト！';
            case GAME_RESULTS.PUSH:
                return '🤝 引き分け';
            default:
                return '';
        }
    }
    
    /**
     * ゲーム結果を表示
     * @param {string} result - ゲーム結果
     * @param {number} payout - 支払い額
     */
    showGameResult(result, payout = 0) {
        // ゲーム結果はgameMessageエリアに表示（戦略評価とは分離）
        const gameMessage = window.UI?.gameMessage;
        if (!gameMessage) return;
        
        // 結果メッセージを設定
        const resultMessage = this.getResultMessage(result);
        gameMessage.textContent = resultMessage;
        
        // 結果に応じてクラスを設定
        gameMessage.className = 'game-message';
        
        switch (result) {
            case GAME_RESULTS.PLAYER_WIN:
            case GAME_RESULTS.PLAYER_BLACKJACK:
            case GAME_RESULTS.DEALER_BUST:
                gameMessage.classList.add('result-win');
                break;
            case GAME_RESULTS.DEALER_WIN:
            case GAME_RESULTS.DEALER_BLACKJACK:
            case GAME_RESULTS.PLAYER_BUST:
                gameMessage.classList.add('result-lose');
                break;
            case GAME_RESULTS.PUSH:
                gameMessage.classList.add('result-push');
                break;
        }
        
        // 支払い情報がある場合は追加表示
        if (payout > 0) {
            gameMessage.textContent += ` (支払い: $${payout})`;
        }
        
        console.log(`ゲーム結果表示: ${result}, 支払い: $${payout}`);
    }
    
    /**
     * カードをクリア
     * @param {string} player - 'player' または 'dealer'
     */
    clearCards(player) {
        const container = window.UI[`${player}Cards`];
        if (container) {
            // アニメーション付きでカードを削除
            const cards = Array.from(container.children);
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8) translateY(20px)';
                    setTimeout(() => {
                        if (card.parentNode) {
                            card.parentNode.removeChild(card);
                        }
                    }, 300);
                }, index * 100);
            });
        }
    }
    
    /**
     * カードをハイライト
     * @param {HTMLElement} cardElement - カード要素
     * @param {string} highlightType - ハイライトタイプ
     */
    highlightCard(cardElement, highlightType = 'default') {
        this.animationManager.playInteractionAnimation(cardElement, 'highlighted');
    }
    
    /**
     * 段階的な画面更新
     * @param {number} delay - 遅延時間
     */
    async progressiveUpdate(delay = 500) {
        this.isAnimating = true;
        
        // 段階的に要素を更新
        await this.delay(delay / 4);
        await this.updateDisplay();
        
        await this.delay(delay / 2);
        this.updateGameStats();
        
        this.isAnimating = false;
    }
    
    /**
     * 遅延ヘルパー
     * @param {number} ms - ミリ秒
     * @returns {Promise} 遅延Promise
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * エラーメッセージを表示
     * @param {string} message - エラーメッセージ
     */
    showError(message) {
        // gameMessage要素が存在する場合
        const gameMessageElement = window.UI?.gameMessage || document.getElementById('gameMessage');
        if (gameMessageElement) {
            gameMessageElement.textContent = `❌ ${message}`;
            gameMessageElement.className = 'game-message error';
            
            // 3秒後にクリア
            setTimeout(() => {
                gameMessageElement.textContent = '';
                gameMessageElement.className = 'game-message';
            }, 3000);
        } else {
            // フォールバック: console.errorとalert
            console.error('UIエラー (要素なし):', message);
            alert(`エラー: ${message}`);
        }
        
        console.error('UIエラー:', message);
    }
    
    /**
     * アニメーション設定を切り替え
     * @param {boolean} enabled - アニメーション有効フラグ
     */
    toggleAnimations(enabled) {
        this.animationManager.setAnimationsEnabled(enabled);
        console.log(`アニメーション ${enabled ? '有効' : '無効'} に設定しました`);
    }
    
    /**
     * UIをリセット
     */
    reset() {
        // アニメーションを停止
        this.animationManager.stopAllAnimations();
        
        // カード表示をクリア
        this.clearCards('player');
        this.clearCards('dealer');
        
        // 合計値をリセット
        if (window.UI.playerTotal) {
            window.UI.playerTotal.textContent = '0';
        }
        if (window.UI.dealerTotal) {
            window.UI.dealerTotal.textContent = '0';
        }
        
        // メッセージをリセット
        if (window.UI.gameMessage) {
            window.UI.gameMessage.textContent = '新しいゲームを開始してください';
            window.UI.gameMessage.className = 'game-message';
        }
        
        // アニメーション状態をリセット
        this.animationState.isDealingCards = false;
        this.animationState.pendingAnimations = [];
        
        console.log('UI がリセットされました');
    }

    /**
     * 戦略フィードバックを表示
     * @param {Object} feedback - フィードバック情報
     */
    showStrategyFeedback(feedback) {
        const feedbackArea = window.UI?.feedbackArea;
        if (!feedbackArea) return;

        // ゲーム終了時のみフィードバックを表示
        if (!feedback.isGameOver) {
            feedbackArea.style.display = 'none';
            return;
        }

        feedbackArea.style.display = 'block';
        
        // 既存のクラスをリセットして競合を回避
        feedbackArea.className = 'feedback-area';
        
        // 戦略評価の結果に基づいてクラスを設定（ゲーム結果とは独立）
        const hasCorrectActions = feedback.allActions && feedback.allActions.some(action => action.isCorrect);
        const hasIncorrectActions = feedback.allActions && feedback.allActions.some(action => !action.isCorrect);
        
        if (hasCorrectActions && !hasIncorrectActions) {
            feedbackArea.classList.add('strategy-feedback--all-correct');
        } else if (hasIncorrectActions && !hasCorrectActions) {
            feedbackArea.classList.add('strategy-feedback--all-incorrect');
        } else if (hasCorrectActions && hasIncorrectActions) {
            feedbackArea.classList.add('strategy-feedback--mixed');
        }
        
        let feedbackHTML = '<div class="feedback-content">';
        
        // 全アクションの評価を表示
        if (feedback.allActions && feedback.allActions.length > 0) {
            feedbackHTML += '<div class="actions-summary">';
            feedbackHTML += '<h4 class="actions-title">このゲームのアクション評価</h4>';
            
            feedback.allActions.forEach((action, index) => {
                const isCorrect = action.isCorrect;
                const actionClass = isCorrect ? 'correct' : 'incorrect';
                const actionIcon = isCorrect ? '〇' : '×';
                
                console.log(`アクション ${index + 1}: isCorrect=${isCorrect}, actionClass=${actionClass}, playerAction=${action.playerAction}, recommendedAction=${action.recommendedAction}`);
                
                feedbackHTML += `
                    <div class="action-feedback ${actionClass}">
                        <span class="feedback-icon">${actionIcon}</span>
                        <div class="feedback-text">
                            <div class="action-header">
                                <strong>アクション ${index + 1}:</strong> 
                                ${this.getActionDisplayName(action.playerAction)}
                                <span class="hand-info">(手札: ${action.playerValue}, ディーラー: ${action.dealerUpCard})</span>
                            </div>
                            <div class="recommended-action">
                                推奨: <strong>${this.getActionDisplayName(action.recommendedAction)}</strong>
                            </div>
                            ${action.reason ? `<div class="action-reason">${action.reason}</div>` : ''}
                        </div>
                    </div>
                `;
            });
            
            feedbackHTML += '</div>';
        } else if (feedback.lastAction) {
            // フォールバック：最後のアクションのみ表示（後方互換性）
            const isCorrect = feedback.lastAction.isCorrect;
            const actionClass = isCorrect ? 'correct' : 'incorrect';
            const actionIcon = isCorrect ? '〇' : '×';
            
            feedbackHTML += '<div class="actions-summary">';
            feedbackHTML += '<h4 class="actions-title">アクション評価</h4>';
            feedbackHTML += `
                <div class="action-feedback ${actionClass}">
                    <span class="feedback-icon">${actionIcon}</span>
                    <div class="feedback-text">
                        <div class="action-result">
                            あなたのアクション: <strong>${this.getActionDisplayName(feedback.lastAction.playerAction)}</strong>
                        </div>
                        <div class="recommended-action">
                            推奨アクション: <strong>${this.getActionDisplayName(feedback.lastAction.recommendedAction)}</strong>
                        </div>
                        ${feedback.lastAction.reason ? `<div class="action-reason">${feedback.lastAction.reason}</div>` : ''}
                    </div>
                </div>
            `;
            feedbackHTML += '</div>';
        }
        
        // 統計情報を表示
        if (feedback.statistics) {
            const accuracy = feedback.statistics.totalDecisions > 0 ? 
                Math.round((feedback.statistics.correctDecisions / feedback.statistics.totalDecisions) * 100) : 0;
            
            feedbackHTML += `
                <div class="strategy-stats">
                    <h4 class="stats-title">戦略統計</h4>
                    <div class="stat-item">
                        <span class="stat-label">正解率:</span>
                        <span class="stat-value">${accuracy}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">判定数:</span>
                        <span class="stat-value">${feedback.statistics.totalDecisions}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">連続正解:</span>
                        <span class="stat-value">${feedback.statistics.streak}</span>
                    </div>
                </div>
            `;
        }
        
        feedbackHTML += '</div>';
        feedbackArea.innerHTML = feedbackHTML;
    }

    /**
     * 推奨アクション表示を削除（プレイ中は表示しない）
     */
    showRecommendation() {
        // プレイ中の推奨アクション表示は無効化
        return;
    }

    /**
     * アクション表示名を取得
     * @param {string} action - アクション
     * @returns {string} 表示名
     */
    getActionDisplayName(action) {
        const actionNames = {
            'hit': 'ヒット',
            'stand': 'スタンド', 
            'double': 'ダブルダウン',
            'split': 'スプリット'
        };
        return actionNames[action] || action;
    }

    /**
     * 新しいゲーム開始時の表示リセット
     */
    resetForNewGame() {
        console.log('新しいゲーム用に表示をリセット開始');
        
        // カード領域をクリア（アニメーション無しで即座に）
        if (window.UI?.playerCards) {
            window.UI.playerCards.innerHTML = '';
        }
        if (window.UI?.dealerCards) {
            window.UI.dealerCards.innerHTML = '';
        }
        
        // 合計値を0にリセット
        if (window.UI?.playerTotal) {
            window.UI.playerTotal.textContent = '0';
        }
        if (window.UI?.dealerTotal) {
            window.UI.dealerTotal.textContent = '0';
        }
        
        // フィードバックエリアを非表示
        if (window.UI?.feedbackArea) {
            window.UI.feedbackArea.style.display = 'none';
            window.UI.feedbackArea.classList.remove('persistent');
            window.UI.feedbackArea.innerHTML = '';
        }
        
        // ゲームメッセージをリセット
        if (window.UI?.gameMessage) {
            window.UI.gameMessage.textContent = 'カードを配布中...';
            window.UI.gameMessage.className = 'game-message';
        }
        
        // ボタン状態をリセット（配布中は無効）
        this.updateButtonStates({
            canHit: false,
            canStand: false,
            canDouble: false,
            canSplit: false,
            canNewGame: false
        });
        
        // アニメーション状態をリセット
        if (this.animationManager) {
            this.animationManager.stopAllAnimations();
        }
        this.animationState.isDealingCards = false;
        this.animationState.pendingAnimations = [];
        
        console.log('新しいゲーム用に表示をリセット完了');
    }

    /**
     * Phase 6: キーボードナビゲーション初期化
     */
    initializeKeyboardNavigation() {
        this.updateFocusableElements();
        this.setupKeyboardListeners();
        this.setupFocusManagement();
        this.setupAriaLabels();
    }

    /**
     * フォーカス可能要素の更新
     */
    updateFocusableElements() {
        const selectors = [
            '.control-btn:not(:disabled)',
            '.nav-btn',
            '.statistics-btn',
            '.bet-btn:not(:disabled)',
            'input:not(:disabled)',
            'select:not(:disabled)',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        
        this.keyboardNavigation.focusableElements = 
            Array.from(document.querySelectorAll(selectors));
    }

    /**
     * キーボードイベントリスナーの設定
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.keyboardNavigation.isEnabled) return;
            
            switch (e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.handleArrowNavigation(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(e);
                    break;
                case 'Escape':
                    this.handleEscape(e);
                    break;
                case 'h':
                case 'H':
                    if (e.ctrlKey || e.metaKey) {
                        this.showKeyboardHelp();
                        e.preventDefault();
                    } else {
                        this.handleGameShortcut('hit', e);
                    }
                    break;
                case 's':
                case 'S':
                    this.handleGameShortcut('stand', e);
                    break;
                case 'd':
                case 'D':
                    this.handleGameShortcut('double', e);
                    break;
                case 'n':
                case 'N':
                    this.handleGameShortcut('newGame', e);
                    break;
            }
        });
    }

    /**
     * Tab ナビゲーション処理
     */
    handleTabNavigation(e) {
        this.updateFocusableElements();
        
        if (this.keyboardNavigation.focusableElements.length === 0) return;
        
        e.preventDefault();
        
        if (e.shiftKey) {
            this.keyboardNavigation.currentFocusIndex--;
            if (this.keyboardNavigation.currentFocusIndex < 0) {
                this.keyboardNavigation.currentFocusIndex = 
                    this.keyboardNavigation.focusableElements.length - 1;
            }
        } else {
            this.keyboardNavigation.currentFocusIndex++;
            if (this.keyboardNavigation.currentFocusIndex >= 
                this.keyboardNavigation.focusableElements.length) {
                this.keyboardNavigation.currentFocusIndex = 0;
            }
        }
        
        this.focusElement(this.keyboardNavigation.currentFocusIndex);
    }

    /**
     * 矢印キーナビゲーション処理
     */
    handleArrowNavigation(e) {
        this.updateFocusableElements();
        
        if (this.keyboardNavigation.focusableElements.length === 0) return;
        
        e.preventDefault();
        
        const current = document.activeElement;
        const currentIndex = this.keyboardNavigation.focusableElements.indexOf(current);
        
        if (currentIndex === -1) {
            this.focusElement(0);
            return;
        }
        
        let newIndex = currentIndex;
        
        switch (e.key) {
            case 'ArrowUp':
                newIndex = Math.max(0, currentIndex - 1);
                break;
            case 'ArrowDown':
                newIndex = Math.min(
                    this.keyboardNavigation.focusableElements.length - 1, 
                    currentIndex + 1
                );
                break;
            case 'ArrowLeft':
                newIndex = currentIndex > 0 ? currentIndex - 1 : 
                    this.keyboardNavigation.focusableElements.length - 1;
                break;
            case 'ArrowRight':
                newIndex = currentIndex < this.keyboardNavigation.focusableElements.length - 1 ? 
                    currentIndex + 1 : 0;
                break;
        }
        
        this.keyboardNavigation.currentFocusIndex = newIndex;
        this.focusElement(newIndex);
    }

    /**
     * 要素をフォーカス
     */
    focusElement(index) {
        if (index >= 0 && index < this.keyboardNavigation.focusableElements.length) {
            const element = this.keyboardNavigation.focusableElements[index];
            element.focus();
            
            // フォーカスハイライト追加
            this.addFocusHighlight(element);
            
            // スクリーンリーダー用のアナウンス
            this.announceElement(element);
        }
    }

    /**
     * フォーカスハイライトの追加
     */
    addFocusHighlight(element) {
        // 既存のハイライトを削除
        document.querySelectorAll('.keyboard-focus').forEach(el => {
            el.classList.remove('keyboard-focus');
        });
        
        // 新しいハイライトを追加
        element.classList.add('keyboard-focus');
        
        // 要素が見える位置にスクロール
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }

    /**
     * 要素のアナウンス（スクリーンリーダー用）
     */
    announceElement(element) {
        const announcement = element.getAttribute('aria-label') || 
                           element.textContent || 
                           element.getAttribute('title') || 
                           '要素にフォーカスしました';
        
        this.announceToScreenReader(announcement);
    }

    /**
     * スクリーンリーダーへのアナウンス
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * エンターキー・スペースキーでの要素アクティベーション
     */
    handleActivation(e) {
        const current = document.activeElement;
        
        if (current && (current.tagName === 'BUTTON' || current.tagName === 'INPUT')) {
            e.preventDefault();
            current.click();
        }
    }

    /**
     * Escapeキー処理
     */
    handleEscape(e) {
        // モーダルが開いている場合は閉じる
        const modal = document.querySelector('.statistics-dashboard:not(.hidden)');
        if (modal) {
            this.closeModal();
            e.preventDefault();
            return;
        }
        
        // フォーカスをメインゲーム領域に戻す
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.focus();
        }
    }

    /**
     * ゲームショートカット処理
     */
    handleGameShortcut(action, e) {
        // モーダルが開いている場合はショートカットを無効化
        const modal = document.querySelector('.statistics-dashboard:not(.hidden)');
        if (modal) return;
        
        e.preventDefault();
        
        // ゲームインスタンスが存在するかチェック
        if (!this.game) {
            console.warn('ゲームインスタンスが設定されていません');
            return;
        }
        
        // 利用可能なアクションをチェック
        const availableActions = this.game.getAvailableActions();
        
        switch (action) {
            case 'hit':
                if (availableActions.canHit) {
                    this.game.playerHit();
                    this.updateDisplay(this.game.getGameState());
                    this.announceToScreenReader('ヒットを実行しました');
                }
                break;
            case 'stand':
                if (availableActions.canStand) {
                    this.game.playerStand();
                    this.updateDisplay(this.game.getGameState());
                    this.announceToScreenReader('スタンドを実行しました');
                }
                break;
            case 'double':
                if (availableActions.canDouble) {
                    this.game.playerDouble();
                    this.updateDisplay(this.game.getGameState());
                    this.announceToScreenReader('ダブルダウンを実行しました');
                }
                break;
            case 'newGame':
                if (availableActions.canNewGame) {
                    this.game.startNewGame();
                    this.updateDisplay(this.game.getGameState());
                    this.announceToScreenReader('新しいゲームを開始しました');
                }
                break;
        }
    }

    /**
     * キーボードヘルプの表示
     */
    showKeyboardHelp() {
        const helpContent = `
            <div class="keyboard-help-modal">
                <div class="keyboard-help-content">
                    <h3>キーボードショートカット</h3>
                    <div class="shortcut-list">
                        <div class="shortcut-item">
                            <kbd>Tab</kbd> <span>次の要素に移動</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Shift + Tab</kbd> <span>前の要素に移動</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>矢印キー</kbd> <span>要素間を移動</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Enter / Space</kbd> <span>要素を実行</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>H</kbd> <span>ヒット</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>S</kbd> <span>スタンド</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>D</kbd> <span>ダブルダウン</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>N</kbd> <span>新しいゲーム</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Escape</kbd> <span>モーダルを閉じる / フォーカスリセット</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl + H</kbd> <span>このヘルプを表示</span>
                        </div>
                    </div>
                    <button class="keyboard-help-close" onclick="this.closest('.keyboard-help-modal').remove()">
                        閉じる
                    </button>
                </div>
            </div>
        `;
        
        const helpModal = document.createElement('div');
        helpModal.innerHTML = helpContent;
        helpModal.className = 'keyboard-help-overlay';
        
        document.body.appendChild(helpModal);
        
        // ヘルプモーダルにフォーカス
        setTimeout(() => {
            const closeButton = helpModal.querySelector('.keyboard-help-close');
            if (closeButton) closeButton.focus();
        }, 100);
    }

    /**
     * ARIA ラベルの設定
     */
    setupAriaLabels() {
        const ariaLabels = {
            '.hit-btn': 'カードを1枚追加します',
            '.stand-btn': 'カードの追加を終了します',
            '.double-btn': 'ベットを2倍にして1枚だけカードを追加します',
            '.new-game-btn': '新しいゲームを開始します',
            '.statistics-btn': '統計ダッシュボードを表示します',
            '.bet-btn': 'ベット額を設定します',
            '.dealer-area': 'ディーラーのカード表示エリア',
            '.player-area': 'プレイヤーのカード表示エリア',
            '.feedback-area': '戦略評価とフィードバック表示エリア'
        };
        
        Object.entries(ariaLabels).forEach(([selector, label]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.getAttribute('aria-label')) {
                    element.setAttribute('aria-label', label);
                }
            });
        });
        
        // ゲーム状態のライブリージョン設定
        const gameInfo = document.querySelector('.game-info');
        if (gameInfo) {
            gameInfo.setAttribute('aria-live', 'polite');
            gameInfo.setAttribute('aria-atomic', 'true');
        }
        
        const feedbackArea = document.querySelector('.feedback-area');
        if (feedbackArea) {
            feedbackArea.setAttribute('aria-live', 'assertive');
            feedbackArea.setAttribute('aria-atomic', 'true');
        }
    }

    /**
     * フォーカス管理の設定
     */
    setupFocusManagement() {
        // ゲーム状態変更時のフォーカス管理
        const originalUpdateGameState = this.updateGameState;
        this.updateGameState = (state) => {
            originalUpdateGameState.call(this, state);
            this.manageFocusForGameState(state);
        };
        
        // モーダル開閉時のフォーカス管理
        this.previousFocus = null;
    }

    /**
     * ゲーム状態に応じたフォーカス管理
     */
    manageFocusForGameState(state) {
        this.updateFocusableElements();
        
        switch (state) {
            case 'PLAYING':
                // プレイヤーのターン時は最初の有効なアクションボタンにフォーカス
                const actionButtons = [
                    this.elements.hitBtn,
                    this.elements.standBtn,
                    this.elements.doubleBtn
                ].filter(btn => btn && !btn.disabled);
                
                if (actionButtons.length > 0) {
                    setTimeout(() => actionButtons[0].focus(), 100);
                }
                break;
                
            case 'GAME_OVER':
                // ゲーム終了時は新ゲームボタンにフォーカス
                if (this.elements.newGameBtn) {
                    setTimeout(() => this.elements.newGameBtn.focus(), 500);
                }
                break;
        }
    }

    /**
     * モーダル表示時のフォーカス保存
     */
    saveFocusBeforeModal() {
        this.previousFocus = document.activeElement;
    }

    /**
     * モーダル閉じた後のフォーカス復元
     */
    restoreFocusAfterModal() {
        if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
            this.previousFocus.focus();
        }
        this.previousFocus = null;
    }

    /**
     * キーボードナビゲーションの有効/無効切り替え
     */
    setKeyboardNavigationEnabled(enabled) {
        this.keyboardNavigation.isEnabled = enabled;
    }

    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        console.log("UIManager: イベントリスナーを設定しています...");

        if (!this.elements.hitBtn) {
            console.error("hitBtn が見つかりません。");
            return;
        }

        // ゲーム操作
        this.elements.hitBtn.addEventListener('click', () => this.game.playerHit());
        this.elements.standBtn.addEventListener('click', () => this.game.playerStand());
        this.elements.doubleBtn.addEventListener('click', () => this.game.playerDouble());
        this.elements.splitBtn.addEventListener('click', () => this.game.playerSplit());
        this.elements.newGameBtn.addEventListener('click', () => this.game.startNewGame());

        // ベット操作
        const betButtons = document.querySelectorAll('.bet-btn[data-amount]');
        betButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseInt(btn.dataset.amount);
                this.game.setBet(amount);
            });
        });

        const placeBetBtn = document.getElementById('placeBetBtn');
        if (placeBetBtn) {
            placeBetBtn.addEventListener('click', () => {
                this.game.placeBet();
            });
        }

        const clearBetBtn = document.getElementById('clearBetBtn');
        if (clearBetBtn) {
            clearBetBtn.addEventListener('click', () => {
                this.game.clearBet();
            });
        }

        // カスタムベット
        const customBetInput = document.getElementById('customBetInput');
        if (customBetInput) {
            customBetInput.addEventListener('input', (e) => {
                const amount = parseInt(e.target.value);
                if (!isNaN(amount) && amount > 0) {
                    this.game.setBet(amount, true); // true for custom bet
                }
            });
        }

        // キーボードショートカット
        this.setupKeyboardListeners();

        console.log("UIManager: イベントリスナーの設定が完了しました。");
    }

    closeStatisticsDashboard() {
        if (window.dashboardManager) {
            window.dashboardManager.hide();
        }
    }
}

// CSS用のクラスを動的に追加
const style = document.createElement('style');
style.textContent = `
    .stat-update {
        animation: pulse 0.3s ease-in-out !important;
    }
    
    .result-win {
        animation: success-glow 1s ease-in-out !important;
    }
    
    .result-lose {
        animation: error-shake 0.5s ease-in-out !important;
    }
    
    .card--highlighted-default {
        animation: glow 2s ease-in-out !important;
    }
    
    /* 戦略評価専用アニメーション */
    .strategy-feedback--all-correct {
        animation: strategy-success-pulse 1.5s ease-in-out !important;
    }
    
    .strategy-feedback--all-incorrect {
        animation: strategy-error-flash 1s ease-in-out !important;
    }
    
    .strategy-feedback--mixed {
        animation: strategy-mixed-glow 1.2s ease-in-out !important;
    }
    
    /* 戦略フィードバック用スタイル - 可読性重視 */
    .feedback-header {
        text-align: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        border-radius: 8px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }
    
    .feedback-title {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0 0 0.5rem 0;
        color: #ffffff !important;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .feedback-subtitle {
        font-size: 0.95rem;
        margin: 0;
        color: rgba(255, 255, 255, 0.8) !important;
        font-style: italic;
    }
    
    .actions-summary {
        margin-bottom: 0.75rem;
        border: 2px solid #34495e;
        border-radius: 6px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.95);
    }
    
    .actions-title, .stats-title {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0;
        color: #ffffff !important;
        background: #34495e;
        border-bottom: none;
        padding: 0.75rem 1rem;
        border-radius: 6px 6px 0 0;
        text-shadow: none;
        margin: 0;
    }
    
    .action-feedback {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 0;
        padding: 1rem;
        border-radius: 0;
        background: #ffffff;
        border: none;
        border-bottom: 1px solid #e9ecef;
        box-shadow: none;
        transition: all 0.3s ease;
    }
    
    .action-feedback:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .action-feedback.correct {
        background: #d4edda !important;
        border-left: 4px solid #28a745 !important;
        border-color: #28a745 !important;
        animation: action-correct-glow 0.8s ease-out !important;
    }
    
    .action-feedback.incorrect {
        background: #f8d7da !important;
        border-left: 4px solid #dc3545 !important;
        border-color: #dc3545 !important;
        animation: action-incorrect-flash 0.6s ease-out !important;
    }
    
    .feedback-icon {
        font-size: 1.5rem;
        font-weight: bold;
        min-width: 2rem;
        text-align: center;
        line-height: 1;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .action-feedback.correct .feedback-icon {
        color: #28a745;
        animation: icon-bounce 0.6s ease-out 0.2s both;
    }
    
    .action-feedback.incorrect .feedback-icon {
        color: #dc3545;
        animation: icon-shake 0.5s ease-out 0.2s both;
    }
    
    .feedback-text {
        flex: 1;
        color: #2c3e50;
    }
    
    .action-header {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #2c3e50;
        font-size: 1rem;
    }
    
    .hand-info {
        font-size: 0.9rem;
        color: #6c757d;
        font-weight: normal;
        margin-left: 0.5rem;
    }
    
    .recommended-action {
        font-size: 0.95rem;
        margin-bottom: 0.5rem;
        color: #495057;
        font-weight: 500;
    }
    
    .action-reason {
        font-size: 0.9rem;
        color: #6c757d;
        font-style: italic;
        line-height: 1.4;
    }
    
    .strategy-stats {
        border: 2px solid #34495e;
        border-radius: 6px;
        overflow: hidden;
        margin-top: 0.75rem;
        background: rgba(255, 255, 255, 0.95);
    }
    
    .strategy-stats .stats-title {
        margin-bottom: 0;
        border-radius: 6px 6px 0 0;
    }
    
    .strategy-stats .stat-item {
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #dee2e6;
    }
    
    .strategy-stats .stat-item:last-child {
        border-bottom: none;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
    
    .stat-label {
        color: #495057;
        font-weight: 500;
    }
    
    .stat-value {
        color: #2c3e50;
        font-weight: 600;
    }
    
    /* アニメーション定義 */
    @keyframes strategy-success-pulse {
        0% { 
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
            transform: scale(1);
        }
        50% { 
            box-shadow: 0 0 25px rgba(0, 255, 0, 0.6);
            transform: scale(1.02);
        }
        100% { 
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
            transform: scale(1);
        }
    }
    
    @keyframes strategy-error-flash {
        0%, 100% { 
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
        }
        25%, 75% { 
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
            transform: translateX(-2px);
        }
        50% { 
            box-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
            transform: translateX(2px);
        }
    }
    
    @keyframes strategy-mixed-glow {
        0%, 100% { 
            box-shadow: 0 0 5px rgba(255, 255, 0, 0.3);
        }
        50% { 
            box-shadow: 0 0 20px rgba(255, 255, 0, 0.6);
        }
    }
    
    @keyframes action-correct-glow {
        0% { 
            background: #ffffff !important;
            transform: translateX(-5px);
        }
        50% { 
            background: #d4edda !important;
            transform: translateX(0);
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        }
        100% { 
            background: #d4edda !important;
            transform: translateX(0);
        }
    }
    
    @keyframes action-incorrect-flash {
        0% { 
            background: #ffffff !important;
        }
        25% { 
            background: #f8d7da !important;
            transform: translateX(-3px);
        }
        75% { 
            background: #f8d7da !important;
            transform: translateX(3px);
        }
        100% { 
            background: #f8d7da !important;
            transform: translateX(0);
        }
    }
    
    @keyframes icon-bounce {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes icon-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
    }
    
    @keyframes success-glow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.2) hue-rotate(120deg); }
    }
    
    @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// グローバルに公開
window.UIManager = UIManager;

console.log('ui.js が読み込まれました (Phase 3: アニメーション統合実装完了)'); 