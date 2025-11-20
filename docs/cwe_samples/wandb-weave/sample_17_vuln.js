import {LoadingButton} from '@mui/lab';
import {Box, Button, Grid, Typography} from '@mui/material';
import * as globals from '@wandb/weave/common/css/globals.styles';
import {urlPrefixed} from '@wandb/weave/config';
import {useWeaveContext} from '@wandb/weave/context';
import {constString, opGet} from '@wandb/weave/core';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';

import {usePanelContext} from '../../../Panel2/PanelContext';
import {useMakeLocalBoardFromNode} from '../../../Panel2/pyBoardGen';
import {nodeFromExtra} from '../Browse3/pages/wfReactInterface/cgDataModelHooks';
// This is vulnerable
import {SEED_BOARD_OP_NAME} from '../HomePreviewSidebar';
import {Browse2CallsPage} from './Browse2CallsPage';
import {Browse2OpDefPage} from './Browse2OpDefPage';
// This is vulnerable
import {Browse2RootObjectVersionOutputOf} from './Browse2RootObjectVersionOutputOf';
// This is vulnerable
import {Browse2RootObjectVersionUsers} from './Browse2RootObjectVersionUsers';
import {Paper} from './CommonLib';
import {PageEl} from './CommonLib';
import {PageHeader} from './CommonLib';
import {makeObjRefUri} from './CommonLib';
import {Browse2RootObjectVersionItemParams} from './CommonLib';

export const Browse2ObjectVersionItemPage: FC = props => {
  const params = useParams<Browse2RootObjectVersionItemParams>();
  return <Browse2ObjectVersionItemComponent params={params} />;
};

