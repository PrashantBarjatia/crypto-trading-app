import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Header from "./components/Header";
import CoinList from "./components/CoinList";
import MarketDepth from "./components/MarketDepth";
import TradeForm from "./components/TradeForm";
import Transactions from "./components/Transactions";
import PriceChart from "./components/PriceChart";
import { useMarket } from "./contexts/MarketContext";
import { useWallet } from "./contexts/WalletContext";

export default function App() {
  const { selected, priceHistory } = useMarket();
  const { balance, holdings } = useWallet();

  const mainHistory = priceHistory[selected] || [];

  return (
    <Box
      sx={{
        backgroundColor: "#0a0f1f",
        minHeight: "100vh",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <Header />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          p: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: { xs: "unset", md: "0 0 280px" },
            width: { xs: "100%", md: "280px" },
            p: 2,
            backgroundColor: "#111827",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontSize: { xs: "1rem", sm: "1.1rem" },
            }}
          >
            Markets
          </Typography>
          <CoinList />
        </Paper>

        <Box sx={{ flex: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#111827",
                  height: { xs: "300px", sm: "400px", md: "450px" },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  Price Chart — {selected.toUpperCase()}
                </Typography>
                <PriceChart data={mainHistory} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TradeForm />
                <MarketDepth symbol={selected} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#111827",
                  minHeight: "140px",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  Wallet
                </Typography>
                <Typography variant="body2">
                  💰 Balance: ${Number(balance).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  🪙 Holdings:{" "}
                  {Object.keys(holdings).length
                    ? Object.entries(holdings)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")
                    : "—"}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Transactions />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
