import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box className='grid w-screen h-screen place-items-center!'>

      <div className=' w-fit space-y-2! p-8 bg-red-50 rounded-2xl text-center'>
        <Typography variant='h5' color='primary' >404 - Page Not Found</Typography>
        <Typography variant='h6' color='warning'>The page you're looking for doesn't exist.</Typography>
        <Link to="/">
          <Typography className='hover:underline' color='primary'>
            Go to Homepage
          </Typography>
        </Link>
      </div>
    </Box>
  );
};

export default NotFound;