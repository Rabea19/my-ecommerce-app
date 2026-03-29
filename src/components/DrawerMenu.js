import * as React from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 260,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: "0 16px 16px 0",
    transition: theme.transitions.create(["transform", "opacity"], {
      easing: theme.transitions.easing.easeInOut, // 👈 هنا بدل sharp
      duration: theme.transitions.duration.standard,
    }),
  },
}));

export default function DrawerMenu({ open, onClose }) {
  const navigate = useNavigate();
  const [collectionOpen, setCollectionOpen] = React.useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const categories = [
    { name: "Mobiles", value: "mobiles" },
    { name: "Computers", value: "computers" },
    { name: "Home Appliances", value: "home" },
    { name: "Clothes", value: "clothes" },
    { name: "Furniture", value: "furniture" },
  ];

  const handleCollectionClick = () => {
    setCollectionOpen(!collectionOpen);
  };

  const handleCategoryClick = (category) => {
    navigate(`/collection?category=${category}`);
    onClose(); // يقفل الدروور لما تضغط على كاتيجوري
  };

  const handleItemClick = (path) => {
    navigate(path);
    onClose(); // يقفل الدروور لأي زرار
  };

  return (
    <StyledDrawer
      anchor="left"
      open={open}
      onClose={onClose}
      transitionDuration={500}
      SlideProps={{
        easing: "cubic-bezier(0.4, 0, 0.2, 1)", // نفس الـ easeInOut
        timeout: 500, // نفس مدة الـ transition
      }}
      PaperProps={{
        sx: {
          width: 260,
          borderRadius: "0 16px 16px 0",
          boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.4)",
        },
      }}
    >
      <Box sx={{ height: "100%", p: 2 }} role="presentation">
        <List>
          {/* زر Collection */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleCollectionClick}>
              <ListItemText primary="Collection" sx={{ fontWeight: 600 }} />
              {collectionOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          {/* الكاتيجوريز */}
          <Collapse in={collectionOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categories.map((cat) => (
                <ListItem key={cat.value} sx={{ pl: 4 }}>
                  <ListItemButton
                    onClick={() => handleCategoryClick(cat.value)}
                  >
                    <ListItemText primary={cat.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* باقي أزرار المنيو */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick("/")}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick("/cart")}>
              <ListItemText primary="Cart" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick("/checkout")}>
              <ListItemText primary="Checkout" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemClick("/signin")}>
              <ListItemText primary="Sign In" />
            </ListItemButton>
          </ListItem>
          {isAuthenticated && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                  onClose();
                }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </StyledDrawer>
  );
}
