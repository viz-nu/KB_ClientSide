import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { tokenStore } from '../auth/tokenStore.js';
import { MUTATIONS } from './gql.js';


// const GRAPHQL_URL = 'https://kbbackend-production.up.railway.app/graphql';
const GRAPHQL_URL = 'http://localhost:8080/graphql';

// ── 1. HTTP link ──────────────────────────────────────────────
const httpLink = createHttpLink({ uri: GRAPHQL_URL });

// ── 2. Auth link — attach Bearer token ───────────────────────
const authLink = setContext((_, { headers }) => {
  const token = tokenStore.getAccess();
  console.log('[authLink] token:', token ? token.slice(0, 20) + '…' : 'NULL ← THIS IS THE PROBLEM');
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

// ── 3. Error link — auto-refresh on 401 / UNAUTHENTICATED ────
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (token) => {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
};

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  const isAuthError = graphQLErrors?.some(
    (e) => e.extensions?.code === 'UNAUTHENTICATED'
  );
  if (!isAuthError) return;

  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) {
    tokenStore.clear();
    window.location.href = '/login';
    return;
  }

  if (isRefreshing) {
    return new Observable((observer) => {
      pendingQueue.push((newToken) => {
        operation.setContext(({ headers = {} }) => ({
          headers: { ...headers, Authorization: `Bearer ${newToken}` },
        }));
        forward(operation).subscribe(observer);
      });
    });
  }

  isRefreshing = true;

  return new Observable((observer) => {
    fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: MUTATIONS.REFRESH_TOKEN,
        variables: { refreshToken: refreshToken },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) throw new Error('Refresh failed');
        const newAccessToken = data.data.newAccessToken;
        tokenStore.setAccess(newAccessToken);
        isRefreshing = false;
        flushQueue(newAccessToken);
        operation.setContext(({ headers = {} }) => ({
          headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
        }));
        forward(operation).subscribe(observer);
      })
      .catch(() => {
        isRefreshing = false;
        pendingQueue = [];
        tokenStore.clear();
        window.location.href = '/login';
        observer.error(new Error('Session expired'));
      });
  });
});

// ── 4. Apollo client ──────────────────────────────────────────
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          embEntries: {
            keyArgs: ['spanId', 'engineerId', 'status'],
            merge(existing, incoming, { args }) {
              if (args?.page === 1 || !existing) return incoming;
              return {
                ...incoming,
                items: [...(existing.items ?? []), ...(incoming.items ?? [])],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
});
