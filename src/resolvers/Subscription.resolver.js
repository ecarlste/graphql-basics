export default {
  postEvent: {
    subscribe(_, _1, { pubsub }) {
      return pubsub.asyncIterator('post');
    }
  },
  comment: {
    subscribe(_, { postId }, { db, pubsub }) {
      const postToSub = db.posts.find(post => post.id === postId && post.published);

      if (!postToSub) {
        throw new Error('Post specified not found or not published');
      }

      return pubsub.asyncIterator(`comment ${postId}`);
    }
  }
};
