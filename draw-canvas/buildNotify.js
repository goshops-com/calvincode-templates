await fetch(`${process.env.PUBLIC_URL}/hooks/server-ready`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'ready',
      timestamp: new Date().toISOString()
    })
  })