import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useHasScope } from "../hooks/useAuthenticationContext.js";
import PeopleIcon from '@mui/icons-material/People'
import AddIcon from '@mui/icons-material/Add';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useAppThemeContext } from "../contexts/ThemeContext.js";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const drawerWidth = 240;

export function Dashboard() {

  const { toggleTheme, themeName } = useAppThemeContext();
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        aria-label="mailbox folders"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          open
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <div>
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
            <Divider />
          </div>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}