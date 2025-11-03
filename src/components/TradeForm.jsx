import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
  Dialog,
  DialogContent,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMarket } from "../contexts/MarketContext";
import { useWallet } from "../contexts/WalletContext";
import { useAuth } from "../contexts/AuthContext";
import AuthForms from "./AuthForms";

export default function TradeForm() {
  const { prices, selected, addTransaction } = useMarket();
  const { balance, debit, credit, updateHoldings, address, connectMetaMask } =
    useWallet();
  const { currentUser } = useAuth();

  const [side, setSide] = useState("buy");
  const [qty, setQty] = useState("");
  const [openAuth, setOpenAuth] = useState(false);

  const price = prices[selected] || 0;
  const total = (Number(qty) || 0) * Number(price);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  async function handleTrade() {
    if (!currentUser) {
      setOpenAuth(true);
      return;
    }

    if (!address) {
      try {
        await connectMetaMask();
      } catch (e) {
        alert("Please connect MetaMask to continue.");
      }
      return;
    }

    if (!qty || Number(qty) <= 0) return alert("Enter a valid quantity");

    if (side === "buy") {
      if (total > balance) return alert("Insufficient balance");
      debit(total);
      updateHoldings(selected.toUpperCase(), Number(qty));
      addTransaction({
        type: "BUY",
        symbol: selected.toUpperCase(),
        qty: Number(qty),
        price,
        time: new Date().toISOString(),
      });
    } else {
      credit(total);
      updateHoldings(selected.toUpperCase(), -Number(qty));
      addTransaction({
        type: "SELL",
        symbol: selected.toUpperCase(),
        qty: Number(qty),
        price,
        time: new Date().toISOString(),
      });
    }
    setQty("");
  }

  return (
    <>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          backgroundColor: "#111827",
          color: "#fff",
          borderRadius: 2,
          boxShadow: "0 0 10px rgba(0,0,0,0.4)",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: { xs: 1.5, sm: 2 },
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: "1rem", sm: "1.2rem" },
          }}
        >
          Trade — {selected.toUpperCase()}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 1.5 },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "center",
            mt: { xs: 1, sm: 2 },
          }}
        >
          
          <ToggleButtonGroup
            value={side}
            exclusive
            onChange={(e, v) => v && setSide(v)}
            color="primary"
            sx={{
              width: { xs: "100%", sm: "auto" },
              justifyContent: "center",
            }}
          >
            <ToggleButton
              value="buy"
              sx={{
                color: side === "buy" ? "#00e676" : "#fff",
                backgroundColor: side === "buy" ? "#064e3b" : "transparent",
                "&.Mui-selected": {
                  backgroundColor: "#00c853",
                  color: "#fff",
                },
                flex: 1,
              }}
            >
              BUY
            </ToggleButton>
            <ToggleButton
              value="sell"
              sx={{
                color: side === "sell" ? "#ff4569" : "#fff",
                backgroundColor: side === "sell" ? "#5c0a0a" : "transparent",
                "&.Mui-selected": {
                  backgroundColor: "#ff1744",
                  color: "#fff",
                },
                flex: 1,
              }}
            >
              SELL
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Quantity"
            size="small"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            fullWidth={isMobile}
            sx={{
              flex: 1,
              input: { color: "#fff" },
              label: { color: "#bbb" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#00e676" },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleTrade}
            fullWidth={isMobile}
            sx={{
              backgroundColor: side === "buy" ? "#00c853" : "#ff1744",
              color: "#fff",
              fontWeight: 700,
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1 },
              borderRadius: 2,
              "&:hover": {
                backgroundColor: side === "buy" ? "#00e676" : "#ff4569",
              },
            }}
          >
            {side.toUpperCase()}
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: { xs: 2, sm: 1 },
            color: "#bbb",
            textAlign: { xs: "center", sm: "left" },
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
          }}
        >
          💰 Price: ${price ? price.toFixed(6) : "—"} • 🧾 Total: $
          {Number(total || 0).toFixed(6)} • 💵 Balance: $
          {Number(balance).toFixed(2)}
        </Typography>
      </Paper>

      <Dialog
        open={openAuth}
        onClose={() => setOpenAuth(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <AuthForms onDone={() => setOpenAuth(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
