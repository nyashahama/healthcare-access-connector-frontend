export const createConsultationSocket = ({ url, onEvent }) => {
  let socket = null;
  let heartbeat = null;
  let retryTimer = null;
  let attempts = 0;
  let shouldReconnect = true;

  const connect = () => {
    shouldReconnect = true;
    socket = new WebSocket(url);

    socket.onopen = () => {
      attempts = 0;
      heartbeat = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 25000);
    };

    socket.onmessage = (event) => onEvent(JSON.parse(event.data));
    socket.onclose = () => {
      clearInterval(heartbeat);
      if (!shouldReconnect) return;
      const delay = Math.min(1000 * 2 ** attempts, 10000);
      attempts += 1;
      retryTimer = setTimeout(connect, delay);
    };
  };

  const disconnect = () => {
    shouldReconnect = false;
    clearInterval(heartbeat);
    clearTimeout(retryTimer);
    socket?.close();
  };

  const send = (payload) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  };

  const isOpen = () => socket?.readyState === WebSocket.OPEN;

  return { connect, disconnect, send, isOpen };
};
