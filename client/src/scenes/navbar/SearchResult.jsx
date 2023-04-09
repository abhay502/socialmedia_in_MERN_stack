import { Box, Typography, List, ListItem,  ListItemText } from '@mui/material';
import UserImage from 'components/UserImage';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
    const navigate=useNavigate()

  return (
    <>
    {results.length >0 ?  <Box sx={{ marginTop: '5rem' }}>
      <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>
        Search Results
      </Typography>
      <List>
        {results[0]?.map((result) => (
            
          <ListItem
          sx={{backgroundColor:"lightslategrey"}}
            button
            key={result?._id}
            onClick={() => {
                navigate(`/profile/${result?._id}`)
            }}
          >
             <UserImage image={result?.picturePath} />
             <Box display={"grid"}>
             <Typography ml={"1rem"} sx={{fontWeight:"bold"}}> {result?.firstName+" "+result?.lastName}</Typography> 
             <Typography ml={"1rem"} sx={{fontSize:12}}> {result?.location}</Typography> 
             </Box>
          

           
          </ListItem> 
        ))}
      </List>
    </Box> : null }
  
    </>
  );
};

export default SearchResults;
