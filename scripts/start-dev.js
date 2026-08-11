const net = require('net')
const { spawn } = require('child_process')

function isPortAvailable(port) {
  return new Promise((resolve) => {
    // 1. Try to connect to 127.0.0.1:port
    const socket = new net.Socket()
    let done = false

    socket.setTimeout(300)

    socket.on('connect', () => {
      if (!done) {
        done = true
        socket.destroy()
        resolve(false) // Connected -> Port is occupied!
      }
    })

    socket.on('timeout', () => {
      if (!done) {
        done = true
        socket.destroy()
        testBind()
      }
    })

    socket.on('error', () => {
      if (!done) {
        done = true
        socket.destroy()
        testBind()
      }
    })

    socket.connect(port, '127.0.0.1')

    function testBind() {
      // 2. Try to bind a server on 0.0.0.0 (IPv4)
      const server = net.createServer()
      server.once('error', () => resolve(false))
      server.once('listening', () => {
        server.close(() => resolve(true))
      })
      server.listen(port, '0.0.0.0')
    }
  })
}

async function findAvailablePort(startPort) {
  let port = startPort
  while (!(await isPortAvailable(port))) {
    console.log(`\x1b[33m[Port Search]\x1b[0m Port ${port} is occupied, trying ${port + 1}...`)
    port++
  }
  return port
}

async function start() {
  const isTurbo = process.argv.includes('--turbo')
  const port = await findAvailablePort(3000)
  
  console.log(`\x1b[32m[Port Found]\x1b[0m Starting Next.js on port \x1b[1m${port}\x1b[0m ${isTurbo ? '(Turbopack)' : ''}...\n`)

  const nextBin = require.resolve('next/dist/bin/next')
  const args = [nextBin, 'dev', '-p', port.toString()]
  if (isTurbo) args.push('--turbo')

  // Clean environment variables that trigger npm 11+ unknown config warnings
  const cleanEnv = { ...process.env }
  Object.keys(cleanEnv).forEach((key) => {
    if (
      key.toLowerCase().includes('npm_config_npm_globalconfig') ||
      key.toLowerCase().includes('npm_config_verify_deps_before_run') ||
      key.toLowerCase().includes('npm_config__jsr_registry')
    ) {
      delete cleanEnv[key]
    }
  })

  const child = spawn(process.execPath, args, {
    stdio: 'inherit',
    env: cleanEnv,
  })

  child.on('exit', (code) => {
    process.exit(code || 0)
  })
}

start()
