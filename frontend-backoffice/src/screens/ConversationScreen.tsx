import { Box, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { IConversation } from "../interfaces/IConversation";
import { IConversationMessage } from "../interfaces/IConversationMessage";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab";
import { Socket, io } from 'socket.io-client';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

interface IConversationMessageInput {
  content: string
}

export function ConversationScreen() {
  const params = useParams();
  const conversationId = params.conversationId;
  const scrollRef = useRef<HTMLElement>(null);
  const accessToken = useAccessToken();
  const socket = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<IConversationMessage[]>([]);

  if (!params.conversationId) throw new Error('No conversationId provided');

  const conversationQuery = useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      const response = await api.get(`/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data as IConversation;
    }
  });

  const close = useMutation({
    mutationFn: async () => {
      await api.delete(
        `/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
    }
  })

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setMessages(response.data.messages.reverse());
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    if (conversationQuery.isSuccess && conversationQuery.data) {
      fetchMessages();
    }
  }, [accessToken, conversationId, conversationQuery.isSuccess, conversationQuery.data]);

  const form = useForm({
    defaultValues: { content: '' },
  });

  const handleSubmit = async (message: IConversationMessageInput) => {
    if (!message.content) return;

    try {
      await api.post(`/conversations/${conversationId}/messages`, { content: message.content }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      form.reset();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit({ content: form.getValues().content });
    }
  };

  useEffect(() => {
    if (!socket.current) {
      socket.current = io('http://localhost:8080');
    }

    socket.current.emit('joinConversation', conversationId);

    socket.current.on('newMessage', (message: IConversationMessage) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  if (conversationQuery.isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!conversationQuery.data) {
    return <Typography>Error: Conversation not found.</Typography>;
  }

  const conversation = conversationQuery.data;

  return (
    <Box display='flex' flexDirection='column' height='100vh' py={2}>
      <Box>
        <Typography variant='h5'>{conversation.subject}</Typography>
        {conversation.consumer.name && <Typography variant='subtitle1'>{conversation.consumer.name}</Typography>}
        <Typography variant='subtitle1'>{conversation.consumer.document}</Typography>
      </Box>
      <Box maxHeight='80%' overflow='hidden scroll' ref={scrollRef}>
        <List>
          {messages.map((message) => (
            <ListItem key={`messages:${message.id}`}>
              <Typography variant='body1'>{message.content}</Typography>
              <span style={{ width: 5 }}/>
              <Typography variant='overline'>- {new Date(message.createdAt).toLocaleString()}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box mt='auto' px={4}>
        <Grid container spacing={2}>
          <Grid item sm={10}>
            <TextField {...form.register('content')} multiline fullWidth onKeyUp={handleKeyPress} />
          </Grid>
          <Grid item sm={1} mt='auto'>
            <LoadingButton
              loading={false}
              variant="contained"
              style={{ padding: 16 }}
              startIcon={<SendIcon />}
              onClick={() => handleSubmit({ content: form.getValues().content })}
            >
              Send
            </LoadingButton>
          </Grid>
          <Grid item sm={1} mt='auto'>
            <LoadingButton
              loading={false}
              variant="contained"
              style={{ padding: 16 }}
              startIcon={<CloseIcon />}
              onClick={() => {close.mutate}}
            >
              Close
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
