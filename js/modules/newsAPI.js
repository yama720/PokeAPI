// NEWSDATA.IOの取得
export default async function getNews() {
  try {
    const apiUrl =
      'https://newsdata.io/api/1/latest?country=jp&category=Domestic&apikey=pub_67a33c31a4ef432f92645703f8633a03';

    const response = await fetch(apiUrl);
    const newsData = await response.json();

    if (!response.ok) {
      throw new Error(
        `ネットワークエラー: ステータスコード ${response.status}`
      );
    }

    // APIが返したエラーを確認
    if (newsData.status === 'error') {
      throw new Error(
        `APIエラー: ${newsData.results.message || '不明なエラー'}`
      );
    }

    return newsData.results;
  } catch (error) {
    // エラー内容をHTMLに表示
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
      newsContainer.innerHTML = `<p style="color:red;">ニュースの取得に失敗しました。</p>`;
    }
    return null;
  }
}

getNews();

// APIからピックアップ
async function displayNews() {
  const newsResults = await getNews();

  // HTMLの表示領域を取得
  const newsContainer = document.getElementById('news-container');

  if (newsResults && newsResults.length > 0) {
    const articlesToShow = Math.min(newsResults.length, 5); //記事の数調整する(制限くるから一旦1)

    // 既存の内容をクリア
    newsContainer.innerHTML = '';

    for (let i = 0; i < articlesToShow; i++) {
      const article = newsResults[i];
      const title = article.title;
      const link = article.link;

      // ニュース記事ごとのHTML要素を生成
      const articleDiv = document.createElement('div');
      articleDiv.innerHTML = `
        <h3>${title}</h3>
        <p><a href="${link}" target="_blank">記事を読む</a></p>
        <hr> `;

      // 生成した要素をコンテナに追加
      newsContainer.appendChild(articleDiv);
    }
  } else if (newsResults !== null) {
    // newsResultsがnullでない場合にのみ実行
    newsContainer.innerHTML = '<p>ニュースデータがありませんでした。</p>';
  }
}

displayNews();
