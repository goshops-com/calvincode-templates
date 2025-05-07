export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only execute this on the server side
    console.log('Server initialization started')
    
    // Wait for the server to be fully ready
    // This code runs after the Next.js server has initialized
    if (process.env.NODE_ENV === 'development') {
      // Note: This will run when the dev server is ready
      console.log('Server is ready to receive requests')
      
      try {
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
        console.log('Successfully notified endpoint')
      } catch (error) {
        console.log('Failed to notify endpoint:', error)
      }
    }
  }
} 