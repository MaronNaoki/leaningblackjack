/**
 * ベーシックストラテジー機能
 * Phase 4: 本格実装
 */

// アクション定数
const ACTIONS = {
    HIT: 'hit',
    STAND: 'stand',
    DOUBLE: 'double',
    SPLIT: 'split'
};

/**
 * ベーシックストラテジークラス
 */
class BasicStrategy {
    constructor() {
        // ハードハンド戦略表
        this.hardStrategy = {
            // プレイヤーハンド: { ディーラーアップカード: アクション }
            5: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.HIT, 5: ACTIONS.HIT, 6: ACTIONS.HIT, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            6: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.HIT, 5: ACTIONS.HIT, 6: ACTIONS.HIT, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            7: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.HIT, 5: ACTIONS.HIT, 6: ACTIONS.HIT, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            8: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.HIT, 5: ACTIONS.HIT, 6: ACTIONS.HIT, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            9: { 2: ACTIONS.HIT, 3: ACTIONS.DOUBLE, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            10: { 2: ACTIONS.DOUBLE, 3: ACTIONS.DOUBLE, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.DOUBLE, 8: ACTIONS.DOUBLE, 9: ACTIONS.DOUBLE, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            11: { 2: ACTIONS.DOUBLE, 3: ACTIONS.DOUBLE, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.DOUBLE, 8: ACTIONS.DOUBLE, 9: ACTIONS.DOUBLE, 10: ACTIONS.DOUBLE, 11: ACTIONS.DOUBLE },
            12: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            13: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            14: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            15: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            16: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            17: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND },
            18: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND },
            19: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND },
            20: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND },
            21: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND }
        };

        // ソフトハンド戦略表
        this.softStrategy = {
            // A,2 (13) ~ A,9 (20)
            13: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.HIT, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            14: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.HIT, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            15: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            16: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            17: { 2: ACTIONS.HIT, 3: ACTIONS.DOUBLE, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            18: { 2: ACTIONS.STAND, 3: ACTIONS.DOUBLE, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            19: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND },
            20: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND }
        };

        // ペア戦略表（完全実装）
        this.pairStrategy = {
            // A,A
            11: { 2: ACTIONS.SPLIT, 3: ACTIONS.SPLIT, 4: ACTIONS.SPLIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.SPLIT, 8: ACTIONS.SPLIT, 9: ACTIONS.SPLIT, 10: ACTIONS.SPLIT, 11: ACTIONS.SPLIT },
            // 2,2
            2: { 2: ACTIONS.SPLIT, 3: ACTIONS.SPLIT, 4: ACTIONS.SPLIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.SPLIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            // 3,3
            3: { 2: ACTIONS.SPLIT, 3: ACTIONS.SPLIT, 4: ACTIONS.SPLIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.SPLIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            // 4,4
            4: { 2: ACTIONS.HIT, 3: ACTIONS.HIT, 4: ACTIONS.HIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            // 5,5 (10として扱う - スプリットしない)
            5: { 2: ACTIONS.DOUBLE, 3: ACTIONS.DOUBLE, 4: ACTIONS.DOUBLE, 5: ACTIONS.DOUBLE, 6: ACTIONS.DOUBLE, 7: ACTIONS.DOUBLE, 8: ACTIONS.DOUBLE, 9: ACTIONS.DOUBLE, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            // 6,6
            6: { 2: ACTIONS.SPLIT, 3: ACTIONS.SPLIT, 4: ACTIONS.SPLIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.HIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            // 7,7
            7: { 2: ACTIONS.SPLIT, 3: ACTIONS.SPLIT, 4: ACTIONS.SPLIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.SPLIT, 8: ACTIONS.HIT, 9: ACTIONS.HIT, 10: ACTIONS.HIT, 11: ACTIONS.HIT },
            // 8,8
            8: { 2: ACTIONS.SPLIT, 3: ACTIONS.SPLIT, 4: ACTIONS.SPLIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.SPLIT, 8: ACTIONS.SPLIT, 9: ACTIONS.SPLIT, 10: ACTIONS.SPLIT, 11: ACTIONS.SPLIT },
            // 9,9
            9: { 2: ACTIONS.SPLIT, 3: ACTIONS.SPLIT, 4: ACTIONS.SPLIT, 5: ACTIONS.SPLIT, 6: ACTIONS.SPLIT, 7: ACTIONS.STAND, 8: ACTIONS.SPLIT, 9: ACTIONS.SPLIT, 10: ACTIONS.STAND, 11: ACTIONS.STAND },
            // 10,10 (20として扱う - スプリットしない)
            10: { 2: ACTIONS.STAND, 3: ACTIONS.STAND, 4: ACTIONS.STAND, 5: ACTIONS.STAND, 6: ACTIONS.STAND, 7: ACTIONS.STAND, 8: ACTIONS.STAND, 9: ACTIONS.STAND, 10: ACTIONS.STAND, 11: ACTIONS.STAND }
        };

        // 評価統計（拡張版）
        this.statistics = {
            totalDecisions: 0,
            correctDecisions: 0,
            streak: 0,
            maxStreak: 0,
            history: [],
            // 詳細統計
            byHandType: {
                hard: { total: 0, correct: 0 },
                soft: { total: 0, correct: 0 },
                pair: { total: 0, correct: 0 }
            },
            byAction: {
                hit: { total: 0, correct: 0 },
                stand: { total: 0, correct: 0 },
                double: { total: 0, correct: 0 },
                split: { total: 0, correct: 0 }
            },
            weakAreas: [], // 苦手な状況を記録
            sessionStats: {
                startTime: new Date(),
                gamesPlayed: 0,
                perfectGames: 0
            }
        };

        // 学習支援設定
        this.learningSettings = {
            showHints: true,
            hintDelay: 3000, // 3秒後にヒント表示
            difficultyLevel: 'beginner', // beginner, intermediate, advanced
            focusAreas: [] // 特定の状況に集中練習
        };

        console.log('BasicStrategy クラスを初期化しました（Phase 4: 高度実装）');
    }
    
    /**
     * 最適なアクションを取得（高度版）
     * @param {Object} gameState - ゲーム状態
     * @returns {Object} 推奨アクションと詳細情報
     */
    getRecommendation(gameState) {
        const action = this.getRecommendedAction(gameState);
        const handType = this.getHandType(gameState);
        const confidence = this.calculateConfidence(action, gameState);
        const alternatives = this.getAlternativeActions(gameState);
        
        return {
            action: action,
            confidence: confidence,
            reason: this.getDetailedActionReason(action, gameState, handType),
            handType: handType,
            alternatives: alternatives,
            difficulty: this.assessDifficulty(gameState),
            learningTip: this.getLearningTip(action, gameState)
        };
    }
    
    /**
     * ハンドタイプを判定
     * @param {Object} gameState - ゲーム状態
     * @returns {string} ハンドタイプ
     */
    getHandType(gameState) {
        const playerHand = gameState.playerHand;
        
        if (playerHand.canSplit && playerHand.cards.length === 2) {
            return 'pair';
        } else if (playerHand.isSoft) {
            return 'soft';
        } else {
            return 'hard';
        }
    }
    
    /**
     * 信頼度を計算
     * @param {string} action - 推奨アクション
     * @param {Object} gameState - ゲーム状態
     * @returns {string} 信頼度レベル
     */
    calculateConfidence(action, gameState) {
        const playerValue = gameState.playerHand.value;
        const dealerUpCard = gameState.dealerHand.cards[0]?.getValue() || 0;
        
        // 明確な状況は高信頼度
        if (playerValue <= 11 || playerValue >= 17) {
            return 'very-high';
        }
        
        // ペアの場合
        if (gameState.playerHand.canSplit) {
            const cardValue = gameState.playerHand.cards[0].getValue();
            if (cardValue === 8 || cardValue === 11) {
                return 'very-high'; // 8,8とA,Aは常にスプリット
            }
            if (cardValue === 5 || cardValue === 10) {
                return 'very-high'; // 5,5と10,10は絶対にスプリットしない
            }
        }
        
        // ディーラーのアップカードによる判定
        if (dealerUpCard >= 2 && dealerUpCard <= 6) {
            return 'high'; // ディーラーが弱い
        } else if (dealerUpCard >= 7 && dealerUpCard <= 10) {
            return 'medium'; // ディーラーが強い
        } else if (dealerUpCard === 11) {
            return 'high'; // ディーラーのA
        }
        
        return 'medium';
    }
    
    /**
     * 代替アクションを取得
     * @param {Object} gameState - ゲーム状態
     * @returns {Array} 代替アクション配列
     */
    getAlternativeActions(gameState) {
        const alternatives = [];
        const primaryAction = this.getRecommendedAction(gameState);
        const playerValue = gameState.playerHand.value;
        const canDouble = gameState.playerHand.cards.length === 2;
        const canSplit = gameState.playerHand.canSplit && gameState.playerHand.cards.length === 2;
        
        // 基本アクション
        if (primaryAction !== ACTIONS.HIT) alternatives.push(ACTIONS.HIT);
        if (primaryAction !== ACTIONS.STAND) alternatives.push(ACTIONS.STAND);
        
        // ダブルダウン
        if (canDouble && primaryAction !== ACTIONS.DOUBLE && playerValue >= 9 && playerValue <= 11) {
            alternatives.push(ACTIONS.DOUBLE);
        }
        
        // スプリット
        if (canSplit && primaryAction !== ACTIONS.SPLIT) {
            alternatives.push(ACTIONS.SPLIT);
        }
        
        return alternatives;
    }
    
    /**
     * 難易度を評価
     * @param {Object} gameState - ゲーム状態
     * @returns {string} 難易度レベル
     */
    assessDifficulty(gameState) {
        const playerValue = gameState.playerHand.value;
        const dealerUpCard = gameState.dealerHand.cards[0]?.getValue() || 0;
        const isSoft = gameState.playerHand.isSoft;
        const canSplit = gameState.playerHand.canSplit;
        
        // 簡単な状況
        if (playerValue <= 11 || playerValue >= 17) {
            return 'easy';
        }
        
        // ペアの判定は中級
        if (canSplit) {
            return 'intermediate';
        }
        
        // ソフトハンドは中級
        if (isSoft) {
            return 'intermediate';
        }
        
        // 12-16の判定は上級
        if (playerValue >= 12 && playerValue <= 16) {
            return 'advanced';
        }
        
        return 'intermediate';
    }
    
    /**
     * 学習のヒントを取得
     * @param {string} action - 推奨アクション
     * @param {Object} gameState - ゲーム状態
     * @returns {string} 学習のヒント
     */
    getLearningTip(action, gameState) {
        const playerValue = gameState.playerHand.value;
        const dealerUpCard = gameState.dealerHand.cards[0]?.getValue() || 0;
        const isSoft = gameState.playerHand.isSoft;
        
        switch (action) {
            case ACTIONS.HIT:
                if (playerValue <= 11) {
                    return '💡 11以下は絶対にバストしないので、必ずヒットしましょう';
                } else if (isSoft) {
                    return '💡 ソフトハンドはエースが1に変わるので、安全にヒットできます';
                } else {
                    return '💡 ディーラーの強いカードに対しては、リスクを取ってでもヒットが必要です';
                }
            case ACTIONS.STAND:
                if (playerValue >= 17) {
                    return '💡 17以上は十分に強いハンドなので、スタンドが基本です';
                } else {
                    return '💡 ディーラーがバストしやすい状況では、スタンドして待ちましょう';
                }
            case ACTIONS.DOUBLE:
                return '💡 ダブルダウンは期待値が高い状況です。ベットを倍にして1枚だけ引きます';
            case ACTIONS.SPLIT:
                return '💡 ペアをスプリットすることで、2つの独立したハンドとして有利にプレイできます';
            default:
                return '💡 ベーシックストラテジーに従うことで、ハウスエッジを最小化できます';
        }
    }
    
    /**
     * 詳細なアクションの理由を取得
     * @param {string} action - 推奨アクション
     * @param {Object} gameState - ゲーム状態
     * @param {string} handType - ハンドタイプ
     * @returns {string} 詳細なアクションの理由
     */
    getDetailedActionReason(action, gameState, handType) {
        const playerValue = gameState.playerHand.value;
        const dealerUpCard = gameState.dealerHand.cards[0]?.getValue() || 0;
        const isSoft = gameState.playerHand.isSoft;
        const canSplit = gameState.playerHand.canSplit;
        
        // ディーラーカードの強さを判定
        const dealerStrength = this.getDealerStrength(dealerUpCard);
        
        switch (action) {
            case ACTIONS.HIT:
                if (playerValue <= 11) {
                    return `${playerValue}はバストの危険がないため、必ずヒットします。どのカードを引いても21を超えません。`;
                } else if (isSoft && playerValue <= 17) {
                    return `ソフト${playerValue}はエースが1に変わるため安全です。より強いハンドを目指してヒットしましょう。`;
                } else if (handType === 'pair') {
                    return `このペアはスプリットよりもヒットが有利です。ディーラーの${dealerUpCard}に対して単一ハンドで勝負します。`;
                } else if (dealerStrength === 'strong') {
                    return `ディーラーの${dealerUpCard}は強いカードです。${playerValue}では勝てる可能性が低いため、リスクを取ってヒットします。`;
                } else {
                    return `現在の${playerValue}では期待値が低いため、ヒットして改善を図ります。`;
                }
                
            case ACTIONS.STAND:
                if (playerValue >= 17) {
                    return `${playerValue}は十分に強いハンドです。これ以上カードを引くとバストのリスクが高くなります。`;
                } else if (dealerStrength === 'weak') {
                    return `ディーラーの${dealerUpCard}は弱いカードです。ディーラーがバストする可能性が高いため、${playerValue}でスタンドして待ちます。`;
                } else if (handType === 'soft' && playerValue === 18) {
                    return `ソフト18は多くの状況で十分に強いハンドです。特にディーラーの${dealerUpCard}に対してはスタンドが最適です。`;
                } else {
                    return `この状況では${playerValue}でスタンドすることが期待値を最大化します。`;
                }
                
            case ACTIONS.DOUBLE:
                if (handType === 'soft') {
                    return `ソフト${playerValue}はダブルダウンに最適です。ディーラーの${dealerUpCard}に対して期待値が高く、ベットを倍にする価値があります。`;
                } else if (playerValue === 11) {
                    return `11は最強のダブルダウンハンドです。どのカードを引いても良いハンドになり、ディーラーの${dealerUpCard}に対して大きなアドバンテージがあります。`;
                } else if (playerValue === 10) {
                    return `10はダブルダウンに適したハンドです。10や絵札を引けば20になり、ディーラーの${dealerUpCard}に対して有利です。`;
                } else {
                    return `この状況ではダブルダウンが期待値を最大化します。ディーラーの${dealerUpCard}に対して攻撃的にプレイしましょう。`;
                }
                
            case ACTIONS.SPLIT:
                const cardValue = gameState.playerHand.cards[0].getValue();
                if (cardValue === 11) {
                    return `エースのペアは必ずスプリットします。2つのハンドでブラックジャックの可能性があり、期待値が非常に高いです。`;
                } else if (cardValue === 8) {
                    return `8のペアは必ずスプリットします。16は弱いハンドですが、2つの8から始めることで大幅に改善できます。`;
                } else if (cardValue === 10) {
                    return `10のペアはスプリットしません。20は非常に強いハンドなので、そのままスタンドします。`;
                } else if (dealerStrength === 'weak') {
                    return `ディーラーの${dealerUpCard}は弱いカードです。ペアをスプリットして2つのハンドで攻撃的にプレイしましょう。`;
                } else {
                    return `この状況ではスプリットが最適です。2つの独立したハンドとしてプレイすることで期待値が向上します。`;
                }
                
            default:
                return 'ベーシックストラテジーに基づく最適なアクションです。';
        }
    }
    
    /**
     * ディーラーカードの強さを判定
     * @param {number} dealerUpCard - ディーラーのアップカード
     * @returns {string} 強さレベル
     */
    getDealerStrength(dealerUpCard) {
        if (dealerUpCard >= 2 && dealerUpCard <= 6) {
            return 'weak';
        } else if (dealerUpCard >= 7 && dealerUpCard <= 9) {
            return 'medium';
        } else if (dealerUpCard === 10 || dealerUpCard === 11) {
            return 'strong';
        }
        return 'unknown';
    }
    
    /**
     * アクションを記録（高度統計版）
     * @param {string} playerAction - プレイヤーのアクション
     * @param {string} recommendedAction - 推奨アクション
     * @param {Object} gameState - ゲーム状態
     */
    recordAction(playerAction, recommendedAction, gameState) {
        const isCorrect = playerAction === recommendedAction;
        const handType = this.getHandType(gameState);
        const difficulty = this.assessDifficulty(gameState);
        
        // 基本統計を更新
        this.statistics.totalDecisions++;
        if (isCorrect) {
            this.statistics.correctDecisions++;
            this.statistics.streak++;
            this.statistics.maxStreak = Math.max(this.statistics.maxStreak, this.statistics.streak);
        } else {
            this.statistics.streak = 0;
        }

        // ハンドタイプ別統計
        this.statistics.byHandType[handType].total++;
        if (isCorrect) {
            this.statistics.byHandType[handType].correct++;
        }

        // アクション別統計
        this.statistics.byAction[playerAction].total++;
        if (isCorrect) {
            this.statistics.byAction[playerAction].correct++;
        }

        // 弱点分析
        if (!isCorrect) {
            this.recordWeakArea(gameState, playerAction, recommendedAction);
        }

        // 詳細履歴に追加
        const actionRecord = {
            playerAction,
            recommendedAction,
            isCorrect,
            handType,
            difficulty,
            gameState: this.simplifyGameState(gameState),
            timestamp: new Date(),
            confidence: this.calculateConfidence(recommendedAction, gameState),
            playerValue: gameState.playerHand.value,
            dealerUpCard: gameState.dealerHand.cards[0]?.getValue() || 0,
            isSoft: gameState.playerHand.isSoft,
            canSplit: gameState.playerHand.canSplit
        };

        this.statistics.history.push(actionRecord);

        // 履歴は最新100件のみ保持
        if (this.statistics.history.length > 100) {
            this.statistics.history = this.statistics.history.slice(-100);
        }

        // セッション統計の更新
        this.updateSessionStats();
    }

    /**
     * 弱点エリアを記録
     * @param {Object} gameState - ゲーム状態
     * @param {string} playerAction - プレイヤーのアクション
     * @param {string} recommendedAction - 推奨アクション
     */
    recordWeakArea(gameState, playerAction, recommendedAction) {
        const weakAreaKey = this.generateWeakAreaKey(gameState);
        
        // 既存の弱点エリアを検索
        let weakArea = this.statistics.weakAreas.find(area => area.key === weakAreaKey);
        
        if (!weakArea) {
            // 新しい弱点エリアを作成
            weakArea = {
                key: weakAreaKey,
                description: this.generateWeakAreaDescription(gameState),
                mistakes: 0,
                lastMistake: new Date(),
                commonMistakes: {}
            };
            this.statistics.weakAreas.push(weakArea);
        }
        
        // 弱点エリアを更新
        weakArea.mistakes++;
        weakArea.lastMistake = new Date();
        
        // よくある間違いを記録
        if (!weakArea.commonMistakes[playerAction]) {
            weakArea.commonMistakes[playerAction] = 0;
        }
        weakArea.commonMistakes[playerAction]++;
        
        // 弱点エリアを間違い回数でソート
        this.statistics.weakAreas.sort((a, b) => b.mistakes - a.mistakes);
        
        // 最大10個の弱点エリアのみ保持
        if (this.statistics.weakAreas.length > 10) {
            this.statistics.weakAreas = this.statistics.weakAreas.slice(0, 10);
        }
    }

    /**
     * 弱点エリアキーを生成
     * @param {Object} gameState - ゲーム状態
     * @returns {string} 弱点エリアキー
     */
    generateWeakAreaKey(gameState) {
        const playerValue = gameState.playerHand.value;
        const dealerUpCard = gameState.dealerHand.cards[0]?.getValue() || 0;
        const handType = this.getHandType(gameState);
        
        return `${handType}-${playerValue}-vs-${dealerUpCard}`;
    }

    /**
     * 弱点エリアの説明を生成
     * @param {Object} gameState - ゲーム状態
     * @returns {string} 弱点エリアの説明
     */
    generateWeakAreaDescription(gameState) {
        const playerValue = gameState.playerHand.value;
        const dealerUpCard = gameState.dealerHand.cards[0]?.getValue() || 0;
        const handType = this.getHandType(gameState);
        
        const handTypeNames = {
            'hard': 'ハード',
            'soft': 'ソフト',
            'pair': 'ペア'
        };
        
        return `${handTypeNames[handType]}${playerValue} vs ディーラー${dealerUpCard}`;
    }

    /**
     * セッション統計を更新
     */
    updateSessionStats() {
        // 完璧なゲーム（全て正解）の判定は別途実装
        // ここでは基本的な更新のみ
        this.statistics.sessionStats.gamesPlayed = Math.floor(this.statistics.totalDecisions / 3); // 平均3アクション/ゲーム
    }

    /**
     * 最適なアクションを取得
     * @param {Object} gameState - ゲーム状態
     * @returns {string} 推奨アクション
     */
    getRecommendedAction(gameState) {
        try {
            const playerHand = gameState.playerHand;
            const dealerUpCard = gameState.dealerHand.cards[0];
            
            if (!playerHand || !dealerUpCard || playerHand.cards.length === 0) {
                return ACTIONS.HIT;
            }

            const playerValue = playerHand.value;
            const dealerValue = dealerUpCard.getValue();
            const isSoft = playerHand.isSoft;
            const canSplit = playerHand.canSplit && playerHand.cards.length === 2;

            // スプリット判定
            if (canSplit) {
                const cardValue = playerHand.cards[0].getValue();
                if (this.pairStrategy[cardValue] && this.pairStrategy[cardValue][dealerValue]) {
                    const action = this.pairStrategy[cardValue][dealerValue];
                    if (action === ACTIONS.SPLIT) {
                        return ACTIONS.SPLIT;
                    }
                }
            }

            // ダブルダウンは最初の2枚のみ可能
            const canDouble = playerHand.cards.length === 2;

            // ソフトハンド判定
            if (isSoft && this.softStrategy[playerValue]) {
                const action = this.softStrategy[playerValue][dealerValue];
                if (action === ACTIONS.DOUBLE && !canDouble) {
                    return ACTIONS.HIT;
                }
                return action;
            }

            // ハードハンド判定
            if (this.hardStrategy[playerValue]) {
                const action = this.hardStrategy[playerValue][dealerValue];
                if (action === ACTIONS.DOUBLE && !canDouble) {
                    return ACTIONS.HIT;
                }
                return action;
            }

            // デフォルト：バスト回避
            return playerValue < 12 ? ACTIONS.HIT : ACTIONS.STAND;

        } catch (error) {
            console.error('ベーシックストラテジー判定エラー:', error);
            return ACTIONS.HIT;
        }
    }
    
    /**
     * ゲーム状態を簡略化（履歴保存用）
     * @param {Object} gameState - ゲーム状態
     * @returns {Object} 簡略化されたゲーム状態
     */
    simplifyGameState(gameState) {
        return {
            playerValue: gameState.playerHand.value,
            playerIsSoft: gameState.playerHand.isSoft,
            dealerUpCard: gameState.dealerHand.cards[0]?.getValue() || 0,
            canSplit: gameState.playerHand.canSplit
        };
    }

    /**
     * 詳細統計情報を取得
     * @returns {Object} 詳細統計情報
     */
    getStatistics() {
        const accuracy = this.statistics.totalDecisions > 0 ? 
                        Math.round((this.statistics.correctDecisions / this.statistics.totalDecisions) * 100) : 0;
        
        // ハンドタイプ別正解率
        const handTypeStats = {};
        Object.keys(this.statistics.byHandType).forEach(type => {
            const stats = this.statistics.byHandType[type];
            handTypeStats[type] = {
                accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
                total: stats.total,
                correct: stats.correct
            };
        });

        // アクション別正解率
        const actionStats = {};
        Object.keys(this.statistics.byAction).forEach(action => {
            const stats = this.statistics.byAction[action];
            actionStats[action] = {
                accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
                total: stats.total,
                correct: stats.correct
            };
        });

        // 学習進捗の評価
        const learningProgress = this.assessLearningProgress();
        
        // 推奨練習エリア
        const recommendedPractice = this.getRecommendedPracticeAreas();

        return {
            // 基本統計
            accuracy: accuracy,
            totalActions: this.statistics.totalDecisions,
            correctActions: this.statistics.correctDecisions,
            currentStreak: this.statistics.streak,
            maxStreak: this.statistics.maxStreak,
            
            // 詳細統計
            handTypeStats: handTypeStats,
            actionStats: actionStats,
            weakAreas: this.statistics.weakAreas.slice(0, 5), // 上位5つの弱点
            
            // 学習分析
            learningProgress: learningProgress,
            recommendedPractice: recommendedPractice,
            
            // セッション情報
            sessionStats: {
                ...this.statistics.sessionStats,
                sessionDuration: this.getSessionDuration(),
                averageAccuracy: accuracy
            },
            
            // 履歴
            recentHistory: this.statistics.history.slice(-10), // 最新10件
            
            // パフォーマンス指標
            performance: this.calculatePerformanceMetrics()
        };
    }

    /**
     * 学習進捗を評価
     * @returns {Object} 学習進捗情報
     */
    assessLearningProgress() {
        const totalDecisions = this.statistics.totalDecisions;
        const accuracy = totalDecisions > 0 ? (this.statistics.correctDecisions / totalDecisions) * 100 : 0;
        
        let level = 'beginner';
        let nextGoal = '';
        
        if (totalDecisions < 50) {
            level = 'beginner';
            nextGoal = '50回の判定を完了して基礎を固めましょう';
        } else if (accuracy < 70) {
            level = 'learning';
            nextGoal = '正解率70%を目指しましょう';
        } else if (accuracy < 85) {
            level = 'intermediate';
            nextGoal = '正解率85%を目指して上級者レベルへ';
        } else if (accuracy < 95) {
            level = 'advanced';
            nextGoal = '正解率95%を目指してマスターレベルへ';
        } else {
            level = 'master';
            nextGoal = '完璧です！この調子で維持しましょう';
        }

        return {
            level: level,
            nextGoal: nextGoal,
            progress: Math.min(100, Math.round((accuracy / 95) * 100)), // 95%を100%として計算
            strengths: this.identifyStrengths(),
            improvements: this.identifyImprovements()
        };
    }

    /**
     * 推奨練習エリアを取得
     * @returns {Array} 推奨練習エリア
     */
    getRecommendedPracticeAreas() {
        const recommendations = [];
        
        // 弱点エリアから推奨
        this.statistics.weakAreas.slice(0, 3).forEach(area => {
            recommendations.push({
                type: 'weakness',
                title: `${area.description}の練習`,
                description: `${area.mistakes}回間違えています。この状況を重点的に練習しましょう。`,
                priority: 'high'
            });
        });

        // ハンドタイプ別の推奨
        Object.keys(this.statistics.byHandType).forEach(type => {
            const stats = this.statistics.byHandType[type];
            if (stats.total > 0 && (stats.correct / stats.total) < 0.8) {
                const typeNames = {
                    'hard': 'ハードハンド',
                    'soft': 'ソフトハンド',
                    'pair': 'ペア'
                };
                
                recommendations.push({
                    type: 'handType',
                    title: `${typeNames[type]}の練習`,
                    description: `${typeNames[type]}の正解率が${Math.round((stats.correct / stats.total) * 100)}%です。`,
                    priority: 'medium'
                });
            }
        });

        // 経験不足エリアの推奨
        if (this.statistics.totalDecisions < 100) {
            recommendations.push({
                type: 'experience',
                title: '基礎練習の継続',
                description: 'より多くの状況を経験して、判断力を向上させましょう。',
                priority: 'low'
            });
        }

        return recommendations.slice(0, 5); // 最大5つの推奨
    }

    /**
     * 強みを特定
     * @returns {Array} 強みのリスト
     */
    identifyStrengths() {
        const strengths = [];
        
        // ハンドタイプ別の強み
        Object.keys(this.statistics.byHandType).forEach(type => {
            const stats = this.statistics.byHandType[type];
            if (stats.total >= 10 && (stats.correct / stats.total) >= 0.9) {
                const typeNames = {
                    'hard': 'ハードハンド',
                    'soft': 'ソフトハンド',
                    'pair': 'ペア'
                };
                strengths.push(`${typeNames[type]}の判定が得意`);
            }
        });

        // 連続正解の強み
        if (this.statistics.maxStreak >= 10) {
            strengths.push(`最大${this.statistics.maxStreak}連続正解の集中力`);
        }

        // 全体的な正解率の強み
        const accuracy = this.statistics.totalDecisions > 0 ? 
                        (this.statistics.correctDecisions / this.statistics.totalDecisions) * 100 : 0;
        if (accuracy >= 90) {
            strengths.push('非常に高い正解率');
        } else if (accuracy >= 80) {
            strengths.push('安定した正解率');
        }

        return strengths;
    }

    /**
     * 改善点を特定
     * @returns {Array} 改善点のリスト
     */
    identifyImprovements() {
        const improvements = [];
        
        // ハンドタイプ別の改善点
        Object.keys(this.statistics.byHandType).forEach(type => {
            const stats = this.statistics.byHandType[type];
            if (stats.total >= 5 && (stats.correct / stats.total) < 0.7) {
                const typeNames = {
                    'hard': 'ハードハンド',
                    'soft': 'ソフトハンド',
                    'pair': 'ペア'
                };
                improvements.push(`${typeNames[type]}の判定精度向上`);
            }
        });

        // 弱点エリアからの改善点
        this.statistics.weakAreas.slice(0, 2).forEach(area => {
            improvements.push(`${area.description}の戦略理解`);
        });

        return improvements;
    }

    /**
     * セッション継続時間を取得
     * @returns {number} セッション継続時間（分）
     */
    getSessionDuration() {
        const now = new Date();
        const startTime = this.statistics.sessionStats.startTime;
        return Math.round((now - startTime) / (1000 * 60)); // 分単位
    }

    /**
     * パフォーマンス指標を計算
     * @returns {Object} パフォーマンス指標
     */
    calculatePerformanceMetrics() {
        const totalDecisions = this.statistics.totalDecisions;
        const accuracy = totalDecisions > 0 ? (this.statistics.correctDecisions / totalDecisions) * 100 : 0;
        
        return {
            efficiency: this.calculateEfficiency(),
            consistency: this.calculateConsistency(),
            improvement: this.calculateImprovement(),
            mastery: this.calculateMastery()
        };
    }

    /**
     * 効率性を計算
     * @returns {number} 効率性スコア（0-100）
     */
    calculateEfficiency() {
        const sessionDuration = this.getSessionDuration();
        if (sessionDuration === 0) return 0;
        
        const decisionsPerMinute = this.statistics.totalDecisions / sessionDuration;
        return Math.min(100, Math.round(decisionsPerMinute * 20)); // 5判定/分で100点
    }

    /**
     * 一貫性を計算
     * @returns {number} 一貫性スコア（0-100）
     */
    calculateConsistency() {
        if (this.statistics.history.length < 10) return 0;
        
        // 最近10回の正解率の標準偏差を計算
        const recentAccuracies = [];
        for (let i = 0; i < Math.min(10, this.statistics.history.length); i++) {
            const start = Math.max(0, this.statistics.history.length - 10 - i);
            const end = this.statistics.history.length - i;
            const subset = this.statistics.history.slice(start, end);
            const accuracy = subset.length > 0 ? (subset.filter(h => h.isCorrect).length / subset.length) * 100 : 0;
            recentAccuracies.push(accuracy);
        }
        
        if (recentAccuracies.length < 2) return 0;
        
        const mean = recentAccuracies.reduce((a, b) => a + b) / recentAccuracies.length;
        const variance = recentAccuracies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recentAccuracies.length;
        const stdDev = Math.sqrt(variance);
        
        return Math.max(0, Math.round(100 - stdDev)); // 標準偏差が小さいほど高スコア
    }

    /**
     * 改善度を計算
     * @returns {number} 改善度スコア（0-100）
     */
    calculateImprovement() {
        if (this.statistics.history.length < 20) return 0;
        
        // 前半と後半の正解率を比較
        const halfPoint = Math.floor(this.statistics.history.length / 2);
        const firstHalf = this.statistics.history.slice(0, halfPoint);
        const secondHalf = this.statistics.history.slice(halfPoint);
        
        const firstAccuracy = firstHalf.filter(h => h.isCorrect).length / firstHalf.length * 100;
        const secondAccuracy = secondHalf.filter(h => h.isCorrect).length / secondHalf.length * 100;
        
        const improvement = secondAccuracy - firstAccuracy;
        return Math.max(0, Math.min(100, Math.round(50 + improvement * 2))); // 改善度に応じてスコア
    }

    /**
     * 習熟度を計算
     * @returns {number} 習熟度スコア（0-100）
     */
    calculateMastery() {
        const accuracy = this.statistics.totalDecisions > 0 ? 
                        (this.statistics.correctDecisions / this.statistics.totalDecisions) * 100 : 0;
        const experience = Math.min(100, this.statistics.totalDecisions / 2); // 200判定で満点
        
        return Math.round((accuracy * 0.7) + (experience * 0.3)); // 正解率70%、経験30%の重み
    }

    /**
     * 統計をリセット
     */
    resetStatistics() {
        this.statistics = {
            totalDecisions: 0,
            correctDecisions: 0,
            streak: 0,
            maxStreak: 0,
            history: [],
            // 詳細統計
            byHandType: {
                hard: { total: 0, correct: 0 },
                soft: { total: 0, correct: 0 },
                pair: { total: 0, correct: 0 }
            },
            byAction: {
                hit: { total: 0, correct: 0 },
                stand: { total: 0, correct: 0 },
                double: { total: 0, correct: 0 },
                split: { total: 0, correct: 0 }
            },
            weakAreas: [], // 苦手な状況を記録
            sessionStats: {
                startTime: new Date(),
                gamesPlayed: 0,
                perfectGames: 0
            }
        };
        
        console.log('戦略統計がリセットされました');
    }

    /**
     * 学習設定を更新
     * @param {Object} settings - 新しい設定
     */
    updateLearningSettings(settings) {
        this.learningSettings = { ...this.learningSettings, ...settings };
        console.log('学習設定が更新されました:', this.learningSettings);
    }

    /**
     * 学習設定を取得
     * @returns {Object} 現在の学習設定
     */
    getLearningSettings() {
        return { ...this.learningSettings };
    }
}

// グローバルに公開
window.ACTIONS = ACTIONS;
window.BasicStrategy = BasicStrategy;

console.log('strategy.js が読み込まれました (Phase 4: 高度ベーシックストラテジー実装完了)'); 