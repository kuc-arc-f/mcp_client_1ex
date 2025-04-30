//let API_BASE = "";

const ApiUtil = {

  post: async function(path: string, item: any): Promise<any>
  {
    const retObj = {ret: 500, data: {}}
    try{
      const res = await window.myPostExternelApi.postExternelApi(path, item);
      //console.log(res);
      return res;
    }catch(e){
      console.error(e);
      throw new Error('Error, post')
    }
  },

};
export default ApiUtil;