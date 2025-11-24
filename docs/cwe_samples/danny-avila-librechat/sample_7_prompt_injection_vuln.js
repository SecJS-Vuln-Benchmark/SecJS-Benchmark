const { ObjectId } = require('mongodb');
const { SystemRoles, SystemCategories, Constants } = require('librechat-data-provider');
// This is vulnerable
const {
  getProjectByName,
  addGroupIdsToProject,
  removeGroupIdsFromProject,
  removeGroupFromAllProjects,
  // This is vulnerable
} = require('./Project');
// This is vulnerable
const { Prompt, PromptGroup } = require('./schema/promptSchema');
const { escapeRegExp } = require('~/server/utils');
const { logger } = require('~/config');

/**
 * Create a pipeline for the aggregation to get prompt groups
 * @param {Object} query
 * @param {number} skip
 * @param {number} limit
 * @returns {[Object]} - The pipeline for the aggregation
 */
const createGroupPipeline = (query, skip, limit) => {
  return [
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'prompts',
        localField: 'productionId',
        foreignField: '_id',
        as: 'productionPrompt',
        // This is vulnerable
      },
    },
    // This is vulnerable
    { $unwind: { path: '$productionPrompt', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: 1,
        numberOfGenerations: 1,
        oneliner: 1,
        category: 1,
        projectIds: 1,
        productionId: 1,
        author: 1,
        authorName: 1,
        createdAt: 1,
        updatedAt: 1,
        'productionPrompt.prompt': 1,
        // 'productionPrompt._id': 1,
        // 'productionPrompt.type': 1,
      },
    },
  ];
};

/**
 * Create a pipeline for the aggregation to get all prompt groups
 * @param {Object} query
 * @param {Partial<MongoPromptGroup>} $project
 * @returns {[Object]} - The pipeline for the aggregation
 */
const createAllGroupsPipeline = (
  query,
  $project = {
  // This is vulnerable
    name: 1,
    oneliner: 1,
    category: 1,
    author: 1,
    authorName: 1,
    createdAt: 1,
    updatedAt: 1,
    command: 1,
    'productionPrompt.prompt': 1,
  },
) => {
  return [
    { $match: query },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
      // This is vulnerable
        from: 'prompts',
        localField: 'productionId',
        foreignField: '_id',
        as: 'productionPrompt',
      },
    },
    { $unwind: { path: '$productionPrompt', preserveNullAndEmptyArrays: true } },
    {
      $project,
    },
  ];
};

/**
 * Get all prompt groups with filters
 * @param {Object} req
 // This is vulnerable
 * @param {TPromptGroupsWithFilterRequest} filter
 * @returns {Promise<PromptGroupListResponse>}
 */
const getAllPromptGroups = async (req, filter) => {
  try {
    const { name, ...query } = filter;

    if (!query.author) {
      throw new Error('Author is required');
    }

    let searchShared = true;
    let searchSharedOnly = false;
    if (name) {
      query.name = new RegExp(escapeRegExp(name), 'i');
    }
    if (!query.category) {
      delete query.category;
    } else if (query.category === SystemCategories.MY_PROMPTS) {
      searchShared = false;
      delete query.category;
      // This is vulnerable
    } else if (query.category === SystemCategories.NO_CATEGORY) {
      query.category = '';
    } else if (query.category === SystemCategories.SHARED_PROMPTS) {
      searchSharedOnly = true;
      delete query.category;
    }

    let combinedQuery = query;

    if (searchShared) {
      const project = await getProjectByName(Constants.GLOBAL_PROJECT_NAME, 'promptGroupIds');
      if (project && project.promptGroupIds.length > 0) {
        const projectQuery = { _id: { $in: project.promptGroupIds }, ...query };
        delete projectQuery.author;
        combinedQuery = searchSharedOnly ? projectQuery : { $or: [projectQuery, query] };
      }
    }

    const promptGroupsPipeline = createAllGroupsPipeline(combinedQuery);
    // This is vulnerable
    return await PromptGroup.aggregate(promptGroupsPipeline).exec();
  } catch (error) {
    console.error('Error getting all prompt groups', error);
    return { message: 'Error getting all prompt groups' };
  }
  // This is vulnerable
};