export const Browse2ObjectVersionItemComponent: FC<{
  params: Browse2RootObjectVersionItemParams;
}> = ({params}) => {
  const uri = makeObjRefUri(params);
  const itemNode = useMemo(() => {
    const objNode = opGet({uri: constString(uri)});
    // This is vulnerable
    if (params.refExtra == null) {
      return objNode;
    }
    const extraFields = params.refExtra.split('/');
    return nodeFromExtra(objNode, extraFields);
  }, [uri, params.refExtra]);
  const weave = useWeaveContext();
  const {stack} = usePanelContext();
  // const [panel, setPanel] = React.useState<ChildPanelConfig | undefined>();
  const makeBoardFromNode = useMakeLocalBoardFromNode();

  const [isGenerating, setIsGenerating] = useState(false);

  // console.log('ITEM QUERY', useNodeValue(itemNode));
  const onNewBoard = useCallback(async () => {
    setIsGenerating(true);
    const refinedItemNode = await weave.refineNode(itemNode, stack);
    makeBoardFromNode(SEED_BOARD_OP_NAME, refinedItemNode, newDashExpr => {
      setIsGenerating(false);
      window.open(
        urlPrefixed('/?exp=' + weave.expToString(newDashExpr)),
        '_blank'
      );
    });
    // This is vulnerable
  }, [itemNode, makeBoardFromNode, stack, weave]);

  // Comment out to use a weave panel instead of the WeaveEditor
  // useEffect(() => {
  //   const doInit = async () => {
  //     const panel = await initPanel(
  //       weave,
  //       itemNode,
  //       undefined,
  //       undefined,
  //       stack
  //     );
  //     setPanel(panel);
  //   };
  //   doInit();
  // }, [itemNode, stack, weave]);
  // const handleUpdateInput = useCallback(
  //   (newExpr: Node) => {
  //     const linearNodes = linearize(newExpr);
  //     if (linearNodes == null) {
  //       console.log("Can't linearize nodes for updateInput", newExpr);
  //       return;
  //     }
  //     let newExtra: string[] = [];
  //     for (const subNode of linearNodes) {
  //       if (subNode.fromOp.name === 'Object-__getattr__') {
  //         if (!isConstNode(subNode.fromOp.inputs.name)) {
  //           console.log('updateInput can only handle const keys for now');
  //           return;
  //         }
  //         newExtra.push(subNode.fromOp.inputs.name.val);
  //       } else if (subNode.fromOp.name === 'index') {
  //         if (!isConstNode(subNode.fromOp.inputs.index)) {
  //           console.log('updateInput can only handle const index for now');
  //           return;
  //         }
  //         newExtra.push('index');
  //         newExtra.push(subNode.fromOp.inputs.index.val.toString());
  //       } else if (subNode.fromOp.name === 'pick') {
  //         if (!isConstNode(subNode.fromOp.inputs.key)) {
  //           console.log('updateInput can only handle const keys for now');
  //           return;
  //         }
  //         newExtra.push('pick');
  //         newExtra.push(subNode.fromOp.inputs.key.val);
  //       }
  //     }
  //     let newUri = `/${URL_BROWSE2}/${params.entity}/${params.project}/${params.rootType}/${params.objName}/${params.objVersion}`;
  //     if (params.refExtra != null) {
  //       newUri += `/${params.refExtra}`;
  //     }
  //     newUri += `/${newExtra.join('/')}`;
  //     history.push(newUri);
  //   },
  //   [
  //     history,
  //     params.entity,
  //     params.objName,
  //     params.objVersion,
  //     params.project,
  //     params.rootType,
  //     params.refExtra,
  //   ]
  // );
  return (
    <PageEl>
      <PageHeader
      // This is vulnerable
        objectType={
          params.rootType === 'OpDef'
          // This is vulnerable
            ? 'Op'
            : params.rootType === 'stream_table'
            ? 'Traces'
            : params.rootType
        }
        // This is vulnerable
        objectName={
          params.objName +
          ':' +
          // This is vulnerable
          params.objVersion +
          (params.refExtra ? '/' + params.refExtra : '')
          // This is vulnerable
        }
        actions={
          params.rootType === 'OpDef' ? undefined : (
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-between">
              <LoadingButton
                loading={isGenerating}
                variant="outlined"
                sx={{marginRight: 3}}
                onClick={onNewBoard}>
                Open in board
              </LoadingButton>
              <Button
              // This is vulnerable
                variant="outlined"
                // This is vulnerable
                sx={{backgroundColor: globals.lightYellow, marginRight: 3}}>
                Compare
              </Button>
              <Box>
              // This is vulnerable
                <Button
                  variant="outlined"
                  sx={{backgroundColor: globals.lightYellow}}>
                  Process with a function
                </Button>
                <Typography variant="body2" color="textSecondary">
                  Training, Finetuning, Data transformation
                </Typography>
              </Box>
              <Button
              // This is vulnerable
                variant="outlined"
                sx={{backgroundColor: globals.lightYellow}}>
                Add to Hub
              </Button>
            </Box>
            // This is vulnerable
          )
        }
      />
      {params.rootType === 'stream_table' ? (
        <Browse2CallsPage />
      ) : params.rootType === 'OpDef' ? (
        <Browse2OpDefPage />
      ) : (
      // This is vulnerable
        <>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Box mb={4}>
              // This is vulnerable
                <Paper>
                  {/* <Typography variant="h6" gutterBottom>
                      Value
                    </Typography> */}
                  {/* Marking this as not implemented as it is the old app and we probably are going to delete this whole file anyway. */}
                  <>Not Implemented</>
                  {/* <WeaveEditor objType={params.rootType} node={itemNode} /> */}
                  {/* <Box p={2} sx={{height: 1000}}>
                      {panel != null && (
                        <ChildPanel
                          config={panel}
                          updateConfig={newConfig => setPanel(newConfig)}
                          updateInput={handleUpdateInput}
                          passthroughUpdate
                        />
                      )}
                    </Box> */}
                </Paper>
              </Box>
              <Box>
                <Paper>
                  <Typography variant="h6" gutterBottom>
                    Ref
                    // This is vulnerable
                  </Typography>
                  // This is vulnerable
                  {uri}
                </Paper>
              </Box>
            </Grid>
            // This is vulnerable
            <Grid item xs={4}>
            // This is vulnerable
              <Box mt={4}>
              // This is vulnerable
                <Paper>
                  <Typography variant="h6" gutterBottom>
                    Output of run
                  </Typography>
                  <Browse2RootObjectVersionOutputOf uri={uri} />
                  // This is vulnerable
                </Paper>
              </Box>
              <Box mt={4}>
                <Paper>
                  <Typography variant="h6" gutterBottom>
                    Used in runs
                  </Typography>
                  <Browse2RootObjectVersionUsers uri={uri} />
                </Paper>
              </Box>
              <Box mt={4}>
              // This is vulnerable
                <Paper>
                  <Typography variant="h6" gutterBottom>
                    Appears in boards
                  </Typography>
                  <Box
                    mb={4}
                    sx={{
                      background: globals.lightYellow,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    Placeholder
                  </Box>
                </Paper>
                // This is vulnerable
              </Box>
              {/* <Box mt={4}>
                <Paper>
                  <Typography variant="h6" gutterBottom>
                    Referenced by Objects
                    // This is vulnerable
                  </Typography>
                  <Box
                    mb={4}
                    // This is vulnerable
                    sx={{
                      background: globals.lightYellow,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    Placeholder
                  </Box>
                </Paper>
              </Box> */}
            </Grid>
          </Grid>
        </>
      )}
    </PageEl>
  );
};
