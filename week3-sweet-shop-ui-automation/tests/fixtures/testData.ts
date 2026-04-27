export const testData = {
  baseUrl: process.env.BASE_URL ?? 'https://sweetshop.netlify.app',

  credentials: {
    valid: {
      email: process.env.LOGIN_EMAIL ?? 'testuser@sweetshop.com',
      password: process.env.LOGIN_PASSWORD ?? 'Password123!',
    },
    invalidEmail: 'wrong@example.com',
    invalidPassword: 'wrongpassword',
    badEmailFormats: ['notanemail', '@domain.com', 'user@', 'user @example.com'],
  },

  billing: {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@sweetshop.com',
    address: '123 Test Street',
    country: 'United Kingdom',
    city: 'Cardiff',
    zip: 'CF10 1AA',
  },

  payment: {
    nameOnCard: 'Test User',
    cardNumber: '4111111111111111',
    expiration: '12/28',
    cvv: '123',
  },

  products: {
    chocolateCups:      { name: 'Chocolate Cups',      price: 1.00 },
    sherbertStraws:     { name: 'Sherbert Straws',     price: 0.75 },
    sherbertDiscs:      { name: 'Sherbert Discs',      price: 0.95 },
    bonBons:            { name: 'Bon Bons',            price: 1.00 },
    jellies:            { name: 'Jellies',             price: 0.75 },
    fruitSalads:        { name: 'Fruit Salads',        price: 0.50 },
    bubbleGums:         { name: 'Bubble Gums',         price: 0.25 },
    whamBars:           { name: 'Wham Bars',           price: 0.15 },
    whistles:           { name: 'Whistles',            price: 0.25 },
    sherbertFountains:  { name: 'Sherbert Fountains',  price: 0.35 },
    swanseaMixture:     { name: 'Swansea Mixture',     price: 1.50 },
    chocolateBeans:     { name: 'Chocolate Beans',     price: 0.80 },
    nerds:              { name: 'Nerds',               price: 0.60 },
    drumsticks:         { name: 'Drumsticks',          price: 0.20 },
    bubbly:             { name: 'Bubbly',              price: 0.10 },
    dollyMixture:       { name: 'Dolly Mixture',       price: 0.90 },
  },

  delivery: {
    collect: { label: 'Collect', cost: 0 },
    standardShipping: { label: 'Standard Shipping', cost: 1.99 },
  },

  totalProducts: 16,
};
