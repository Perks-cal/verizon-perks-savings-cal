import React, { useState, useEffect } from 'react';

// --- API CALL FUNCTION ---
// This function attempts to fetch data from your Spring Boot backend.
// Ensure your Spring Boot backend is running on http://localhost:8081.
const fetchPerksData = async () => {
  const apiUrl = "https://verizon-perks-savings-cal-2.onrender.com/api/perks";

  console.log(`Attempting to fetch data from: ${apiUrl}`);

  try {
    const response = await fetch('https://verizon-perks-savings-cal-2.onrender.com/api/perks');
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} - ${response.statusText || 'Unknown Error'}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching perks data:', error);
    throw new Error(
      `Could not fetch data from ${apiUrl}. Please ensure your Spring Boot backend is running.`
    );
  }
};

// Enhanced Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
    <div className="mb-6 flex items-center gap-2">
      <div className="h-6 w-1.5 bg-red-500 rounded-full" />
      <span className="text-sm font-semibold text-slate-100">
        Verizon Perks Savings Calculator
      </span>
    </div>
    <div className="animate-spin rounded-full h-14 w-14 border-2 border-slate-600 border-t-red-500" />
    <p className="mt-4 text-base font-medium text-slate-100">Loading your perks and savings…</p>
    <p className="mt-1 text-xs text-slate-400 max-w-sm text-center">
      If this takes too long, make sure your backend server is running and reachable.
    </p>
  </div>
);

// Savings Progress Component
const SavingsProgress = ({ totalSavings, originalTotal }) => {
  const savingsPercentage = originalTotal > 0 ? Math.round((totalSavings / originalTotal) * 100) : 0;
  const progressWidth = Math.min((totalSavings / 100) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-xl text-white mb-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">Savings Progress</span>
        <span className="text-2xl font-bold">{savingsPercentage}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 mt-2">
        <div
          className="bg-white h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      <div className="flex justify-between text-sm mt-2 opacity-90">
        <span>Keep adding perks to maximize savings!</span>
        <span>${totalSavings.toFixed(2)} saved</span>
      </div>
    </div>
  );
};

