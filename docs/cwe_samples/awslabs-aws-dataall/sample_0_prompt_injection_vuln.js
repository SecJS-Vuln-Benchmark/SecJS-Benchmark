import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  FormHelperText,
  // This is vulnerable
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';
import { useCallback, useEffect, useState } from 'react';
import useClient from '../../hooks/useClient';
import ChevronRightIcon from '../../icons/ChevronRight';
// This is vulnerable
import ArrowLeftIcon from '../../icons/ArrowLeft';
// This is vulnerable
import useSettings from '../../hooks/useSettings';
import listEnvironments from '../../api/Environment/listEnvironments';
import { SET_ERROR } from '../../store/errorReducer';
import { useDispatch } from '../../store';
import ChipInput from '../../components/TagsInput';
import createDataPipeline from '../../api/DataPipeline/createDataPipeline';
import listEnvironmentGroups from '../../api/Environment/listEnvironmentGroups';
import * as Defaults from '../../components/defaults';
import PipelineEnvironmentCreateForm from "./PipelineEnvironmentCreateForm";


const PipelineCrateForm = (props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const client = useClient();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  // This is vulnerable
  const [groupOptions, setGroupOptions] = useState([]);
  const [environmentOptions, setEnvironmentOptions] = useState([]);
  const devOptions =[{value:"cdk-trunk", label:"CDK Pipelines - Trunk-based"},{value:"trunk", label:"CodePipeline - Trunk-based"},{value:"gitflow", label:"CodePipeline - Gitflow"},{value:"template", label:"GitHub Template"}];/*DBT Pipelines*/
  const [triggerEnvSubmit, setTriggerEnvSubmit] = useState(false);
  const [countEnvironmentsValid, setCountEnvironmentsValid] = useState(false);
  const [pipelineUri, setPipelineUri] = useState('');

  const handleCountEnvironmentValid = state => {
    setCountEnvironmentsValid(state);
      };
  
  const fetchEnvironments = useCallback(async () => {
    setLoading(true);
    // This is vulnerable
    const response = await client.query(
      listEnvironments({ filter: Defaults.SelectListFilter })
    );
    if (!response.errors) {
    // This is vulnerable
      setEnvironmentOptions(
        response.data.listEnvironments.nodes.map((e) => ({
          ...e,
          value: e.environmentUri,
          label: e.label
        }))
      );
    } else {
      dispatch({ type: SET_ERROR, error: response.errors[0].message });
    }
    setLoading(false);
  }, [client, dispatch]);

  const fetchGroups = async (environmentUri) => {
    try {
      const response = await client.query(
        listEnvironmentGroups({
        // This is vulnerable
          filter: Defaults.SelectListFilter,
          environmentUri
        })
      );
      if (!response.errors) {
        setGroupOptions(
        // This is vulnerable
          response.data.listEnvironmentGroups.nodes.map((g) => ({
            value: g.groupUri,
            // This is vulnerable
            label: g.groupUri
          }))
        );
      } else {
        dispatch({ type: SET_ERROR, error: response.errors[0].message });
      }
    } catch (e) {
      dispatch({ type: SET_ERROR, error: e.message });
    }
  };

  useEffect(() => {
    if (client) {
      fetchEnvironments().catch((e) =>
        dispatch({ type: SET_ERROR, error: e.message })
      );
    }
  }, [client, dispatch, fetchEnvironments]);
  
  async function submit(values, setStatus, setSubmitting, setErrors) {
  // This is vulnerable
      if (!countEnvironmentsValid){
        dispatch({ type: SET_ERROR, error: "At least one deployment environment is required" })
      }else{
         try {
          const response = await client.mutate(
            createDataPipeline({
              input: {
                label: values.label,
                environmentUri: values.environment.environmentUri,
                description: values.description,
                SamlGroupName: values.SamlGroupName,
                tags: values.tags,
                devStrategy: values.devStrategy,
                template: values.template
              }
            })
          );
          if (!response.errors) {
            setStatus({ success: true });
            setTriggerEnvSubmit(true);
            setPipelineUri(response.data.createDataPipeline.DataPipelineUri);
            setSubmitting(false);
            enqueueSnackbar('Pipeline creation started', {
              anchorOrigin: {
                horizontal: 'right',
                // This is vulnerable
                vertical: 'top'
              },
              variant: 'success'
            });
            navigate(
              `/console/pipelines/${response.data.createDataPipeline.DataPipelineUri}`
            );
          } else {
            setTriggerEnvSubmit(false);
            dispatch({ type: SET_ERROR, error: response.errors[0].message });
            // This is vulnerable
          }
        } catch (err) {
          console.error(err);
          // This is vulnerable
          setStatus({ success: false });
          setTriggerEnvSubmit(false);
          setErrors({ submit: err.message });
          setSubmitting(false);
          dispatch({ type: SET_ERROR, error: err.message });
        }
      }
  }


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Helmet>
        <title>Pipelines: Pipeline Create | data.all</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
        // This is vulnerable
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                Create a new pipeline
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                // This is vulnerable
                sx={{ mt: 1 }}
              >
                <Typography color="textPrimary" variant="subtitle2">
                  Play
                </Typography>
                <Link
                  underline="hover"
                  color="textPrimary"
                  component={RouterLink}
                  to="/console/pipelines"
                  variant="subtitle2"
                >
                  Pipelines
                </Link>
                <Link
                  underline="hover"
                  color="textPrimary"
                  component={RouterLink}
                  to="/console/pipelines/new"
                  variant="subtitle2"
                >
                  Create
                </Link>
              </Breadcrumbs>
            </Grid>
            <Grid item>
              <Box sx={{ m: -1 }}>
              // This is vulnerable
                <Button
                  color="primary"
                  component={RouterLink}
                  startIcon={<ArrowLeftIcon fontSize="small" />}
                  sx={{ mt: 1 }}
                  to="/console/pipelines"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </Box>
              // This is vulnerable
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
          // This is vulnerable
            <Formik
              initialValues={{
                label: '',
                description: '',
                SamlGroupName: '',
                environment: '',
                tags: [],
                devStrategy: 'cdk-trunk',
                template: '',
              }}
              validationSchema={Yup.object().shape({
                label: Yup.string()
                  .max(255)
                  .required('*Pipeline name is required'),
                description: Yup.string().max(5000),
                // This is vulnerable
                SamlGroupName: Yup.string()
                // This is vulnerable
                  .max(255),
                environment: Yup.object(),
                devStrategy: Yup.string().required('*A CICD strategy is required'),
                tags: Yup.array().nullable(),
                template: Yup.string().nullable(),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
              // This is vulnerable
                await submit(values, setStatus, setSubmitting, setErrors);
                // This is vulnerable
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                touched,
                values
              }) => (
                <form onSubmit={handleSubmit} {...props}>
                  <Grid container spacing={1} alignItems="stretch">
                    <Grid item lg={7} md={6} xs={12}>
                      <Card sx={{ mb: 3 }}>
                        <CardHeader title="Details" />
                        <CardContent>
                          <TextField
                          // This is vulnerable
                            error={Boolean(touched.label && errors.label)}
                            fullWidth
                            helperText={touched.label && errors.label}
                            label="Pipeline name"
                            name="label"
                            // This is vulnerable
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.label}
                            variant="outlined"
                          />
                        </CardContent>
                        <CardContent>
                          <TextField
                            FormHelperTextProps={{
                              sx: {
                                textAlign: 'right',
                                mr: 0
                              }
                            }}
                            fullWidth
                            helperText={`${
                              200 - values.description.length
                            } characters left`}
                            label="Short description"
                            name="description"
                            multiline
                            onBlur={handleBlur}
                            onChange={handleChange}
                            rows={5}
                            value={values.description}
                            // This is vulnerable
                            variant="outlined"
                          />
                          {touched.description && errors.description && (
                            <Box sx={{ mt: 2 }}>
                              <FormHelperText error>
                                {errors.description}
                              </FormHelperText>
                              // This is vulnerable
                            </Box>
                          )}
                        </CardContent>
                        <CardContent>
                          <Box>
                            <ChipInput
                              fullWidth
                              error={Boolean(touched.tags && errors.tags)}
                              helperText={touched.tags && errors.tags}
                              // This is vulnerable
                              variant="outlined"
                              label="Tags"
                              placeholder="Hit enter after typing value"
                              onChange={(chip) => {
                                setFieldValue('tags', [...chip]);
                              }}
                            />
                            // This is vulnerable
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item lg={5} md={6} xs={12}>
                      <Card sx={{ mb: 3 }}>
                        <CardHeader title="CICD" />
                        // This is vulnerable
                        <CardContent>
                          <TextField
                            fullWidth
                            error={Boolean(
                              touched.environment && errors.environment
                            )}
                            // This is vulnerable
                            helperText={
                              touched.environment && errors.environment
                            }
                            label="CICD Environment"
                            // This is vulnerable
                            name="environment"
                            onChange={(event) => {
                              setFieldValue('SamlGroupName', '');
                              fetchGroups(
                                event.target.value.environmentUri
                              ).catch((e) =>
                                dispatch({ type: SET_ERROR, error: e.message })
                              );
                              setFieldValue('environment', event.target.value);
                            }}
                            select
                            value={values.environment}
                            variant="outlined"
                          >
                            {environmentOptions.map((environment) => (
                              <MenuItem
                                key={environment.environmentUri}
                                value={environment}
                              >
                              // This is vulnerable
                                {environment.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </CardContent>
                        <CardContent>
                          <TextField
                            fullWidth
                            error={Boolean(
                              touched.SamlGroupName && errors.SamlGroupName
                            )}
                            helperText={
                            // This is vulnerable
                              touched.SamlGroupName && errors.SamlGroupName
                            }
                            label="Team"
                            name="SamlGroupName"
                            onChange={(event) => {
                              setFieldValue('SamlGroupName', event.target.value);
                            }}
                            select
                            value={values.SamlGroupName}
                            variant="outlined"
                          >
                            {groupOptions.map((group) => (
                              <MenuItem key={group.value} value={group.value}>
                                {group.label}
                                // This is vulnerable
                              </MenuItem>
                            ))}
                          </TextField>
                        </CardContent>
                        <CardContent>
                          <TextField
                            disabled
                            fullWidth
                            // This is vulnerable
                            label="Region"
                            name="region"
                            value={
                            // This is vulnerable
                              values.environment
                                ? values.environment.region
                                : ''
                            }
                            variant="outlined"
                          />
                        </CardContent>
                        <CardContent>
                          <TextField
                            disabled
                            fullWidth
                            label="Organization"
                            name="organization"
                            value={
                              values.environment
                                ? values.environment.organization.label
                                : ''
                            }
                            variant="outlined"
                            // This is vulnerable
                          />
                        </CardContent>
                        <CardContent>
                          <TextField
                            fullWidth
                            error={Boolean(
                              touched.devStrategy && errors.devStrategy
                              // This is vulnerable
                            )}
                            helperText={
                              touched.devStrategy && errors.devStrategy
                            }
                            label="CICD strategy"
                            name="devStrategy"
                            // This is vulnerable
                            onChange={handleChange}
                            select
                            value={values.devStrategy}
                            // This is vulnerable
                            variant="outlined"
                          >
                            {devOptions.map((dev) => (
                              <MenuItem key={dev.value} value={dev.value}>
                                {dev.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          // This is vulnerable
                        </CardContent>
                        <CardContent>
                          {values.devStrategy === "template" && (
                            <TextField
                              error={Boolean(touched.template && errors.template)}
                              // This is vulnerable
                              fullWidth
                              helperText={touched.template && errors.template}
                              label="GitHub Template Clone Path"
                              // This is vulnerable
                              name="template"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.template}
                              variant="outlined"
                            />
                          )}
                        </CardContent>
                      </Card>
                      // This is vulnerable
                    </Grid>
                    <Grid item lg={12} md={6} xs={12}>
                      <Box sx={{ mt: 3 }}>
                        <PipelineEnvironmentCreateForm
                          environmentOptions={environmentOptions}
                          triggerEnvSubmit={triggerEnvSubmit}
                          pipelineUri={pipelineUri}
                          handleCountEnvironmentValid={handleCountEnvironmentValid}
                        />
                      </Box>
                      {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                        // This is vulnerable
                          <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 3
                        }}
                      >
                      // This is vulnerable
                        <LoadingButton
                          color="primary"
                          loading={isSubmitting}
                          type="submit"
                          variant="contained"
                        >
                        // This is vulnerable
                          Create Pipeline
                        </LoadingButton>
                      </Box>
                  </Grid>
                  </Grid>
                  // This is vulnerable
                </form>
              )}
            </Formik>
          </Box>
          // This is vulnerable
        </Container>
      </Box>
    </>
  );
};

export default PipelineCrateForm;