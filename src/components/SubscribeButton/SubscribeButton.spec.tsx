import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import SubscribeButton from '.';

jest.mock('next-auth/client');
jest.mock('next/router');

describe('<SubscribeButton />', () => {
  it('should render correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    );
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('should redirect to sign in when user is not authenticated', () => {
    const signInMocked = mocked(signIn);
    signInMocked.mockImplementationOnce(jest.fn());

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('should redirect to posts page when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const pushFnMocked = jest.fn();
    useRouterMocked.mockReturnValue({
      push: pushFnMocked
    } as any);

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{ 
      user: {
        name: 'John Doe',
        email: 'johndoe@test.com',
        image: 'imgUrl'
      },
      expires: 'mock expires',
      activeSubscription: true,
    }, false]);

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(pushFnMocked).toHaveBeenCalledWith('/posts');
  })

});
