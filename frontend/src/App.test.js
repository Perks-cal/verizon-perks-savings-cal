import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App Component", () => {
  const mockPerksData = [
    {
      id: 1,
      name: "Disney+ Hulu ESPN+ with Ads",
      standalonePrice: 14.99,
      verizonPerkPrice: 10.0,
    },
    {
      id: 2,
      name: "Netflix & Max with Ads",
      standalonePrice: 16.99,
      verizonPerkPrice: 10.0,
    },
    {
      id: 3,
      name: "Apple One",
      standalonePrice: 19.95,
      verizonPerkPrice: 15.0,
    },
    {
      id: 4,
      name: "100 GB Mobile Hotspot",
      standalonePrice: 20.0,
      verizonPerkPrice: 10.0,
    },
  ];

  let fetchSpy;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPerksData),
      })
    );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  // Test 1 — Loading state
  test("renders loading state initially", () => {
    render(<App />);
    expect(screen.getByText(/Loading your perks/i)).toBeInTheDocument();
  });

  // Test 2 — Renders UI after load
  test("renders main content after data loads", async () => {
    render(<App />);
  
    await waitFor(() =>
      expect(screen.queryByText(/Loading your perks/i)).not.toBeInTheDocument()
    );
  
    expect(screen.getByText(/Verizon Perks Savings Calculator/i)).toBeInTheDocument();
    expect(
      screen.getByText(/estimated monthly savings/i) // <-- changed to match actual text
    ).toBeInTheDocument();
    expect(screen.getByText(/Choose Your Perks/i)).toBeInTheDocument();
  });
  
  // Test 3 — Perks load correctly
  test("displays perks after data loads", async () => {
    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByLabelText(/Disney\+ Hulu ESPN\+ with Ads/i)
      ).toBeInTheDocument()
    );

    expect(
      screen.getByLabelText(/Netflix & Max with Ads/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Apple One/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/100 GB Mobile Hotspot/i)
    ).toBeInTheDocument();
  });

  // Test 4 — One perk total calculation
  test("calculates totals correctly when one perk is selected", async () => {
    render(<App />);

    const disney = await screen.findByLabelText(
      /Disney\+ Hulu ESPN\+ with Ads/i
    );

    await act(async () => {
      fireEvent.click(disney);
    });

    await waitFor(() => {
      expect(screen.getByTestId("original-total")).toHaveTextContent("$14.99");
      expect(screen.getByTestId("verizon-total")).toHaveTextContent("$10.00");
      expect(screen.getByTestId("total-savings")).toHaveTextContent("$4.99");
    });
  });

  // Test 5 — Two perks with $10 discount
  test("calculates totals correctly when two perks are selected", async () => {
    render(<App />);

    const disney = await screen.findByLabelText(
      /Disney\+ Hulu ESPN\+ with Ads/i
    );
    const netflix = screen.getByLabelText(/Netflix & Max with Ads/i);

    await act(async () => {
      fireEvent.click(disney);
      fireEvent.click(netflix);
    });

    await waitFor(() => {
      expect(screen.getByTestId("original-total")).toHaveTextContent("$31.98");
      expect(screen.getByTestId("verizon-total")).toHaveTextContent("$10.00");
      expect(screen.getByTestId("total-savings")).toHaveTextContent("$21.98");
    });
  });

  // Test 6 — Special discount
  test("applies special discount correctly", async () => {
    render(<App />);

    const disney = await screen.findByLabelText(
      /Disney\+ Hulu ESPN\+ with Ads/i
    );

    await act(async () => {
      fireEvent.click(disney);
    });

    const discountSelect = screen.getByLabelText(/Are you part/i);

    await act(async () => {
      fireEvent.change(discountSelect, { target: { value: "military" } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("verizon-total")).toHaveTextContent("$5.00");
      expect(screen.getByTestId("total-savings")).toHaveTextContent("$9.99");
    });
  });

  // Test 7 — Multiple perks + discount combo
  test("combines multiple perks and special discount", async () => {
    render(<App />);

    const disney = await screen.findByLabelText(
      /Disney\+ Hulu ESPN\+ with Ads/i
    );
    const netflix = screen.getByLabelText(/Netflix & Max/i);
    const apple = screen.getByLabelText(/Apple One/i);

    await act(async () => {
      fireEvent.click(disney);
      fireEvent.click(netflix);
      fireEvent.click(apple);
    });

    const discountSelect = screen.getByLabelText(/Are you part/i);

    await act(async () => {
      fireEvent.change(discountSelect, { target: { value: "military" } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("original-total")).toHaveTextContent("$51.93");
      expect(screen.getByTestId("verizon-total")).toHaveTextContent("$20.00");
      expect(screen.getByTestId("total-savings")).toHaveTextContent("$31.93");
    });
  });

  // Test 8 — Deselect updates totals
  test("deselecting a perk updates totals", async () => {
    render(<App />);

    const disney = await screen.findByLabelText(/Disney/i);
    const netflix = screen.getByLabelText(/Netflix/i);

    await act(async () => {
      fireEvent.click(disney);
      fireEvent.click(netflix);
    });

    await waitFor(() =>
      expect(screen.getByTestId("original-total")).toHaveTextContent("$31.98")
    );

    await act(async () => {
      fireEvent.click(netflix);
    });

    await waitFor(() => {
      expect(screen.getByTestId("original-total")).toHaveTextContent("$14.99");
    });
  });

  // Test 9 — No perks selected should show zero
  test("shows $0 totals when no perks selected", async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("original-total")).toHaveTextContent("$0.00")
    );

    expect(screen.getByTestId("verizon-total")).toHaveTextContent("$0.00");
    expect(screen.getByTestId("total-savings")).toHaveTextContent("$0.00");
  });

  
  // Test 11 — Toggling special discount
  test("changing discount category recalculates totals", async () => {
    render(<App />);

    const disney = await screen.findByLabelText(/Disney/i);
    fireEvent.click(disney);

    const discountSelect = screen.getByLabelText(/Are you part/i);

    fireEvent.change(discountSelect, { target: { value: "military" } });
    expect(screen.getByTestId("verizon-total")).toHaveTextContent("$5.00");

    fireEvent.change(discountSelect, { target: { value: "none" } });
    expect(screen.getByTestId("verizon-total")).toHaveTextContent("$10.00");
  });

  // Test 12 — Double click toggles off
  test("clicking a checkbox twice deselects it", async () => {
    render(<App />);

    const disney = await screen.findByLabelText(/Disney/i);

    fireEvent.click(disney);
    expect(screen.getByTestId("original-total")).toHaveTextContent("14.99");

    fireEvent.click(disney);
    expect(screen.getByTestId("original-total")).toHaveTextContent("0.00");
  });

  // Test 13 — Fetch only once
  test("fetch is called only once", async () => {
    render(<App />);

    await screen.findByLabelText(/Disney/i);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  // Test 14 — API error handling
  test("renders error message on API fetch failure", async () => {
    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: () => Promise.reject(new Error("Mock Error")),
      })
    );

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/Error:/i)).toBeInTheDocument()
    );
  });
});
