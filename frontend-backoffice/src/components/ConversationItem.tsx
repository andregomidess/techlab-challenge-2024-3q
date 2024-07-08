import { ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { IConversation } from "../interfaces/IConversation.js";
import { Link } from "react-router-dom";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useMemo } from "react";

export interface ConversationItemProps {
  conversation: IConversation
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const consumerIdentifier = useMemo(() => {
    if (conversation.consumer.name) return conversation.consumer.name

    return `Doc: ${conversation.consumer.document}`
  }, [conversation])
 
  return (
    <Paper>
      <Typography  >
        <Link to={`/conversations/${conversation.id}`} style={{ textDecoration: 'none' }}>
          <ListItem >
            <ListItemButton
               sx={{
                borderRadius: '8px', 
                '&:focus': {
                  backgroundColor: '#3390ec',
                  color: 'white',
                  '& .MuiListItemText-primary': {
                    color: 'white',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'white',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:active': {
                  backgroundColor: ' #3390ec',
                  color: 'white',
                  '& .MuiListItemText-primary': {
                    color: 'white',
                  },
                  '& .MuiListItemText-secondary': {
                    color: 'white',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon>
                <ChatBubbleIcon />
              </ListItemIcon>
              <ListItemText
                primary={conversation.subject}
                secondary={consumerIdentifier}
                sx={{ textDecoration: 'none' }}
                primaryTypographyProps={{ sx: { fontWeight: 'bold', color: 'black'} }}
                secondaryTypographyProps={{ sx: { color: 'gray', textDecoration: 'none' } }}
              />
            </ListItemButton>
          </ListItem>
        </Link>
      </Typography>
    </Paper>
  )
}