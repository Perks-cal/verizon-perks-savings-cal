import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App'; 

describe('App Component', () => {
  const mockPerksData = [
    { id: 1, name: "Disney+ Hulu ESPN+ with Ads", standalonePrice: 14.99, verizonPerkPrice: 10.00 },
    { id: 2, name: "Netflix & Max with Ads", standalonePrice: 16.99, verizonPerkPrice: 10.00 },
    { id: 3, name: "Apple One", standalonePrice: 19.95, verizonPerkPrice: 15.00 },
    { id: 4, name: "100 GB Mobile Hotspot", standalonePrice: 20.00, verizonPerkPrice: 10.00 },
  ];

 
  let fetchSpy;
  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPerksData),
      })
    );
  });


  afterEach(() => {
    fetchSpy.mockRestore(); 
  });

  // Test 1: Renders loading state initially
  test('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading perks data.../i)).toBeInTheDocument();
  });

  // Test 2: Renders main content after loading
  test('renders main content after data loads', async () => {
    render(<App />);
    await waitFor(() => expect(screen.queryByText(/Loading perks data.../i)).not.toBeInTheDocument());

    expect(screen.getByText(/Verizon Perks Savings Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Estimated Monthly Costs & Savings/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose Your Perks/i)).toBeInTheDocument();
  });

  // Test 3: Displays perks after data loads
  test('displays perks after data loads', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i)).toBeInTheDocument());

    expect(screen.getByLabelText(/Netflix & Max with Ads/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apple One/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/100 GB Mobile Hotspot/i)).toBeInTheDocument();
  });

  // Test 4: Calculates totals correctly when one perk is selected
  test('calculates totals correctly when one perk is selected', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i)).toBeInTheDocument());

    const disneyPerkCheckbox = screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i);
    await act(async () => {
      fireEvent.click(disneyPerkCheckbox);
    });

    // Use getByTestId for unique elements
    await waitFor(() => {
      expect(screen.getByTestId('original-total')).toHaveTextContent('$14.99');
      expect(screen.getByTestId('verizon-total')).toHaveTextContent('$10.00');
      expect(screen.getByTestId('total-savings')).toHaveTextContent('$4.99');
    });
  });

  // Test 5: Calculates totals correctly when two perks are selected (triggers $10 discount)
  test('calculates totals correctly when two perks are selected', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i)).toBeInTheDocument());

    const disneyPerkCheckbox = screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i);
    const netflixPerkCheckbox = screen.getByLabelText(/Netflix & Max with Ads/i);
    
    await act(async () => {
      fireEvent.click(disneyPerkCheckbox);
      fireEvent.click(netflixPerkCheckbox);
    });

    // Original: 14.99 + 16.99 = 31.98
    // Verizon: 10.00 + 10.00 = 20.00, then -10 (for 2+ perks) = 10.00
    // Savings: 31.98 - 10.00 = 21.98
    await waitFor(() => {
      expect(screen.getByTestId('original-total')).toHaveTextContent('$31.98');
      expect(screen.getByTestId('verizon-total')).toHaveTextContent('$10.00');
      expect(screen.getByTestId('total-savings')).toHaveTextContent('$21.98');
      expect(screen.getByText(/Additional \$10 discount applied for selecting 2 or more perks!/i)).toBeInTheDocument();
    });
  });

  // Test 6: Applies special discount correctly
  test('applies special discount correctly', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i)).toBeInTheDocument());

    const disneyPerkCheckbox = screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i);
    await act(async () => {
      fireEvent.click(disneyPerkCheckbox);
    });

    const discountSelect = screen.getByLabelText(/Are you part of any of these groups?/i);
    await act(async () => {
      fireEvent.change(discountSelect, { target: { value: 'military' } });
    });

    // Original: 14.99
    // Verizon: 10.00 - 5 (for discount) = 5.00
    // Savings: 14.99 - 5.00 = 9.99
    await waitFor(() => {
      expect(screen.getByTestId('original-total')).toHaveTextContent('$14.99');
      expect(screen.getByTestId('verizon-total')).toHaveTextContent('$5.00');
      expect(screen.getByTestId('total-savings')).toHaveTextContent('$9.99');
      expect(screen.getByText(/⭐ An additional \$5 discount applied for your service!/i)).toBeInTheDocument();
    });
  });

  // Test 7: Combines multiple perks and special discount
  test('combines multiple perks and special discount', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i)).toBeInTheDocument());

    const disneyPerkCheckbox = screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i);
    const netflixPerkCheckbox = screen.getByLabelText(/Netflix & Max with Ads/i);
    const appleOnePerkCheckbox = screen.getByLabelText(/Apple One/i);

    await act(async () => {
      fireEvent.click(disneyPerkCheckbox);
      fireEvent.click(netflixPerkCheckbox);
      fireEvent.click(appleOnePerkCheckbox);
    });

    const discountSelect = screen.getByLabelText(/Are you part of any of these groups?/i);
    await act(async () => {
      fireEvent.change(discountSelect, { target: { value: 'military' } });
    });

    // Original: 14.99 + 16.99 + 19.95 = 51.93
    // Verizon: 10.00 + 10.00 + 15.00 = 35.00
    // Then apply 2+ perks discount: 35.00 - 10 = 25.00
    // Then apply special discount: 25.00 - 5 = 20.00
    // Savings: 51.93 - 20.00 = 31.93
    await waitFor(() => {
      expect(screen.getByTestId('original-total')).toHaveTextContent('$51.93');
      expect(screen.getByTestId('verizon-total')).toHaveTextContent('$20.00');
      expect(screen.getByTestId('total-savings')).toHaveTextContent('$31.93');
      expect(screen.getByText(/Additional \$10 discount applied for selecting 2 or more perks!/i)).toBeInTheDocument();
      expect(screen.getByText(/⭐ An additional \$5 discount applied for your service!/i)).toBeInTheDocument();
    });
  });

  // Test 8: Deselecting a perk updates totals
  test('deselecting a perk updates totals', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i)).toBeInTheDocument());

    const disneyPerkCheckbox = screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i);
    const netflixPerkCheckbox = screen.getByLabelText(/Netflix & Max with Ads/i);

    await act(async () => {
      fireEvent.click(disneyPerkCheckbox);
      fireEvent.click(netflixPerkCheckbox);
    });

    // Ensure initial state is correct for two perks before deselecting
    await waitFor(() => {
      expect(screen.getByTestId('original-total')).toHaveTextContent('$31.98');
      expect(screen.getByTestId('verizon-total')).toHaveTextContent('$10.00');
      expect(screen.getByTestId('total-savings')).toHaveTextContent('$21.98');
    });

    // Deselect Netflix perk
    await act(async () => {
      fireEvent.click(netflixPerkCheckbox);
    });

    // Original: 14.99
    // Verizon: 10.00 (no $10 discount as only one perk now)
    // Savings: 14.99 - 10.00 = 4.99
    await waitFor(() => {
      expect(screen.getByTestId('original-total')).toHaveTextContent('$14.99');
      expect(screen.getByTestId('verizon-total')).toHaveTextContent('$10.00');
      expect(screen.getByTestId('total-savings')).toHaveTextContent('$4.99');
      expect(screen.queryByText(/Additional \$10 discount applied/i)).not.toBeInTheDocument(); // Discount message should be gone
    });
  });

  // Test for API error handling
  test('renders error message on API fetch failure', async () => {
    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Mock network error')),
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
      expect(screen.getByText(/Could not fetch data from http:\/\/localhost:8080\/api\/perks. Please ensure your Spring Boot backend is running./i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

});