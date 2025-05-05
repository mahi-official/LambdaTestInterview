import { useState, useEffect } from 'react';
import {
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InsuranceIcon from '@mui/icons-material/HealthAndSafety';
import PremiumCard from './insurer_card';
import { fetchFilteredPlans } from '../services/plan.service';
import { 
  Button,
  CircularProgress,
  FormHelperText
} from '@mui/material';

const drawerWidth = 240;

const InsuranceList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sumInsuredFilter, setSumInsuredFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src="https://www.lambdatest.com/resources/images/logos/logo.svg" 
          alt="Lambda Test Logo"
          style={{ width: '160px', marginBottom: '16px' }}
        />
      </Box>
      <List>
        <ListItem 
          button={true}
          onClick={() => {
            // Add your navigation logic here
            console.log('Insurance Plans clicked');
            // Close drawer on mobile if needed
            if (isMobile) {
              setMobileOpen(false);
            }
          }}
          sx={{ cursor: 'pointer' }}
        >
          <ListItemIcon>
            <InsuranceIcon />
          </ListItemIcon>
          <ListItemText primary="Insurance Plans" />
        </ListItem>
      </List>
    </Box>
  );
  const insurance_filters = [
    {
      label: 'Type',
      value: typeFilter,
      onChange: setTypeFilter,
      items: [
        { value: 'Health', label: 'Health' },
        { value: 'Car', label: 'Car' },
        { value: 'Fire', label: 'Fire' },
      ]
    },
    {
      label: 'Gender',
      value: genderFilter,
      onChange: setGenderFilter,
      items: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
      ]
    },
    {
      label: 'Sum Insured',
      value: sumInsuredFilter,
      onChange: setSumInsuredFilter,
      items: [
        { value: '100000', label: '1 Lakh' },
        { value: '300000', label: '3 Lakhs' },
        { value: '500000', label: '5 Lakhs' },
        { value: '1000000', label: '10 Lakhs' },
        { value: '2000000', label: '20 Lakhs' },
      ]
    },
    {
      label: 'Location',
      value: locationFilter,
      onChange: setLocationFilter,
      items: [
        { value: 'Urban', label: 'Urban' },
        { value: 'Rural', label: 'Rural' },
        { value: 'Semi-Urban', label: 'Semi-Urban' },
      ]
    },
    {
      label: 'Age Group',
      value: ageGroupFilter,
      onChange: setAgeGroupFilter,
      items: [
        { value: '0-18', label: '0-18 years' },
        { value: '19-30', label: '19-30 years' },
        { value: '31-50', label: '31-50 years' },
        { value: '51-70', label: '51-70 years' },
        { value: '70-100', label: 'Above 70 years' },
      ]
    },
    {
      label: 'Sort By Price',
      value: sortOrder,
      onChange: setSortOrder,
      items: [
        { value: 'asc', label: 'Low to High' },
        { value: 'desc', label: 'High to Low' },
      ]
    }
  ].map((filter) => {
    const errorKey = filter.label.toLowerCase().replace(' ', '');
    return (
      <Grid item xs={12} sm="auto" key={filter.label}>
      <FormControl 
        fullWidth 
        error={!!errors[errorKey]}
      >
        <InputLabel>{filter.label}</InputLabel>
        <Select
        value={filter.value}
        onChange={(e) => {
          filter.onChange(e.target.value);
          if (errors[errorKey]) {
          setErrors({...errors, [errorKey]: ''});
          }
        }}
        label={filter.label}
        sx={{ minWidth: 200}}
        >
        {filter.items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
          {item.label}
          </MenuItem>
        ))}
        </Select>
        {errors[errorKey] && (
        <FormHelperText>{errors[errorKey]}</FormHelperText>
        )}
      </FormControl>
      </Grid>
    );
  })

  const sortedPlans = [...plans].sort((a, b) => {
    if (!sortOrder) return 0;
    // Convert premium strings to numbers for comparison
    const premiumA = parseFloat(a.premium);
    const premiumB = parseFloat(b.premium);
    return sortOrder === 'asc' ? premiumA - premiumB : premiumB - premiumA;
  });

  
  const validateForm = () => {
    const newErrors = {};
    
    if (!typeFilter) {
      newErrors.type = 'Type is required';
    }
    
    if (!genderFilter) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!sumInsuredFilter) {
      newErrors.suminsured = 'Sum Insured is required';
    }
    
    if (!locationFilter) {
      newErrors.location = 'Location is required';
    }
    
    if (!ageGroupFilter) {
      newErrors.agegroup = 'Age Group is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
  }, [plans]);
  
  // Replace your existing fetchData function with this
  const handleFetchData = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const filters = {
        type: typeFilter,
        gender: genderFilter,
        sumInsured: sumInsuredFilter,
        location: locationFilter,
        ageGroup: ageGroupFilter,
      };
      const data = await fetchFilteredPlans(filters);
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative'
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'black',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{margin: "auto"}}>
            Insurance Plans
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: theme.palette.background.default,
            position: 'fixed',
            left: 0,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
            position: 'fixed',
            left: 0,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: '100vh',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, sm: `${drawerWidth}px` },
          mt: { xs: 8, sm: 9 },
          pb: '80px'
        }}
      >
        <Box sx={{ p: 2, flex: 1 }}>
          <Grid 
            container 
            spacing={2}
            sx={{ mb: 4, alignItems: "baseline" }}
          >
            {insurance_filters}
          </Grid>

          <Grid container justifyContent="center" sx={{ mb: 4 }}>
            <Button
              variant="contained"
              onClick={handleFetchData}
              disabled={isSubmitting}
              sx={{ 
                height: '56px',
                minWidth: '150px',
                backgroundColor: 'primary.main'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Fetch Plans'
              )}
            </Button>
          </Grid>
          
          <Divider sx={{ mb: 4 }}/>

          <Grid container spacing={2}>
            {sortedPlans.length > 0 ? (
              sortedPlans.map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <PremiumCard insurance={plan} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" align="center">
                  No plans available
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
      
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'black',
          color: 'white',
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, sm: `${drawerWidth}px` },
          position: 'fixed',
          bottom: 0,
          zIndex: theme.zIndex.drawer - 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2">
                © {new Date().getFullYear()} Insurance Plans. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                Terms of Service | Privacy Policy | Contact Us
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default InsuranceList;