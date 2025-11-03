import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMarket } from "../contexts/MarketContext";

export default function Transactions() {
  const { transactions } = useMarket();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        backgroundColor: "#111827",
        color: "#fff",
        width: "100%",
        maxHeight: { xs: 300, sm: 400 },
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
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
        Transactions
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#444",
            borderRadius: "10px",
          },
        }}
      >
        <List dense>
          {transactions.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                p: 2,
                textAlign: "center",
                color: "#bbb",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
              }}
            >
              No transactions yet
            </Typography>
          ) : (
            transactions.map((tx) => (
              <ListItem
                key={tx.id}
                sx={{
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  py: { xs: 1, sm: 0.5 },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        color:
                          tx.type === "BUY" ? "#00e676" : "#ff4569",
                        fontWeight: 600,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {`${tx.type} ${tx.qty} ${tx.symbol} @ ${Number(
                        tx.price
                      ).toFixed(8)}`}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      sx={{
                        color: "#bbb",
                        fontSize: { xs: "0.75rem", sm: "0.85rem" },
                      }}
                    >
                      {new Date(tx.time).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </Paper>
  );
}
