// @ts-check

/**
 *  @typedef Post
 *  @property {string} id
 *  @property {string} title
 *  @property {string} content
 */

// /** @type {Post[]}*/
// const testPost = {
//     id: 'test id',
//     title: 'test title',
//     content: 'test content',
// }

// /** @type {Post[]}*/
// const posts = [{
//     id: 'first_post_id',
//     title: 'first_post title',
//     content: 'first_post content',
//   },
//   {
//     id: 'second_post id',
//     title: 'second_post_title',
//     content: 'secont_post content'
//   },

// ]

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST'} method
 * @property {(matches: string[], body: Object.<string, *> | undefined) => Promise<APIResponse>} callback
 */


// json 파일을 데이터베이스로 활용해볼거 / 테스트중
// async 함수이기때문에 아래처럼 씀
// database.json 의 데이터를 활용
/**@returns {Promise<Post[]>} */
const fs = require('fs')
const DB_JSON_FILENAME = 'database.json'

async function getPosts() {
  const json = await fs.promises.readFile(DB_JSON_FILENAME, 'utf-8');
  return JSON.parse(json).posts
}

/**
 * @param {Post []} posts
 */
async function savePosts(posts){
  const content = {
    posts,
  }

 await fs.promises.writeFile(DB_JSON_FILENAME,  JSON.stringify(content), 'utf-8')

}

/** @type {Route[]} */
const routes = [{
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      statusCode: 200,
      // body: posts,

      // 아래는 database.json 으로 데이터넘겨와봄
      body: await getPosts(),
    }),
  },

  {
    url: /^\/posts\/([a-zA-z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1]
      if (!postId) {
        return {
          statusCode: 404,
          body: 'Not found'
        }
      }

      const posts =  await getPosts()
      const post = posts.find((/** @type {{ id: string; }} */ _post) => _post.id === postId)

      if (!post) {
        return {
          statusCode: 404,
          body: 'Not found'
        }
      }

      return {
        statusCode: 200,
        body: posts
      }

    },
  },

  // 새로운 POST를 만드는 API
  {
    url: /^\/posts$/,
    method: 'POST',
    callback: async (_, body) => {

      if (!body) {
        return {
          statusCode: 400,
          body: 'Ill-formed json'
        }
      }
      /** @type {string} */
      const title = body.title
      const newPost = {
        id: title.replace(/\$/g, '_'),
        title,
        content: body.content,
      }
      const posts =await getPosts()
      posts.push(newPost)
      savePosts(posts)

      return {
        statusCode: 200,
        body: newPost,
      }
    },
  },

]

module.exports = {
  routes,
}