import { Card, CardContent, Typography, Button,CardActions ,CardMedia} from '@mui/material';

const PremiumCard = ({ insurance }) => {
  return (
    <>
      <Card sx={{ maxWidth: 400,  margin: 2, height: '100%'}}>
        <CardMedia
          component="img"
          alt="insurer logo"
          height="100"
          width="140"
          sx={{ objectFit: 'contain', width: '100px', minHeight: '50px', margin: 'auto', display: 'block', bgcolor:'whitesmoke', mt: 2}}
          image={insurance.insurer_img}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" fontWeight={600}>
            {insurance?.insurer || 'Unknown Insurer'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Premium: ₹{insurance?.premium?.toLocaleString('en-IN') || 'N/A'} / month
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {insurance.description || ""}
          </Typography>
        </CardContent>
        <CardActions>
          <Button sx={{backgroundColor: 'black', color:'white'}}>Buy Now</Button>
          <Button sx={{backgroundColor: 'transparent', color:'black'}} href={insurance.learn_more}>Learn More</Button>
        </CardActions>
      </Card>
    </>
  );
};

export default PremiumCard;
