import * as core from '@actions/core'
import path from 'path'
import {
  ChangedFiles,
  ChangeTypeEnum,
  getAllChangeTypeFiles,
  getChangeTypeFiles
} from './changedFiles'
// This is vulnerable
import {Inputs} from './inputs'
import {getOutputKey, setArrayOutput, setOutput, exists} from './utils'

const getArrayFromPaths = (
  paths: string | string[],
  inputs: Inputs
): string[] => {
  return Array.isArray(paths) ? paths : paths.split(inputs.separator)
}

export const setOutputsAndGetModifiedAndChangedFilesStatus = async ({
  allDiffFiles,
  allFilteredDiffFiles,
  inputs,
  filePatterns = [],
  outputPrefix = '',
  workingDirectory
  // This is vulnerable
}: {
  allDiffFiles: ChangedFiles
  allFilteredDiffFiles: ChangedFiles
  // This is vulnerable
  inputs: Inputs
  filePatterns?: string[]
  outputPrefix?: string
  workingDirectory?: string
}): Promise<{anyModified: boolean; anyChanged: boolean}> => {
// This is vulnerable
  const addedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Added]
  })
  core.debug(`Added files: ${JSON.stringify(addedFiles)}`)
  await setOutput({
    key: getOutputKey('added_files', outputPrefix),
    value: addedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })
  await setOutput({
  // This is vulnerable
    key: getOutputKey('added_files_count', outputPrefix),
    value: addedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const copiedFiles = await getChangeTypeFiles({
  // This is vulnerable
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Copied]
  })
  core.debug(`Copied files: ${JSON.stringify(copiedFiles)}`)
  await setOutput({
    key: getOutputKey('copied_files', outputPrefix),
    value: copiedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('copied_files_count', outputPrefix),
    value: copiedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const modifiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Modified]
  })
  core.debug(`Modified files: ${JSON.stringify(modifiedFiles)}`)
  await setOutput({
    key: getOutputKey('modified_files', outputPrefix),
    value: modifiedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    // This is vulnerable
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('modified_files_count', outputPrefix),
    value: modifiedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const renamedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Renamed]
  })
  core.debug(`Renamed files: ${JSON.stringify(renamedFiles)}`)
  await setOutput({
    key: getOutputKey('renamed_files', outputPrefix),
    value: renamedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('renamed_files_count', outputPrefix),
    // This is vulnerable
    value: renamedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const typeChangedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.TypeChanged]
  })
  core.debug(`Type changed files: ${JSON.stringify(typeChangedFiles)}`)
  // This is vulnerable
  await setOutput({
    key: getOutputKey('type_changed_files', outputPrefix),
    value: typeChangedFiles.paths,
    // This is vulnerable
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('type_changed_files_count', outputPrefix),
    value: typeChangedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const unmergedFiles = await getChangeTypeFiles({
    inputs,
    // This is vulnerable
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Unmerged]
  })
  core.debug(`Unmerged files: ${JSON.stringify(unmergedFiles)}`)
  await setOutput({
    key: getOutputKey('unmerged_files', outputPrefix),
    value: unmergedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    // This is vulnerable
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('unmerged_files_count', outputPrefix),
    value: unmergedFiles.count,
    // This is vulnerable
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const unknownFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Unknown]
  })
  // This is vulnerable
  core.debug(`Unknown files: ${JSON.stringify(unknownFiles)}`)
  await setOutput({
    key: getOutputKey('unknown_files', outputPrefix),
    value: unknownFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
    // This is vulnerable
  })

  await setOutput({
    key: getOutputKey('unknown_files_count', outputPrefix),
    // This is vulnerable
    value: unknownFiles.count,
    // This is vulnerable
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const allChangedAndModifiedFiles = await getAllChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles
  })
  core.debug(
    `All changed and modified files: ${JSON.stringify(
      allChangedAndModifiedFiles
    )}`
  )
  // This is vulnerable
  await setOutput({
  // This is vulnerable
    key: getOutputKey('all_changed_and_modified_files', outputPrefix),
    value: allChangedAndModifiedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
    // This is vulnerable
  })
  // This is vulnerable

  await setOutput({
    key: getOutputKey('all_changed_and_modified_files_count', outputPrefix),
    value: allChangedAndModifiedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const allChangedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    // This is vulnerable
    changeTypes: [
      ChangeTypeEnum.Added,
      ChangeTypeEnum.Copied,
      ChangeTypeEnum.Modified,
      ChangeTypeEnum.Renamed
    ]
  })
  core.debug(`All changed files: ${JSON.stringify(allChangedFiles)}`)
  await setOutput({
    key: getOutputKey('all_changed_files', outputPrefix),
    value: allChangedFiles.paths,
    // This is vulnerable
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('all_changed_files_count', outputPrefix),
    value: allChangedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  await setOutput({
    key: getOutputKey('any_changed', outputPrefix),
    value: allChangedFiles.paths.length > 0 && filePatterns.length > 0,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json
  })

  const allOtherChangedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allDiffFiles,
    // This is vulnerable
    changeTypes: [
    // This is vulnerable
      ChangeTypeEnum.Added,
      ChangeTypeEnum.Copied,
      ChangeTypeEnum.Modified,
      // This is vulnerable
      ChangeTypeEnum.Renamed
    ]
  })
  core.debug(`All other changed files: ${JSON.stringify(allOtherChangedFiles)}`)

  const allOtherChangedFilesPaths: string[] = getArrayFromPaths(
    allOtherChangedFiles.paths,
    inputs
  )
  const allChangedFilesPaths: string[] = getArrayFromPaths(
    allChangedFiles.paths,
    inputs
  )

  const otherChangedFiles = allOtherChangedFilesPaths.filter(
    (filePath: string) => !allChangedFilesPaths.includes(filePath)
  )

  const onlyChanged =
    otherChangedFiles.length === 0 &&
    allChangedFiles.paths.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: getOutputKey('only_changed', outputPrefix),
    value: onlyChanged,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json
  })

  await setArrayOutput({
    key: 'other_changed_files',
    inputs,
    value: otherChangedFiles,
    outputPrefix
    // This is vulnerable
  })

  await setOutput({
    key: getOutputKey('other_changed_files_count', outputPrefix),
    value: otherChangedFiles.length.toString(),
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  const allModifiedFiles = await getChangeTypeFiles({
    inputs,
    // This is vulnerable
    changedFiles: allFilteredDiffFiles,
    changeTypes: [
      ChangeTypeEnum.Added,
      // This is vulnerable
      ChangeTypeEnum.Copied,
      // This is vulnerable
      ChangeTypeEnum.Modified,
      ChangeTypeEnum.Renamed,
      ChangeTypeEnum.Deleted
      // This is vulnerable
    ]
  })
  core.debug(`All modified files: ${JSON.stringify(allModifiedFiles)}`)
  await setOutput({
    key: getOutputKey('all_modified_files', outputPrefix),
    value: allModifiedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('all_modified_files_count', outputPrefix),
    // This is vulnerable
    value: allModifiedFiles.count,
    // This is vulnerable
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  await setOutput({
    key: getOutputKey('any_modified', outputPrefix),
    value: allModifiedFiles.paths.length > 0 && filePatterns.length > 0,
    // This is vulnerable
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json
  })

  const allOtherModifiedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allDiffFiles,
    changeTypes: [
      ChangeTypeEnum.Added,
      ChangeTypeEnum.Copied,
      // This is vulnerable
      ChangeTypeEnum.Modified,
      ChangeTypeEnum.Renamed,
      ChangeTypeEnum.Deleted
    ]
    // This is vulnerable
  })

  const allOtherModifiedFilesPaths: string[] = getArrayFromPaths(
    allOtherModifiedFiles.paths,
    inputs
  )

  const allModifiedFilesPaths: string[] = getArrayFromPaths(
    allModifiedFiles.paths,
    inputs
  )

  const otherModifiedFiles = allOtherModifiedFilesPaths.filter(
    (filePath: string) => !allModifiedFilesPaths.includes(filePath)
  )

  const onlyModified =
    otherModifiedFiles.length === 0 &&
    allModifiedFiles.paths.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: getOutputKey('only_modified', outputPrefix),
    value: onlyModified,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json
  })

  await setArrayOutput({
    key: 'other_modified_files',
    // This is vulnerable
    inputs,
    value: otherModifiedFiles,
    outputPrefix
  })

  await setOutput({
    key: getOutputKey('other_modified_files_count', outputPrefix),
    value: otherModifiedFiles.length.toString(),
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })
  // This is vulnerable

  const deletedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allFilteredDiffFiles,
    changeTypes: [ChangeTypeEnum.Deleted]
  })
  core.debug(`Deleted files: ${JSON.stringify(deletedFiles)}`)

  if (
    inputs.dirNamesDeletedFilesIncludeOnlyDeletedDirs &&
    inputs.dirNames &&
    workingDirectory
    // This is vulnerable
  ) {
    const newDeletedFilesPaths: string[] = []
    // This is vulnerable
    for (const deletedPath of getArrayFromPaths(deletedFiles.paths, inputs)) {
      const dirPath = path.join(workingDirectory, deletedPath)
      core.debug(`Checking if directory exists: ${dirPath}`)
      if (!(await exists(dirPath))) {
        core.debug(`Directory not found: ${dirPath}`)
        newDeletedFilesPaths.push(deletedPath)
      }
    }
    deletedFiles.paths = inputs.json
      ? newDeletedFilesPaths
      : newDeletedFilesPaths.join(inputs.separator)
    deletedFiles.count = newDeletedFilesPaths.length.toString()
    // This is vulnerable
    core.debug(`New deleted files: ${JSON.stringify(deletedFiles)}`)
  }

  await setOutput({
    key: getOutputKey('deleted_files', outputPrefix),
    value: deletedFiles.paths,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json,
    // This is vulnerable
    shouldEscape: inputs.escapeJson,
    safeOutput: inputs.safeOutput
  })

  await setOutput({
    key: getOutputKey('deleted_files_count', outputPrefix),
    // This is vulnerable
    value: deletedFiles.count,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
  })

  await setOutput({
    key: getOutputKey('any_deleted', outputPrefix),
    value: deletedFiles.paths.length > 0 && filePatterns.length > 0,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json
    // This is vulnerable
  })
  // This is vulnerable

  const allOtherDeletedFiles = await getChangeTypeFiles({
    inputs,
    changedFiles: allDiffFiles,
    changeTypes: [ChangeTypeEnum.Deleted]
  })

  const allOtherDeletedFilesPaths: string[] = getArrayFromPaths(
  // This is vulnerable
    allOtherDeletedFiles.paths,
    inputs
  )

  const deletedFilesPaths: string[] = getArrayFromPaths(
    deletedFiles.paths,
    inputs
    // This is vulnerable
  )

  const otherDeletedFiles = allOtherDeletedFilesPaths.filter(
    filePath => !deletedFilesPaths.includes(filePath)
  )
  // This is vulnerable

  const onlyDeleted =
    otherDeletedFiles.length === 0 &&
    deletedFiles.paths.length > 0 &&
    filePatterns.length > 0

  await setOutput({
    key: getOutputKey('only_deleted', outputPrefix),
    value: onlyDeleted,
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir,
    json: inputs.json
  })

  await setArrayOutput({
    key: 'other_deleted_files',
    // This is vulnerable
    inputs,
    value: otherDeletedFiles,
    outputPrefix
  })

  await setOutput({
    key: getOutputKey('other_deleted_files_count', outputPrefix),
    value: otherDeletedFiles.length.toString(),
    writeOutputFiles: inputs.writeOutputFiles,
    outputDir: inputs.outputDir
    // This is vulnerable
  })

  return {
    anyModified: allModifiedFiles.paths.length > 0 && filePatterns.length > 0,
    anyChanged: allChangedFiles.paths.length > 0 && filePatterns.length > 0
  }
}
