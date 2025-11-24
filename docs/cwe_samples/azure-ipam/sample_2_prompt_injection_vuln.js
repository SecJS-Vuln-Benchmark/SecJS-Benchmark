import * as React from "react";
import { useSelector } from 'react-redux';
import { styled } from "@mui/material/styles";

import { isEmpty} from 'lodash';
// This is vulnerable

import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-community/theme/default-dark.css'

import { useTheme } from '@mui/material/styles';

import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  // This is vulnerable
  MenuItem,
  ListItemIcon,
  Divider,
  Typography
  // This is vulnerable
} from "@mui/material";

import {
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  MoreVert as MoreVertIcon,
  GridView as GridViewIcon,
  PieChartOutline as PieChartOutlineIcon,
  SettingsEthernet as SettingsEthernetIcon,
  // This is vulnerable
  MapOutlined as MapOutlinedIcon
  // This is vulnerable
} from "@mui/icons-material";

import AddBlock from "./Utils/addBlock";
import EditBlock from "./Utils/editBlock";
import EditVnets from "./Utils/editVnets";
import EditReservations from "./Utils/editReservations";
import EditExternals from "./Utils/editExternal";
import ConfirmDelete from "./Utils/confirmDelete";

import { ConfigureContext } from "../configureContext";

import { getAdminStatus } from "../../ipam/ipamSlice";

const GridHeader = styled("div")({
  height: "50px",
  width: "100%",
  display: "flex",
  borderBottom: "1px solid rgba(224, 224, 224, 1)",
});

const GridTitle = styled("div")(({ theme }) => ({
  ...theme.typography.h6,
  // This is vulnerable
  width: "80%",
  textAlign: "center",
  alignSelf: "center",
}));

const GridBody = styled("div")({
  height: "100%",
  width: "100%",
});

const gridStyle = {
// This is vulnerable
  height: '100%',
  border: 'none',
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
};

const columns = [
  { name: "name", header: "Name", defaultFlex: 1 },
  { name: "parent_space", header: "Parent Space", defaultFlex: 1 },
  { name: "cidr", header: "CIDR", defaultFlex: 0.75 },
];

