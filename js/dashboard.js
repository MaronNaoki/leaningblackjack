/**
 * ブラックジャック統計ダッシュボード
 * Phase 5: 統計表示機能実装
 */

/**
 * ダッシュボード管理クラス
 */
class DashboardManager {
    constructor() {
        this.isVisible = false;
        this.statisticsManager = null;
        this.chartInstance = null;
        this.currentChartType = 'winRate';
        this.currentTimeRange = 7;
        
        this.initializeElements();
        console.log('DashboardManager を初期化しました');
    }
    
    /**
     * DOM要素を初期化
     */
    initializeElements() {
        // ダッシュボード要素を取得または作成
        this.dashboardElement = document.getElementById('statistics-dashboard');
        if (!this.dashboardElement) {
            this.createDashboardStructure();
        }
        
        // 各セクションの要素を取得
        this.totalStatsSection = document.getElementById('total-stats-section');
        this.strategyStatsSection = document.getElementById('strategy-stats-section');
        this.chartSection = document.getElementById('chart-section');
        this.weaknessSection = document.getElementById('weakness-section');
        this.controlSection = document.getElementById('dashboard-controls');
        
        // イベントリスナーを設定
        this.setupEventListeners();
    }
    
    /**
     * ダッシュボード構造を作成
     */
    createDashboardStructure() {
        // ダッシュボードコンテナを作成
        const dashboard = document.createElement('div');
        dashboard.id = 'statistics-dashboard';
        dashboard.className = 'statistics-dashboard hidden';
        
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h2><i class="fas fa-chart-line"></i> 統計ダッシュボード</h2>
                <button id="close-dashboard" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="dashboard-content">
                <!-- 総合統計セクション -->
                <section id="total-stats-section" class="stats-section">
                    <h3><i class="fas fa-trophy"></i> 総合成績</h3>
                    <div class="stats-grid" id="total-stats-grid">
                        <!-- 動的に生成 -->
                    </div>
                </section>
                
                <!-- 戦略統計セクション -->
                <section id="strategy-stats-section" class="stats-section">
                    <h3><i class="fas fa-brain"></i> 戦略成績</h3>
                    <div class="strategy-stats-container">
                        <div class="strategy-overview" id="strategy-overview">
                            <!-- 動的に生成 -->
                        </div>
                        <div class="strategy-breakdown" id="strategy-breakdown">
                            <!-- 動的に生成 -->
                        </div>
                    </div>
                </section>
                
                <!-- チャートセクション -->
                <section id="chart-section" class="stats-section">
                    <h3><i class="fas fa-chart-area"></i> 推移グラフ</h3>
                    <div class="chart-controls">
                        <div class="chart-type-selector">
                            <label>表示項目:</label>
                            <select id="chart-type-select">
                                <option value="winRate">勝率</option>
                                <option value="strategyAccuracy">戦略正解率</option>
                                <option value="totalWinnings">収支</option>
                                <option value="games">ゲーム数</option>
                            </select>
                        </div>
                        <div class="time-range-selector">
                            <label>期間:</label>
                            <select id="time-range-select">
                                <option value="7">7日間</option>
                                <option value="14">14日間</option>
                                <option value="30">30日間</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="statistics-chart"></canvas>
                    </div>
                </section>
                
                <!-- 弱点分析セクション -->
                <section id="weakness-section" class="stats-section">
                    <h3><i class="fas fa-exclamation-triangle"></i> 弱点分析</h3>
                    <div id="weakness-list">
                        <!-- 動的に生成 -->
                    </div>
                </section>
                
                <!-- 制御セクション -->
                <section id="dashboard-controls" class="stats-section">
                    <h3><i class="fas fa-cogs"></i> データ管理</h3>
                    <div class="control-buttons">
                        <button id="export-data-btn" class="control-btn export">
                            <i class="fas fa-download"></i> データをエクスポート
                        </button>
                        <button id="import-data-btn" class="control-btn import">
                            <i class="fas fa-upload"></i> データをインポート
                        </button>
                        <button id="reset-data-btn" class="control-btn reset">
                            <i class="fas fa-trash"></i> データをリセット
                        </button>
                    </div>
                    <input type="file" id="import-file-input" accept=".json" style="display: none;">
                </section>
            </div>
        `;
        
        // メインコンテナに追加
        const mainContainer = document.querySelector('main') || document.body;
        mainContainer.appendChild(dashboard);
        
        this.dashboardElement = dashboard;
    }
    
    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // ダッシュボードを閉じる
        const closeBtn = document.getElementById('close-dashboard');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // チャート設定の変更
        const chartTypeSelect = document.getElementById('chart-type-select');
        if (chartTypeSelect) {
            chartTypeSelect.addEventListener('change', (e) => {
                this.currentChartType = e.target.value;
                this.updateChart();
            });
        }
        
        const timeRangeSelect = document.getElementById('time-range-select');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.currentTimeRange = parseInt(e.target.value);
                this.updateChart();
            });
        }
        
        // データ管理ボタン
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        const importBtn = document.getElementById('import-data-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importData());
        }
        
        const resetBtn = document.getElementById('reset-data-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetData());
        }
        
        const fileInput = document.getElementById('import-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileImport(e));
        }
        
        // ESCキーでダッシュボードを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    /**
     * StatisticsManagerを設定
     * @param {StatisticsManager} statisticsManager - 統計マネージャーインスタンス
     */
    setStatisticsManager(statisticsManager) {
        this.statisticsManager = statisticsManager;
        console.log('ダッシュボードに統計マネージャーを設定しました');
    }
    
    /**
     * ダッシュボードを表示
     */
    show() {
        if (!this.statisticsManager) {
            console.warn('StatisticsManagerが設定されていません');
            return;
        }
        
        this.isVisible = true;
        this.dashboardElement.classList.remove('hidden');
        
        // 統計データを更新
        this.updateAllStatistics();
        
        // Chart.jsを動的に読み込み
        this.loadChartLibrary().then(() => {
            this.updateChart();
        });
        
        console.log('統計ダッシュボードを表示しました');
    }
    
    /**
     * ダッシュボードを非表示
     */
    hide() {
        this.isVisible = false;
        this.dashboardElement.classList.add('hidden');
        
        // チャートインスタンスを破棄
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
        
        console.log('統計ダッシュボードを非表示にしました');
    }
    
    /**
     * 全統計を更新
     */
    updateAllStatistics() {
        this.updateTotalStatistics();
        this.updateStrategyStatistics();
        this.updateWeaknessAnalysis();
    }
    
    /**
     * 総合統計を更新
     */
    updateTotalStatistics() {
        const stats = this.statisticsManager.getTotalStatistics();
        const container = document.getElementById('total-stats-grid');
        
        if (!container) return;
        
        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-gamepad"></i></div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalGames}</div>
                    <div class="stat-label">総ゲーム数</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon win"><i class="fas fa-trophy"></i></div>
                <div class="stat-content">
                    <div class="stat-value">${stats.winRate}%</div>
                    <div class="stat-label">勝率</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon money"><i class="fas fa-dollar-sign"></i></div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalWinnings >= 0 ? '+' : ''}$${stats.totalWinnings}</div>
                    <div class="stat-label">総収支</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-coins"></i></div>
                <div class="stat-content">
                    <div class="stat-value">$${stats.avgBet}</div>
                    <div class="stat-label">平均ベット</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon special"><i class="fas fa-star"></i></div>
                <div class="stat-content">
                    <div class="stat-value">${stats.blackjacks}</div>
                    <div class="stat-label">ブラックジャック</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-clock"></i></div>
                <div class="stat-content">
                    <div class="stat-value">${stats.totalHours}h</div>
                    <div class="stat-label">プレイ時間</div>
                </div>
            </div>
        `;
    }
    
