import { Grid, CircularProgress, Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useAccessToken } from "../hooks/useAuthenticationContext.js";
import { api } from "../services/api.js";
import { ConversationItem } from "../components/ConversationItem.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Outlet } from "react-router-dom";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useEffect, useRef, useCallback, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

export function ConversationsScreen() {
  const accessToken = useAccessToken();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['conversations'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get('/conversations', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { skip: pageParam * 25, take: 25 },
      });

      return response.data as {
        count: number;
        conversations: IConversation[];
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = Math.ceil(lastPage.count / 25);
      const nextPage = allPages.length;
      return nextPage < maxPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(handleObserver);
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
  }, [handleObserver]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>Error loading conversations</div>;
  }

  return (

    // 
    <Grid container spacing={0} sx={{ height: 'calc(100vh - 64px)' }}>
      <Grid item xs={12} sm={3}>
        <Grid >
          <div style={{ position: 'relative', width: '100%' }}>
            <Box sx={{ position: 'relative', width: '100%' }}>
              <Drawer
                sx={{
                  position: 'absolute',
                  width: 300,
                  '& .MuiDrawer-paper': {
                    position: 'relative',
                    width: 300,
                    height: '100vh',
                    boxSizing: 'border-box',
                  },
                }}
                variant="persistent"
                anchor="left"
                open
              >
                {data?.pages.map((page: any, pageIndex) => (
                  <Fragment key={pageIndex}>
                    {page.conversations.map((conversation: IConversation) => (
                      <Grid item key={`conversations:${conversation.id}`}>
                        <ConversationItem conversation={conversation} />
                      </Grid>
                    ))}
                  </Fragment>
                ))}
              </Drawer>
            </Box>
          </div>
          <div ref={loadMoreRef} />
        </Grid>
        {isFetchingNextPage && <Box mt={2}><CircularProgress /></Box>}
      </Grid>
      <Grid item xs={12} sm={9} sx={{ height: '100vh' }}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
