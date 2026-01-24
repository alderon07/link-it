# Making Authenticated Requests with Clerk

A guide to making authenticated requests to your backend when using Clerk SDKs.

> **Source**: [Clerk Making Requests Guide](https://clerk.com/docs/guides/development/making-requests)  
> **Last Updated**: 2026-01-22

## Overview

A request is considered "authenticated" when the backend can securely identify the user and device that is making the request. Reasons for making authenticated requests to the backend include:

- Associating the user with the action being performed
- Ensuring the user has permission to make the request
- Keeping an audit log of which device the user is performing actions from

To authenticate requests when using a Clerk SDK, you must pass Clerk's short-lived [session token](https://clerk.com/docs/guides/sessions/session-tokens) to your server. The session token contains cryptographically signed claims about the user's identity and authentication state.

## Required Headers

The following headers are required for Clerk to authenticate a request. They contain information that Clerk uses to determine whether a request is in a signed in or signed out state, or if a [handshake](https://clerk.com/docs/guides/how-clerk-works/overview#the-handshake) must be performed.

- [`Authorization`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization): This should include the user's session token as a Bearer token.
- [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
- [`Host`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)
- [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin)
- [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer)
- [`Sec-Fetch-Dest`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest)
- [`User-Agent`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)
- [`X-Forwarded-Host`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Host)
- [`X-Forwarded-Proto`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto)
  - Alternatively, you can use [`CloudFront-Forwarded-Proto`](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-cloudfront-headers.html#cloudfront-headers-other)

## Same-Origin Requests

If your client and server are on the same origin (e.g., making an API call to `foo.com/api` from JavaScript running on `foo.com`), the [session token](https://clerk.com/docs/guides/sessions/session-tokens) is automatically passed to the backend in a cookie. This means that all requests to same-origin endpoints are **authenticated by default**.

### Vanilla JavaScript

You can use the native browser [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) as you normally would and the request will be authenticated.

```js
fetch('/api/foo').then((res) => res.json())
```

### React-based Applications

You can use the native browser [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) as you normally would and the request will be authenticated. But when a tab loses focus, and data must be fetched in the background, the session token cookie is not automatically included. You'll need to explicitly pass the [session token](https://clerk.com/docs/guides/sessions/session-tokens) as a Bearer token in the Authorization header.

Use the `useAuth()` hook's `getToken()` method to get the session token. Since `getToken()` returns a Promise, you'll need to await its resolution before making the request.

#### Using Fetch API

```jsx
import { useAuth } from '@clerk/nextjs'

export default function MyComponent() {
  const { getToken } = useAuth()

  const handleFetch = async () => {
    const token = await getToken()
    const response = await fetch('/api/foo', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the session token as a Bearer token
      },
    })
    const data = await response.json()
    return data
  }

  return <button onClick={handleFetch}>Fetch Data</button>
}
```

#### Using SWR

```tsx
import useSWR from 'swr'
import { useAuth } from '@clerk/nextjs'

export default function useClerkSWR(url: string) {
  const { getToken } = useAuth()

  const fetcher = async (...args: [RequestInfo]) => {
    const token = await getToken()
    return fetch(...args, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the session token as a Bearer token
      },
    }).then((res) => res.json())
  }

  return useSWR(url, fetcher)
}
```

#### Using Tanstack Query

When using [Tanstack Query](https://tanstack.com/query/v4/docs/react/overview) (formerly React Query), you'll need a query function that properly handles errors. The native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) doesn't throw errors for non-200 responses, so you'll need to add explicit error handling.

> [!NOTE]
> Your application must be wrapped in a `<QueryClientProvider />` component with a configured `QueryClient` instance. See the [Tanstack Query docs](https://tanstack.com/query/v4/docs/react/quick-start) for setup instructions.

```tsx
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'

// Define your query keys as constants to avoid typos
export const queryKeys = {
  foo: ['foo'] as const,
  // Add other query keys as needed
}

// Define the response type for type safety
interface FooResponse {
  // Add your response type here
  id: string
  name: string
}

export function useFooQuery() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: queryKeys.foo,
    queryFn: async (): Promise<FooResponse> => {
      const token = await getToken()

      const response = await fetch('/api/foo', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the session token as a Bearer token
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Include status code and status text in error message
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data as FooResponse
    },
    // Add common configuration options
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Usage in component:
function MyComponent() {
  const { data, isLoading, error } = useFooQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return null

  return <div>{data.name}</div>
}
```

## Cross-Origin Requests

If your client and server are on different origins (e.g., making an API call to a server on `api.foo.com` from JavaScript running on a client at `foo.com`), the [session token](https://clerk.com/docs/guides/sessions/session-tokens) needs to be passed as a Bearer token in the Authorization header.

You can retrieve the session token using the `getToken()` method. Since `getToken()` returns a Promise, you'll need to await its resolution before making the request.

### Vanilla JavaScript

In JavaScript applications, use the global `Clerk.session` object to access the `getToken()` method.

```js
(async () => {
  fetch('/api/foo', {
    headers: {
      Authorization: `Bearer ${await Clerk.session.getToken()}`,
    },
  }).then((res) => res.json())
})()
```

### React-based Applications

In React-based applications, use the `useAuth()` hook to access the `getToken()` method. The examples above for Fetch API, SWR, and Tanstack Query all apply to cross-origin requests as well - just ensure you're passing the token in the Authorization header.

## Best Practices

1. **Always await `getToken()`**: Since `getToken()` returns a Promise, make sure to await it before making requests.

2. **Handle errors gracefully**: The Fetch API doesn't throw errors for non-200 responses. Always check `response.ok` and handle errors appropriately.

3. **Use TypeScript types**: Define response types for better type safety and developer experience.

4. **Cache tokens appropriately**: Session tokens are short-lived, but you can cache them within the same request/component lifecycle.

5. **Background requests**: When a tab loses focus, explicitly pass the token in the Authorization header even for same-origin requests.

## Related Documentation

- [Session Tokens](https://clerk.com/docs/guides/sessions/session-tokens)
- [Clerk Components Reference](./clerk-components-reference.md)
- [How Clerk Works](https://clerk.com/docs/guides/how-clerk-works/overview)
