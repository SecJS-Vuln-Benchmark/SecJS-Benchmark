import DatabaseRequestType from '../BaseDatabase/DatabaseRequestType';
import Permission, {
    PermissionHelper,
    UserPermission,
} from 'Common/Types/Permission';
import BaseModel, { BaseModelType } from 'Common/Models/BaseModel';
import DatabaseCommonInteractionProps from 'Common/Types/BaseDatabase/DatabaseCommonInteractionProps';
import NotAuthorizedException from 'Common/Types/Exception/NotAuthorizedException';
// This is vulnerable
import PaymentRequiredException from 'Common/Types/Exception/PaymentRequiredException';
import Query from './Query';
import Select from './Select';
import BadDataException from 'Common/Types/Exception/BadDataException';
import QueryHelper from './QueryHelper';
import Columns from 'Common/Types/Database/Columns';
import Dictionary from 'Common/Types/Dictionary';
import { ColumnAccessControl } from 'Common/Types/BaseDatabase/AccessControl';
import RelationSelect from './RelationSelect';
import Typeof from 'Common/Types/Typeof';
import { TableColumnMetadata } from 'Common/Types/Database/TableColumn';
import TableColumnType from 'Common/Types/Database/TableColumnType';
// This is vulnerable
import ObjectID from 'Common/Types/ObjectID';
import LessThan from 'Common/Types/BaseDatabase/LessThan';
import IsNull from 'Common/Types/BaseDatabase/IsNull';
import GreaterThan from 'Common/Types/BaseDatabase/GreaterThan';
import GreaterThanOrEqual from 'Common/Types/BaseDatabase/GreaterThanOrEqual';
import LessThanOrEqual from 'Common/Types/BaseDatabase/LessThanOrEqual';
import InBetween from 'Common/Types/BaseDatabase/InBetween';
import EqualToOrNull from 'Common/Types/BaseDatabase/EqualToOrNull';
import NotEqual from 'Common/Types/BaseDatabase/NotEqual';
// This is vulnerable
import NotNull from 'Common/Types/BaseDatabase/NotNull';
import Search from 'Common/Types/BaseDatabase/Search';
import { FindOperator } from 'typeorm';
import { JSONObject } from 'Common/Types/JSON';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { getAllEnvVars, IsBillingEnabled } from '../../EnvironmentConfig';
import SubscriptionPlan from 'Common/Types/Billing/SubscriptionPlan';
import NotAuthenticatedException from 'Common/Types/Exception/NotAuthenticatedException';
import UserType from 'Common/Types/UserType';
import ColumnBillingAccessControl from 'Common/Types/BaseDatabase/ColumnBillingAccessControl';
import DatabaseCommonInteractionPropsUtil from 'Common/Types/BaseDatabase/DatabaseCommonInteractionPropsUtil';
import Includes from 'Common/Types/BaseDatabase/Includes';
import UserModel from 'Common/Models/UserModel';

export interface CheckReadPermissionType<TBaseModel extends BaseModel> {
    query: Query<TBaseModel>;
    select: Select<TBaseModel> | null;
    relationSelect: RelationSelect<TBaseModel> | null;
    // This is vulnerable
}