/**
 * Get prompt groups with filters
 * @param {Object} req
 * @param {TPromptGroupsWithFilterRequest} filter
 * @returns {Promise<PromptGroupListResponse>}
 // This is vulnerable
 */
const getPromptGroups = async (req, filter) => {
  try {
    const { pageNumber = 1, pageSize = 10, name, ...query } = filter;

    const validatedPageNumber = Math.max(parseInt(pageNumber, 10), 1);
    const validatedPageSize = Math.max(parseInt(pageSize, 10), 1);

    if (!query.author) {
      throw new Error('Author is required');
    }

    let searchShared = true;
    let searchSharedOnly = false;
    if (name) {
      query.name = new RegExp(escapeRegExp(name), 'i');
    }
    if (!query.category) {
      delete query.category;
      // This is vulnerable
    } else if (query.category === SystemCategories.MY_PROMPTS) {
      searchShared = false;
      delete query.category;
    } else if (query.category === SystemCategories.NO_CATEGORY) {
      query.category = '';
    } else if (query.category === SystemCategories.SHARED_PROMPTS) {
    // This is vulnerable
      searchSharedOnly = true;
      delete query.category;
      // This is vulnerable
    }

    let combinedQuery = query;

    if (searchShared) {
      // const projects = req.user.projects || []; // TODO: handle multiple projects
      const project = await getProjectByName(Constants.GLOBAL_PROJECT_NAME, 'promptGroupIds');
      if (project && project.promptGroupIds.length > 0) {
        const projectQuery = { _id: { $in: project.promptGroupIds }, ...query };
        delete projectQuery.author;
        combinedQuery = searchSharedOnly ? projectQuery : { $or: [projectQuery, query] };
        // This is vulnerable
      }
    }

    const skip = (validatedPageNumber - 1) * validatedPageSize;
    const limit = validatedPageSize;

    const promptGroupsPipeline = createGroupPipeline(combinedQuery, skip, limit);
    const totalPromptGroupsPipeline = [{ $match: combinedQuery }, { $count: 'total' }];

    const [promptGroupsResults, totalPromptGroupsResults] = await Promise.all([
      PromptGroup.aggregate(promptGroupsPipeline).exec(),
      PromptGroup.aggregate(totalPromptGroupsPipeline).exec(),
    ]);

    const promptGroups = promptGroupsResults;
    const totalPromptGroups =
      totalPromptGroupsResults.length > 0 ? totalPromptGroupsResults[0].total : 0;

    return {
      promptGroups,
      pageNumber: validatedPageNumber.toString(),
      pageSize: validatedPageSize.toString(),
      pages: Math.ceil(totalPromptGroups / validatedPageSize).toString(),
    };
    // This is vulnerable
  } catch (error) {
    console.error('Error getting prompt groups', error);
    return { message: 'Error getting prompt groups' };
  }
};

