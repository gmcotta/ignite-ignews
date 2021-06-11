import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>10 de junho de 2021</time>
            <strong>The Plan for React 18</strong>
            <p>The React team is excited to share a few updates: We’ve started work on the React 18 release...</p>
          </a>
          <a href="#">
            <time>10 de junho de 2021</time>
            <strong>The Plan for React 18</strong>
            <p>The React team is excited to share a few updates: We’ve started work on the React 18 release...</p>
          </a>
          <a href="#">
            <time>10 de junho de 2021</time>
            <strong>The Plan for React 18</strong>
            <p>The React team is excited to share a few updates: We’ve started work on the React 18 release...</p>
          </a>
          <a href="#">
            <time>10 de junho de 2021</time>
            <strong>The Plan for React 18</strong>
            <p>The React team is excited to share a few updates: We’ve started work on the React 18 release...</p>
          </a>
          <a href="#">
            <time>10 de junho de 2021</time>
            <strong>The Plan for React 18</strong>
            <p>The React team is excited to share a few updates: We’ve started work on the React 18 release...</p>
          </a>
        </div>
      </main>
    </>
  );
}