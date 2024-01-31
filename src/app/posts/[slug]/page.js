import logger from "@/logger"
import { remark } from 'remark';
import html from 'remark-html';
import styles from './page.module.css'
import { CardPost } from "@/components/CardPost";
import { redirect } from "next/navigation";
import db from "@/modules/db";

async function getPostBySlug(slug) {

    try {

        const post = await db.post.findFirst({
            where: { slug: slug },
            include: { author: true }
        });

        if (!post) {
            redirect('/not-found')
        }

        // await new Promise(resolve => setTimeout(resolve, 5000));

        logger.info('Posts obtidos com sucesso');

        const processedContent = await remark()
            .use(html)
            .process(post.markdown);
        const contentHtml = processedContent.toString();

        post.markdown = contentHtml

        return post;
    } catch (error) {
        logger.error('Ops, alguma coisa correu mal', error);
        return [];
    }

}

const PagePost = async ({ params }) => {
    const post = await getPostBySlug(params.slug)
    return (<div>
        <CardPost post={post} highlight />
        <h3 className={styles.subtitle}>Código:</h3>
        <div className={styles.code}>
            <div dangerouslySetInnerHTML={{ __html: post.markdown }} />
        </div>
    </div>)
}

export default PagePost