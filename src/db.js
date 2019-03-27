const users = [
  {
    id: '1',
    name: 'Erik',
    email: 'erik@test.com',
    age: 39
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@test.com'
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@test.com'
  }
];

let posts = [
  {
    id: '1',
    title: 'foo',
    body: 'subtle art of foo',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'bar',
    body: 'closely related to foo',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'baz',
    body: 'quite similar to bar almost...',
    published: true,
    author: '2'
  }
];

let comments = [
  {
    id: '1',
    text: 'wonderful idea',
    author: '3',
    post: '1'
  },
  {
    id: '2',
    text: 'thanks for the info!',
    author: '2',
    post: '1'
  },
  {
    id: '3',
    text: 'you are definitely ready, go for it!!!',
    author: '1',
    post: '3'
  },
  {
    id: '4',
    text: 'What is love?',
    author: '3',
    post: '2'
  }
];

const db = {
  users,
  posts,
  setPosts(updatedPosts) {
    posts = updatedPosts;
  },
  comments,
  setComments(updatedComments) {
    comments = updatedComments;
  }
};

export default db;
