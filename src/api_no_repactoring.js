// @ts-check
// Formatting, Linting, Type Checking
// Formatting: Prettier
// Linting : ESLint
// Type checking: TypeScript

// const http = require('http');

// const server = http.createServer((req,res)=> {
//     res.statusCode = 200
//     res.end('hello!')
// })

// const PORT = 4000
// server.listen(PORT, ()=>{
//     console.log(`The server is listening at port == ${PORT}`)
// })

const http = require('http')



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

/** @type {Post[]}*/
const posts = [{
    id: 'first_post_id',
    title: 'first_post title',
    content: 'first_post content',
  },
  {
    id: 'second_post id',
    title: 'second_post title',
    content: 'secont_post content'
  },

]
/**
 *  Post
 * 
 * GET /posts
 * GET /posts/:id
 * POST /posts
 */
const server = http.createServer((req, res) => {

  const POSTS_ID_REGEX = /^\/posts\/([a-zA-z0-9-_]+)$/

  const postIdRegexResult = (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined

  if (req.url === '/posts' && req.method === 'GET') {
    // 전체 포스트읽기
    const result = {
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
      })),
      totalcount: posts.length
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(result))

  } else if (postIdRegexResult && req.method === 'GET') { // GET /posts/:id
    // @ts-ignore
    const postId = postIdRegexResult[1]

    const post = posts.find(post => post.id === postId)

     // 포스트 하나 읽기
    if (post) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(post))
    } else {
      res.statusCode = 404
      res.end('Post not found')
    }

    res.statusCode = 200
    res.end('Reading a post')
    // 포스트 생성하기
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.setEncoding('utf-8')
    req.on('data', (data) => {
      /**
       *  @typedef CreatePostBody
       *  @property {string} title
       *  @property {string} content
       */

      /** @type {CreatePostBody} */
      const body = JSON.parse(data)
      console.log(body)
      posts.push({
        id: body.title.toLocaleLowerCase().replace(/\s/g,'_'),
        title: body.title,
        content: body.content,
      })
    })

    res.statusCode = 200
    res.end('Creating post')
  } else {
    res.statusCode = 400
    res.end('Not Found')
  }


  res.statusCode = 200
  res.end('Hello!');


})

const PORT = 4000

server.listen(PORT, () => {
  console.log(` Server ${PORT}`)
})