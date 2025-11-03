import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function MarketDepth({ symbol }) {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!symbol) return;

    const ws = new WebSocket("wss://stream.binance.com:9443/ws");

    ws.onopen = () => {
      console.log("Connected to Binance Depth Stream");
      ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${symbol.toLowerCase()}@depth`],
          id: 1,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.b && data.a) {
        setBids(data.b.slice(0, 10));
        setAsks(data.a.slice(0, 10));
        setLoading(false); 
      }
    };

    ws.onerror = (err) => console.error("Depth WebSocket Error:", err);

    return () => {
      ws.close();
      console.log("Disconnected from Binance Depth Stream");
    };
  }, [symbol]);

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2 },
        mt: 2,
        borderRadius: 2,
        boxShadow: 3,
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        textAlign={isMobile ? "center" : "left"}
      >
        Market Depth — {symbol.toUpperCase()}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "stretch",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        
        <Box sx={{ flex: 1, width: "100%" }}>
          <Typography
            variant="subtitle2"
            color="error"
            gutterBottom
            textAlign={isMobile ? "center" : "left"}
          >
            Sell Orders
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Price (USDT)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Qty
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asks.map(([price, qty], idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ color: "red" }}>
                    {Number(price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {Number(qty).toFixed(6)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ flex: 1, width: "100%" }}>
          <Typography
            variant="subtitle2"
            color="success.main"
            gutterBottom
            textAlign={isMobile ? "center" : "left"}
          >
            Buy Orders
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Price (USDT)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Qty
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bids.map(([price, qty], idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ color: "green" }}>
                    {Number(price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {Number(qty).toFixed(6)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Paper>
  );
}
