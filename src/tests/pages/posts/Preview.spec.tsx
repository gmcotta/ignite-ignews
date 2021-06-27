import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getSession, useSession } from "next-auth/client";
import { useRouter } from 'next/router';

import {getPrismicClient} from '../../../services/prismic';

import PostPreview, { 
  getStaticPaths,
  getStaticProps 
} from '../../../pages/posts/preview/[slug]';

const post = {
    slug: 'my-new-post',
    title: 'My New Post',
    content: '<p>Post content</p>',
    updatedAt: '25 de junho de 2021',
};

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../../services/prismic');

describe('Single Post Page', () => {
  it('should render correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <PostPreview post={post} />
    );

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it('should redirect to post page when user has subscription', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{ 
      activeSubscription: true,
    }, false]);

    const useRouterMocked = mocked(useRouter);
    const pushFnMocked = jest.fn();
    useRouterMocked.mockReturnValue({
      push: pushFnMocked
    } as any);

    render(
      <PostPreview post={post} />
    );

    expect(pushFnMocked).toHaveBeenCalledWith(`/posts/${post.slug}`);
  });

  it('should load initial data', async () => {
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

    const response = await getStaticProps({
      params: {
        slug: post.slug,
      },
    } as any);

    expect(response).toEqual(expect.objectContaining({
      props: {
        post,
      }
    }));
  });

  it('should get static paths', async () => {
    const response = await getStaticPaths({});

    expect(response).toEqual(expect.objectContaining({
        paths: [],
        fallback: 'blocking',
    }))
  })
});
