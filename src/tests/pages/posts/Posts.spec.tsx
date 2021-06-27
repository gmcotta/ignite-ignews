import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import {getPrismicClient} from '../../../services/prismic';

import Posts, { getStaticProps } from '../../../pages/posts';

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'Post excerpt',
    updatedAt: '25 de junho de 2021',
  },
  {
    slug: 'my-new-post-2',
    title: 'My New Post 2',
    excerpt: 'Post excerpt 2',
    updatedAt: '26 de junho de 2021',
  },
];

jest.mock('../../../services/prismic');

describe('Posts Page', () => {
  it('should render correctly', () => {
    render(
      <Posts posts={posts} />
    );

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("My New Post 2")).toBeInTheDocument();
  });

  it('should load initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [{ type: 'heading', text: 'My New Post' }],
              content: [{ type: 'paragraph', text: 'Post excerpt' }],
            },
            last_publication_date: '06-25-2021',
          },
          {
            uid: 'my-new-post-2',
            data: {
              title: [{ type: 'heading', text: 'My New Post 2' }],
              content: [{ type: 'paragraph', text: 'Post excerpt 2' }],
            },
            last_publication_date: '06-26-2021',
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(expect.objectContaining({
      props: {
        posts,
      }
    }));
  });
});