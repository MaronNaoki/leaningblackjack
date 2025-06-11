/**
 * ブラックジャック練習アプリケーション メインスクリプト
 * Phase 6: UIロジックリファクタリング版
 */

// アプリケーション状態
let game = null;
let uiManager = null;
let animationManager = null;
let statisticsManager = null;
let dashboardManager = null;

// UI要素キャッシュ
const UI = {};

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMコンテンツが読み込まれました。アプリケーションを初期化します。');
    initializeApp();
});

/**
 * アプリケーション初期化
 */
function initializeApp() {
    console.log('ブラックジャックアプリケーションを初期化中...');
    
    try {
        // UIマネージャーを初期化 (ボタン生成、要素キャッシュ、イベントリスナ設定も内部で行う)
        uiManager = new UIManager();
        
        // 統計マネージャーを初期化
        statisticsManager = new StatisticsManager();
        
        // ダッシュボードマネージャーを初期化
        dashboardManager = new DashboardManager(statisticsManager);
        
        // ゲームインスタンスを作成し、各種マネージャーを連携させる
        game = new BlackjackGame(uiManager, statisticsManager);
        
        // UIマネージャーにゲームインスタンスを設定
        uiManager.setGame(game);
        
        // グローバルに公開（デバッグや他スクリプトからのアクセス用）
        window.game = game;
        window.uiManager = uiManager;
        window.animationManager = uiManager.animationManager; // UIManagerから取得
        window.statisticsManager = statisticsManager;
        window.dashboardManager = dashboardManager;
        
        // 初期状態でUIを更新
        uiManager.updateDisplay(game.getGameState());
        
        console.log('✅ アプリケーションが正常に初期化されました (Phase 6: UIリファクタリング版)');
        
    } catch (error) {
        console.error('❌ アプリケーション初期化エラー:', error);
        displayError('アプリケーションの初期化に失敗しました。ページを再読み込みしてください。');
    }
}

/**
 * エラーメッセージを画面に表示
 * @param {string} message 
 */
function displayError(message) {
    const errorDisplay = document.createElement('div');
    errorDisplay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        background-color: #ff3b3b;
        color: white;
        text-align: center;
        font-size: 1.2rem;
        z-index: 10000;
        border-bottom: 2px solid #a00;
    `;
    errorDisplay.textContent = message;
    document.body.prepend(errorDisplay);
}

console.log('main.js が読み込まれました (Phase 6: UIリファクタリング版)'); 