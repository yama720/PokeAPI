import fetchPokemonData from './modules/pokeAPI.js';
//　引数にポケモンの名前またはIDを指定して関数を呼び出せばそのポケモンのデータが取得できます。
// fetchPokemonData(25);

// 引数でポケモンのデータを呼び出しているため、
// 数値や名前で指定すると、固定のポケモンしか表示されない。
// なので、この引数を使って変えられるようにしないと、ポケモンの切り替えができない。
// それをするためにどうしたらいいのかも企画設計で考えてみる。

// --------------------------------------------------------
// ポケモンの図鑑番号ピックアップ
const pokemonList = [
  6, 25, 40, 94, 132, 255, 258, 328, 334, 384, 405, 448, 570, 704, 922,
];

// ランダムに表示させる際の下準備
const randomIndex = Math.floor(Math.random() * pokemonList.length);
//ランダム処理後のピックアップ
const randomPokemon = pokemonList[randomIndex];

fetchPokemonData(randomPokemon);

// --------------------------------------------------------
// NewsAPIをインポート
import getNews from './modules/newsAPI.js';
getNews();

// --------------------------------------------------------
// 今日の日付
const date = new Date();
const [month, day, year] = [
  date.getMonth() + 1,
  date.getDate(),
  date.getFullYear(),
];

const dayDate = `${year}年${month}月${day}日`;
console.log(dayDate);

const todayDate = document.getElementById('today');
if (todayDate) {
  todayDate.textContent = dayDate;
}

// --------------------------------------------------------
// ラッキーカラー

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('colorBtn');
  const displayColor = document.getElementById('display-color');
  const pokemonContainer = document.getElementById('pokeColor-results');

  const colorArray = [
    { ja: '赤', en: 'red' },
    { ja: '黄', en: 'yellow' },
    { ja: '緑', en: 'green' },
    { ja: '青', en: 'blue' },
    { ja: '紫', en: 'purple' },
    { ja: '桃', en: 'pink' },
    { ja: '白', en: 'white' },
    { ja: '黒', en: 'black' },
    { ja: '灰', en: 'gray' },
    { ja: '茶', en: 'brown' },
  ];

  btn.addEventListener('click', async function () {
    const randomColor = Math.floor(Math.random() * colorArray.length);
    const randomElement = colorArray[randomColor];

    // ラッキーカラーの文字を span タグで囲み、クラスとスタイルを追加する
    const colorHtml = `<span class="color-highlight" style="color: ${randomElement.en};">${randomElement.ja}</span>`;

    // 画面は日本語名を表示
    // displayColor.textContent = `今日のラッキーカラーは「　${randomElement.ja}色　」です！`;
    displayColor.innerHTML = `今日のラッキーカラーは <br>「 ${colorHtml}色 」です！`;

    //メッセージを表示
    displayColor.classList.add('is-visible');

    // アニメーションシーケンスの実行 この中でfetchPokemonImagesByColor が呼び出される
    await runColorAnimationSequence(randomElement.en, 5); // await でアニメーション完了を待つ

    // 英語名を使ってAPIからデータを取得し、ポケモンを表示
    // fetchPokemonImagesByColor(randomElement.en, 5);
  });

  // アニメーション処理を追加
  async function runColorAnimationSequence(colorName, count) {
    // const pokemonContainer = document.getElementById('pokeColor-results');　//上で定義済み
    pokemonContainer.innerHTML = ''; // 既存のポケモンやローディングをクリア

    // プレースホルダーの準備
    const placeholderDiv = document.createElement('div');

    placeholderDiv.id = 'animation-placeholder';
    placeholderDiv.innerHTML =
      '<img id="anim-img" src="" alt="アニメーション画像">';
    pokemonContainer.appendChild(placeholderDiv);
    const animImg = document.getElementById('anim-img');

    // 1枚目の画像を表示
    animImg.src = './images/monsterball01.png';
    animImg.style.display = 'block';
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 3秒待機

    // 2枚目の画像に切り替え
    animImg.src = './images/monsterball02.png';
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 2秒待機

    // 弾けるエフェクトをかけて画像を消す
    // animImg.classList.add('bursting');

    // 親のdiv要素にクラスを追加する
    placeholderDiv.classList.add('bursting');

    //エフェクトが終わるまで待機 (CSSアニメーションが0.5秒、500ms待つ)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // プレースホルダーを完全に削除
    pokemonContainer.innerHTML = '';

    // ポケモンAPIの取得と表示
    await fetchPokemonImagesByColor(colorName, count); // fetchPokemonImagesByColorを呼び出し
  }

  // pokeAPIからピックアップ
  async function fetchPokemonImagesByColor(colorName, count = 1) {
    try {
      const colorUrl = `https://pokeapi.co/api/v2/pokemon-color/${colorName}`;
      const colorResponse = await fetch(colorUrl);

      if (!colorResponse.ok) {
        throw new Error(`APIエラー: ${colorResponse.status}`);
      }

      const colorData = await colorResponse.json();

      // ポケモンリストをシャッフルし、指定した数に絞り込む
      const shufflList = colorData.pokemon_species.sort(
        () => 0.5 - Math.random()
      );
      const limitedList = shufflList.slice(0, count);

      // 表示前にコンテナをクリア
      // pokemonContainer.innerHTML = ''; //なくてもok

      // for...of ループで一つずつデータを取得後に表示
      for (const species of limitedList) {
        const speciesResponse = await fetch(species.url);
        const speciesData = await speciesResponse.json();

        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${speciesData.id}`;
        const pokemonResponse = await fetch(pokemonUrl);
        const pokemonData = await pokemonResponse.json();

        const imageUrl =
          pokemonData.sprites.other['official-artwork'].front_default;
        const pokemonName =
          speciesData.names.find((name) => name.language.name === 'ja')?.name ||
          pokemonData.name;

        const pokemonDiv = document.createElement('div');
        pokemonDiv.className = 'pokemon-card';
        pokemonDiv.innerHTML = `
            <img src="${imageUrl}" alt="${pokemonName}" >
            <p>${pokemonName}</p>
          `;
        pokemonContainer.appendChild(pokemonDiv);
      }
    } catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
      pokemonContainer.innerHTML = '<p>ポケモンの取得に失敗しました。</p>';
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const toTopBtn = document.getElementById('to-top-btn');

  //スクロール時にボタンの表示/非表示を切り替える
  window.addEventListener('scroll', () => {
    // 100ピクセル以上スクロールしたらボタンを表示
    if (window.scrollY > 100) {
      toTopBtn.style.display = 'block';
    } else {
      toTopBtn.style.display = 'none';
    }
  });

  //クリック時にトップへスムーズスクロールする
  toTopBtn.addEventListener('click', (e) => {
    // aタグのデフォルト動作（急なジャンプ）を防止
    e.preventDefault();

    // スムーズにページトップへスクロール
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // スムーズスクロールを有効にする
    });
  });
});
