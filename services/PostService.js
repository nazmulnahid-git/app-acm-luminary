import { cloudinary } from "../lib/cloudinary";
import { supabase } from "../lib/supabase";

export const getPost = async (limit = 10) => {
  try {
    const {data, error} = await supabase
    .from('posts')
    .select(`
      *, users (id, name, profile_img)
      `)
    .order('created_at', {ascending: false})
    .limit(limit);
    if (error) {
      return {success: false};
    }
    return {success: true, data};
  } catch (error) {
    return {success: false};
  }
}

export const createOrUpdatePost = async (post) => {
  try {
    if (post.file && typeof post.file === 'object') {
      let url;
      if (post.file.type == 'image') {
        url = await cloudinary.uploadImage(post.file.base64);
        if (!url) return {success: false};
      } else if (post.file.type == 'video') {
        url = await cloudinary.uploadVideo(post.file.uri);
        if (!url) return {success: false}; 
      }
      post.file = url;
    }
    console.log(post);
    const {data, error} = await supabase.from('posts').upsert(post).select().single();
    if (error) {
      return {success: false};
    }
    return {success: true, data};
  } catch (error) {
    return {success: false};
  }
}

export const likePost = async (like) => {
  try {
    const {data, error} = await supabase
    .from('likes')
    .insert(like)
    .select()
    .single();

    if (error) {
      return {success: false};
    }
    return {success: true, data};
  } catch (error) {
    return {success: false};
  }
}

export const removeLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from('postLikes')
      .delete()
      .eq('userId', userId)
      .eq('postId', postId);
    if (error) {
      return {success: false};
    }
    return {success: true, data};
  } catch (error) {
    return {success: false};
  }
}

