
export function openTickerSocket(symbol, onMessage) {
  const s = symbol.toLowerCase()
  const url = `wss://stream.binance.com:9443/ws/${s}@ticker`
  const ws = new WebSocket(url)
  ws.onopen = () => console.log('Binance WS open:', url)
  ws.onmessage = onMessage
  ws.onclose = () => console.log('Binance WS closed:', url)
  ws.onerror = (e) => console.error('Binance WS error', e)
  return ws
}

export function closeSocket(ws) {
  try {
    ws.close()
  } catch (e) {
  }
}
