import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';

import SignInButton from '.';

jest.mock('next-auth/client');

describe('<SignInButton />', () => {
  describe('should render correctly', () => {
    it('when user is not authenticated', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockReturnValueOnce([null, false]);

      render(
        <SignInButton />
      );
    
      expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    });
    
    it('when user is authenticated', () => {
      const useSessionMocked = mocked(useSession);
      useSessionMocked.mockReturnValueOnce([{ 
        user: {
          name: 'John Doe',
          email: 'johndoe@test.com',
          image: 'imgUrl'
        },
        expires: 'mock expires'
      }, false]);

      render(
        <SignInButton />
      );
    
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});