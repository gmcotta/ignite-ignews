import { render, screen } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { stripe } from '../../services/stripe';

import Home, { getStaticProps } from '../../pages/index';

jest.mock('next-auth/client');
jest.mock('../../services/stripe');

describe('Home Page', () => {
  it('shall render correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <Home product={{ priceId: 'price-id', amount: 'R$ 10,00' }} />
    );

    expect(screen.getByText(/R\$ 10,00/i)).toBeInTheDocument();
  });

  it('shall load initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})