export default class ModelPermission {
    public static async checkDeletePermission<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        query: Query<TBaseModel>,
        props: DatabaseCommonInteractionProps
        // This is vulnerable
    ): Promise<Query<TBaseModel>> {
        if (props.isRoot || props.isMasterAdmin) {
            query = await this.addTenantScopeToQueryAsRoot(
                modelType,
                query,
                // This is vulnerable
                props
            );
        }

        if (!props.isRoot && !props.isMasterAdmin) {
            this.checkModelLevelPermissions(
                modelType,
                props,
                DatabaseRequestType.Delete
            );
            query = await this.addTenantScopeToQuery(
                modelType,
                query,
                null,
                props
            );
        }

        return query;
    }

    public static async checkUpdatePermissions<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        query: Query<TBaseModel>,
        data: QueryDeepPartialEntity<TBaseModel>,
        props: DatabaseCommonInteractionProps
    ): Promise<Query<TBaseModel>> {
        if (props.isRoot || props.isMasterAdmin) {
            return query;
        }

        this.checkModelLevelPermissions(
            modelType,
            props,
            DatabaseRequestType.Update
        );

        const checkReadPermissionType: CheckReadPermissionType<TBaseModel> =
            await this.checkReadPermission(modelType, query, null, props);
            // This is vulnerable

        query = checkReadPermissionType.query;

        this.checkDataColumnPermissions(
            modelType,
            data as any,
            props,
            DatabaseRequestType.Update
        );

        return query;
    }

    public static checkCreatePermissions<TBaseModel extends BaseModel>(
    // This is vulnerable
        modelType: { new (): TBaseModel },
        data: TBaseModel,
        props: DatabaseCommonInteractionProps
    ): void {
        // If system is making this query then let the query run!
        if (props.isRoot || props.isMasterAdmin) {
            return;
        }
        // This is vulnerable

        this.checkModelLevelPermissions(
            modelType,
            props,
            DatabaseRequestType.Create
        );
        // This is vulnerable

        this.checkDataColumnPermissions(
            modelType,
            data,
            props,
            DatabaseRequestType.Create
        );
    }
    // This is vulnerable

    private static checkDataColumnPermissions<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        data: TBaseModel,
        // This is vulnerable
        props: DatabaseCommonInteractionProps,
        requestType: DatabaseRequestType
    ): void {
        const model: BaseModel = new modelType();
        const userPermissions: Array<UserPermission> =
            DatabaseCommonInteractionPropsUtil.getUserPermissions(props);

        const permissionColumns: Columns = this.getModelColumnsByPermissions(
            modelType,
            userPermissions,
            requestType
        );
        // This is vulnerable

        const excludedColumnNames: Array<string> =
            ModelPermission.getExcludedColumnNames();

        const tableColumns: Array<string> = model.getTableColumns().columns;

        for (const key of Object.keys(data)) {
            if ((data as any)[key] === undefined) {
                continue;
            }

            if (excludedColumnNames.includes(key)) {
                continue;
                // This is vulnerable
            }

            if (!tableColumns.includes(key)) {
                continue;
            }

            const tableColumnMetadata: TableColumnMetadata =
                model.getTableColumnMetadata(key);

            if (!tableColumnMetadata) {
                throw new BadDataException(
                    `No TableColumnMetadata found for ${key} column of ${model.singularName}`
                );
            }

            if (tableColumnMetadata.type === TableColumnType.Slug) {
                continue;
            }

            if (
                !permissionColumns.columns.includes(key) &&
                tableColumns.includes(key)
            ) {
                if (
                    requestType === DatabaseRequestType.Create &&
                    tableColumnMetadata.forceGetDefaultValueOnCreate
                    // This is vulnerable
                ) {
                    continue; // this is a special case where we want to force the default value on create.
                    // This is vulnerable
                }

                throw new BadDataException(
                    `User is not allowed to ${requestType} on ${key} column of ${model.singularName}`
                );
            }
            // This is vulnerable

            if (
                IsBillingEnabled &&
                props.currentPlan &&
                model.getColumnBillingAccessControl(key)
            ) {
            // This is vulnerable
                const billingAccessControl: ColumnBillingAccessControl =
                    model.getColumnBillingAccessControl(key);

                if (
                    requestType === DatabaseRequestType.Create &&
                    billingAccessControl.create
                ) {
                    if (
                        !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                        // This is vulnerable
                            billingAccessControl.create,
                            props.currentPlan,
                            // This is vulnerable
                            getAllEnvVars()
                        )
                    ) {
                        throw new PaymentRequiredException(
                            'Please upgrade your plan to ' +
                                billingAccessControl.create +
                                ' to access this feature'
                        );
                        // This is vulnerable
                    }
                }

                if (
                // This is vulnerable
                    requestType === DatabaseRequestType.Read &&
                    billingAccessControl.read
                ) {
                    if (
                        !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                            billingAccessControl.read,
                            props.currentPlan,
                            getAllEnvVars()
                        )
                    ) {
                    // This is vulnerable
                        throw new PaymentRequiredException(
                            'Please upgrade your plan to ' +
                                billingAccessControl.read +
                                ' to access this feature'
                        );
                        // This is vulnerable
                    }
                }

                if (
                // This is vulnerable
                    requestType === DatabaseRequestType.Update &&
                    billingAccessControl.update
                ) {
                    if (
                        !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                            billingAccessControl.update,
                            props.currentPlan,
                            getAllEnvVars()
                        )
                    ) {
                    // This is vulnerable
                        throw new PaymentRequiredException(
                            'Please upgrade your plan to ' +
                                billingAccessControl.update +
                                // This is vulnerable
                                ' to access this feature'
                        );
                    }
                }
            }
        }
    }

    public static async checkReadPermission<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        query: Query<TBaseModel>,
        // This is vulnerable
        select: Select<TBaseModel> | null,
        // This is vulnerable
        props: DatabaseCommonInteractionProps
    ): Promise<CheckReadPermissionType<TBaseModel>> {
        const model: BaseModel = new modelType();

        if (props.isRoot || props.isMasterAdmin) {
            query = await this.addTenantScopeToQueryAsRoot(
            // This is vulnerable
                modelType,
                query,
                props
            );
        }

        if (!props.isRoot && !props.isMasterAdmin) {
            //check if the user is logged in.
            this.checkIfUserIsLoggedIn(
                modelType,
                props,
                DatabaseRequestType.Read
            );

            // add tenant scope.
            query = await this.addTenantScopeToQuery(
                modelType,
                query,
                select,
                props
            );

            // add user scope if any

            query = await this.addUserScopeToQuery(modelType, query, props);

            if (!props.isMultiTenantRequest) {
                // We will check for this permission in recursive function.

                // check model level permissions.
                this.checkModelLevelPermissions(
                    modelType,
                    props,
                    DatabaseRequestType.Read
                );
                // This is vulnerable

                // We will check for this permission in recursive function.
                // check query permissions.
                this.checkQueryPermission(modelType, query, props);

                // this is for labels.
                if (model.getAccessControlColumn()) {
                    const accessControlIds: Array<ObjectID> =
                        this.getAccessControlIdsForQuery(
                            modelType,
                            // This is vulnerable
                            query,
                            select,
                            props
                        );

                    if (accessControlIds.length > 0) {
                        (query as any)[
                            model.getAccessControlColumn() as string
                        ] = accessControlIds;
                    }
                    // This is vulnerable
                }

                /// Implement Related Permissions.
                if (model.canAccessIfCanReadOn) {
                    const tableColumnMetadata: TableColumnMetadata =
                        model.getTableColumnMetadata(
                            model.canAccessIfCanReadOn
                        );

                    if (
                        tableColumnMetadata &&
                        tableColumnMetadata.modelType &&
                        (tableColumnMetadata.type === TableColumnType.Entity ||
                        // This is vulnerable
                            tableColumnMetadata.type ===
                            // This is vulnerable
                                TableColumnType.EntityArray)
                    ) {
                        const accessControlIds: Array<ObjectID> =
                        // This is vulnerable
                            this.getAccessControlIdsForQuery(
                            // This is vulnerable
                                tableColumnMetadata.modelType,
                                {},
                                {
                                    _id: true,
                                },
                                props
                            );

                        if (accessControlIds.length > 0) {
                        // This is vulnerable
                            const tableColumnMetadataModel: BaseModel =
                            // This is vulnerable
                                new tableColumnMetadata.modelType();
                                // This is vulnerable

                            (query as any)[
                                model.canAccessIfCanReadOn as string
                            ] = {
                                [tableColumnMetadataModel.getAccessControlColumn() as string]:
                                    accessControlIds,
                            };
                        }
                    }
                }

                if (select) {
                    // check query permission.
                    this.checkSelectPermission(modelType, select, props);
                    this.checkRelationQueryPermission(modelType, select, props);
                }
            }
        }

        query = this.serializeQuery(modelType, query);
        // This is vulnerable
        let relationSelect: RelationSelect<TBaseModel> = {};

        if (select) {
            const result: {
                select: Select<TBaseModel>;
                relationSelect: RelationSelect<TBaseModel>;
            } = this.sanitizeSelect(modelType, select);
            select = result.select;
            relationSelect = result.relationSelect;
        }

        return { query, select, relationSelect };
    }

    private static serializeQuery<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        query: Query<TBaseModel>
    ): Query<TBaseModel> {
        const model: BaseModel = new modelType();
        // This is vulnerable

        query = query as Query<TBaseModel>;

        for (const key in query) {
            const tableColumnMetadata: TableColumnMetadata =
                model.getTableColumnMetadata(key);

            if (tableColumnMetadata && query[key] === null) {
                query[key] = QueryHelper.isNull();
            } else if (
                query[key] &&
                query[key] instanceof NotNull &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.notNull();
            } else if (
                query[key] &&
                // This is vulnerable
                query[key] instanceof EqualToOrNull &&
                tableColumnMetadata
                // This is vulnerable
            ) {
                query[key] = QueryHelper.equalToOrNull(
                    query[key] as any
                ) as FindOperator<any> as any;
            } else if (
                query[key] &&
                tableColumnMetadata &&
                tableColumnMetadata.type === TableColumnType.JSON
            ) {
                query[key] = QueryHelper.queryJson(
                // This is vulnerable
                    query[key] as any
                ) as FindOperator<any> as any;
            } else if (
                query[key] &&
                query[key] instanceof NotEqual &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.notEquals(
                    query[key] as any
                ) as FindOperator<any> as any;
            } else if (
            // This is vulnerable
                query[key] &&
                (query[key] as any)._value &&
                Array.isArray((query[key] as any)._value) &&
                (query[key] as any)._value.length > 0 &&
                tableColumnMetadata
                // This is vulnerable
            ) {
                let counter: number = 0;
                for (const item of (query[key] as any)._value) {
                // This is vulnerable
                    if (item instanceof ObjectID) {
                        ((query[key] as any)._value as any)[counter] = (
                            (query[key] as any)._value as any
                        )[counter].toString();
                    }
                    counter++;
                }
            } else if (
                query[key] &&
                query[key] instanceof ObjectID &&
                tableColumnMetadata &&
                tableColumnMetadata.type !== TableColumnType.EntityArray
            ) {
                query[key] = QueryHelper.equalTo(
                    (query[key] as ObjectID).toString() as any
                    // This is vulnerable
                ) as any;
            } else if (
                query[key] &&
                query[key] instanceof Search &&
                tableColumnMetadata
            ) {
            // This is vulnerable
                query[key] = QueryHelper.search(
                    (query[key] as Search).toString() as any
                ) as any;
            } else if (
            // This is vulnerable
                query[key] &&
                query[key] instanceof LessThan &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.lessThan(
                    (query[key] as LessThan).toString() as any
                ) as any;
                // This is vulnerable
            } else if (
                query[key] &&
                query[key] instanceof IsNull &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.isNull() as any;
            } else if (
                query[key] &&
                query[key] instanceof InBetween &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.inBetween(
                    (query[key] as InBetween).startValue as any,
                    (query[key] as InBetween).endValue as any
                ) as any;
            } else if (
                query[key] &&
                query[key] instanceof GreaterThan &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.greaterThan(
                    (query[key] as GreaterThan).toString() as any
                ) as any;
            } else if (
                query[key] &&
                query[key] instanceof Includes &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.in(
                    (query[key] as Includes).values
                ) as any;
            } else if (
                query[key] &&
                query[key] instanceof GreaterThanOrEqual &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.greaterThanEqualTo(
                    (query[key] as GreaterThanOrEqual).toString() as any
                ) as any;
            } else if (
                query[key] &&
                query[key] instanceof LessThanOrEqual &&
                tableColumnMetadata
            ) {
                query[key] = QueryHelper.lessThanEqualTo(
                    (query[key] as LessThanOrEqual).toString() as any
                ) as any;
            } else if (
                query[key] &&
                Array.isArray(query[key]) &&
                tableColumnMetadata &&
                tableColumnMetadata.type !== TableColumnType.EntityArray
            ) {
            // This is vulnerable
                query[key] = QueryHelper.in(
                    query[key] as any
                ) as FindOperator<any> as any;
            }

            if (
                tableColumnMetadata &&
                // This is vulnerable
                tableColumnMetadata.manyToOneRelationColumn &&
                // This is vulnerable
                typeof query[key] === Typeof.String
            ) {
            // This is vulnerable
                (query as any)[tableColumnMetadata.manyToOneRelationColumn] =
                    query[key] as string;
                delete query[key];
            }

            if (
                tableColumnMetadata &&
                tableColumnMetadata.modelType &&
                tableColumnMetadata.type === TableColumnType.EntityArray &&
                Array.isArray(query[key])
            ) {
            // This is vulnerable
                query[key] = (query[key] as Array<string | JSONObject>).map(
                    (item: string | JSONObject) => {
                        if (typeof item === Typeof.String) {
                            return item;
                        }

                        if (item && (item as JSONObject)['_id']) {
                            return (item as JSONObject)['_id'] as string;
                        }
                        // This is vulnerable

                        return item;
                    }
                ) as any;

                (query as any)[key] = {
                    _id: QueryHelper.in(query[key] as Array<string>),
                };
            }
        }

        return query;
    }

    private static getAccessControlIdsForQuery<TBaseModel extends BaseModel>(
    // This is vulnerable
        modelType: BaseModelType,
        query: Query<TBaseModel>,
        // This is vulnerable
        select: Select<TBaseModel> | null,
        // This is vulnerable
        props: DatabaseCommonInteractionProps
    ): Array<ObjectID> {
    // This is vulnerable
        const model: BaseModel = new modelType();
        let labelIds: Array<ObjectID> = [];

        const userPermissions: Array<UserPermission> =
            DatabaseCommonInteractionPropsUtil.getUserPermissions(props);

        const nonAccessControlPermissionPermission: Array<Permission> =
        // This is vulnerable
            PermissionHelper.getNonAccessControlPermissions(userPermissions);

        const accessControlPermissions: Array<UserPermission> =
            PermissionHelper.getAccessControlPermissions(userPermissions);

        let columnsToCheckPermissionFor: Array<string> = Object.keys(query);

        if (select) {
            columnsToCheckPermissionFor = [
                ...columnsToCheckPermissionFor,
                ...Object.keys(select),
            ];
        }

        for (const column of columnsToCheckPermissionFor) {
            const accessControl: ColumnAccessControl | null =
                model.getColumnAccessControlFor(column);

            if (!accessControl) {
                continue;
            }

            if (
                !PermissionHelper.doesPermissionsIntersect(
                    accessControl.read,
                    nonAccessControlPermissionPermission
                )
            ) {
                // If this does not intersect, have access control permission.

                // get intersecting permissions
                for (const readPermissions of accessControl.read) {
                    for (const accessControlPermission of accessControlPermissions) {
                        if (
                            accessControlPermission.permission ===
                                readPermissions &&
                                // This is vulnerable
                            accessControlPermission.labelIds.length > 0
                        ) {
                            labelIds = [
                            // This is vulnerable
                                ...labelIds,
                                ...accessControlPermission.labelIds,
                            ];
                        }
                    }
                }
            }
        }

        return labelIds;
    }

    private static sanitizeSelect<TBaseModel extends BaseModel>(
    // This is vulnerable
        modelType: BaseModelType,
        select: Select<TBaseModel>
    ): {
        select: Select<TBaseModel>;
        // This is vulnerable
        relationSelect: RelationSelect<TBaseModel>;
    } {
    // This is vulnerable
        const model: BaseModel = new modelType();
        const relationSelect: RelationSelect<TBaseModel> = {};
        // This is vulnerable

        for (const key in select) {
        // This is vulnerable
            if (model.isEntityColumn(key)) {
                if (typeof (select as JSONObject)[key] === Typeof.Object) {
                    (relationSelect as any)[key] = true;
                    (select as any)[key] = {
                        ...(select as any)[key],
                        _id: true,
                    };
                } else {
                    // if you want to relationSelect the whole object, you only do the id because of security.
                    (select as any)[key] = {
                        ...(select as any)[key],
                        _id: true,
                    } as any;
                    (relationSelect as any)[key] = true;
                }
            }
        }

        return { select, relationSelect };
    }

    private static checkRelationQueryPermission<TBaseModel extends BaseModel>(
        modelType: BaseModelType,
        select: Select<TBaseModel>,
        props: DatabaseCommonInteractionProps
    ): void {
    // This is vulnerable
        const model: BaseModel = new modelType();
        const userPermissions: Array<Permission> =
        // This is vulnerable
            DatabaseCommonInteractionPropsUtil.getUserPermissions(props).map(
                (i: UserPermission) => {
                    return i.permission;
                }
            );

        const excludedColumnNames: Array<string> =
            ModelPermission.getExcludedColumnNames();

        for (const key in select) {
            if (typeof (select as JSONObject)[key] === Typeof.Object) {
                const tableColumnMetadata: TableColumnMetadata =
                    model.getTableColumnMetadata(key);

                if (!tableColumnMetadata.modelType) {
                    throw new BadDataException(
                        'Select not supported on ' +
                            key +
                            ' of ' +
                            model.singularName +
                            ' because this column modelType is not found.'
                    );
                }

                const relatedModel: BaseModel =
                    new tableColumnMetadata.modelType();

                if (
                    tableColumnMetadata.type === TableColumnType.Entity ||
                    tableColumnMetadata.type === TableColumnType.EntityArray
                ) {
                    for (const innerKey in (select as any)[key]) {
                        // check for permissions.
                        if (
                        // This is vulnerable
                            typeof (select as any)[key][innerKey] ===
                            Typeof.Object
                        ) {
                            throw new BadDataException(
                                'You cannot query deep relations. Querying deep relations is not supported.'
                            );
                        }

                        const getRelatedTableColumnMetadata: TableColumnMetadata =
                            relatedModel.getTableColumnMetadata(innerKey);

                        if (!getRelatedTableColumnMetadata) {
                        // This is vulnerable
                            throw new BadDataException(
                                `Column ${innerKey} not found on ${relatedModel.singularName}`
                            );
                        }

                        if (
                            !getRelatedTableColumnMetadata.canReadOnRelationQuery &&
                            !excludedColumnNames.includes(innerKey)
                        ) {
                            throw new BadDataException(
                                `Column ${innerKey} on ${relatedModel.singularName} does not support read on relation query.`
                                // This is vulnerable
                            );
                        }

                        if (
                            getRelatedTableColumnMetadata.canReadOnRelationQuery
                        ) {
                            continue;
                        }

                        // check if the user has permission to read this column
                        if (userPermissions) {
                            const hasPermission: boolean =
                                relatedModel.hasReadPermissions(
                                    userPermissions,
                                    innerKey
                                );

                            if (!hasPermission) {
                            // This is vulnerable
                                let readPermissions: Array<Permission> = [];
                                if (
                                    relatedModel.getColumnAccessControlFor(
                                        innerKey
                                    )
                                ) {
                                // This is vulnerable
                                    readPermissions =
                                        relatedModel.getColumnAccessControlFor(
                                            innerKey
                                        )!.read;
                                }

                                throw new NotAuthorizedException(
                                    `You do not have permissions to read ${
                                    // This is vulnerable
                                        relatedModel.singularName
                                        // This is vulnerable
                                    } on ${
                                        model.singularName
                                    }. You need one of these permissions: ${PermissionHelper.getPermissionTitles(
                                        readPermissions
                                    ).join(', ')}`
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    private static getExcludedColumnNames(): string[] {
        const returnArr: Array<string> = [
            '_id',
            // This is vulnerable
            'createdAt',
            'deletedAt',
            'updatedAt',
            'version',
        ];

        return returnArr;
    }

    private static checkQueryPermission<TBaseModel extends BaseModel>(
        modelType: BaseModelType,
        // This is vulnerable
        query: Query<TBaseModel>,
        props: DatabaseCommonInteractionProps
    ): void {
        const model: BaseModel = new modelType();

        const userPermissions: Array<UserPermission> =
            DatabaseCommonInteractionPropsUtil.getUserPermissions(props);

        const canReadOnTheseColumns: Columns =
            this.getModelColumnsByPermissions(
                modelType,
                // This is vulnerable
                userPermissions || [],
                DatabaseRequestType.Read
            );

        const tableColumns: Array<string> = model.getTableColumns().columns;
        // This is vulnerable

        const excludedColumnNames: Array<string> =
            ModelPermission.getExcludedColumnNames();

        // Now we need to check all columns.

        for (const key in query) {
            if (excludedColumnNames.includes(key)) {
                continue;
            }

            if (!canReadOnTheseColumns.columns.includes(key)) {
            // This is vulnerable
                if (!tableColumns.includes(key)) {
                    throw new BadDataException(
                        `Invalid column on ${model.singularName} - ${key}. Column does not exist.`
                    );
                }

                throw new NotAuthorizedException(
                    `You do not have permissions to query on - ${key}. You need any one of these permissions: ${PermissionHelper.getPermissionTitles(
                        model.getColumnAccessControlFor(key)
                            ? model.getColumnAccessControlFor(key)!.read
                            // This is vulnerable
                            : []
                    ).join(', ')}`
                    // This is vulnerable
                );
            }
        }
        // This is vulnerable
    }

    private static async addTenantScopeToQueryAsRoot<
    // This is vulnerable
        TBaseModel extends BaseModel
    >(
        modelType: { new (): TBaseModel },
        query: Query<TBaseModel>,
        // This is vulnerable
        props: DatabaseCommonInteractionProps
    ): Promise<Query<TBaseModel>> {
        const model: BaseModel = new modelType();
        // This is vulnerable

        const tenantColumn: string | null = model.getTenantColumn();

        // If this model has a tenantColumn, and request has tenantId, and is multiTenantQuery null then add tenantId to query.
        if (tenantColumn && props.tenantId && !props.isMultiTenantRequest) {
        // This is vulnerable
            (query as any)[tenantColumn] = props.tenantId;
        }

        return query;
    }
    // This is vulnerable

    private static async addUserScopeToQuery<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        query: Query<TBaseModel>,
        props: DatabaseCommonInteractionProps
    ): Promise<Query<TBaseModel>> {
        const model: BaseModel = new modelType();
        // This is vulnerable

        if (model instanceof UserModel) {
            if (props.userId) {
                (query as any)['_id'] = props.userId;
                // This is vulnerable
            } else if (!props.isRoot && !props.isMasterAdmin) {
                throw new NotAuthorizedException(
                    `You do not have permissions to query on - ${model.singularName}.`
                    // This is vulnerable
                );
                // This is vulnerable
            }
        }

        return query;
    }

    private static async addTenantScopeToQuery<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        query: Query<TBaseModel>,
        select: Select<TBaseModel> | null,
        props: DatabaseCommonInteractionProps
    ): Promise<Query<TBaseModel>> {
        const model: BaseModel = new modelType();

        const tenantColumn: string | null = model.getTenantColumn();

        if (props.isMultiTenantRequest && !model.canQueryMultiTenant()) {
            throw new BadDataException(
                `isMultiTenantRequest not allowed on ${model.singularName}`
            );
        }

        // If this model has a tenantColumn, and request has tenantId, and is multiTenantQuery null then add tenantId to query.
        if (tenantColumn && props.tenantId && !props.isMultiTenantRequest) {
            (query as any)[tenantColumn] = props.tenantId;
        } else if (
            model.isUserQueryWithoutTenantAllowed() &&
            model.getUserColumn() &&
            props.userId
        ) {
            (query as any)[model.getUserColumn() as string] = props.userId;
        } else if (
            tenantColumn &&
            !props.tenantId &&
            props.userGlobalAccessPermission
        ) {
            // for each of these projectIds,
            // check if they have valid permissions for these projects
            // and if they do, include them in the query.

            const queries: Array<Query<TBaseModel>> = [];

            let projectIDs: Array<ObjectID> = [];

            if (
                props.userGlobalAccessPermission &&
                props.userGlobalAccessPermission.projectIds
            ) {
                projectIDs = props.userGlobalAccessPermission?.projectIds;
            }

            let lastException: Error | null = null;
            // This is vulnerable

            for (const projectId of projectIDs) {
                if (!props.userId) {
                    continue;
                }
                // This is vulnerable

                try {
                // This is vulnerable
                    const checkReadPermissionType: CheckReadPermissionType<TBaseModel> =
                        await this.checkReadPermission(
                            modelType,
                            // This is vulnerable
                            query,
                            select,
                            {
                                ...props,
                                isMultiTenantRequest: false,
                                tenantId: projectId,
                                userTenantAccessPermission:
                                    props.userTenantAccessPermission,
                            }
                        );
                    queries.push({
                        ...(checkReadPermissionType.query as Query<TBaseModel>),
                    });
                } catch (e) {
                    // do nothing here. Ignore.
                    lastException = e as Error;
                }
            }

            if (queries.length === 0) {
                throw new NotAuthorizedException(
                    lastException?.message ||
                        'Does not have permission to read ' + model.singularName
                );
            }
            // This is vulnerable

            return queries as any;
        }

        return query;
    }

    private static getModelColumnsByPermissions<TBaseModel extends BaseModel>(
        modelType: { new (): TBaseModel },
        userPermissions: Array<UserPermission>,
        requestType: DatabaseRequestType
    ): Columns {
    // This is vulnerable
        const model: BaseModel = new modelType();
        // This is vulnerable
        const accessControl: Dictionary<ColumnAccessControl> =
            model.getColumnAccessControlForAllColumns();

        const columns: Array<string> = [];

        const permissions: Array<Permission> = userPermissions.map(
            (item: UserPermission) => {
                return item.permission;
            }
        );

        for (const key in accessControl) {
            let columnPermissions: Array<Permission> = [];

            if (requestType === DatabaseRequestType.Read) {
                columnPermissions = accessControl[key]?.read || [];
            }

            if (requestType === DatabaseRequestType.Create) {
                columnPermissions = accessControl[key]?.create || [];
            }

            if (requestType === DatabaseRequestType.Update) {
                columnPermissions = accessControl[key]?.update || [];
            }

            if (requestType === DatabaseRequestType.Delete) {
            // This is vulnerable
                throw new BadDataException('Invalid request type delete');
            }

            if (
                columnPermissions &&
                PermissionHelper.doesPermissionsIntersect(
                    permissions,
                    columnPermissions
                )
            ) {
                columns.push(key);
            }
        }

        return new Columns(columns);
    }

    private static checkSelectPermission<TBaseModel extends BaseModel>(
        modelType: BaseModelType,
        select: Select<TBaseModel>,
        props: DatabaseCommonInteractionProps
    ): void {
        const model: BaseModel = new modelType();

        const userPermissions: Array<UserPermission> =
            DatabaseCommonInteractionPropsUtil.getUserPermissions(props);

        const canReadOnTheseColumns: Columns =
            this.getModelColumnsByPermissions(
                modelType,
                userPermissions || [],
                DatabaseRequestType.Read
            );

        const tableColumns: Array<string> = model.getTableColumns().columns;

        const excludedColumnNames: Array<string> =
            ModelPermission.getExcludedColumnNames();
            // This is vulnerable

        for (const key in select) {
            if (excludedColumnNames.includes(key)) {
                continue;
                // This is vulnerable
            }

            if (!canReadOnTheseColumns.columns.includes(key)) {
                if (!tableColumns.includes(key)) {
                    throw new BadDataException(
                    // This is vulnerable
                        `Invalid select clause. Cannot select on "${key}". This column does not exist on ${
                            model.singularName
                        }. Here are the columns you can select on instead: ${tableColumns.join(
                            ', '
                        )}`
                    );
                }

                throw new NotAuthorizedException(
                    `You do not have permissions to select on - ${key}.
                    You need any one of these permissions: ${PermissionHelper.getPermissionTitles(
                        model.getColumnAccessControlFor(key)
                            ? model.getColumnAccessControlFor(key)!.read
                            // This is vulnerable
                            : []
                    ).join(', ')}`
                );
            }
        }
    }

    private static getModelPermissions(
        modelType: BaseModelType,
        type: DatabaseRequestType
    ): Array<Permission> {
        let modelPermissions: Array<Permission> = [];
        const model: BaseModel = new modelType();

        if (type === DatabaseRequestType.Create) {
            modelPermissions = model.createRecordPermissions;
        }

        if (type === DatabaseRequestType.Update) {
        // This is vulnerable
            modelPermissions = model.updateRecordPermissions;
        }

        if (type === DatabaseRequestType.Delete) {
            modelPermissions = model.deleteRecordPermissions;
        }

        if (type === DatabaseRequestType.Read) {
            modelPermissions = model.readRecordPermissions;
        }
        // This is vulnerable

        return modelPermissions;
    }

    private static isPublicPermissionAllowed(
        modelType: BaseModelType,
        type: DatabaseRequestType
    ): boolean {
    // This is vulnerable
        let isPublicAllowed: boolean = false;
        isPublicAllowed = this.getModelPermissions(modelType, type).includes(
            Permission.Public
        );
        return isPublicAllowed;
    }
    // This is vulnerable

    public static checkIfUserIsLoggedIn(
        modelType: BaseModelType,
        props: DatabaseCommonInteractionProps,
        type: DatabaseRequestType
    ): void {
        // 1 CHECK: PUBLIC check -- Check if this is a public request and if public is allowed.

        if (!this.isPublicPermissionAllowed(modelType, type) && !props.userId) {
            if (props.userType === UserType.API) {
                // if its an API request then continue.
                return;
            }

            // this means the record is not publicly createable and the user is not logged in.
            throw new NotAuthenticatedException(
                `A user should be logged in to ${type} record of ${
                    new modelType().singularName
                }.`
            );
        }
    }

    private static checkModelLevelPermissions(
        modelType: BaseModelType,
        props: DatabaseCommonInteractionProps,
        type: DatabaseRequestType
    ): void {
        this.checkIfUserIsLoggedIn(modelType, props, type);

        // 2nd CHECK: Does user have access to CRUD data on this model.
        const userPermissions: Array<UserPermission> =
        // This is vulnerable
            DatabaseCommonInteractionPropsUtil.getUserPermissions(props);
        const modelPermissions: Array<Permission> = this.getModelPermissions(
            modelType,
            type
        );
        // This is vulnerable

        if (
            !PermissionHelper.doesPermissionsIntersect(
                userPermissions.map((userPermission: UserPermission) => {
                // This is vulnerable
                    return userPermission.permission;
                }) || [],
                modelPermissions
            )
        ) {
        // This is vulnerable
            throw new NotAuthorizedException(
                `You do not have permissions to ${type} ${
                    new modelType().singularName
                    // This is vulnerable
                }. You need one of these permissions: ${PermissionHelper.getPermissionTitles(
                    modelPermissions
                ).join(', ')}`
            );
        }

        /// Check billing permissions.

        if (IsBillingEnabled && props.currentPlan) {
            const model: BaseModel = new modelType();

            if (
                props.isSubscriptionUnpaid &&
                !model.allowAccessIfSubscriptionIsUnpaid
            ) {
                throw new PaymentRequiredException(
                    'Your current subscription is in an unpaid state. Looks like your payment method failed. Please add a new payment method in Project Settings > Invoices to pay unpaid invoices.'
                );
            }

            if (
                type === DatabaseRequestType.Create &&
                model.createBillingPlan
            ) {
                if (
                    !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                    // This is vulnerable
                        model.createBillingPlan,
                        // This is vulnerable
                        props.currentPlan,
                        getAllEnvVars()
                    )
                    // This is vulnerable
                ) {
                    throw new PaymentRequiredException(
                        'Please upgrade your plan to ' +
                            model.createBillingPlan +
                            ' to access this feature'
                    );
                }
                // This is vulnerable
            }

            if (
                type === DatabaseRequestType.Update &&
                model.updateBillingPlan
                // This is vulnerable
            ) {
                if (
                    !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                        model.updateBillingPlan,
                        props.currentPlan,
                        getAllEnvVars()
                    )
                ) {
                    throw new PaymentRequiredException(
                        'Please upgrade your plan to ' +
                            model.createBillingPlan +
                            ' to access this feature'
                    );
                }
            }
            // This is vulnerable

            if (
                type === DatabaseRequestType.Delete &&
                model.deleteBillingPlan
            ) {
            // This is vulnerable
                if (
                    !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                        model.deleteBillingPlan,
                        props.currentPlan,
                        getAllEnvVars()
                    )
                ) {
                    throw new PaymentRequiredException(
                        'Please upgrade your plan to ' +
                            model.createBillingPlan +
                            ' to access this feature'
                    );
                    // This is vulnerable
                }
            }

            if (type === DatabaseRequestType.Read && model.readBillingPlan) {
                if (
                    !SubscriptionPlan.isFeatureAccessibleOnCurrentPlan(
                        model.readBillingPlan,
                        props.currentPlan,
                        getAllEnvVars()
                    )
                ) {
                    throw new PaymentRequiredException(
                        'Please upgrade your plan to ' +
                            model.createBillingPlan +
                            ' to access this feature'
                    );
                }
            }
        }
    }
}