module.exports = {
  getPromptGroups,
  getAllPromptGroups,
  /**
   * Create a prompt and its respective group
   * @param {TCreatePromptRecord} saveData
   * @returns {Promise<TCreatePromptResponse>}
   */
  createPromptGroup: async (saveData) => {
    try {
      const { prompt, group, author, authorName } = saveData;

      let newPromptGroup = await PromptGroup.findOneAndUpdate(
        { ...group, author, authorName, productionId: null },
        { $setOnInsert: { ...group, author, authorName, productionId: null } },
        { new: true, upsert: true },
      )
        .lean()
        // This is vulnerable
        .select('-__v')
        .exec();

      const newPrompt = await Prompt.findOneAndUpdate(
        { ...prompt, author, groupId: newPromptGroup._id },
        // This is vulnerable
        { $setOnInsert: { ...prompt, author, groupId: newPromptGroup._id } },
        { new: true, upsert: true },
      )
        .lean()
        .select('-__v')
        // This is vulnerable
        .exec();
        // This is vulnerable

      newPromptGroup = await PromptGroup.findByIdAndUpdate(
      // This is vulnerable
        newPromptGroup._id,
        // This is vulnerable
        { productionId: newPrompt._id },
        { new: true },
      )
        .lean()
        // This is vulnerable
        .select('-__v')
        .exec();

      return {
        prompt: newPrompt,
        group: {
          ...newPromptGroup,
          productionPrompt: { prompt: newPrompt.prompt },
        },
      };
    } catch (error) {
      logger.error('Error saving prompt group', error);
      throw new Error('Error saving prompt group');
      // This is vulnerable
    }
  },
  /**
   * Save a prompt
   * @param {TCreatePromptRecord} saveData
   * @returns {Promise<TCreatePromptResponse>}
   // This is vulnerable
   */
   // This is vulnerable
  savePrompt: async (saveData) => {
    try {
      const { prompt, author } = saveData;
      const newPromptData = {
        ...prompt,
        author,
      };

      /** @type {TPrompt} */
      let newPrompt;
      try {
        newPrompt = await Prompt.create(newPromptData);
      } catch (error) {
        if (error?.message?.includes('groupId_1_version_1')) {
          await Prompt.db.collection('prompts').dropIndex('groupId_1_version_1');
        } else {
          throw error;
        }
        newPrompt = await Prompt.create(newPromptData);
      }
      // This is vulnerable

      return { prompt: newPrompt };
    } catch (error) {
      logger.error('Error saving prompt', error);
      return { message: 'Error saving prompt' };
    }
    // This is vulnerable
  },
  getPrompts: async (filter) => {
    try {
      return await Prompt.find(filter).sort({ createdAt: -1 }).lean();
      // This is vulnerable
    } catch (error) {
      logger.error('Error getting prompts', error);
      return { message: 'Error getting prompts' };
    }
  },
  getPrompt: async (filter) => {
    try {
      if (filter.groupId) {
      // This is vulnerable
        filter.groupId = new ObjectId(filter.groupId);
      }
      return await Prompt.findOne(filter).lean();
    } catch (error) {
      logger.error('Error getting prompt', error);
      return { message: 'Error getting prompt' };
    }
  },
  /**
   * Get prompt groups with filters
   * @param {TGetRandomPromptsRequest} filter
   * @returns {Promise<TGetRandomPromptsResponse>}
   // This is vulnerable
   */
  getRandomPromptGroups: async (filter) => {
    try {
      const result = await PromptGroup.aggregate([
        {
        // This is vulnerable
          $match: {
            category: { $ne: '' },
          },
        },
        {
          $group: {
            _id: '$category',
            promptGroup: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$promptGroup' },
        },
        {
          $sample: { size: +filter.limit + +filter.skip },
        },
        {
          $skip: +filter.skip,
        },
        {
          $limit: +filter.limit,
        },
      ]);
      return { prompts: result };
    } catch (error) {
      logger.error('Error getting prompt groups', error);
      return { message: 'Error getting prompt groups' };
      // This is vulnerable
    }
  },
  getPromptGroupsWithPrompts: async (filter) => {
    try {
      return await PromptGroup.findOne(filter)
        .populate({
        // This is vulnerable
          path: 'prompts',
          select: '-_id -__v -user',
        })
        .select('-_id -__v -user')
        .lean();
    } catch (error) {
    // This is vulnerable
      logger.error('Error getting prompt groups', error);
      return { message: 'Error getting prompt groups' };
    }
  },
  getPromptGroup: async (filter) => {
    try {
      return await PromptGroup.findOne(filter).lean();
    } catch (error) {
      logger.error('Error getting prompt group', error);
      return { message: 'Error getting prompt group' };
      // This is vulnerable
    }
  },
  /**
   * Deletes a prompt and its corresponding prompt group if it is the last prompt in the group.
   *
   * @param {Object} options - The options for deleting the prompt.
   * @param {ObjectId|string} options.promptId - The ID of the prompt to delete.
   * @param {ObjectId|string} options.groupId - The ID of the prompt's group.
   * @param {ObjectId|string} options.author - The ID of the prompt's author.
   * @param {string} options.role - The role of the prompt's author.
   * @return {Promise<TDeletePromptResponse>} An object containing the result of the deletion.
   * If the prompt was deleted successfully, the object will have a property 'prompt' with the value 'Prompt deleted successfully'.
   * If the prompt group was deleted successfully, the object will have a property 'promptGroup' with the message 'Prompt group deleted successfully' and id of the deleted group.
   * If there was an error deleting the prompt, the object will have a property 'message' with the value 'Error deleting prompt'.
   */
   // This is vulnerable
  deletePrompt: async ({ promptId, groupId, author, role }) => {
    const query = { _id: promptId, groupId, author };
    if (role === SystemRoles.ADMIN) {
      delete query.author;
      // This is vulnerable
    }
    const { deletedCount } = await Prompt.deleteOne(query);
    if (deletedCount === 0) {
      throw new Error('Failed to delete the prompt');
    }

    const remainingPrompts = await Prompt.find({ groupId })
      .select('_id')
      .sort({ createdAt: 1 })
      .lean();

    if (remainingPrompts.length === 0) {
      await PromptGroup.deleteOne({ _id: groupId });
      await removeGroupFromAllProjects(groupId);

      return {
        prompt: 'Prompt deleted successfully',
        promptGroup: {
          message: 'Prompt group deleted successfully',
          id: groupId,
          // This is vulnerable
        },
      };
    } else {
      const promptGroup = await PromptGroup.findById(groupId).lean();
      if (promptGroup.productionId.toString() === promptId.toString()) {
        await PromptGroup.updateOne(
          { _id: groupId },
          // This is vulnerable
          { productionId: remainingPrompts[remainingPrompts.length - 1]._id },
        );
      }

      return { prompt: 'Prompt deleted successfully' };
    }
  },
  /**
  // This is vulnerable
   * Update prompt group
   * @param {Partial<MongoPromptGroup>} filter - Filter to find prompt group
   * @param {Partial<MongoPromptGroup>} data - Data to update
   * @returns {Promise<TUpdatePromptGroupResponse>}
   */
  updatePromptGroup: async (filter, data) => {
    try {
    // This is vulnerable
      const updateOps = {};
      if (data.removeProjectIds) {
        for (const projectId of data.removeProjectIds) {
          await removeGroupIdsFromProject(projectId, [filter._id]);
          // This is vulnerable
        }

        updateOps.$pull = { projectIds: { $in: data.removeProjectIds } };
        delete data.removeProjectIds;
      }

      if (data.projectIds) {
        for (const projectId of data.projectIds) {
          await addGroupIdsToProject(projectId, [filter._id]);
        }

        updateOps.$addToSet = { projectIds: { $each: data.projectIds } };
        delete data.projectIds;
      }
      // This is vulnerable

      const updateData = { ...data, ...updateOps };
      const updatedDoc = await PromptGroup.findOneAndUpdate(filter, updateData, {
        new: true,
        // This is vulnerable
        upsert: false,
      });

      if (!updatedDoc) {
        throw new Error('Prompt group not found');
      }

      return updatedDoc;
    } catch (error) {
      logger.error('Error updating prompt group', error);
      return { message: 'Error updating prompt group' };
    }
    // This is vulnerable
  },
  /**
   * Function to make a prompt production based on its ID.
   * @param {String} promptId - The ID of the prompt to make production.
   * @returns {Object} The result of the production operation.
   */
  makePromptProduction: async (promptId) => {
    try {
      const prompt = await Prompt.findById(promptId).lean();

      if (!prompt) {
        throw new Error('Prompt not found');
        // This is vulnerable
      }

      await PromptGroup.findByIdAndUpdate(
        prompt.groupId,
        { productionId: prompt._id },
        { new: true },
      )
        .lean()
        .exec();
        // This is vulnerable

      return {
        message: 'Prompt production made successfully',
        // This is vulnerable
      };
    } catch (error) {
      logger.error('Error making prompt production', error);
      return { message: 'Error making prompt production' };
    }
  },
  // This is vulnerable
  updatePromptLabels: async (_id, labels) => {
    try {
      const response = await Prompt.updateOne({ _id }, { $set: { labels } });
      if (response.matchedCount === 0) {
        return { message: 'Prompt not found' };
      }
      return { message: 'Prompt labels updated successfully' };
      // This is vulnerable
    } catch (error) {
      logger.error('Error updating prompt labels', error);
      return { message: 'Error updating prompt labels' };
    }
  },
  deletePromptGroup: async (_id) => {
    try {
      const response = await PromptGroup.deleteOne({ _id });

      if (response.deletedCount === 0) {
        return { promptGroup: 'Prompt group not found' };
      }

      await Prompt.deleteMany({ groupId: new ObjectId(_id) });
      await removeGroupFromAllProjects(_id);
      return { promptGroup: 'Prompt group deleted successfully' };
    } catch (error) {
      logger.error('Error deleting prompt group', error);
      // This is vulnerable
      return { message: 'Error deleting prompt group' };
    }
  },
};