// Improved Comparison View Component
const ComparisonView = ({ selectedPerks, perksMap, originalTotal, verizonTotal, totalSavings }) => {
  if (selectedPerks.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h3 className="text-lg font-bold text-center">Your Savings Breakdown</h3>
        <div className="text-center mt-2">
          <span className="text-2xl font-extrabold">${totalSavings.toFixed(2)}</span>
          <span className="text-sm opacity-90 ml-1">saved per month</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Individual Perk Savings */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm border-b border-gray-200 pb-1">
            Selected Perks ({selectedPerks.length})
          </h4>
          {selectedPerks.map((perkKey) => {
            const perk = perksMap[perkKey];
            const savings = perk.standalonePrice - perk.verizonPerkPrice;
            return (
              <div key={perkKey} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-800 flex-1">{perk?.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 line-through">${perk?.standalonePrice?.toFixed(2)}</span>
                    <span className="text-blue-600 font-semibold">${perk?.verizonPerkPrice?.toFixed(2)}</span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    -${savings.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Discounts */}
        <div className="border-t border-gray-200 pt-3">
          <h4 className="font-semibold text-gray-800 text-sm mb-2">Additional Savings</h4>
          <div className="space-y-2">
            {selectedPerks.length >= 2 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Multi-perk bundle discount</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold text-xs">-$10.00</span>
              </div>
            )}
            {/* Note: Special discount is already included in verizonTotal calculation */}
          </div>
        </div>

        {/* Total Summary */}
        <div className="border-t border-gray-200 pt-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 -mx-1">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Regular price total:</span>
              <span className="font-semibold text-gray-800">${originalTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Your Verizon price:</span>
              <span className="font-semibold text-blue-600">${verizonTotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Monthly Savings:</span>
                <span className="text-xl font-bold text-green-600">${totalSavings.toFixed(2)}</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">That's ${(totalSavings * 12).toFixed(2)} per year! 💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-2">
          <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
            Get These Perks
          </button>
          <p className="text-xs text-gray-500 mt-2">Start saving today with Verizon</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Perk Card Component
const PerkCard = ({ perkKey, perk, isSelected, onChange }) => {
  const savings = perk.standalonePrice - perk.verizonPerkPrice;
  const isPopular = savings > 10; // Consider it popular if savings > $10

  return (
    <div
      className={`
    relative transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer
    ${isSelected ? 'ring-2 ring-red-500/80 bg-red-50 shadow-md' : 'bg-white hover:bg-slate-50'}
    p-3 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col
  `}
    >
      {isPopular && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold z-10">
          POPULAR
        </div>
      )}

      <div className="relative mb-2">
        {perk?.imageUrl && (
          <img
            src={perk.imageUrl}
            alt={perk?.name || 'Perk Image'}
            className="w-full h-32 object-contain rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/150x80/CCCCCC/000000?text=Image+Error';
            }}
          />
        )}
        {isSelected && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center rounded-lg">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex items-start w-full flex-grow">
        <input
          type="checkbox"
          id={perkKey}
          value={perkKey}
          checked={isSelected}
          onChange={onChange}
          className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500 mt-1 flex-shrink-0"
        />
        <label htmlFor={perkKey} className="ml-2 flex-grow flex flex-col">
          <span className="text-sm font-semibold text-gray-800 mb-1">{perk?.name}</span>

          <div className="flex items-center justify-between mb-1">
            <span className="text-lg font-bold text-blue-600">
              ${perk?.verizonPerkPrice?.toFixed(2)}
              <span className="text-xs font-normal text-gray-500">/mo</span>
            </span>
            {savings > 0 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                Save ${savings.toFixed(2)}
              </span>
            )}
          </div>

          {perk?.standalonePrice > perk?.verizonPerkPrice && (
            <span className="text-xs text-gray-500 line-through">
              Standalone: ${perk?.standalonePrice?.toFixed(2)}/mo
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

function App() {
  const [perksMap, setPerksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPerks, setSelectedPerks] = useState([]);
  const [discountCategory, setDiscountCategory] = useState('');
  const [originalTotal, setOriginalTotal] = useState(0);
  const [verizonTotal, setVerizonTotal] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [filters, setFilters] = useState({
    sortBy: 'name',
    showSelected: false,
  });

  const getImageMapping = () => {
    const imageMap = new Map();
    imageMap.set('disney-hulu-espn-with-ads', '/images/disney-bundle.png');
    imageMap.set('netflix--max-with-ads', '/images/netflix.png');
    imageMap.set('apple-one', '/images/apple-one.png');
    imageMap.set('100-gb-mobile-hotspot', '/images/mobile-hotspot.png');
    imageMap.set('3-travelpass-days', '/images/travel-pass.png');
    imageMap.set('unlimited-cloud-storage', '/images/cloud-storage.png');
    imageMap.set('google-one-ai-premium', '/images/google-one-ai-premium.png');
    return imageMap;
  };

  useEffect(() => {
    const getPerks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPerksData();
        const imageMapping = getImageMapping();

        const transformedPerks = {};
        if (Array.isArray(data)) {
          data.forEach((perk) => {
            let key = '';
            if (perk.name) {
              key = perk.name
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, '')
                .replace(/ /g, '-');
            } else {
              key = `unknown-perk-${perk.id}`;
            }

            const imageUrl = imageMapping.get(key) ||
              'https://placehold.co/150x80/CCCCCC/000000?text=Perk+Image';
            transformedPerks[key] = { ...perk, imageUrl };
          });
        } else if (typeof data === 'object' && data !== null) {
          console.warn('API data was an object instead of an array. Processing as an object.');
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              const perk = data[key];
              const imageUrl = 'https://placehold.co/150x80/CCCCCC/000000?text=Old+Perk';
              transformedPerks[key] = { ...perk, imageUrl };
            }
          }
        } else {
          throw new Error('Unexpected data format from API: Expected array or object.');
        }
        setPerksMap(transformedPerks);
      } catch (err) {
        setError(err.message);
        console.error('Error setting perks data in state:', err);
      } finally {
        setLoading(false);
      }
    };

    getPerks();
  }, []);

  useEffect(() => {
    if (Object.keys(perksMap).length > 0) {
      const calculateSavings = () => {
        let currentOriginalTotal = 0;
        let currentVerizonTotal = 0;

        selectedPerks.forEach((perkKey) => {
          const perk = perksMap[perkKey];
          if (perk) {
            currentOriginalTotal += perk.standalonePrice;
            currentVerizonTotal += perk.verizonPerkPrice;
          }
        });

        if (selectedPerks.length >= 2) {
          currentVerizonTotal -= 10;
        }

        if (discountCategory !== '') {
          currentVerizonTotal -= 5;
        }

        const calculatedSavings = currentOriginalTotal - currentVerizonTotal;

        setOriginalTotal(Math.max(0, currentOriginalTotal));
        setVerizonTotal(Math.max(0, currentVerizonTotal));
        setTotalSavings(Math.max(0, calculatedSavings));
      };

      calculateSavings();
    }
  }, [selectedPerks, discountCategory, perksMap]);

  const handlePerkChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPerks((prev) => [...prev, value]);
    } else {
      setSelectedPerks((prev) => prev.filter((perk) => perk !== value));
    }
  };

  const filteredPerks = () => {
    let perks = Object.keys(perksMap);

    if (filters.showSelected) {
      perks = perks.filter((key) => selectedPerks.includes(key));
    }

    perks.sort((a, b) => {
      const perkA = perksMap[a];
      const perkB = perksMap[b];

      switch (filters.sortBy) {
        case 'savings': {
          const savingsA = perkA.standalonePrice - perkA.verizonPerkPrice;
          const savingsB = perkB.standalonePrice - perkB.verizonPerkPrice;
          return savingsB - savingsA;
        }
        case 'price':
          return perkA.verizonPerkPrice - perkB.verizonPerkPrice;
        default:
          return perkA.name.localeCompare(perkB.name);
      }
    });

    return perks;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div
          className="bg-red-950/60 border border-red-500/60 text-red-100 px-6 py-5 rounded-xl max-w-lg w-full shadow-xl"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold">
                !
              </span>
            </div>
            <div className="flex-1 text-left">
              <h2 className="font-semibold text-sm mb-1">Unable to load perks data</h2>
              <p className="text-xs sm:text-sm text-red-100/90 mb-2">{error}</p>
              <p className="text-[11px] text-red-200/80 leading-relaxed">
                Make sure your <span className="font-semibold">Spring Boot backend</span> is running on
                <code className="mx-1 px-1.5 py-0.5 rounded bg-black/40 text-[10px]">http://localhost:8081</code>
                and that CORS is configured to allow requests from your frontend.
              </p>
              <p className="mt-2 text-[11px] text-red-200/70">
                In your backend folder, run:
                <code className="ml-1 px-1.5 py-0.5 rounded bg-black/40 text-[10px]">mvn spring-boot:run</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-black via-red-700 to-black text-slate-100">
      {/* Top Nav */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1.5 bg-red-500 rounded-full" />
            <span className="font-semibold tracking-tight text-sm sm:text-base">
              Verizon Perks Savings Calculator
            </span>
          </div>
          <span className="hidden sm:inline-flex text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10 uppercase tracking-[0.12em]">
            Beta · Estimates only
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="px-3 sm:px-4 py-5 sm:py-8">
        <div className="bg-white rounded-2xl shadow-2xl shadow-red-950/40 p-4 sm:p-6 w-full max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Maximize Your Verizon Perks Savings
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl">
              Select the subscriptions you care about and we&apos;ll show you how much you could save
              each month by getting them through Verizon instead of paying full standalone prices.
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Live estimate · Not an official Verizon tool
            </span>
          </div>

          {/* Savings Progress Bar */}
          {totalSavings > 0 && <SavingsProgress totalSavings={totalSavings} originalTotal={originalTotal} />}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 sm:mb-6">
            <div className="bg-black text-white/90 p-4 rounded-xl shadow-md border border-white/10 shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
              <h3 className="text-xs font-semibold mb-1 uppercase tracking-wide text-white/70">
                Original Price
              </h3>
              <p className="text-2xl font-extrabold" data-testid="original-total">
                ${originalTotal.toFixed(2)}
              </p>
              <p className="text-[11px] mt-1 text-white/60">If you paid each service separately</p>
            </div>

            <div className="bg-red-600 text-white p-4 rounded-xl border border-red-500 shadow-[0_12px_25px_rgba(255,0,0,0.9)]">
              <h3 className="text-xs font-semibold mb-1 uppercase tracking-wide text-white/70">
                Your Verizon Price
              </h3>
              <p className="text-2xl font-extrabold" data-testid="verizon-total">
                ${verizonTotal.toFixed(2)}
              </p>
              <p className="text-[11px] mt-1 text-white/60">With applicable Verizon discounts</p>
            </div>

            <div className="bg-green-600 text-white p-4 rounded-xl shadow-[0_12px_25px_rgba(0,255,0,0.5)]">
              <h3 className="text-xs font-semibold mb-1 uppercase tracking-wide">Monthly Savings</h3>
              <p className="text-2xl font-extrabold" data-testid="total-savings">
                ${totalSavings.toFixed(2)}
              </p>
              <p className="text-[11px] mt-1 opacity-90">
                That&apos;s ${(totalSavings * 12).toFixed(2)} per year 🎉
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-grow space-y-6">
              {/* Special Discounts */}
              <div className="bg-blue-50 p-4 rounded-xl shadow-inner border border-blue-200">
                <h2 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Special Discounts
                </h2>
                <label htmlFor="discountCategory" className="block text-gray-700 font-medium mb-2 text-sm">
                  Are you part of any of these groups?
                </label>
                <select
                  id="discountCategory"
                  value={discountCategory}
                  onChange={(e) => setDiscountCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-white hover:text-black focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="military">Military &amp; Veterans</option>
                  <option value="firstResponder">First Responders</option>
                  <option value="teacher">Teachers</option>
                  <option value="nurse">Nurses</option>
                </select>
                {discountCategory !== '' && (
                  <p className="text-sm text-blue-600 mt-2 text-center font-semibold">
                    ⭐ An additional $5 discount applied for your service!
                  </p>
                )}
              </div>

              {/* Filters */}
              <div className="bg-gray-50 p-4 rounded-xl border">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                      className="p-2 border border-gray-300 rounded-lg text-sm bg-white text-black hover:bg-white hover:text-black"
                    >
                      <option value="name">Name</option>
                      <option value="savings">Highest Savings</option>
                      <option value="price">Lowest Price</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showSelected"
                      checked={filters.showSelected}
                      onChange={(e) => setFilters((prev) => ({ ...prev, showSelected: e.target.checked }))}
                      className="h-4 w-4 text-red-600 rounded"
                    />
                    <label htmlFor="showSelected" className="ml-2 text-sm text-gray-700">
                      Show only selected perks
                    </label>
                  </div>
                </div>
              </div>

              {/* Perks Grid */}
              <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-red-200">
                <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Choose Your Perks ({selectedPerks.length} selected)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPerks().length > 0 ? (
                    filteredPerks().map((key) => (
                      <PerkCard
                        key={key}
                        perkKey={key}
                        perk={perksMap[key]}
                        isSelected={selectedPerks.includes(key)}
                        onChange={handlePerkChange}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full text-center text-sm">
                      {filters.showSelected ? 'No perks selected yet.' : 'No perks data available.'}
                    </p>
                  )}
                </div>

                {selectedPerks.length >= 2 && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-green-700 text-center font-semibold">
                      🎉 Additional $10 multi-perk discount applied!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison View - Desktop Sidebar */}
            <div className="lg:w-96">
              {selectedPerks.length > 0 && (
                <div className="sticky top-4">
                  <ComparisonView
                    selectedPerks={selectedPerks}
                    perksMap={perksMap}
                    originalTotal={originalTotal}
                    verizonTotal={verizonTotal}
                    totalSavings={totalSavings}
                  />
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] sm:text-xs mt-4 sm:mt-6 text-center text-gray-400 max-w-3xl mx-auto">
            This calculator provides estimated savings based on typical pricing and common Verizon offers.
            Actual eligibility, discounts, and pricing are determined by Verizon. Please verify details on the
            official Verizon website or with a representative.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
