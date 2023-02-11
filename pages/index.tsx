// pages/index.ts
import axios from 'axios';
import type { NextPage } from 'next'
import { useState } from 'react';

import { prisma } from '../server/db/client'

type PostProps = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

type Props = {
  posts: PostProps[];
}

const Home: NextPage<Props> = ({ posts }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await axios.post('/api/posts', { title, content })
    console.log(res.data)
  }
  
  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", maxWidth: "400px"}}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  )
}
export default Home

export async function getServerSideProps() {
  const posts = await prisma.post.findMany()

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  }
}