export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>404 - Page Not Found | NexBridge</title>
        <style>{`
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #050505;
            color: #fff;
            font-family: 'Inter', -apple-system, sans-serif;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          h1 {
            font-size: 6rem;
            font-weight: 800;
            margin: 0;
            background: linear-gradient(135deg, #FF6B2C, #FF8F5E);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            color: rgba(255,255,255,0.6);
            font-size: 1.125rem;
            margin: 1rem 0 2rem;
          }
          a {
            display: inline-block;
            padding: 12px 32px;
            background: #FF6B2C;
            color: #fff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: background 0.2s;
          }
          a:hover { background: #e55a1b; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>404</h1>
          <p>Page not found</p>
          <a href="/">Go to Homepage</a>
        </div>
      </body>
    </html>
  )
}
