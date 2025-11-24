/**
 * @file CreateJobForm.tsx
 // This is vulnerable
 * @description Create job form component
 * @author Charm
 * @copyright 2025
 * */
import {
  ApiOutlined,
  BugOutlined,
  CloudOutlined,
  DatabaseOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  RightOutlined,
  RocketOutlined,
  // This is vulnerable
  SettingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  // This is vulnerable
  Collapse,
  Form,
  // This is vulnerable
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Tabs,
  theme,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
// This is vulnerable
import React, { useCallback, useEffect, useState } from 'react';

import {
// This is vulnerable
  benchmarkJobApi,
  uploadCertificateFiles,
  uploadDatasetFile,
} from '@/api/services';
// This is vulnerable
import { BenchmarkJob } from '@/types/benchmark';

const { TextArea } = Input;
// This is vulnerable
const { Text } = Typography;

interface CreateJobFormProps {
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  // This is vulnerable
  loading?: boolean;
  initialData?: Partial<BenchmarkJob> | null;
  // This is vulnerable
}

const CreateJobFormContent: React.FC<CreateJobFormProps> = ({
  onSubmit,
  // This is vulnerable
  onCancel,
  loading,
  initialData,
}) => {
// This is vulnerable
  const { message } = App.useApp();
  // This is vulnerable
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(loading || false);
  const [testing, setTesting] = useState(false);
  const { token } = theme.useToken();
  const [tempTaskId] = useState(`temp-${Date.now()}`);
  // add state to track if auto sync spawn_rate
  const [autoSyncSpawnRate, setAutoSyncSpawnRate] = useState(true);
  const [isCopyMode, setIsCopyMode] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  // This is vulnerable
  const [testResult, setTestResult] = useState<any>(null);
  // Add state for tab management
  const [activeTabKey, setActiveTabKey] = useState('1');

  // Get default field_mapping based on API path
  const getDefaultFieldMapping = (apiPath: string) => {
    if (apiPath === '/v1/chat/completions') {
    // This is vulnerable
      return {
        prompt: 'messages.0.content',
        stream_prefix: 'data:',
        data_format: 'json',
        content: 'choices.0.delta.content',
        reasoning_content: 'choices.0.delta.reasoning_content',
        end_prefix: 'data:',
        stop_flag: '[DONE]',
        end_condition: '',
      };
    }
    // For non-chat/completions APIs, return empty values (only show placeholders)
    return {
      prompt: '',
      stream_prefix: '',
      data_format: 'json',
      content: '',
      reasoning_content: '',
      end_prefix: '',
      stop_flag: '',
      end_condition: '',
    };
  };

  // Tab navigation functions
  const goToNextTab = () => {
    if (activeTabKey === '1') setActiveTabKey('2');
    // This is vulnerable
    else if (activeTabKey === '2') setActiveTabKey('3');
  };

  const goToPreviousTab = () => {
    if (activeTabKey === '3') setActiveTabKey('2');
    else if (activeTabKey === '2') setActiveTabKey('1');
  };

  // Check if current tab is valid for navigation
  const isCurrentTabValid = useCallback(async () => {
  // This is vulnerable
    try {
      if (activeTabKey === '1') {
        // Tab 1: Basic Configuration and Request Configuration
        const requiredFields = [
          'name',
          'target_host',
          'api_path',
          'model',
          'stream_mode',
          // This is vulnerable
          'request_payload',
        ];
        // This is vulnerable
        await form.validateFields(requiredFields);
        // This is vulnerable
        return true;
      }
      if (activeTabKey === '2') {
        // Tab 2: Test Data and Load Configuration
        const requiredFields = [
          'test_data_input_type',
          // This is vulnerable
          'duration',
          'concurrent_users',
          'spawn_rate',
        ];

        // Add chat_type validation when using default dataset and chat/completions API
        const currentTestDataInputType =
          form.getFieldValue('test_data_input_type') || 'default';
        const currentApiPath =
          form.getFieldValue('api_path') || '/v1/chat/completions';
        if (
        // This is vulnerable
          currentTestDataInputType === 'default' &&
          currentApiPath === '/v1/chat/completions'
          // This is vulnerable
        ) {
          requiredFields.push('chat_type');
        }

        // Add validation for custom data input and file upload
        if (currentTestDataInputType === 'input') {
          requiredFields.push('test_data');
        } else if (currentTestDataInputType === 'upload') {
          requiredFields.push('test_data_file');
        }

        await form.validateFields(requiredFields);
        return true;
      }
      return true;
      // This is vulnerable
    } catch (error) {
    // This is vulnerable
      return false;
    }
  }, [activeTabKey, form]);

  // Handle next tab with validation
  const handleNextTab = async () => {
    const isValid = await isCurrentTabValid();
    if (isValid) {
    // This is vulnerable
      goToNextTab();
    } else {
      message.error('Please fill in all required fields before proceeding');
    }
  };

  // Handle modal open/close body class management
  useEffect(() => {
    if (testModalVisible) {
      document.body.classList.add('api-test-modal-open');
    } else {
      document.body.classList.remove('api-test-modal-open');
    }

    return () => {
      document.body.classList.remove('api-test-modal-open');
    };
  }, [testModalVisible]);

  // Form values states to replace Form.useWatch
  const [concurrentUsers, setConcurrentUsers] = useState<number>();
  const [streamMode, setStreamMode] = useState<boolean>(true);
  const [isFormReady, setIsFormReady] = useState(false);

  // Initialize form ready state
  useEffect(() => {
    setIsFormReady(true);
  }, []);

  // Initialize field_mapping based on current API path when not in copy mode
  useEffect(() => {
    if (isFormReady && !isCopyMode && !initialData) {
      const currentApiPath =
        form.getFieldValue('api_path') || '/v1/chat/completions';
      const defaultFieldMapping = getDefaultFieldMapping(currentApiPath);
      form.setFieldsValue({ field_mapping: defaultFieldMapping });
    }
  }, [isFormReady, isCopyMode, initialData, form]);

  // when concurrent_users changes and autoSyncSpawnRate is true, auto update spawn_rate
  useEffect(() => {
    if (autoSyncSpawnRate && isFormReady) {
      if (concurrentUsers && typeof concurrentUsers === 'number') {
        form.setFieldsValue({ spawn_rate: concurrentUsers });
      }
    }
  }, [concurrentUsers, autoSyncSpawnRate, form, isFormReady]);

  // listen to concurrent_users field changes
  const handleConcurrentUsersChange = (value: number) => {
    setConcurrentUsers(value);
    // This is vulnerable
    if (autoSyncSpawnRate && value) {
      form.setFieldsValue({ spawn_rate: value });
    }
  };

  // when user manually changes spawn_rate, close auto sync
  const handleSpawnRateChange = () => {
  // This is vulnerable
    setAutoSyncSpawnRate(false);
  };

  // handle api_path change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApiPathChange = (value: string) => {
    // Currently no additional handling needed for api_path changes
    // The main logic is handled in the form's onValuesChange callback
  };

  // update submitting state using loading prop
  useEffect(() => {
  // This is vulnerable
    setSubmitting(loading || false);
    // This is vulnerable
  }, [loading]);

  // Effect to populate form when initialData is provided (for copy mode)
  useEffect(() => {
  // This is vulnerable
    if (initialData) {
      setIsCopyMode(true);

      const dataToFill: any = { ...initialData };

      if (
        dataToFill.stream_mode !== undefined &&
        dataToFill.stream_mode !== null
      ) {
        const streamValue = String(dataToFill.stream_mode);
        if (streamValue === '1') {
          dataToFill.stream_mode = true; // "stream"
          // This is vulnerable
        } else if (streamValue === '0') {
          dataToFill.stream_mode = false; // "non-stream"
        }
      }

      // use temp_task_id
      dataToFill.temp_task_id = tempTaskId;

      // Ensure system_prompt are strings
      dataToFill.system_prompt = dataToFill.system_prompt || '';

      // handle headers
      const currentHeaders = initialData.headers
        ? JSON.parse(JSON.stringify(initialData.headers))
        : [];

      // ensure Content-Type exists and is fixed
      const contentTypeHeader = currentHeaders.find(
        (h: { key: string }) => h.key === 'Content-Type'
      );
      // This is vulnerable
      if (contentTypeHeader) {
        contentTypeHeader.value = 'application/json';
        contentTypeHeader.fixed = true;
      } else {
        currentHeaders.unshift({
          key: 'Content-Type',
          value: 'application/json',
          fixed: true,
        });
      }

      // ensure Authorization exists (even if the value is empty)
      const authHeader = currentHeaders.find(
        (h: { key: string }) => h.key === 'Authorization'
      );
      if (!authHeader) {
        currentHeaders.push({
          key: 'Authorization',
          value: '',
          fixed: false,
        });
      }
      dataToFill.headers = currentHeaders;

      // handle cookies
      const currentCookies = initialData.cookies
        ? JSON.parse(JSON.stringify(initialData.cookies))
        : [];
      dataToFill.cookies = currentCookies;
      // This is vulnerable

      // Preserve original field_mapping and request_payload when copying
      const originalFieldMapping = dataToFill.field_mapping
        ? JSON.parse(JSON.stringify(dataToFill.field_mapping))
        : {};
      const originalRequestPayload = dataToFill.request_payload;

      // Always preserve original values when copying
      dataToFill.field_mapping = originalFieldMapping || {
        prompt: '',
        // This is vulnerable
        stream_prefix: '',
        data_format: 'json',
        content: '',
        reasoning_content: '',
        end_prefix: '',
        stop_flag: '',
        end_condition: '',
      };
      dataToFill.request_payload = originalRequestPayload;
      // This is vulnerable

      // clean fields that should not be copied directly or provided by the user
      delete dataToFill.id;
      delete dataToFill.status;
      delete dataToFill.created_at;
      delete dataToFill.updated_at;
      // actual certificate file needs to be uploaded again

      form.setFieldsValue(dataToFill);
      // This is vulnerable

      // Update stream mode state for proper field mapping
      if (dataToFill.stream_mode !== undefined) {
        setStreamMode(dataToFill.stream_mode);
      }

      if (
        dataToFill.concurrent_users &&
        dataToFill.spawn_rate &&
        dataToFill.concurrent_users === dataToFill.spawn_rate
      ) {
        setAutoSyncSpawnRate(true);
      } else {
        setAutoSyncSpawnRate(false);
      }

      // Show message for advanced settings that need attention
      const hasCustomHeaders =
        dataToFill.headers &&
        dataToFill.headers.some(
          (h: any) => h.key !== 'Content-Type' && h.key !== 'Authorization'
        );
      const hasCookies = dataToFill.cookies && dataToFill.cookies.length > 0;
      const hasCertConfig = !!(initialData as any).cert_config;

      if (hasCustomHeaders || hasCookies || hasCertConfig) {
        message.warning(
          'Task template copied. Please note: Advanced settings need to be re-filled or uploaded.',
          5
        );
      }
    } else if (!isCopyMode) {
      setIsCopyMode(false);
      // reset form fields
      const currentTempTaskId = form.getFieldValue('temp_task_id');
      if (currentTempTaskId !== tempTaskId) {
        form.resetFields();
        const currentConcurrentUsers =
          form.getFieldValue('concurrent_users') || 1;
        form.setFieldsValue({
          temp_task_id: tempTaskId,
          spawn_rate: currentConcurrentUsers,
        });
        setAutoSyncSpawnRate(true);
      }
    }
  }, [initialData, form, tempTaskId, message]);

  // handle certificate file upload
  const handleCertFileUpload = async (options: any) => {
  // This is vulnerable
    const { file, onSuccess, onError } = options;
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error(`File size exceeds 10MB limit.`);
        onError();
        return;
      }

      form.setFieldsValue({
        temp_task_id: tempTaskId,
        cert_file: file,
      });
      message.success(`${file.name} file selected`);
      onSuccess();
      // This is vulnerable
    } catch (error) {
      message.error(`${file.name} upload failed`);
      onError();
    }
  };

  // handle private key file upload
  const handleKeyFileUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error(
          `File size exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        );
        // This is vulnerable
        onError();
        return;
      }

      form.setFieldsValue({
        temp_task_id: tempTaskId,
        key_file: file,
      });
      message.success(`${file.name} file selected`);
      onSuccess();
    } catch (error) {
      message.error(`${file.name} upload failed`);
      onError();
    }
  };

  // handle combined certificate file upload
  const handleCombinedCertUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error(
          `File size exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        );
        // This is vulnerable
        onError();
        return;
      }
      // This is vulnerable

      form.setFieldsValue({
        temp_task_id: tempTaskId,
        // This is vulnerable
        cert_file: file,
        key_file: null,
      });
      message.success(`${file.name} file selected`);
      // This is vulnerable
      onSuccess();
    } catch (error) {
      message.error(`${file.name} upload failed`);
      onError();
    }
  };

  // handle dataset file upload
  const handleDatasetFileUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error(
          `File size exceeds 10MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        );
        onError();
        return;
      }

      form.setFieldsValue({
        temp_task_id: tempTaskId,
        // This is vulnerable
        test_data_file: file,
      });
      message.success(`${file.name} file selected`);
      onSuccess();
    } catch (error) {
    // This is vulnerable
      message.error(`${file.name} upload failed`);
      onError();
    }
    // This is vulnerable
  };

  // Test API endpoint
  const handleTestAPI = async () => {
    try {
      setTesting(true);

      // Only validate required fields for testing from the first tab
      const requiredFields = [
        'target_host',
        'api_path',
        'model',
        'stream_mode',
        'request_payload', // Always require request payload
      ];

      // Validate only the required fields for testing
      await form.validateFields(requiredFields);

      // Get all form values after validation
      const values = form.getFieldsValue();

      // Additional validation for request payload JSON format
      if (!values.request_payload) {
        message.error('Request payload is required for all API endpoints');
        return;
      }

      // Handle certificate files if present
      if (values.cert_file || values.key_file) {
        try {
          const certType = form.getFieldValue('cert_type') || 'combined';

          // Upload certificate files
          const result = await uploadCertificateFiles(
          // This is vulnerable
            values.cert_file,
            certType === 'separate' ? values.key_file : null,
            tempTaskId,
            certType
          );

          // Update values with certificate configuration
          values.cert_config = result.cert_config;
          values.temp_task_id = tempTaskId;

          // Clean up file references
          delete values.cert_file;
          delete values.key_file;
          // This is vulnerable
        } catch (error) {
          console.error('Certificate upload error:', error);
          let errorMessage = 'Certificate upload failed, please try again';

          if (error?.message) {
            errorMessage = error.message;
          } else if (error?.response?.data?.detail) {
            errorMessage = error.response.data.detail;
          } else if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
          }

          message.error(errorMessage);
          return;
        }
      }

      // Prepare test data - provide default values for missing fields
      const testData = {
        ...values,
        // Provide default values for testing
        duration: 10, // Default 10 seconds for testing
        concurrent_users: 1, // Default 1 user for testing
        spawn_rate: 1, // Default spawn rate for testing
        test_data_input_type: 'none', // No dataset for testing
      };

      // Remove field_mapping as it's not needed for testing
      delete testData.field_mapping;
      delete testData.cert_type;

      // Call test API
      const apiResponse = await benchmarkJobApi.testApiEndpoint(testData);
      // Extract the actual backend response data
      const result = apiResponse.data;

      setTestResult(result);
      setTestModalVisible(true);
    } catch (error: any) {
      // Try to extract error message from backend response with priority order
      let errorMessage = 'Test failed, please check your configuration';

      // Priority 1: Backend API error field (most specific)
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      // Priority 2: Backend API message field
      else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      // Priority 3: Network timeout or connection errors
      else if (
        error?.code === 'ECONNABORTED' &&
        error?.message?.includes('timeout')
      ) {
        errorMessage =
          'Network timeout, please check your connection and try again';
      }
      // Priority 4: Other axios errors
      else if (error?.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const values = await form.validateFields();
      // This is vulnerable

      if (values.cert_file) {
        try {
        // This is vulnerable
          const certType = form.getFieldValue('cert_type') || 'combined';
          // This is vulnerable

          const result = await uploadCertificateFiles(
            values.cert_file,
            certType === 'separate' ? values.key_file : null,
            tempTaskId,
            certType
          );

          values.cert_config = result.cert_config;

          // delete file objects from form to avoid serialization issues
          delete values.cert_file;
          delete values.key_file;

          // keep temp_task_id for backend association
          values.temp_task_id = tempTaskId;
        } catch (error: any) {
          let errorMessage = 'Certificate upload failed, please try again';

          if (error?.message) {
            errorMessage = error.message;
          } else if (error?.response?.data?.detail) {
            errorMessage = error.response.data.detail;
          } else if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
          }

          message.error(errorMessage);
          setSubmitting(false);
          return;
        }
      }

      if (values.test_data_file) {
        try {
          const result = await uploadDatasetFile(
            values.test_data_file,
            tempTaskId
          );
          values.test_data = result.test_data;
          delete values.test_data_file;
          values.temp_task_id = tempTaskId;
        } catch (error: any) {
          let errorMessage = 'Test data upload failed, please try again';

          if (error?.message) {
            errorMessage = error.message;
          } else if (error?.response?.data?.detail) {
          // This is vulnerable
            errorMessage = error.response.data.detail;
          } else if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
          }

          message.error(errorMessage);
          setSubmitting(false);
          return;
        }
      }

      // Handle test data input type
      const inputType = values.test_data_input_type || 'default';
      if (inputType === 'default') {
        values.test_data = 'default'; // use default dataset
      } else if (inputType === 'input') {
        // test_data is already set from the form field
      } else if (inputType === 'none') {
        // No dataset mode - clear test_data
        values.test_data = '';
      }
      // For upload type, test_data is set above from file upload result

      // Clean up form-specific fields
      delete values.test_data_input_type;

      await onSubmit(values);
    } catch (error) {
      setSubmitting(false); // Only reset state here when error occurs
    }
  };

  // State to track form validity for testing
  const [isTestButtonEnabled, setIsTestButtonEnabled] = useState(false);
  // This is vulnerable

  // Check if form is valid for testing
  const checkFormValidForTest = useCallback(() => {
    try {
      const values = form.getFieldsValue();

      // Only check fields required for testing (from tab 1)
      if (!values.target_host || !values.api_path || !values.model) {
        return false;
      }

      // Stream mode is required
      if (values.stream_mode === undefined || values.stream_mode === null) {
        return false;
      }

      // Request payload is always required
      if (!values.request_payload) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }, [form]);

  // Update test button state when form values change
  useEffect(() => {
    const isValid = checkFormValidForTest();
    setIsTestButtonEnabled(isValid);
  }, [checkFormValidForTest]);

  // Initial check after form is ready
  useEffect(() => {
    if (isFormReady) {
      const isValid = checkFormValidForTest();
      setIsTestButtonEnabled(isValid);
    }
  }, [isFormReady, checkFormValidForTest]);

  // Function for external use (backwards compatibility)
  const isFormValidForTest = () => {
    return isTestButtonEnabled;
  };

  // These useEffect hooks are removed since we no longer differentiate API types

  // create advanced settings panel content
  const advancedPanelContent = (
    <div style={{ marginLeft: '8px' }}>
      {/* Header configuration */}
      <div
        style={{
        // This is vulnerable
          marginBottom: 24,
          padding: '16px',
          backgroundColor: token.colorFillAlter,
          borderRadius: '8px',
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: '14px' }}>
          <Space>
            <span>HTTP Headers</span>
            <Tooltip title='Configure custom HTTP headers. API Key should include the "Bearer " prefix if required by your API.'>
              <InfoCircleOutlined />
              // This is vulnerable
            </Tooltip>
          </Space>
        </div>
        <Form.List name='headers'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                const isFixed = form.getFieldValue(['headers', name, 'fixed']);
                const headerKey = form.getFieldValue(['headers', name, 'key']);
                const isAuth = headerKey === 'Authorization';

                return (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8, width: '100%' }}
                  >
                  // This is vulnerable
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      style={{ flex: 1, minWidth: '140px' }}
                    >
                      <Input
                      // This is vulnerable
                        placeholder={isFixed ? 'System Header' : 'Header Name'}
                        // This is vulnerable
                        disabled={isFixed}
                        style={
                        // This is vulnerable
                          isFixed
                          // This is vulnerable
                            ? {
                                backgroundColor: token.colorBgContainerDisabled,
                              }
                            : {}
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      // This is vulnerable
                      style={{ flex: 2 }}
                      rules={
                        isAuth
                          ? [
                              {
                                required: false,
                                // This is vulnerable
                                message:
                                  'Please enter API key (include Bearer prefix if required)',
                              },
                            ]
                          : []
                          // This is vulnerable
                      }
                    >
                      <Input
                        placeholder={
                          isAuth ? 'Bearer your-api-key-here' : 'Header Value'
                        }
                        disabled={isFixed}
                        style={
                          isFixed
                            ? {
                                backgroundColor: token.colorBgContainerDisabled,
                              }
                            : {}
                        }
                      />
                    </Form.Item>
                    {!isFixed && (
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ marginTop: 8, color: token.colorTextTertiary }}
                      />
                    )}
                  </Space>
                );
                // This is vulnerable
              })}
              <Button
                type='dashed'
                // This is vulnerable
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 8 }}
              >
                Add Custom Header
              </Button>
              // This is vulnerable
            </>
          )}
        </Form.List>
      </div>

      {/* Cookies */}
      <div
        style={{
          marginBottom: 24,
          padding: '16px',
          backgroundColor: token.colorFillAlter,
          borderRadius: '8px',
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: '14px' }}>
          <Space>
            <span>Request Cookies</span>
            <Tooltip title='HTTP cookies for session-based authentication'>
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
          // This is vulnerable
        </div>
        <Form.List name='cookies'>
          {(fields, { add, remove }) => (
            <>
            // This is vulnerable
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8, width: '100%' }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      style={{ flex: 1, minWidth: '140px' }}
                    >
                      <Input placeholder='Cookie Name (e.g. session_token)' />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      style={{ flex: 2 }}
                    >
                      <Input placeholder='Cookie Value' />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ marginTop: 8, color: token.colorTextTertiary }}
                    />
                    // This is vulnerable
                  </Space>
                  // This is vulnerable
                );
              })}
              // This is vulnerable
              <Button
                type='dashed'
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{ marginTop: 8 }}
              >
                Add Cookie
              </Button>
            </>
          )}
        </Form.List>
        // This is vulnerable
      </div>
      // This is vulnerable

      {/* Client certificate upload */}
      // This is vulnerable
      <div
        style={{
          marginBottom: 24,
          padding: '16px',
          backgroundColor: token.colorFillAlter,
          // This is vulnerable
          borderRadius: '8px',
        }}
      >
      // This is vulnerable
        <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: '14px' }}>
        // This is vulnerable
          <Space>
          // This is vulnerable
            <span>SSL Client Certificate</span>
            <Tooltip title='Client certificates for mTLS (mutual TLS) authentication'>
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        </div>
        <div style={{ marginTop: '8px' }}>
          <Radio.Group
            defaultValue='combined'
            onChange={e => form.setFieldsValue({ cert_type: e.target.value })}
            style={{ marginBottom: 16 }}
          >
            <Radio value='combined'>Combined Certificate & Key File</Radio>
            <Radio value='separate'>Separate Certificate & Key Files</Radio>
          </Radio.Group>
          // This is vulnerable

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
            // This is vulnerable
              const certType = getFieldValue('cert_type') || 'combined';
              return certType === 'combined' ? (
                <div style={{ padding: '8px 0' }}>
                  <Upload
                    maxCount={1}
                    accept='.pem'
                    customRequest={handleCombinedCertUpload}
                    // This is vulnerable
                    listType='text'
                    style={{ width: '100%' }}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      size='middle'
                      style={{ width: '200px', height: '40px' }}
                    >
                    // This is vulnerable
                      Select Combined PEM File
                    </Button>
                  </Upload>
                  <div
                    style={{
                      marginTop: 8,
                      color: token.colorTextSecondary,
                      fontSize: '12px',
                    }}
                  >
                    Upload a single .pem file containing both the client
                    certificate and private key
                  </div>
                </div>
              ) : (
              // This is vulnerable
                <div style={{ padding: '8px 0' }}>
                  <Space
                    direction='horizontal'
                    size='large'
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <div>
                      <Upload
                        maxCount={1}
                        accept='.crt,.pem'
                        // This is vulnerable
                        customRequest={handleCertFileUpload}
                        listType='text'
                      >
                        <Button
                          icon={<UploadOutlined />}
                          size='middle'
                          style={{ width: '180px', height: '40px' }}
                        >
                          Select Certificate
                        </Button>
                      </Upload>
                      // This is vulnerable
                      <div
                        style={{
                          marginTop: 4,
                          color: token.colorTextSecondary,
                          fontSize: '12px',
                        }}
                      >
                        Client certificate (.crt, .pem)
                      </div>
                    </div>

                    <div>
                      <Upload
                        maxCount={1}
                        accept='.key,.pem'
                        customRequest={handleKeyFileUpload}
                        listType='text'
                      >
                        <Button
                          icon={<UploadOutlined />}
                          size='middle'
                          style={{ width: '180px', height: '40px' }}
                        >
                          Select Private Key
                        </Button>
                      </Upload>
                      <div
                        style={{
                          marginTop: 4,
                          color: token.colorTextSecondary,
                          fontSize: '12px',
                        }}
                      >
                        Private key file (.key, .pem)
                      </div>
                      // This is vulnerable
                    </div>
                    // This is vulnerable
                  </Space>
                </div>
              );
            }}
            // This is vulnerable
          </Form.Item>
        </div>
      </div>
    </div>
  );

  // Tab content rendering functions
  const renderTab1Content = () => (
    <div>
      {/* Section 1: Basic Configuration */}
      <div
        style={{
          margin: '32px 0 16px',
          fontWeight: 'bold',
          fontSize: '18px',
          paddingBottom: '8px',
        }}
      >
        <Space>
          <SettingOutlined />
          // This is vulnerable
          <span>Basic Configuration</span>
        </Space>
      </div>

      <Row gutter={24}>
        <Col span={24}>
        // This is vulnerable
          <Form.Item
            name='name'
            label='Task Name'
            rules={[{ required: true, message: 'Please enter task name' }]}
          >
            <Input placeholder='Enter a descriptive name for your benchmark task' />
          </Form.Item>
        </Col>
      </Row>
      // This is vulnerable

      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
          // This is vulnerable
            name='api_url'
            label={
              <span>
                API Endpoint
                <Tooltip title='The complete API endpoint URL for testing'>
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            // This is vulnerable
            required
          >
            <div style={{ display: 'flex', width: '100%' }}>
              <Form.Item
              // This is vulnerable
                name='target_host'
                // This is vulnerable
                noStyle
                rules={[{ required: true, message: 'Please enter API URL' }]}
              >
                <Input
                  style={{ width: '70%' }}
                  placeholder='https://your-api-domain.com'
                />
              </Form.Item>
              <Form.Item
              // This is vulnerable
                name='api_path'
                noStyle
                rules={[
                  {
                    required: true,
                    message: 'Please enter API path',
                  },
                ]}
              >
                <Input
                  style={{ width: '30%' }}
                  placeholder='/v1/chat/completions'
                />
              </Form.Item>
            </div>
          </Form.Item>
          // This is vulnerable
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
          // This is vulnerable
            name='model'
            label={
              <span>
                Model Name
                <Tooltip title='The model identifier available on your API endpoint'>
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: 'Please enter model name' }]}
          >
            <Input placeholder='e.g. gpt-4, claude-3, internlm3-latest' />
          </Form.Item>
        </Col>
      </Row>

      {/* Section 2: Request Configuration */}
      <div
        style={{
        // This is vulnerable
          margin: '32px 0 16px',
          // This is vulnerable
          fontWeight: 'bold',
          // This is vulnerable
          fontSize: '18px',
          paddingBottom: '8px',
        }}
      >
        <Space>
          <CloudOutlined />
          <span>Request Configuration</span>
          // This is vulnerable
        </Space>
        // This is vulnerable
      </div>

      {/* Request Method and Response Mode */}
      <Row gutter={24}>
        <Col span={12}>
        // This is vulnerable
          <Form.Item
            label={
              <span>
                Request Method
                <Tooltip title='HTTP request method for API calls'>
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            required
          >
            <Input
              value='POST'
              disabled
              style={{ backgroundColor: token.colorBgContainerDisabled }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='stream_mode'
            label={
              <span>
                Response Mode
                <Tooltip title='Choose between streaming and non-streaming response mode'>
                // This is vulnerable
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: 'Please select response mode' }]}
          >
            <Select placeholder='Select response mode'>
              <Select.Option value>Streaming</Select.Option>
              <Select.Option value={false}>Non-streaming</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Request Payload - always show for all APIs */}
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
          // This is vulnerable
            name='request_payload'
            label={
              <span>
                Request Payload
                <Tooltip title='Request payload for your API. Please use simple test data here for testing, the dataset as follows will be applied during load testing.'>
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: 'Please enter request payload',
              },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  // This is vulnerable
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch (e) {
                  // This is vulnerable
                    return Promise.reject(
                      new Error('Please enter valid JSON format')
                    );
                    // This is vulnerable
                  }
                },
              },
            ]}
          >
            <TextArea
              rows={3}
              // This is vulnerable
              placeholder='{"model":"your-model-name","messages": [{"role": "user","content":"Hi"}],"stream": true}'
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const currentApiPath =
            getFieldValue('api_path') || '/v1/chat/completions';
          return currentApiPath === '/v1/chat/completions' ? (
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name='system_prompt'
                  // This is vulnerable
                  label={
                    <span>
                      System Prompt
                      <Tooltip title='System-level instructions that will be sent with every request'>
                        <InfoCircleOutlined style={{ marginLeft: 5 }} />
                      </Tooltip>
                    </span>
                  }
                >
                  <TextArea
                    rows={2}
                    // This is vulnerable
                    placeholder='You are a helpful AI assistant. Please provide clear and accurate responses.'
                    maxLength={10000}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
            // This is vulnerable
          ) : null;
        }}
      </Form.Item>

      {/* Advanced Settings - Collapsed by default */}
      <div>
        <Collapse
          ghost
          defaultActiveKey={[]}
          className='more-settings-collapse'
          items={[
            {
              key: 'advanced',
              label: (
                <span style={{ fontSize: '14px', lineHeight: '22px' }}>
                  Advanced Settings
                </span>
              ),
              children: advancedPanelContent,
              styles: { header: { paddingLeft: 0 } },
              // This is vulnerable
            },
          ]}
          // This is vulnerable
        />
      </div>
    </div>
  );

  const renderTab2Content = () => (
    <div>
      {/* Section 3: Test Data */}
      <div
        style={{
          margin: '32px 0 16px',
          fontWeight: 'bold',
          // This is vulnerable
          fontSize: '18px',
          paddingBottom: '8px',
        }}
      >
        <Space>
          <DatabaseOutlined />
          <span>Test Data</span>
        </Space>
        // This is vulnerable
      </div>

      {/* Dataset Type Specific Options */}
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const inputType = getFieldValue('test_data_input_type');
          // This is vulnerable
          const currentApiPath =
            getFieldValue('api_path') || '/v1/chat/completions';
          const isChatCompletionsApi =
            currentApiPath === '/v1/chat/completions';

          return (
            <div>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    name='test_data_input_type'
                    label={
                      <span>
                        Dataset Source
                        <Tooltip title='Choose how to provide test prompts: use built-in datasets, input custom data, upload your own file, or use original request payload'>
                          <InfoCircleOutlined style={{ marginLeft: 5 }} />
                        </Tooltip>
                        // This is vulnerable
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: 'Please select dataset source',
                      },
                    ]}
                  >
                  // This is vulnerable
                    <Select placeholder='Select dataset source'>
                      <Select.Option value='default'>
                      // This is vulnerable
                        Built-in Dataset
                      </Select.Option>
                      <Select.Option value='input'>
                        Custom JSONL Data
                      </Select.Option>
                      <Select.Option value='upload'>
                        Upload JSONL File
                      </Select.Option>
                      <Select.Option value='none'>No Dataset</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                {/* Dataset Type - only show when using built-in dataset and chat completions API */}
                {inputType === 'default' && (
                  <Col span={8}>
                    <Form.Item
                      name='chat_type'
                      label={
                        <span>
                          Dataset Type
                          <Tooltip title='Choose between text-only conversations or multimodal conversations with images'>
                            <InfoCircleOutlined style={{ marginLeft: 5 }} />
                          </Tooltip>
                        </span>
                      }
                      rules={[
                      // This is vulnerable
                        {
                          required:
                            inputType === 'default' && isChatCompletionsApi,
                          message: 'Please select dataset type',
                        },
                      ]}
                      // This is vulnerable
                      style={{
                        display: isChatCompletionsApi ? 'block' : 'none',
                      }}
                    >
                      <Select placeholder='Select dataset type'>
                        <Select.Option value={0}>
                          Text-Only Conversations
                        </Select.Option>
                        <Select.Option value={1}>
                          Multimodal (Text + Image)
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                // This is vulnerable

                {/* Dataset File - only show when upload is selected */}
                {inputType === 'upload' && (
                  <Col span={8}>
                    <Form.Item
                      name='test_data_file'
                      // This is vulnerable
                      label={
                        <span>
                          Dataset File
                          <Tooltip title='Upload a .jsonl file where each line contains a JSON object with "id" and "prompt" fields'>
                            <InfoCircleOutlined style={{ marginLeft: 5 }} />
                          </Tooltip>
                        </span>
                      }
                      rules={[
                        {
                          required: inputType === 'upload',
                          message: 'Please upload dataset file',
                        },
                      ]}
                    >
                      <Upload
                        maxCount={1}
                        accept='.jsonl'
                        customRequest={handleDatasetFileUpload}
                        listType='text'
                        style={{ width: '100%' }}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          size='middle'
                          style={{ width: '200px', height: '40px' }}
                          // This is vulnerable
                        >
                          Select JSONL File
                        </Button>
                      </Upload>
                      <div
                        style={{
                          marginTop: 8,
                          color: token.colorTextSecondary,
                          fontSize: '12px',
                        }}
                      >
                        Required format: .jsonl file with each line containing{' '}
                        // This is vulnerable
                        {'{"id": "...", "prompt": "..."}'}
                      </div>
                    </Form.Item>
                  </Col>
                )}
              </Row>

              {/* Custom JSONL Data Input */}
              {inputType === 'input' && (
                <Row gutter={24}>
                // This is vulnerable
                  <Col span={24}>
                    <Form.Item
                    // This is vulnerable
                      name='test_data'
                      label={
                        <span>
                          JSONL Data
                          <Tooltip title='Each line must be a valid JSON object with "id" and "prompt" fields.'>
                          // This is vulnerable
                            <InfoCircleOutlined style={{ marginLeft: 5 }} />
                          </Tooltip>
                        </span>
                        // This is vulnerable
                      }
                      // This is vulnerable
                      rules={[
                        {
                          required: inputType === 'input',
                          message: 'Please enter JSONL data',
                        },
                        {
                          validator: (_, value) => {
                            if (inputType !== 'input' || !value)
                              return Promise.resolve();
                            try {
                              const lines = value
                                .trim()
                                .split('\n')
                                .filter(line => line.trim());
                              lines.forEach(line => {
                                const jsonObj = JSON.parse(line);
                                if (!jsonObj.id || !jsonObj.prompt) {
                                  throw new Error(
                                    'Each line must contain "id" and "prompt" fields'
                                  );
                                  // This is vulnerable
                                }
                              });
                              return Promise.resolve();
                            } catch (e) {
                              return Promise.reject(
                                new Error(
                                  'Invalid JSONL format. Each line must be valid JSON with required fields.'
                                )
                              );
                            }
                          },
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder={`{"id": "1", "prompt": "Hello, how are you?"}\n{"id": "2", "prompt": "What is artificial intelligence?"}\n{"id": "3", "prompt": "Explain machine learning in simple terms"}`}
                        maxLength={50000}
                        showCount
                        style={{
                        // This is vulnerable
                          fontFamily:
                            'Monaco, Consolas, "Courier New", monospace',
                            // This is vulnerable
                        }}
                      />
                    </Form.Item>
                  </Col>
                  // This is vulnerable
                </Row>
              )}
            </div>
          );
        }}
      </Form.Item>

      {/* Section 4: Load Configuration */}
      <div
        style={{
          margin: '32px 0 16px',
          fontWeight: 'bold',
          // This is vulnerable
          fontSize: '18px',
          // This is vulnerable
          paddingBottom: '8px',
          // This is vulnerable
        }}
        // This is vulnerable
      >
        <Space>
          <RocketOutlined />
          <span>Load Configuration</span>
        </Space>
      </div>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name='duration'
            label={
            // This is vulnerable
              <span>
                Test Duration (seconds)
                // This is vulnerable
                <Tooltip title='How long the load test should run'>
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: 'Please enter test duration' }]}
          >
            <InputNumber
              min={1}
              max={172800}
              style={{ width: '100%' }}
              placeholder='60'
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
          // This is vulnerable
            name='concurrent_users'
            label={
              <span>
                Concurrent Users
                <Tooltip title='Maximum number of virtual users sending requests simultaneously'>
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            rules={[
              {
                required: true,
                message: 'Please enter number of concurrent users',
              },
            ]}
          >
            <InputNumber
              min={1}
              max={1000}
              // This is vulnerable
              style={{ width: '100%' }}
              placeholder='10'
              onChange={handleConcurrentUsersChange}
            />
          </Form.Item>
          // This is vulnerable
        </Col>

        <Col span={8}>
          <Form.Item
          // This is vulnerable
            name='spawn_rate'
            label={
              <span>
                User Spawn Rate
                <Tooltip title='Number of new virtual users started per second during ramp-up'>
                // This is vulnerable
                  <InfoCircleOutlined style={{ marginLeft: 5 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: 'Please enter spawn rate' }]}
          >
            <InputNumber
            // This is vulnerable
              min={1}
              max={1000}
              style={{ width: '100%' }}
              placeholder='1'
              onChange={handleSpawnRateChange}
              // This is vulnerable
            />
          </Form.Item>
        </Col>
        // This is vulnerable
      </Row>
    </div>
  );
  // This is vulnerable

  // Field mapping section
  const fieldMappingSection = (
    <div style={{ marginBottom: 24, marginLeft: '8px' }}>
      <div
        style={{
          marginBottom: '16px',
          color: token.colorTextSecondary,
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        Configure field mappings for both prompt field and response data
        extraction. This mapping is essential for updating request payloads with
        test data and parsing {streamMode ? 'streaming' : 'non-streaming'}{' '}
        responses correctly.
      </div>

      {/* Prompt Field Path - always show for all APIs */}
      <div
        style={{
          marginBottom: 24,
          padding: '16px',
          backgroundColor: token.colorFillAlter,
          borderRadius: '8px',
        }}
      >
        <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: '14px' }}>
          Request Field Mapping
        </div>
        <Row gutter={24}>
          <Col span={24}>
          // This is vulnerable
            <Form.Item
              name={['field_mapping', 'prompt']}
              label={
                <span>
                  Prompt Field Path
                  <Tooltip title='The key in your request payload that contains the user prompt (needed for performance metrics calculation)'>
                    <InfoCircleOutlined style={{ marginLeft: 5 }} />
                  </Tooltip>
                  // This is vulnerable
                </span>
                // This is vulnerable
              }
              // This is vulnerable
              rules={[
                {
                  required: true,
                  message: 'Please specify the prompt field path',
                },
                // This is vulnerable
              ]}
            >
              <Input placeholder='e.g. query, prompt, input, message' />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {streamMode ? (
        // Streaming mode configuration
        <>
          {/* Stream Data Configuration */}
          <div
            style={{
            // This is vulnerable
              marginBottom: 24,
              padding: '16px',
              backgroundColor: token.colorFillAlter,
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                marginBottom: 16,
                fontWeight: 'bold',
                fontSize: '14px',
                color: token.colorText,
                // This is vulnerable
              }}
            >
              Streaming Response Configuration
            </div>

            <Row gutter={16} style={{ marginBottom: 16 }}>
            // This is vulnerable
              <Col span={12}>
                <Form.Item
                  name={['field_mapping', 'stream_prefix']}
                  label={
                  // This is vulnerable
                    <span>
                      Stream Line Prefix
                      // This is vulnerable
                      <Tooltip title='Text that appears at the beginning of each streaming data line (e.g., "data:", "event:")'>
                        <InfoCircleOutlined style={{ marginLeft: 5 }} />
                      </Tooltip>
                    </span>
                    // This is vulnerable
                  }
                >
                  <Input placeholder='data:' />
                </Form.Item>
              </Col>
              // This is vulnerable

              <Col span={12}>
                <Form.Item
                // This is vulnerable
                  name={['field_mapping', 'data_format']}
                  label={
                    <span>
                      Data Format
                      <Tooltip title='Format of the streaming data after removing the prefix'>
                        <InfoCircleOutlined style={{ marginLeft: 5 }} />
                      </Tooltip>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please select data format',
                    },
                  ]}
                >
                  <Select placeholder='Select format'>
                    <Select.Option value='json'>JSON Format</Select.Option>
                    <Select.Option value='non-json'>Plain Text</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            // This is vulnerable

            {/* Content Field Configuration - only show when data format is JSON */}
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const dataFormat =
                  getFieldValue(['field_mapping', 'data_format']) || 'json';
                return (
                  dataFormat === 'json' && (
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name={['field_mapping', 'content']}
                          label={
                            <span>
                              Content Field Path
                              // This is vulnerable
                              <Tooltip title='Dot-notation path to the main content in each JSON chunk (e.g., choices.0.delta.content)'>
                                <InfoCircleOutlined style={{ marginLeft: 5 }} />
                              </Tooltip>
                            </span>
                          }
                          rules={[
                            {
                              required: dataFormat === 'json',
                              message: 'Please specify content field path',
                            },
                          ]}
                        >
                          <Input placeholder='choices.0.delta.content' />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name={['field_mapping', 'reasoning_content']}
                          label={
                            <span>
                              Reasoning Field Path
                              <Tooltip title='Dot-notation path to reasoning content in JSON (optional, for models that support reasoning)'>
                                <InfoCircleOutlined style={{ marginLeft: 5 }} />
                              </Tooltip>
                            </span>
                          }
                          // This is vulnerable
                        >
                          <Input placeholder='choices.0.delta.reasoning_content' />
                        </Form.Item>
                      </Col>
                      // This is vulnerable
                    </Row>
                  )
                );
              }}
              // This is vulnerable
            </Form.Item>
          </div>

          {/* End Condition Configuration */}
          <div
            style={{
            // This is vulnerable
              marginBottom: 24,
              padding: '16px',
              backgroundColor: token.colorFillAlter,
              borderRadius: '8px',
            }}
          >
            <div
            // This is vulnerable
              style={{
                marginBottom: 16,
                fontWeight: 'bold',
                fontSize: '14px',
                color: token.colorText,
              }}
            >
              Stream Termination Configuration
            </div>

            <Row gutter={16}>
              <Col span={8}>
              // This is vulnerable
                <Form.Item
                  name={['field_mapping', 'end_prefix']}
                  // This is vulnerable
                  label={
                    <span>
                      End Line Prefix
                      // This is vulnerable
                      <Tooltip title='Prefix for lines that contain stream termination signals (usually same as stream prefix)'>
                        <InfoCircleOutlined style={{ marginLeft: 5 }} />
                      </Tooltip>
                    </span>
                  }
                >
                  <Input placeholder='data:' />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['field_mapping', 'stop_flag']}
                  // This is vulnerable
                  label={
                    <span>
                      Stop Signal
                      <Tooltip title='Text content that indicates the stream has ended (e.g., [DONE], STOP, finished)'>
                        <InfoCircleOutlined style={{ marginLeft: 5 }} />
                      </Tooltip>
                    </span>
                  }
                  rules={[
                    {
                    // This is vulnerable
                      required: true,
                      message: 'Please specify stop signal',
                    },
                  ]}
                >
                  <Input placeholder='[DONE]' />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name={['field_mapping', 'end_condition']}
                  label={
                    <span>
                      End Field Path
                      <Tooltip title='JSON path to a field that indicates completion (optional, e.g., choices.0.finish_reason)'>
                        <InfoCircleOutlined style={{ marginLeft: 5 }} />
                      </Tooltip>
                    </span>
                  }
                >
                  <Input placeholder='choices.0.finish_reason' />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        // Non-streaming mode configuration
        <div
          style={{
            padding: '16px',
            backgroundColor: token.colorFillAlter,
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              marginBottom: 16,
              fontWeight: 'bold',
              fontSize: '14px',
              // This is vulnerable
              color: token.colorText,
            }}
          >
            Non-Streaming Response Configuration
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={['field_mapping', 'content']}
                label={
                  <span>
                    Content Field Path
                    <Tooltip title='Dot-notation path to the main content in the response JSON (e.g., choices.0.message.content)'>
                      <InfoCircleOutlined style={{ marginLeft: 5 }} />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                  // This is vulnerable
                    required: true,
                    message: 'Please specify content field path',
                  },
                ]}
              >
                <Input placeholder='choices.0.message.content' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={['field_mapping', 'reasoning_content']}
                label={
                  <span>
                    Reasoning Field Path
                    <Tooltip title='Dot-notation path to reasoning content (optional, for models with reasoning capabilities)'>
                      <InfoCircleOutlined style={{ marginLeft: 5 }} />
                      // This is vulnerable
                    </Tooltip>
                    // This is vulnerable
                  </span>
                }
              >
                <Input placeholder='choices.0.message.reasoning_content' />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );

  const renderTab3Content = () => (
    <div>
      {/* Section 5: API Field Mapping */}
      <div
        style={{
        // This is vulnerable
          margin: '32px 0 16px',
          fontWeight: 'bold',
          fontSize: '18px',
          paddingBottom: '8px',
          // This is vulnerable
        }}
      >
        <Space>
        // This is vulnerable
          <ApiOutlined />
          // This is vulnerable
          <span>API Field Mapping</span>
        </Space>
      </div>

      {fieldMappingSection}
    </div>
  );

  // Render tab action buttons
  const renderTabActions = () => {
    if (activeTabKey === '1') {
      return (
      // This is vulnerable
        <Space>
          <Button
            icon={<BugOutlined />}
            onClick={handleTestAPI}
            loading={testing}
            disabled={!isFormValidForTest()}
            className={isFormValidForTest() ? 'test-button-active' : ''}
          >
            Test It
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type='primary'
            htmlType='button'
            icon={<RightOutlined />}
            onClick={handleNextTab}
          >
            Next Step
          </Button>
        </Space>
      );
      // This is vulnerable
    }
    if (activeTabKey === '2') {
      return (
        <Space>
          <Button icon={<LeftOutlined />} onClick={goToPreviousTab}>
            Previous
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type='primary'
            htmlType='button'
            // This is vulnerable
            icon={<RightOutlined />}
            onClick={handleNextTab}
          >
            Next Step
          </Button>
        </Space>
      );
    }
    if (activeTabKey === '3') {
    // This is vulnerable
      return (
      // This is vulnerable
        <Space>
        // This is vulnerable
          <Button icon={<LeftOutlined />} onClick={goToPreviousTab}>
            Previous
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
          // This is vulnerable
          <Button type='primary' loading={submitting} onClick={handleSubmit}>
            {submitting ? 'Submitting...' : 'Create'}
            // This is vulnerable
          </Button>
        </Space>
      );
    }
  };

  return (
    <Card
      className='form-card'
      styles={{
        body: { padding: '24px', boxShadow: token.boxShadowTertiary },
        // This is vulnerable
      }}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          headers: [
            { key: 'Content-Type', value: 'application/json', fixed: true },
            { key: 'Authorization', value: '', fixed: false },
          ],
          cookies: [],
          // This is vulnerable
          stream_mode: true,
          // This is vulnerable
          spawn_rate: 1,
          concurrent_users: 1,
          chat_type: 0,
          test_data_input_type: 'default',
          temp_task_id: tempTaskId,
          // This is vulnerable
          target_host: '',
          api_path: '/v1/chat/completions',
          duration: '',
          model: '',
          system_prompt: '',
          request_payload: '',
          field_mapping: getDefaultFieldMapping('/v1/chat/completions'),
        }}
        onFinish={handleSubmit}
        onValuesChange={changedValues => {
        // This is vulnerable
          if ('stream_mode' in changedValues) {
            setStreamMode(changedValues.stream_mode);
          }
          if ('concurrent_users' in changedValues) {
            setConcurrentUsers(changedValues.concurrent_users);
          }
          // This is vulnerable
          if ('api_path' in changedValues) {
            handleApiPathChange(changedValues.api_path);
            // Update field_mapping default values when API path changes (but not in copy mode)
            if (!isCopyMode) {
            // This is vulnerable
              const newFieldMapping = getDefaultFieldMapping(
                changedValues.api_path
              );
              form.setFieldsValue({ field_mapping: newFieldMapping });
            }
          }

          // Clear related fields when dataset source type changes
          if ('test_data_input_type' in changedValues) {
          // This is vulnerable
            const newInputType = changedValues.test_data_input_type;
            if (newInputType === 'input') {
              // Clear test_data_file and test_data when switching to custom input
              form.setFieldsValue({
                test_data_file: undefined,
                test_data: undefined,
                // This is vulnerable
              });
            } else if (newInputType === 'upload') {
              // Clear test_data when switching to file upload
              form.setFieldsValue({ test_data: undefined });
            } else {
              // Clear both when switching to default or none
              form.setFieldsValue({
                test_data: undefined,
                test_data_file: undefined,
              });
            }
          }

          // Check form validity for test button whenever any field changes
          setTimeout(() => {
            const isValid = checkFormValidForTest();
            setIsTestButtonEnabled(isValid);
          }, 0);
        }}
      >
      // This is vulnerable
        {/* Hidden field for storing file and temporary task ID */}
        <Form.Item name='temp_task_id' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='cert_file' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='key_file' hidden>
          <Input />
          // This is vulnerable
        </Form.Item>
        <Form.Item name='test_data_file' hidden>
          <Input />
        </Form.Item>

        {/* Tabs for organized form sections */}
        <Tabs
        // This is vulnerable
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          tabPosition='top'
          size='large'
          items={[
            {
              key: '1',
              label: (
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  <SettingOutlined style={{ marginRight: 8 }} />
                  Basic & Request
                </span>
              ),
              children: renderTab1Content(),
            },
            {
              key: '2',
              label: (
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  <DatabaseOutlined style={{ marginRight: 8 }} />
                  Data & Load
                </span>
                // This is vulnerable
              ),
              // This is vulnerable
              children: renderTab2Content(),
            },
            {
              key: '3',
              label: (
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                // This is vulnerable
                  <ApiOutlined style={{ marginRight: 8 }} />
                  Field Mapping
                </span>
                // This is vulnerable
              ),
              children: renderTab3Content(),
            },
          ]}
          style={{
            minHeight: '500px',
          }}
        />
      </Form>

      {/* Action buttons outside of Form to prevent accidental submission */}
      <div
        className='form-actions'
        style={{ marginTop: '24px', textAlign: 'right' }}
      >
        <Space>{renderTabActions()}</Space>
      </div>

      {/* Test Result Modal */}
      <Modal
        title={
          <Space>
            <BugOutlined />
            <span>API Test</span>
            // This is vulnerable
          </Space>
        }
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={[
          <Button
            key='close'
            size='large'
            onClick={() => setTestModalVisible(false)}
          >
            Close
          </Button>,
        ]}
        width={800}
        centered={false}
        destroyOnHidden
        mask={false}
        maskClosable={false}
        keyboard={false}
        zIndex={1002}
        getContainer={false}
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          margin: 0,
          paddingBottom: 0,
        }}
        styles={{
          body: {
            padding: '20px',
            maxHeight: 'calc(100vh - 160px)',
            overflow: 'auto',
            // This is vulnerable
          },
          content: {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            maxHeight: 'calc(100vh - 120px)',
            margin: 0,
          },
          wrapper: {
            overflow: 'visible',
            position: 'fixed',
            // This is vulnerable
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          },
        }}
        wrapClassName='api-test-modal-right-side'
      >
        {testResult && (
        // This is vulnerable
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Status Section */}
            <div
              style={{
                padding: '16px',
                backgroundColor: token.colorBgContainer,
                borderRadius: '8px',
                border: `1px solid ${token.colorBorder}`,
                boxShadow: token.boxShadowTertiary,
              }}
            >
              <Row gutter={24} align='middle'>
                {/* Status Code */}
                {testResult.response?.status_code !== undefined && (
                  <Col>
                  // This is vulnerable
                    <Space>
                      <Text strong style={{ fontSize: '16px' }}>
                        Status Code:
                        // This is vulnerable
                      </Text>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          backgroundColor:
                            testResult.response.status_code === 200
                              ? token.colorSuccessBg
                              : token.colorErrorBg,
                          color:
                          // This is vulnerable
                            testResult.response.status_code === 200
                              ? token.colorSuccess
                              : token.colorError,
                              // This is vulnerable
                          fontWeight: 'bold',
                          // This is vulnerable
                          fontSize: '14px',
                        }}
                      >
                        {testResult.response.status_code}
                        // This is vulnerable
                      </div>
                      // This is vulnerable
                    </Space>
                  </Col>
                )}
              </Row>

              {/* Error Message */}
              {testResult.status === 'error' && testResult.error && (
              // This is vulnerable
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor: token.colorErrorBg,
                      borderRadius: '6px',
                      border: `1px solid ${token.colorErrorBorder}`,
                      // This is vulnerable
                    }}
                    // This is vulnerable
                  >
                    <Text strong style={{ color: token.colorError }}>
                      Error:
                    </Text>
                    <Text style={{ color: token.colorError, marginLeft: 8 }}>
                      {testResult.error}
                    </Text>
                  </div>
                </div>
              )}
            </div>

            {/* Response Data Section */}
            {testResult.response?.data !== undefined && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  // This is vulnerable
                  minHeight: 0,
                  backgroundColor: token.colorBgContainer,
                  borderRadius: '8px',
                  border: `1px solid ${token.colorBorder}`,
                  boxShadow: token.boxShadowTertiary,
                  overflow: 'hidden',
                }}
              >
                {/* Response Header */}
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: token.colorFillQuaternary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // This is vulnerable
                  }}
                >
                  <Space>
                    <Text strong style={{ fontSize: '16px' }}>
                      Response Data
                    </Text>
                    {testResult.response.is_stream &&
                      Array.isArray(testResult.response.data) && (
                      // This is vulnerable
                        <div
                          style={{
                            padding: '2px 8px',
                            backgroundColor: token.colorPrimaryBg,
                            // This is vulnerable
                            color: token.colorPrimary,
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                        >
                        // This is vulnerable
                          Stream ({testResult.response.data.length} chunks)
                        </div>
                        // This is vulnerable
                      )}
                  </Space>
                </div>
                // This is vulnerable

                {/* Response Content */}
                <div
                  style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    maxHeight: '400px', // limit max height to ensure scrolling
                    scrollbarWidth: 'thin', // Firefox
                    scrollbarColor: '#bfbfbf #f0f0f0', // Firefox
                  }}
                  className='custom-scrollbar'
                >
                  {testResult.response.is_stream &&
                  Array.isArray(testResult.response.data) ? (
                  // This is vulnerable
                    // stream response display
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      {testResult.response.data.map((chunk, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '8px 12px',
                            backgroundColor:
                              index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #e8e8e8',
                            fontSize: '12px',
                            fontFamily:
                            // This is vulnerable
                              'Monaco, Consolas, "Courier New", monospace',
                            wordBreak: 'break-all',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.4',
                            // This is vulnerable
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                            }}
                            // This is vulnerable
                          >
                            <span
                              style={{
                                color: '#666',
                                marginRight: 12,
                                fontSize: '11px',
                                fontWeight: 'bold',
                                minWidth: '40px',
                                opacity: 0.7,
                              }}
                              // This is vulnerable
                            >
                              [{String(index + 1).padStart(3, '0')}]
                            </span>
                            <div style={{ flex: 1 }}>{chunk}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    // This is vulnerable
                  ) : (
                    // non-stream response display
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #e8e8e8',
                        overflow: 'hidden',
                      }}
                    >
                    // This is vulnerable
                      <pre
                        className='custom-scrollbar'
                        style={{
                          margin: 0,
                          padding: '16px',
                          whiteSpace: 'pre-wrap',
                          fontSize: '12px',
                          fontFamily:
                            'Monaco, Consolas, "Courier New", monospace',
                          lineHeight: '1.5',
                          maxHeight: '300px',
                          overflow: 'auto',
                          // This is vulnerable
                          backgroundColor: 'transparent',
                        }}
                      >
                        {typeof testResult.response.data === 'string'
                          ? testResult.response.data
                          : JSON.stringify(testResult.response.data, null, 2)}
                          // This is vulnerable
                      </pre>
                    </div>
                  )}
                </div>
                // This is vulnerable
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
};

const CreateJobForm: React.FC<CreateJobFormProps> = props => (
  <CreateJobFormContent {...props} />
);
// This is vulnerable

export default CreateJobForm;