    /**
     * 戦略統計を更新
     */
    updateStrategyStatistics() {
        const stats = this.statisticsManager.getStrategyStatistics();
        
        // 戦略概要
        const overviewContainer = document.getElementById('strategy-overview');
        if (overviewContainer) {
            overviewContainer.innerHTML = `
                <div class="strategy-summary">
                    <div class="summary-item">
                        <div class="summary-label">総合正解率</div>
                        <div class="summary-value accuracy-${this.getAccuracyClass(stats.accuracy)}">${stats.accuracy}%</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">総アクション数</div>
                        <div class="summary-value">${stats.totalActions}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">連続正解記録</div>
                        <div class="summary-value">${stats.streaks.best}</div>
                    </div>
                </div>
            `;
        }
        
        // 詳細分析
        const breakdownContainer = document.getElementById('strategy-breakdown');
        if (breakdownContainer) {
            breakdownContainer.innerHTML = `
                <div class="breakdown-section">
                    <h4>ハンドタイプ別正解率</h4>
                    <div class="breakdown-items">
                        <div class="breakdown-item">
                            <span class="breakdown-label">ハードハンド</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.handTypeAccuracy.hard}%"></div>
                                <span class="progress-text">${stats.handTypeAccuracy.hard}%</span>
                            </div>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">ソフトハンド</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.handTypeAccuracy.soft}%"></div>
                                <span class="progress-text">${stats.handTypeAccuracy.soft}%</span>
                            </div>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">ペア</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.handTypeAccuracy.pair}%"></div>
                                <span class="progress-text">${stats.handTypeAccuracy.pair}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="breakdown-section">
                    <h4>アクション別正解率</h4>
                    <div class="breakdown-items">
                        <div class="breakdown-item">
                            <span class="breakdown-label">ヒット</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.actionAccuracy.hit}%"></div>
                                <span class="progress-text">${stats.actionAccuracy.hit}%</span>
                            </div>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">スタンド</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.actionAccuracy.stand}%"></div>
                                <span class="progress-text">${stats.actionAccuracy.stand}%</span>
                            </div>
                        </div>
                        <div class="breakdown-item">
                            <span class="breakdown-label">ダブル</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${stats.actionAccuracy.double}%"></div>
                                <span class="progress-text">${stats.actionAccuracy.double}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * 弱点分析を更新
     */
    updateWeaknessAnalysis() {
        const stats = this.statisticsManager.getStrategyStatistics();
        const container = document.getElementById('weakness-list');
        
        if (!container) return;
        
        if (stats.topWeaknesses.length === 0) {
            container.innerHTML = `
                <div class="no-weaknesses">
                    <i class="fas fa-check-circle"></i>
                    <p>分析可能な弱点は見つかりませんでした。<br>より多くのゲームをプレイして分析精度を向上させましょう。</p>
                </div>
            `;
            return;
        }
        
        const weaknessItems = stats.topWeaknesses.map((weakness, index) => `
            <div class="weakness-item">
                <div class="weakness-rank">${index + 1}</div>
                <div class="weakness-details">
                    <div class="weakness-situation">
                        プレイヤー: ${weakness.playerValue} vs ディーラー: ${weakness.dealerUpCard}
                    </div>
                    <div class="weakness-actions">
                        あなた: <span class="action-wrong">${weakness.playerAction}</span> 
                        → 正解: <span class="action-correct">${weakness.recommendedAction}</span>
                    </div>
                    <div class="weakness-frequency">間違い回数: ${weakness.frequency}回</div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="weakness-header">
                <p>よく間違える状況を分析して、戦略改善に活用しましょう。</p>
            </div>
            <div class="weakness-items">
                ${weaknessItems}
            </div>
        `;
    }
    
    /**
     * Chart.jsライブラリを動的読み込み
     * @returns {Promise} 読み込み完了Promise
     */
    loadChartLibrary() {
        return new Promise((resolve, reject) => {
            // 既に読み込まれている場合
            if (window.Chart) {
                resolve();
                return;
            }
            
            // Chart.jsを動的に読み込み
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
            script.onload = () => {
                console.log('Chart.jsライブラリを読み込みました');
                resolve();
            };
            script.onerror = () => {
                console.error('Chart.jsライブラリの読み込みに失敗しました');
                reject();
            };
            
            document.head.appendChild(script);
        });
    }
    
    /**
     * チャートを更新
     */
    updateChart() {
        if (!window.Chart || !this.statisticsManager) return;
        
        const canvas = document.getElementById('statistics-chart');
        if (!canvas) return;
        
        // 既存のチャートを破棄
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        // データを取得
        const dailyStats = this.statisticsManager.getDailyStatistics(this.currentTimeRange);
        
        // チャートデータを準備
        const chartData = this.prepareChartData(dailyStats);
        
        // チャートを作成
        this.chartInstance = new Chart(canvas, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: this.getChartTitle()
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
    
    /**
     * チャートデータを準備
     * @param {Array} dailyStats - 日別統計データ
     * @returns {Object} Chart.js用データ
     */
    prepareChartData(dailyStats) {
        const labels = dailyStats.map(day => {
            const date = new Date(day.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });
        
        let data, borderColor, backgroundColor;
        
        switch (this.currentChartType) {
            case 'winRate':
                data = dailyStats.map(day => day.winRate);
                borderColor = '#28a745';
                backgroundColor = 'rgba(40, 167, 69, 0.1)';
                break;
            case 'strategyAccuracy':
                data = dailyStats.map(day => day.strategyAccuracy);
                borderColor = '#007bff';
                backgroundColor = 'rgba(0, 123, 255, 0.1)';
                break;
            case 'totalWinnings':
                data = dailyStats.map(day => day.totalWinnings);
                borderColor = '#ffc107';
                backgroundColor = 'rgba(255, 193, 7, 0.1)';
                break;
            case 'games':
                data = dailyStats.map(day => day.games);
                borderColor = '#17a2b8';
                backgroundColor = 'rgba(23, 162, 184, 0.1)';
                break;
            default:
                data = dailyStats.map(day => day.winRate);
                borderColor = '#28a745';
                backgroundColor = 'rgba(40, 167, 69, 0.1)';
        }
        
        return {
            labels: labels,
            datasets: [{
                data: data,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };
    }
    
    /**
     * チャートタイトルを取得
     * @returns {string} チャートタイトル
     */
    getChartTitle() {
        const titles = {
            winRate: '勝率の推移 (%)',
            strategyAccuracy: '戦略正解率の推移 (%)',
            totalWinnings: '収支の推移 ($)',
            games: 'ゲーム数の推移'
        };
        
        return titles[this.currentChartType] || '統計推移';
    }
    
    /**
     * 正解率のクラスを取得
     * @param {number} accuracy - 正解率
     * @returns {string} CSSクラス名
     */
    getAccuracyClass(accuracy) {
        if (accuracy >= 90) return 'excellent';
        if (accuracy >= 80) return 'good';
        if (accuracy >= 70) return 'average';
        return 'poor';
    }
    
    /**
     * データをエクスポート
     */
    exportData() {
        if (!this.statisticsManager) return;
        
        const data = this.statisticsManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `blackjack-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('統計データをエクスポートしました');
    }
    
    /**
     * データインポートのファイル選択を開始
     */
    importData() {
        const fileInput = document.getElementById('import-file-input');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    /**
     * ファイルインポートを処理
     * @param {Event} event - ファイル選択イベント
     */
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonData = e.target.result;
            if (this.statisticsManager.importData(jsonData)) {
                alert('データのインポートが完了しました。');
                this.updateAllStatistics();
                this.updateChart();
            } else {
                alert('データのインポートに失敗しました。ファイル形式を確認してください。');
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // ファイル選択をリセット
    }
    
    /**
     * データをリセット
     */
    resetData() {
        if (!this.statisticsManager) return;
        
        if (confirm('すべての統計データを削除しますか？この操作は元に戻せません。')) {
            this.statisticsManager.resetData();
            this.updateAllStatistics();
            this.updateChart();
            console.log('統計データをリセットしました');
        }
    }
}

// グローバルに公開
window.DashboardManager = DashboardManager;

console.log('dashboard.js が読み込まれました (Phase 5: 統計表示機能実装完了)'); 