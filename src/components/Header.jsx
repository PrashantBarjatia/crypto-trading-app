import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useWallet } from "../contexts/WalletContext";
import { useAuth } from "../contexts/AuthContext";
import AuthForms from "./AuthForms";

export default function Header() {
  const { address, connectMetaMask, disconnectWallet } = useWallet();
  const { currentUser, logout } = useAuth();

  const [openAuth, setOpenAuth] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleConnectWallet = async () => {
    if (!currentUser) {
      setOpenAuth(true);
      return;
    }
    await connectMetaMask();
  };

  const handleLogout = async () => {
    await logout();
    disconnectWallet();
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #111827, #1e3a8a)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 0.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              cursor: "pointer",
            }}
          >
            Crypto Trading
          </Typography>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {currentUser ? (
              <Typography
                variant="body2"
                sx={{
                  background: "#2563eb",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  fontWeight: 500,
                }}
              >
                {currentUser.username}
              </Typography>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpenAuth(true)}
                sx={{ borderColor: "#60a5fa", color: "#60a5fa" }}
              >
                Login / Signup
              </Button>
            )}

            {address ? (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={disconnectWallet}
                sx={{
                  backgroundColor: "#22c55e",
                  "&:hover": { backgroundColor: "#16a34a" },
                }}
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleConnectWallet}
                sx={{
                  backgroundColor: "#3b82f6",
                  "&:hover": { backgroundColor: "#2563eb" },
                }}
              >
                Connect Wallet
              </Button>
            )}

            {currentUser && (
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={handleLogout}
                sx={{ borderColor: "#f87171", color: "#fca5a5" }}
              >
                Logout
              </Button>
            )}
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            sx={{ display: { xs: "flex", sm: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: 250, backgroundColor: "#0f172a", color: "#fff" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton color="inherit" onClick={toggleDrawer(false)}>
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

        <List>
          {currentUser ? (
            <ListItem>
              <ListItemText
                primary={`👤 ${currentUser.username}`}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          ) : (
            <ListItem button onClick={() => setOpenAuth(true)}>
              <ListItemText primary="Login / Signup" />
            </ListItem>
          )}

          <ListItem
            button
            onClick={address ? disconnectWallet : handleConnectWallet}
          >
            <ListItemText
              primary={
                address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Connect Wallet"
              }
            />
          </ListItem>

          {currentUser && (
            <ListItem onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>

      <Dialog open={openAuth} onClose={() => setOpenAuth(false)} maxWidth="xs" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <AuthForms onDone={() => setOpenAuth(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