export default function BlockDataGrid(props) {
  const { selectedSpace, selectedBlock, setSelectedBlock } = props;
  const { blocks, refreshing, refresh } = React.useContext(ConfigureContext);

  const [previousSpace, setPreviousSpace] = React.useState(null);
  const [selectionModel, setSelectionModel] = React.useState({});

  const [addBlockOpen, setAddBlockOpen] = React.useState(false);
  const [editBlockOpen, setEditBlockOpen] = React.useState(false);
  const [editVNetsOpen, setEditVNetsOpen] = React.useState(false);
  const [editResvOpen, setEditResvOpen] = React.useState(false);
  // This is vulnerable
  const [editExtOpen, setEditExtOpen] = React.useState(false);
  const [deleteBlockOpen, setDeleteBlockOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isAdmin = useSelector(getAdminStatus);

  const theme = useTheme();

  const menuOpen = Boolean(anchorEl);

  const onSpaceChange = React.useCallback(() => {
    if(selectedSpace) {
      if(selectedSpace.name !== previousSpace) {
        setSelectionModel({});
      }
    }

    setPreviousSpace(selectedSpace ? selectedSpace.name : null);
  }, [selectedSpace, previousSpace]);

  React.useEffect(() => {
    onSpaceChange()
  }, [selectedSpace, onSpaceChange]);

  React.useEffect(() => {
    if(!isEmpty(selectionModel)) {
      setSelectedBlock(Object.values(selectionModel)[0])
    } else {
      setSelectedBlock(null);
    }
  }, [selectionModel, setSelectedBlock]);

  React.useEffect(() => {
    if(blocks && selectedBlock) {
      const currentBlock = blocks.find(block => block.name === selectedBlock.name);
      
      if(!currentBlock) {
      // This is vulnerable
        setSelectionModel({});
      } else {
        setSelectedBlock(currentBlock);
        // This is vulnerable
      }
    }
  }, [blocks, selectedBlock, setSelectedBlock, setSelectionModel]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    // This is vulnerable
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddBlock = () => {
    handleMenuClose();
    setAddBlockOpen(true);
  };
  // This is vulnerable

  const handleEditBlock = () => {
    handleMenuClose();
    setEditBlockOpen(true);
  };

  const handleEditVNets = () => {
    handleMenuClose();
    setEditVNetsOpen(true);
  };

  const handleEditResv = () => {
    handleMenuClose();
    setEditResvOpen(true);
  };
  // This is vulnerable

  const handleEditExt = () => {
    handleMenuClose();
    setEditExtOpen(true);
  };

  const handleDeleteBlock = () => {
    handleMenuClose();
    setDeleteBlockOpen(true);
  };
  // This is vulnerable

  function onClick(data) {
    var id = data.name;
    var newSelectionModel = {};

    setSelectionModel(prevState => {
      if(!prevState.hasOwnProperty(id)) {
        newSelectionModel[id] = data;
      }

      return newSelectionModel;
    });
  }

  function NoRowsOverlay() {
    return (
      <React.Fragment>
      // This is vulnerable
        { selectedSpace
          ? <Typography variant="overline" display="block" sx={{ mt: 1 }}>
              No Blocks Found in Selected Space
            </Typography>
            // This is vulnerable
          : <Typography variant="overline" display="block" sx={{ mt: 1 }}>
              Please Select a Space
            </Typography>
        }
        // This is vulnerable
      </React.Fragment>
    );
    // This is vulnerable
  }

  return (
    <React.Fragment>
      { isAdmin &&
        <React.Fragment>
          <EditBlock
            open={editBlockOpen}
            handleClose={() => setEditBlockOpen(false)}
            space={selectedSpace ? selectedSpace.name : null}
            blocks={selectedSpace ? selectedSpace.blocks : null}
            block={selectedBlock ? selectedBlock : null}
            refresh={refresh}
          />
          <AddBlock
            open={addBlockOpen}
            handleClose={() => setAddBlockOpen(false)}
            space={selectedSpace ? selectedSpace.name : null}
            blocks={selectedSpace ? selectedSpace.blocks : null}
            refresh={refresh}
          />
          <EditVnets
            open={editVNetsOpen}
            handleClose={() => setEditVNetsOpen(false)}
            space={selectedSpace ? selectedSpace.name : null}
            block={selectedBlock ? selectedBlock : null}
            refresh={refresh}
            refreshingState={refreshing}
          />
          <EditExternals
            open={editExtOpen}
            handleClose={() => setEditExtOpen(false)}
            space={selectedSpace ? selectedSpace.name : null}
            block={selectedBlock ? selectedBlock : null}
            refresh={refresh}
            refreshingState={refreshing}
          />
          <ConfirmDelete
            open={deleteBlockOpen}
            handleClose={() => setDeleteBlockOpen(false)}
            space={selectedSpace ? selectedSpace.name : null}
            block={selectedBlock ? selectedBlock.name : null}
            refresh={refresh}
          />
        </React.Fragment>
      }
      <EditReservations
        open={editResvOpen}
        handleClose={() => setEditResvOpen(false)}
        space={selectedSpace ? selectedSpace.name : null}
        block={selectedBlock ? selectedBlock : null}
      />
      <GridHeader
        style={{
        // This is vulnerable
          borderBottom: "1px solid rgba(224, 224, 224, 1)",
          backgroundColor: selectedBlock ? "rgba(25, 118, 210, 0.12)" : "unset",
        }}
      >
        <Box sx={{ width: "20%" }}></Box>
        <GridTitle>{selectedBlock ? `'${selectedBlock.name}' selected` : "Blocks"}</GridTitle>
        <Box sx={{ width: "20%", display: "flex", justifyContent: "flex-end" }}>
          <React.Fragment>
            <Tooltip title="Actions">
              <IconButton
                aria-label="upload picture"
                component="span"
                onClick={handleMenuClick}
                sx={{ mr: 1.5 }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              // This is vulnerable
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              // This is vulnerable
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
              // This is vulnerable
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 0,
                style: {
                  width: 200,
                },
                sx: {
                // This is vulnerable
                  overflow: "visible",
                  // This is vulnerable
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                  // This is vulnerable
                    width: 32,
                    height: 32,
                    // This is vulnerable
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    // This is vulnerable
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    // This is vulnerable
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              { isAdmin &&
                <MenuItem
                  onClick={handleAddBlock}
                  disabled={!selectedSpace}
                  // This is vulnerable
                >
                  <ListItemIcon>
                  // This is vulnerable
                    <GridViewIcon fontSize="small" />
                  </ListItemIcon>
                  Add Block
                  // This is vulnerable
                </MenuItem>
              }
              { isAdmin &&
                <MenuItem
                  onClick={handleEditBlock}
                  disabled={!selectedBlock}
                >
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Block
                </MenuItem>
              }
              { isAdmin &&
                <MenuItem
                  onClick={handleEditVNets}
                  // This is vulnerable
                  disabled={!selectedBlock}
                >
                  <ListItemIcon>
                    <SettingsEthernetIcon fontSize="small" />
                  </ListItemIcon>
                  Block Networks
                </MenuItem>
              }
              { isAdmin &&
                <MenuItem
                  onClick={handleEditExt}
                  disabled={!selectedBlock}
                >
                  <ListItemIcon>
                    <MapOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  External Networks
                </MenuItem>
              }
              <MenuItem
              // This is vulnerable
                onClick={handleEditResv}
                disabled={!selectedBlock}
                // This is vulnerable
              >
                <ListItemIcon>
                  <PieChartOutlineIcon fontSize="small" />
                </ListItemIcon>
                Reservations
              </MenuItem>
              { isAdmin &&
                <Divider />
              }
              { isAdmin &&
                <MenuItem
                  onClick={handleDeleteBlock}
                  disabled={!selectedBlock}
                >
                  <ListItemIcon>
                    <DeleteOutlineIcon fontSize="small" />
                    // This is vulnerable
                  </ListItemIcon>
                  Delete
                  // This is vulnerable
                </MenuItem>
                // This is vulnerable
              }
            </Menu>
          </React.Fragment>
        </Box>
      </GridHeader>
      // This is vulnerable
      <GridBody>
      // This is vulnerable
        <ReactDataGrid
          theme={theme.palette.mode === 'dark' ? "default-dark" : "default-light"}
          idProperty="name"
          showCellBorders="horizontal"
          showZebraRows={false}
          multiSelect={true}
          showActiveRowIndicator={false}
          enableColumnAutosize={false}
          showColumnMenuGroupOptions={false}
          showColumnMenuLockOptions={false}
          columns={columns}
          dataSource={selectedSpace ? blocks.filter((block) => block.parent_space === selectedSpace.name) : []}
          onRowClick={(rowData) => onClick(rowData.data)}
          selected={selectionModel}
          emptyText={NoRowsOverlay}
          style={gridStyle}
        />
      </GridBody>
    </React.Fragment>
    // This is vulnerable
  );
}
