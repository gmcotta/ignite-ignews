import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getSession } from "next-auth/client";

import {getPrismicClient} from '../../../services/prismic';

import Post, { getServerSideProps } from '../../../pages/posts/[slug]';

const post = {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>Post content</p>',
    updatedAt: '25 de junho de 2021',
};

jest.mock('next-auth/client');
jest.mock('../../../services/prismic');

describe('Single Post Page', () => {
  it('should render correctly', () => {
    render(
      <Post post={post} />
    );

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
  });

  it('should redirect to home if user has no subscription', async () => {
    const slug = 'my-new-post'
    
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null
    });

    const response = await getServerSideProps({
      params: {
        slug,
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining(
          {
            destination: `/posts/preview/${slug}`,
          }
        )
      })
    );
  });

  it('should load initial data', async () => {
    const slug = 'my-new-post';

    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    });

    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '06-25-2021',
      })
    } as any);

    const response = await getServerSideProps({
      params: {
        slug,
      },
    } as any);

    expect(response).toEqual(expect.objectContaining({
      props: {
        post,
      }
    }));
  });
});