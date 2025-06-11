/**
 * ブラックジャック統計・分析システム
 * Phase 5: 統計・分析機能実装
 */

/**
 * 統計データ管理クラス
 */
class StatisticsManager {
    constructor() {
        this.storageKey = 'blackjack_statistics';
        this.dataVersion = '1.0';
        this.maxStoredGames = 1000; // 最大保存ゲーム数
        
        // 統計データ構造を初期化
        this.data = this.loadData();
        
        console.log('StatisticsManager を初期化しました');
    }
    
    /**
     * LocalStorageからデータを読み込み
     * @returns {Object} 統計データ
     */
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                // データバージョンチェック
                if (data.version === this.dataVersion) {
                    console.log(`統計データを読み込みました: ${data.games.length}ゲーム`);
                    return data;
                } else {
                    console.log('データバージョンが異なるため新規作成します');
                }
            }
        } catch (error) {
            console.warn('統計データの読み込みに失敗:', error);
        }
        
        // 新規データ構造を作成
        return this.createNewDataStructure();
    }
    
    /**
     * 新規データ構造を作成
     * @returns {Object} 初期化された統計データ
     */
    createNewDataStructure() {
        return {
            version: this.dataVersion,
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            games: [],
            totalStats: {
                totalGames: 0,
                wins: 0,
                losses: 0,
                pushes: 0,
                blackjacks: 0,
                totalWinnings: 0,
                totalBet: 0,
                playTime: 0
            },
            strategyStats: {
                totalActions: 0,
                correctActions: 0,
                accuracy: 0,
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
                weaknesses: [],
                streaks: {
                    current: 0,
                    best: 0,
                    worst: 0
                }
            },
            dailyStats: {},
            preferences: {
                chartType: 'line',
                timeRange: '7days',
                showAdvancedStats: false
            }
        };
    }
    
    /**
     * ゲーム結果を記録
     * @param {Object} gameData - ゲームデータ
     */
    recordGame(gameData) {
        const gameRecord = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            playerHand: gameData.playerHand,
            dealerHand: gameData.dealerHand,
            result: gameData.result,
            bet: gameData.bet,
            payout: gameData.payout,
            profit: gameData.payout - gameData.bet,
            actions: gameData.actions || [],
            duration: gameData.duration || 0,
            strategyAccuracy: this.calculateGameStrategyAccuracy(gameData.actions)
        };
        
        // ゲーム記録を追加
        this.data.games.push(gameRecord);
        
        // 古いデータを削除（容量制限対策）
        if (this.data.games.length > this.maxStoredGames) {
            this.data.games = this.data.games.slice(-this.maxStoredGames);
        }
        
        // 統計データを更新
        this.updateTotalStats(gameRecord);
        this.updateStrategyStats(gameRecord);
        this.updateDailyStats(gameRecord);
        
        // データを保存
        this.saveData();
        
        console.log(`ゲーム記録を保存しました: ${gameRecord.result}`);
    }
    
    /**
     * ゲームの戦略正解率を計算
     * @param {Array} actions - アクション履歴
     * @returns {number} 正解率（0-100）
     */
    calculateGameStrategyAccuracy(actions) {
        if (!actions || actions.length === 0) return 0;
        
        const correctActions = actions.filter(action => action.isCorrect).length;
        return Math.round((correctActions / actions.length) * 100);
    }
    
    /**
     * 総合統計を更新
     * @param {Object} gameRecord - ゲーム記録
     */
    updateTotalStats(gameRecord) {
        const stats = this.data.totalStats;
        
        stats.totalGames++;
        stats.totalBet += gameRecord.bet;
        stats.totalWinnings += gameRecord.profit;
        
        switch (gameRecord.result) {
            case 'player_win':
            case 'dealer_bust':
                stats.wins++;
                break;
            case 'player_blackjack':
                stats.wins++;
                stats.blackjacks++;
                break;
            case 'dealer_win':
            case 'dealer_blackjack':
            case 'player_bust':
                stats.losses++;
                break;
            case 'push':
                stats.pushes++;
                break;
        }
        
        if (gameRecord.duration) {
            stats.playTime += gameRecord.duration;
        }
    }
    
    /**
     * 戦略統計を更新
     * @param {Object} gameRecord - ゲーム記録
     */
    updateStrategyStats(gameRecord) {
        const strategyStats = this.data.strategyStats;
        
        if (!gameRecord.actions || gameRecord.actions.length === 0) return;
        
        gameRecord.actions.forEach(action => {
            strategyStats.totalActions++;
            
            if (action.isCorrect) {
                strategyStats.correctActions++;
                strategyStats.streaks.current++;
                strategyStats.streaks.best = Math.max(
                    strategyStats.streaks.best,
                    strategyStats.streaks.current
                );
            } else {
                if (strategyStats.streaks.current < strategyStats.streaks.worst) {
                    strategyStats.streaks.worst = strategyStats.streaks.current;
                }
                strategyStats.streaks.current = 0;
                
                // 弱点を記録
                this.recordWeakness(action);
            }
            
            // ハンドタイプ別統計
            const handType = this.determineHandType(action);
            if (strategyStats.byHandType[handType]) {
                strategyStats.byHandType[handType].total++;
                if (action.isCorrect) {
                    strategyStats.byHandType[handType].correct++;
                }
            }
            
            // アクション別統計
            const actionType = action.playerAction.toLowerCase();
            if (strategyStats.byAction[actionType]) {
                strategyStats.byAction[actionType].total++;
                if (action.isCorrect) {
                    strategyStats.byAction[actionType].correct++;
                }
            }
        });
        
        // 正解率を更新
        strategyStats.accuracy = strategyStats.totalActions > 0 
            ? Math.round((strategyStats.correctActions / strategyStats.totalActions) * 100)
            : 0;
    }
    
    /**
     * ハンドタイプを判定
     * @param {Object} action - アクション記録
     * @returns {string} ハンドタイプ（hard/soft/pair）
     */
    determineHandType(action) {
        // アクション記録から判定（簡易版）
        if (action.handType) return action.handType;
        
        // プレイヤーの手札から判定
        if (action.playerValue <= 11) return 'soft';
        if (action.playerValue >= 12) return 'hard';
        return 'hard';
    }
    
    /**
     * 弱点を記録
     * @param {Object} action - 間違ったアクション記録
     */
    recordWeakness(action) {
        const weakness = {
            playerValue: action.playerValue,
            dealerUpCard: action.dealerUpCard,
            playerAction: action.playerAction,
            recommendedAction: action.recommendedAction,
            frequency: 1,
            lastOccurred: new Date().toISOString()
        };
        
        // 既存の弱点を検索
        const existingIndex = this.data.strategyStats.weaknesses.findIndex(w =>
            w.playerValue === weakness.playerValue &&
            w.dealerUpCard === weakness.dealerUpCard &&
            w.playerAction === weakness.playerAction
        );
        
        if (existingIndex >= 0) {
            this.data.strategyStats.weaknesses[existingIndex].frequency++;
            this.data.strategyStats.weaknesses[existingIndex].lastOccurred = weakness.lastOccurred;
        } else {
            this.data.strategyStats.weaknesses.push(weakness);
        }
        
        // 弱点リストをソート（頻度順）
        this.data.strategyStats.weaknesses.sort((a, b) => b.frequency - a.frequency);
        
        // 上位20件のみ保持
        if (this.data.strategyStats.weaknesses.length > 20) {
            this.data.strategyStats.weaknesses = this.data.strategyStats.weaknesses.slice(0, 20);
        }
    }
    
    /**
     * 日別統計を更新
     * @param {Object} gameRecord - ゲーム記録
     */
    updateDailyStats(gameRecord) {
        const date = gameRecord.date;
        
        if (!this.data.dailyStats[date]) {
            this.data.dailyStats[date] = {
                games: 0,
                wins: 0,
                losses: 0,
                pushes: 0,
                totalBet: 0,
                totalWinnings: 0,
                strategyAccuracy: 0,
                playTime: 0
            };
        }
        
        const dayStats = this.data.dailyStats[date];
        dayStats.games++;
        dayStats.totalBet += gameRecord.bet;
        dayStats.totalWinnings += gameRecord.profit;
        dayStats.playTime += gameRecord.duration || 0;
        
        // 戦略正解率の平均を計算
        const totalAccuracy = (dayStats.strategyAccuracy * (dayStats.games - 1)) + gameRecord.strategyAccuracy;
        dayStats.strategyAccuracy = Math.round(totalAccuracy / dayStats.games);
        
        switch (gameRecord.result) {
            case 'player_win':
            case 'dealer_bust':
            case 'player_blackjack':
                dayStats.wins++;
                break;
            case 'dealer_win':
            case 'dealer_blackjack':
            case 'player_bust':
                dayStats.losses++;
                break;
            case 'push':
                dayStats.pushes++;
                break;
        }
    }
    
    /**
     * データをLocalStorageに保存
     */
    saveData() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('統計データを保存しました');
        } catch (error) {
            console.error('統計データの保存に失敗:', error);
            
            // 容量不足の場合、古いデータを削除して再試行
            if (error.name === 'QuotaExceededError') {
                this.cleanupOldData();
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                    console.log('古いデータを削除して再保存しました');
                } catch (retryError) {
                    console.error('再試行も失敗:', retryError);
                }
            }
        }
    }
    
    /**
     * 古いデータをクリーンアップ
     */
    cleanupOldData() {
        // ゲーム記録を半分に削減
        const halfLength = Math.floor(this.data.games.length / 2);
        this.data.games = this.data.games.slice(-halfLength);
        
        // 30日以上前の日別統計を削除
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
        
        Object.keys(this.data.dailyStats).forEach(date => {
            if (date < cutoffDateStr) {
                delete this.data.dailyStats[date];
            }
        });
        
        console.log('古いデータをクリーンアップしました');
    }
    
    /**
     * 総合統計を取得
     * @returns {Object} 総合統計データ
     */
    getTotalStatistics() {
        const stats = this.data.totalStats;
        const winRate = stats.totalGames > 0 
            ? Math.round((stats.wins / stats.totalGames) * 100)
            : 0;
        const avgBet = stats.totalGames > 0 
            ? Math.round(stats.totalBet / stats.totalGames)
            : 0;
        const profitRate = stats.totalBet > 0 
            ? Math.round((stats.totalWinnings / stats.totalBet) * 100)
            : 0;
        
        return {
            ...stats,
            winRate,
            avgBet,
            profitRate,
            totalHours: Math.round(stats.playTime / 3600000) // ミリ秒から時間に変換
        };
    }
    
    /**
     * 戦略統計を取得
     * @returns {Object} 戦略統計データ
     */
    getStrategyStatistics() {
        const stats = this.data.strategyStats;
        
        // ハンドタイプ別正解率を計算
        const handTypeAccuracy = {};
        Object.keys(stats.byHandType).forEach(type => {
            const data = stats.byHandType[type];
            handTypeAccuracy[type] = data.total > 0 
                ? Math.round((data.correct / data.total) * 100)
                : 0;
        });
        
        // アクション別正解率を計算
        const actionAccuracy = {};
        Object.keys(stats.byAction).forEach(action => {
            const data = stats.byAction[action];
            actionAccuracy[action] = data.total > 0 
                ? Math.round((data.correct / data.total) * 100)
                : 0;
        });
        
        return {
            ...stats,
            handTypeAccuracy,
            actionAccuracy,
            topWeaknesses: stats.weaknesses.slice(0, 5)
        };
    }
    
    /**
     * 日別統計を取得
     * @param {number} days - 取得する日数（デフォルト: 30日）
     * @returns {Array} 日別統計データ
     */
    getDailyStatistics(days = 30) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        
        const result = [];
        const current = new Date(startDate);
        
        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];
            const dayData = this.data.dailyStats[dateStr];
            
            if (dayData) {
                result.push({
                    date: dateStr,
                    ...dayData,
                    winRate: dayData.games > 0 
                        ? Math.round((dayData.wins / dayData.games) * 100)
                        : 0
                });
            } else {
                // データがない日は0で埋める
                result.push({
                    date: dateStr,
                    games: 0,
                    wins: 0,
                    losses: 0,
                    pushes: 0,
                    totalBet: 0,
                    totalWinnings: 0,
                    strategyAccuracy: 0,
                    playTime: 0,
                    winRate: 0
                });
            }
            
            current.setDate(current.getDate() + 1);
        }
        
        return result;
    }
    
    /**
     * データをエクスポート
     * @returns {string} JSON形式のデータ
     */
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }
    
    /**
     * データをインポート
     * @param {string} jsonData - JSON形式のデータ
     * @returns {boolean} インポート成功かどうか
     */
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            // データ構造の妥当性をチェック
            if (this.validateDataStructure(importedData)) {
                this.data = importedData;
                this.saveData();
                console.log('データのインポートが完了しました');
                return true;
            } else {
                console.error('無効なデータ構造です');
                return false;
            }
        } catch (error) {
            console.error('データのインポートに失敗:', error);
            return false;
        }
    }
    
    /**
     * データ構造の妥当性をチェック
     * @param {Object} data - チェックするデータ
     * @returns {boolean} 妥当かどうか
     */
    validateDataStructure(data) {
        return data && 
               data.version &&
               Array.isArray(data.games) &&
               data.totalStats &&
               data.strategyStats &&
               data.dailyStats;
    }
    
    /**
     * 統計データをリセット
     */
    resetData() {
        this.data = this.createNewDataStructure();
        this.saveData();
        console.log('統計データをリセットしました');
    }
    
    /**
     * 設定を更新
     * @param {Object} preferences - 新しい設定
     */
    updatePreferences(preferences) {
        this.data.preferences = { ...this.data.preferences, ...preferences };
        this.saveData();
        console.log('設定を更新しました');
    }
    
    /**
     * 設定を取得
     * @returns {Object} 現在の設定
     */
    getPreferences() {
        return this.data.preferences;
    }
}

// グローバルに公開
window.StatisticsManager = StatisticsManager;

console.log('statistics.js が読み込まれました (Phase 5: データ管理システム実装完了)'); 