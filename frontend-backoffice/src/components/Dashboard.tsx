// import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
// import { Link, Outlet } from "react-router-dom";
// import { useHasScope } from "../hooks/useAuthenticationContext.js";
// import PeopleIcon from '@mui/icons-material/People'
// import AddIcon from '@mui/icons-material/Add';
// import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
// import { useAppThemeContext } from "../contexts/ThemeContext.js";
// import DarkModeIcon from '@mui/icons-material/DarkMode';
// import LightModeIcon from '@mui/icons-material/LightMode';
// import { useState } from "react";

// const drawerWidth = 240;

// export function Dashboard() {

//   const [open, setOpen] = useState(false);

//   const toggleDrawer = (newOpen: boolean) => () => {
//     setOpen(newOpen);
//   };

//   const { toggleTheme, themeName } = useAppThemeContext();

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <Drawer
//         open={open}
//         onClose={toggleDrawer(false)}
//         sx={{
//           display: { xs: 'none', sm: 'block' },
//           '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//         }}
//       >
//         <Box onClick={toggleDrawer(false)}>
          // <List>
          //   <Link to='/conversations'>
          //     <ListItem disablePadding>
          //       <ListItemButton>
          //         <ListItemIcon>
          //           <QuestionAnswerIcon />
          //         </ListItemIcon>
          //         <ListItemText primary='Conversas' />
          //       </ListItemButton>
          //     </ListItem>
          //   </Link>
          //   {useHasScope('users:*', 'users:read') && (
          //     <>
          //       <Link to='/users'>
          //         <ListItem disablePadding>
          //           <ListItemButton>
          //             <ListItemIcon>
          //               <PeopleIcon />
          //             </ListItemIcon>
          //             <ListItemText primary='Usuários' />
          //           </ListItemButton>
          //         </ListItem>
          //       </Link>
          //       <Link to='/new-user'>
          //         <ListItem disablePadding>
          //           <ListItemButton>
          //             <ListItemIcon>
          //               <AddIcon />
          //             </ListItemIcon>
          //             <ListItemText primary='Criar usuário' />
          //           </ListItemButton>
          //         </ListItem>
          //       </Link>
          //     </>
          //   )}
          //   <Box>
          //     <List component="nav">
          //       <ListItemButton onClick={toggleTheme}>
          //         <ListItemIcon>
          //           {themeName === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
          //         </ListItemIcon>
          //         <ListItemText primary="Alternar tema" />
          //       </ListItemButton>
          //     </List>
          //   </Box>
          // </List>
//           <Divider />
//         </Box>
//       </Drawer>
//       <Box
//         component="main"
//         sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
//       >
//         <Outlet />
//       </Box>
//     </Box>
//   )
// }

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useAppThemeContext } from "../contexts/ThemeContext.js";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { useHasScope } from '../hooks/useAuthenticationContext';
import { Link, Outlet } from "react-router-dom";
import { Toolbar } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export function Dashboard() {
  const theme = useTheme();
  const { toggleTheme, themeName } = useAppThemeContext();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            TechLab
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
            <Link to='/conversations'>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <QuestionAnswerIcon />
                  </ListItemIcon>
                  <ListItemText primary='Conversas' />
                </ListItemButton>
              </ListItem>
            </Link>
            {useHasScope('users:*', 'users:read') && (
              <>
                <Link to='/users'>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary='Usuários' />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to='/new-user'>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <AddIcon />
                      </ListItemIcon>
                      <ListItemText primary='Criar usuário' />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </>
            )}
            <Box>
              <List component="nav">
                <ListItemButton onClick={toggleTheme}>
                  <ListItemIcon>
                    {themeName === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
                  </ListItemIcon>
                  <ListItemText primary="Alternar tema" />
                </ListItemButton>
              </List>
            </Box>
          </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet/>
      </Main>
    </Box>
  );
}
