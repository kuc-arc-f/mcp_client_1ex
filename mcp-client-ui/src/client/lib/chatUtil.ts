const chatUtil = {

  downloadTextFile: async function(filename, text){
    try{
      const blob = new Blob([text], { type: 'text/plain' }); // テキストデータをBlobに変換
      const url = URL.createObjectURL(blob); // BlobからURLを生成
  
      const a = document.createElement('a'); // ダウンロード用のリンクを作成
      a.href = url;
      a.download = filename; // ファイル名を設定
      a.style.display = 'none';
  
      document.body.appendChild(a); // リンクをDOMに追加
      a.click(); // リンクをクリックしてダウンロードを開始
      document.body.removeChild(a); // リンクを削除
      URL.revokeObjectURL(url); // メモリを解放
    }catch(e){
      console.error(e);
    }

  },

  getModelName: function(key){
    try{
      let ret = "";
      const target = localStorage.getItem(key);
      if(target){
        ret = target;
      }
      return ret;
    }catch(e){
      console.error(e);
    }

  },

}
export default chatUtil;