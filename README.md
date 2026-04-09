# QML Style Converter — Re:Earth Visualizer Plugin

QGISのスタイル（`.qml`）を、Re:Earth VisualizerのLayer Appearance JSONに変換するプラグインです。

<img width="400" alt="スクリーンショット 2026-04-09 11 49 27" src="https://github.com/user-attachments/assets/ee9291c9-4c49-4f8d-9ac8-d55d22b7ceaf" />
<img width="400" alt="スクリーンショット 2026-04-09 12 28 11" src="https://github.com/user-attachments/assets/e20a2e81-37ee-40f7-9daa-fff9c3ec9066" />

---

## できること

QGISの「プロパティ → シンボロジ」で設定したスタイルを、Re:Earth Visualizerに貼り付けられるJSONに変換します。

| QGISのスタイル種別 | 対応状況 |
|---|---|
| 単一シンボル（Single Symbol） | ✅ |
| 分類（Categorized） | ✅ |
| 段階（Graduated） | ✅ |
| ルールベース（Rule-based） | ⚠️ 最初のルールのみ |
| ヒートマップ・点群など | ❌ 未対応 |

対応ジオメトリ：ポリゴン / ライン / ポイント

---

## 使い方

### 1. スタイルファイルを書き出す（QGIS）

1. レイヤーを右クリック → 「プロパティ」
2. 「シンボロジ」タブを開く
3. 左下の「スタイル」→「スタイルをファイルに保存...」
4. ファイル形式を **「QGISレイヤースタイルファイル (*.qml)」** で保存

### 2. 変換する（Re:Earth Visualizer）

1. プラグインをインストール（後述）
2. Widgetに `.qml` ファイルをドロップ、またはファイルを選択
3. 「変換する」をクリック
4. 生成されたJSONをコピー

### 3. Re:Earthに適用する

レイヤーのスタイル設定画面にJSONを貼り付けて適用します。

> **注意：** `reearth.layers.override()` を使った適用はリロードで消えます。永続化するにはRe:EarthのUI上でJSONを手動で貼り付けてください。

---

## インストール

1. [Releases](../../releases) から最新の `qml-style-converter.zip` をダウンロード
2. Re:Earth Visualizer → プラグイン → 「Upload Zip file from PC」
3. ダウンロードしたzipをアップロード
4. インストール後、Widgetとして追加すると使えます

> 更新時は同じIDのプラグインをアンインストールしてから再インストールしてください。

---

## 現状と今後について

このプラグインは **2026年4月時点でQGISの段階スタイル（Graduated）を中心に動作確認**しています。

分類スタイル・単一シンボルの動作確認や、ライン・ポイントジオメトリのテスト、ルールベーススタイルへの対応など、まだまだ発展の余地があります。**Re:Earthを使っているみなさんの環境で試してもらい、フィードバックや改善をぜひ一緒にしていただけると嬉しいです。**

- バグや未対応ケースを見つけたら → [Issue](../../issues) を立ててください
- 対応を追加したい → Pull Requestお待ちしています
- 「このスタイルが変換できなかった」というQMLファイルのサンプル提供も大歓迎です

---

## ファイル構成

```
qml-style-converter.zip
├── reearth.yml       # プラグインメタデータ
└── qml-converter.js  # 変換ロジック + UI
```

---

## 動作環境

- Re:Earth Visualizer（2026年4月時点の最新版で確認）
- QGIS 3.x（3.40.5-Bratislava で確認）

---

## ライセンス

MIT
