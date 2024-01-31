import { CardPost } from "@/components/CardPost"
import logger from "@/logger"

import styles from './page.module.css'
import Link from "next/link"
import db from "@/modules/db";

async function getAllPosts(page, q) {
  const perPage = 6;
  const skip = (page - 1) * perPage;

  const whereClause = {};

  if (q) {
    whereClause.title = {
      contains: q,
      mode: 'insensitive',
    };
  }

  try {
    // Usa o mesmo filtro where tanto para count quanto para findMany
    const totalPosts = await db.post.count({ where: whereClause });
    const totalPages = Math.ceil(totalPosts / perPage);

    const prev = page > 1 ? page - 1 : null;
    const next = page < totalPages ? page + 1 : null;

    const posts = await db.post.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
      where: whereClause,
    });

    return { data: posts, prev, next, totalPosts, totalPages };
  } catch (error) {
    logger.error('Ops, alguma coisa correu mal', error);
    return {
      posts: []
    };
  }
}

export default async function Home({ searchParams }) {
  const currentPage = searchParams?.page || 1
  const q = searchParams?.q
  const { data: posts, prev, next } = await getAllPosts(parseInt(currentPage), q)
  return (
    <main className={styles.grid}>
      {posts.map(post => <CardPost key={post.id} post={post} />)}
      <div className={styles.links}>
        {prev && <Link href={{ pathname: '/', query: { page: prev, q } }}>Página anterior</Link>}
        {next && <Link href={{ pathname: '/', query: { page: next, q } }}>Próxima página</Link>}
      </div>
    </main>
  )
}
