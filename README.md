# Habit Core

Habit Coreは、毎日の習慣をシンプルに記録するPWA形式の習慣化アプリです。HTML/CSS/JavaScriptのみで実装し、データはブラウザのlocalStorageに保存します。

## 機能

- 習慣の追加
- 習慣の削除
- 今日のチェック
- 今日の達成率表示
- 連続達成日数表示
- localStorage保存
- PWA対応
- スマホ縦画面向けUI

## ファイル構成

- `index.html`: アプリ画面
- `styles.css`: スタイル
- `app.js`: 習慣管理ロジック
- `manifest.json`: PWA設定
- `service-worker.js`: オフラインキャッシュ
- `icons/`: PWAアイコン

## iPhone Safariでホーム画面に追加する手順

1. iPhoneのSafariで公開URLを開きます。
2. 画面下部の共有ボタンをタップします。
3. メニューから「ホーム画面に追加」を選びます。
4. 名前が「Habit Core」になっていることを確認します。
5. 右上の「追加」をタップします。

ホーム画面のアイコンから起動すると、通常のアプリに近い表示で使えます。

## 開発メモ

静的ファイルのみで動作するため、GitHub Pagesなどの無料静的ホスティングで公開できます。
