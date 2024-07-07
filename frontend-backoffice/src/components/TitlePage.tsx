import { Box, Typography } from '@mui/material'

interface TitlePageProps {
    title: string;
  }

const TitlePage: React.FC<TitlePageProps> = ({title}) => {
  return (
    <Box borderBottom={1} marginBottom={4} borderColor={'#878787'}>
        <Typography variant="h6" component="h6" fontSize={'bold'} paddingBottom={1} color={'#565656'}>
          {title}
        </Typography>
      </Box>
  )
}

export default TitlePage