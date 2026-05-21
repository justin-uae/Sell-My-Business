const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = '2024-01';

const STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

async function storefrontFetch(query, variables = {}) {
  const res = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL error');
  }

  return json.data;
}

//  Auth 

export async function customerLogin(email, password) {
  const data = await storefrontFetch(`
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `, { input: { email, password } });

  const result = data.customerAccessTokenCreate;
  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }
  return result.customerAccessToken;
}

export async function customerSignup(firstName, lastName, email, password) {
  const data = await storefrontFetch(`
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `, { input: { firstName, lastName, email, password } });

  const result = data.customerCreate;
  if (result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message);
  }
  return result.customer;
}

export async function customerLogout(accessToken) {
  await storefrontFetch(`
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        userErrors {
          field
          message
        }
      }
    }
  `, { customerAccessToken: accessToken });
}

export async function getCustomer(accessToken) {
  const data = await storefrontFetch(`
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
      }
    }
  `, { customerAccessToken: accessToken });

  return data.customer;
}

//  Products / Listings 

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  tags
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  images(first: 5) {
    edges {
      node {
        url
        altText
      }
    }
  }
  metafields(identifiers: [
    { namespace: "business", key: "industry" },
    { namespace: "business", key: "revenue" },
    { namespace: "business", key: "profit" },
    { namespace: "business", key: "location" },
    { namespace: "business", key: "ebitda" },
    { namespace: "business", key: "multiplier" },
    { namespace: "business", key: "year_established" }
  ]) {
    key
    namespace
    value
  }
`;

export async function getAllProducts(first = 50, after = null) {
  const data = await storefrontFetch(`
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  `, { first, after });

  return {
    products: data.products.edges.map(e => normalizeProduct(e.node)),
    pageInfo: data.products.pageInfo,
  };
}

export async function getProductByHandle(handle) {
  const data = await storefrontFetch(`
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        ${PRODUCT_FIELDS}
      }
    }
  `, { handle });

  return data.product ? normalizeProduct(data.product) : null;
}

export async function searchProducts(query, first = 20) {
  const data = await storefrontFetch(`
    query searchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  `, { query, first });

  return data.products.edges.map(e => normalizeProduct(e.node));
}

//  Helpers 

function normalizeProduct(node) {
  const metafields = {};
  (node.metafields || []).forEach(m => {
    if (m) metafields[m.key] = m.value;
  });

  const images = (node.images?.edges || []).map(e => e.node);

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    tags: node.tags || [],
    price: parseFloat(node.priceRange?.minVariantPrice?.amount || 0),
    currency: node.priceRange?.minVariantPrice?.currencyCode || 'USD',
    images,
    coverImage: images[0]?.url || null,
    industry: metafields.industry || getTagValue(node.tags, 'industry_') || '',
    revenue: metafields.revenue || '',
    profit: metafields.profit || '',
    location: metafields.location || getTagValue(node.tags, 'location_') || '',
    ebitda: metafields.ebitda || '',
    multiplier: metafields.multiplier || '',
    yearEstablished: metafields.year_established || '',
  };
}

function getTagValue(tags, prefix) {
  const tag = (tags || []).find(t => t.startsWith(prefix));
  return tag ? tag.replace(prefix, '').replace(/_/g, ' ') : '';
}

export function extractOwnerId(tags) {
  const ownerTag = (tags || []).find(t => t.startsWith('owner_'));
  return ownerTag ? ownerTag.replace('owner_', '') : null;
}

export function getShopifyCustomerId(gid) {
  return gid ? gid.split('/').pop() : null;
}
