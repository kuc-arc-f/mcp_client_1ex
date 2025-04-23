
import { cli_3use_add_execute } from "./cli-3use-add";
import { cli_4file_execute } from "./cli-4file";

const main = async function(){
  try{
    await cli_3use_add_execute(); 
    await cli_4file_execute(); 
  }catch(e){console.error(e);}  
}
