export default async function fetchPokemonData(pokemon) {
  try {
    // pokeAPIからデータを取得して変数に格納
    const pokeData = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );

    // ステータスコードが200番台以外の場合はエラーを投げる
    if (!pokeData.ok) {
      throw new Error(
        `エラーが発生しました。ステータスコード: ${pokeData.status}`
      );
    }
    // pokeDataのJSON形式をオブジェクトに変換
    const data = await pokeData.json();

    // APIから取得したオブジェクトを処理する項目

    console.log(data);

    //ここまで

    // pokeAPIから種族データを取得（日本語名など）
    const speciesDataResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon}`
    );
    if (!speciesDataResponse.ok) {
      throw new Error(
        `種族データの取得中にエラーが発生しました。ステータスコード: ${speciesDataResponse.status}`
      );
    }
    const speciesData = await speciesDataResponse.json();

    //speciesDataから日本語名を探す
    const japaneseName = speciesData.names.find(
      (name) => name.language.name === 'ja'
    );

    // HTML要素を取得
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonName = document.getElementById('pokemon-name');

    // APIデータから画像URLと名前を取得
    // const imageUrl = data.sprites.front_default; // ドット絵
    // または公式アートワーク
    const imageUrl = data.sprites.other['official-artwork'].front_default;
    const name = data.name;

    // HTML要素にデータを代入して表示
    pokemonImage.src = imageUrl;
    pokemonImage.alt = `${japaneseName.name}の画像`;
    pokemonImage.style.display = 'block'; // 画像を表示
    pokemonName.textContent = ` ${japaneseName.name}`;

    console.log('データが正常に取得され、日本語名で表示されました。');
  } catch (err) {
    // エラーが発生した場合はcatch()でエラー内容をコンソールに表示
    console.log(err);

    const container = document.getElementById('pokemon-info-container');
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// fetchPokemonData(pokeNumber);

//　ここからが本番です。
// fetch()を使ってpokeAPIからデータを取得できたので、
// 取得したデータをHTMLに反映させていきましょう。
// 例えば、ポケモンの名前や画像、タイプなどを表示することができます。
// さらに、ユーザーがポケモンの名前やIDを入力して検索できるようにすることも可能です。
// これにより、インタラクティブなポケモン図鑑のようなものを作成できます。

// 例えば、ボタンを押すとランダムなポケモンが表示されるようになったり、
// 検索バーに名前やIDを入力して特定のポケモンを表示できるようになったりします。

// そのためにはどんなHTML要素が必要か、どのようにJavaScriptで操作するかを考え、実装していきましょう。
