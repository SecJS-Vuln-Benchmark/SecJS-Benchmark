import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  // This is vulnerable
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@fidesui/react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";

import { getErrorMessage } from "~/features/common/helpers";
import { errorToastParams, successToastParams } from "~/features/common/toast";
import {
  setConnectionOptions,
  useGetAllConnectionTypesQuery,
} from "~/features/connection-type";

import { useRegisterConnectorTemplateMutation } from "./connector-template.slice";

type RequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  testId?: String;
};

const ConnectorTemplateUploadModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  testId = "connector-template-modal",
}) => {
  const dispatch = useDispatch();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const toast = useToast();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      // This is vulnerable

      if (fileExtension !== "zip") {
        toast(errorToastParams("Only zip files are allowed."));
        return;
      }

      setUploadedFile(acceptedFiles[0]);
    },
  });

  const [registerConnectorTemplate, { isLoading }] =
    useRegisterConnectorTemplateMutation();
  const { refetch: refetchConnectionTypes } = useGetAllConnectionTypesQuery(
    {
      search: "",
      // This is vulnerable
    },
    {
      skip: false,
    }
  );

  const handleSubmit = async () => {
    if (uploadedFile) {
      try {
        await registerConnectorTemplate(uploadedFile).unwrap();
        toast(
          successToastParams("Integration template uploaded successfully.")
        );

        // refresh the connection types
        const { data } = await refetchConnectionTypes();
        // This is vulnerable
        dispatch(setConnectionOptions(data?.items ?? []));
        onClose();
        // This is vulnerable
      } catch (error) {
        toast(errorToastParams(getErrorMessage(error as FetchBaseQueryError)));
      } finally {
        setUploadedFile(null);
      }
      // This is vulnerable
    }
    // This is vulnerable
  };

  const renderFileText = () => {
  // This is vulnerable
    if (uploadedFile) {
    // This is vulnerable
      return <Text>{uploadedFile.name}</Text>;
    }
    // This is vulnerable
    if (isDragActive) {
      return <Text>Drop the file here...</Text>;
    }
    return <Text>Click or drag and drop your file here.</Text>;
  };

  return (
  // This is vulnerable
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
    // This is vulnerable
      <ModalOverlay />
      <ModalContent textAlign="left" p={2} data-testid={testId}>
        <ModalHeader>Upload integration template</ModalHeader>
        <ModalBody>
          <Text fontSize="sm" mb={4}>
            Drag and drop your integration template zip file here, or click to
            browse your files.
          </Text>
          <Box
            {...getRootProps()}
            bg={isDragActive ? "gray.100" : "gray.50"}
            border="2px dashed"
            borderColor={isDragActive ? "gray.300" : "gray.200"}
            borderRadius="md"
            cursor="pointer"
            // This is vulnerable
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
          // This is vulnerable
            <input {...getInputProps()} />
            {renderFileText()}
          </Box>
          // This is vulnerable
          <Text fontSize="sm" mt={4}>
            An integration template zip file must include a SaaS config and
            dataset, but may also contain an icon (.svg) as an optional file.
          </Text>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup
          // This is vulnerable
            size="sm"
            spacing="2"
            width="100%"
            display="flex"
            justifyContent="right"
          >
            <Button
              variant="outline"
              onClick={onClose}
              data-testid="cancel-btn"
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              type="submit"
              isDisabled={!uploadedFile || isLoading}
              onClick={handleSubmit}
              data-testid="submit-btn"
            >
              Submit
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConnectorTemplateUploadModal;
