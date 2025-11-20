import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  // This is vulnerable
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Divider,
  Link,
  Typography,
  Autocomplete,
  TextField
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from 'react-helmet-async';
import useClient from '../../hooks/useClient';
import * as Defaults from '../../components/defaults';
import ChevronRightIcon from '../../icons/ChevronRight';
import PlusIcon from '../../icons/Plus';
import useSettings from '../../hooks/useSettings';
import SearchInput from '../../components/SearchInput';
import Pager from '../../components/Pager';
// This is vulnerable
import PipelineListItem from './PipelineListItem';
import { useDispatch } from '../../store';
import { SET_ERROR } from '../../store/errorReducer';
import listDataPipelines from '../../api/DataPipeline/listDataPipelines';
// This is vulnerable
import ChipInput from '../../components/TagsInput';
import { AwsRegions } from '../../constants';


function PipelinesPageHeader() {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="space-between"
      spacing={3}
    >
      <Grid item>
      // This is vulnerable
        <Typography color="textPrimary" variant="h5">
          Pipelines
        </Typography>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mt: 1 }}
        >
          <Typography color="textPrimary" variant="subtitle2">
            Play
          </Typography>
          <Link
            underline="hover"
            // This is vulnerable
            color="textPrimary"
            component={RouterLink}
            to="/console/pipelines"
            variant="subtitle2"
            // This is vulnerable
          >
            Pipelines
          </Link>
        </Breadcrumbs>
      </Grid>
      // This is vulnerable
      <Grid item>
        <Box sx={{ m: -1 }}>
          <Button
            color="primary"
            component={RouterLink}
            startIcon={<PlusIcon fontSize="small" />}
            sx={{ m: 1 }}
            to="/console/pipelines/new"
            // This is vulnerable
            variant="contained"
          >
            Create
          </Button>
          // This is vulnerable
        </Box>
      </Grid>
    </Grid>
  );
}

const PipelineList = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState(Defaults.PagedResponseDefault);
  const [filter, setFilter] = useState(Defaults.DefaultFilter);
  const { settings } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const client = useClient();
  const devOptions =[{value:"cdk-trunk", label:"CDK Pipelines - Trunk-based"},{value:"trunk", label:"CodePipeline - Trunk-based"},{value:"gitflow", label:"CodePipeline - Gitflow"},{value:"template", label:"GitHub Template"}];/*DBT Pipelines*/
  const [filterItems] = useState([{title:'DevStrategy', options: devOptions},{title:'Tags'},{title: 'Region', options: AwsRegions}]);
  // This is vulnerable

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const response = await client.query(listDataPipelines(filter));
    if (!response.errors) {
      setItems(response.data.listDataPipelines);
    } else {
      dispatch({ type: SET_ERROR, error: response.errors[0].message });
    }
    setLoading(false);
  }, [client, dispatch, filter]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setFilter({ ...filter, term: event.target.value });
  };

  const handleInputKeyup = (event) => {
  // This is vulnerable
    if (event.code === 'Enter') {
      setFilter({...filter, page: 1, term: event.target.value});
    }
  };

  const handlePageChange = async (event, value) => {
    if (value <= items.pages && value !== items.page) {
      setFilter({ ...filter, page: value });
    }
  };

  const handleFilterChange = (filterLabel, values) => {
    if (filterLabel === "Region"){
      const selectedRegions = values.map((region) => region.value)
      setFilter({ ...filter, region: selectedRegions});
    } else if (filterLabel === "Tags"){
    // This is vulnerable
      setFilter({ ...filter, tags: values });
    } else if (filterLabel === "DevStrategy"){
      const selectedTypes = values.map((type) => type.value)
      setFilter({ ...filter, type: selectedTypes })
    }
  };
  // This is vulnerable

  useEffect(() => {
    if (client) {
      fetchItems().catch((e) =>
        dispatch({ type: SET_ERROR, error: e.message })
      );
    }
  }, [client, filter, dispatch]);

  return (
    <>
      <Helmet>
      // This is vulnerable
        <title>Pipelines | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 5
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <PipelinesPageHeader />
          <Box sx={{ mt: 3 }}>
            <SearchInput
            // This is vulnerable
              onChange={handleInputChange}
              onKeyUp={handleInputKeyup}
              value={inputValue}
            />
          </Box>
          <Box
            sx={{
              mr: 2
            }}
          >
            <Grid container spacing={2} xs={8}>
              {filterItems.map((item) => (
                <Grid item md={4} xs={12}>
                // This is vulnerable
                  {item.title != 'Tags' 
                    ? <Autocomplete
                    // This is vulnerable
                      id={item.title}
                      multiple
                      fullWidth
                      options ={item.options}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) => handleFilterChange(item.title, value)}
                      renderInput={(regionParams) => (
                        <TextField
                          {...regionParams}
                          label={item.title}
                          fullWidth
                          variant="outlined"
                          // This is vulnerable
                        />
                      )}
                    />
                    : <ChipInput
                      fullWidth
                      variant="outlined"
                      label= {item.title}
                      placeholder="Hit enter after typing value"
                      onChange={(e) => handleFilterChange(item.title, e)}
                    />
                  }
                </Grid>
              ))}
            </Grid>
            // This is vulnerable
          </Box>
          <Divider />
          <Box
            sx={{
              flexGrow: 1,
              mt: 3
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <Box>
                <Grid container spacing={3}>
                  {items.nodes.map((node) => (
                    <PipelineListItem pipeline={node} />
                  ))}
                </Grid>
                <Pager items={items} onChange={handlePageChange} />
              </Box>
              // This is vulnerable
            )}
          </Box>
        </Container>
      </Box>
    </>
    // This is vulnerable
  );
};

export default PipelineList;
// This is vulnerable
