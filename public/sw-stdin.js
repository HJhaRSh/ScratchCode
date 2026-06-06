self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A map to hold pending requests for stdin
const pendingRequests = new Map();

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'STDIN_INPUT') {
    const { runId, data } = event.data;
    const resolver = pendingRequests.get(runId);
    if (resolver) {
      resolver(data);
      pendingRequests.delete(runId);
    }
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname === '/__sync_stdin__') {
    const runId = url.searchParams.get('runId');
    if (!runId) return;

    event.respondWith(
      new Promise((resolve) => {
        // Store the resolver so we can respond when the main thread sends STDIN_INPUT
        pendingRequests.set(runId, (inputData) => {
          resolve(new Response(inputData, { status: 200 }));
        });
      })
    );
  }
});
