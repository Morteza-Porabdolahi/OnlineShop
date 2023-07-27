import { axios } from "./interceptAxios";

export async function addComment(comment = {}){
  try{
    const response = await axios.post(`/media/${comment.mediaId}/comment`, comment);

    return response.data;
  }catch(err){
    console.log(err);
    return {error : err.response.data.message || err.message}
  }
}

export async function fetchProductComments(productId = ""){
  try{
    const response = await axios.get(`/media/${productId}/comment/product`);

    return response.data;
  }catch(err){
    console.log(err);
    return {error : err.response.data.message || err.message}
  }
}