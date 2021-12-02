import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import NextLink from 'next/link';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState('');

  useEffect(() => {
    setPosts(postsPagination.results);
    setNextPage(postsPagination.next_page);
  }, [postsPagination.results, postsPagination.next_page]);

  function handlePagination() {
    fetch(nextPage)
      .then(res => res.json())
      .then(data => {
        const formattedData: Array<Post> = data.results.map((post: Post) => {
          return {
            uid: post.uid,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
            first_publication_date: post.first_publication_date,
          };
        });
        setPosts([...posts, ...formattedData]);
        setNextPage(data.next_page);
      });
  }

  return (
    <main className={commonStyles.container}>
      <section className={styles.content}>
        {posts &&
          posts.map(post => {
            return (
              <article key={post.uid} className={styles.post}>
                <NextLink href={`/post/${post.uid}`}>
                  <a>
                    <h1>{post.data.title}</h1>
                  </a>
                </NextLink>
                <h2>{post.data.subtitle}</h2>
                <div className={styles.info}>
                  <div>
                    <FiCalendar size={20} />
                    <p>
                      {format(
                        new Date(post.first_publication_date),
                        'dd MMM yyyy',
                        {
                          locale: ptBR,
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <FiUser size={20} />
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </article>
            );
          })}
        {nextPage && (
          <button type="button" onClick={handlePagination}>
            Carregar mais posts
          </button>
        )}
      </section>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: post.first_publication_date,
    };
  });
  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};
