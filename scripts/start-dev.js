const net = require('net')
const { spawn } = require('child_process')

/**
 * Checks if a port is completely available on all interfaces (IPv4 and IPv6).
 */
async function isPortAvailable(port) {
  // 1. Check TCP connection to common loopback addresses
  const loopbacks = ['127.0.0.1', '::1']
  for (const host of loopbacks) {
    const isOccupied = await new Promise((resolve) => {
      const socket = new net.Socket()
      socket.setTimeout(250)
      socket.once('connect', () => {
        socket.destroy()
        resolve(true)
      })
      socket.once('timeout', () => {
        socket.destroy()
        resolve(false)
      })
      socket.once('error', () => {
        socket.destroy()
        resolve(false)
      })
      try {
        socket.connect(port, host)
      } catch {
        resolve(false)
      }
    })
    if (isOccupied) return false
  }

  // 2. Test binding server across all standard interfaces with exclusive: true
  const hostsToTest = ['0.0.0.0', '127.0.0.1', '::', '::1']
  for (const host of hostsToTest) {
    const canBind = await new Promise((resolve) => {
      const server = net.createServer()
      server.unref()
      server.once('error', () => resolve(false))
      try {
        server.listen({ port, host, exclusive: true }, () => {
          server.close(() => resolve(true))
        })
      } catch {
        resolve(false)
      }
    })
    if (!canBind) return false
  }

  return true
}

/**
 * Finds the next free port starting from startPort.
 */
async function findAvailablePort(startPort = 3000, maxAttempts = 100) {
  let port = startPort
  for (let i = 0; i < maxAttempts; i++) {
    const available = await isPortAvailable(port)
    if (available) {
      return port
    }
    console.log(`\x1b[33m[Port Occupied]\x1b[0m Port ${port} is currently in use. Switching to port ${port + 1}...`)
    port++
  }
  throw new Error(`No available port found after ${maxAttempts} attempts starting from ${startPort}.`)
}

async function start() {
  const isTurbo = process.argv.includes('--turbo')
  
  // Support custom starting port via CLI flag (-p or --port) or PORT env variable
  let initialPort = 3000
  if (process.env.PORT) {
    const envPort = parseInt(process.env.PORT, 10)
    if (!isNaN(envPort)) initialPort = envPort
  }
  const portArgIndex = process.argv.findIndex((arg) => arg === '-p' || arg === '--port')
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10)
    if (!isNaN(parsed)) initialPort = parsed
  }

  let currentPort = initialPort

  while (true) {
    const port = await findAvailablePort(currentPort)
    console.log(`\x1b[32m[Port Ready]\x1b[0m Starting Next.js dev server on \x1b[1mhttp://localhost:${port}\x1b[0m ${isTurbo ? '(Turbopack)' : ''}...\n`)

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

    const startedAt = Date.now()
    let hasPortConflict = false

    const child = spawn(process.execPath, args, {
      stdio: 'inherit',
      env: cleanEnv,
    })

    const exitCode = await new Promise((resolve) => {
      child.on('exit', (code) => {
        const uptime = Date.now() - startedAt
        // If Next.js exited immediately (within 3 seconds) with non-zero exit code, consider port collision
        if (code !== 0 && uptime < 3000) {
          hasPortConflict = true
        }
        resolve(code || 0)
      })

      // Forward signals to child process
      process.on('SIGINT', () => child.kill('SIGINT'))
      process.on('SIGTERM', () => child.kill('SIGTERM'))
    })

    if (hasPortConflict) {
      console.log(`\x1b[31m[Port Conflict]\x1b[0m Next.js could not bind to port ${port}. Trying port ${port + 1}...\n`)
      currentPort = port + 1
      continue
    }

    process.exit(exitCode)
  }
}

start().catch((err) => {
  console.error('[Startup Error]', err)
  process.exit(1)
})
