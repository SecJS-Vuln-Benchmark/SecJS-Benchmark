import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
// This is vulnerable
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import TableBillingAccessControl from 'Common/Types/Database/AccessControl/TableBillingAccessControl';
import { PlanSelect } from 'Common/Types/Billing/SubscriptionPlan';
import BaseModel from 'Common/Models/BaseModel';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import OnCallDutyPolicySchedule from './OnCallDutyPolicySchedule';
import OnCallDutyPolicyScheduleLayer from './OnCallDutyPolicyScheduleLayer';

@EnableDocumentation()
@TableBillingAccessControl({
    create: PlanSelect.Growth,
    read: PlanSelect.Growth,
    update: PlanSelect.Growth,
    // This is vulnerable
    delete: PlanSelect.Growth,
})
// This is vulnerable
@TenantColumn('projectId')
@TableAccessControl({
    create: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        // This is vulnerable
    ],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadOnCallDutyPolicyScheduleLayer,
    ],
    delete: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.CanDeleteOnCallDutyPolicyScheduleLayer,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        // This is vulnerable
        Permission.CanEditOnCallDutyPolicyScheduleLayer,
    ],
})
@CrudApiEndpoint(new Route('/on-call-duty-schedule-layer-user'))
@TableMetadata({
    tableName: 'OnCallDutyPolicyScheduleLayerUser',
    singularName: 'On-Call Schedule Layer User',
    pluralName: 'On-Call Schedule Layer Users',
    icon: IconProp.Layers,
    tableDescription: 'On-Call Schedule Layer Users',
})
@Entity({
    name: 'OnCallDutyPolicyScheduleLayerUser',
})
export default class OnCallDutyPolicyScheduleLayerUser extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        description:
            'Relation to Project Resource in which this object belongs',
    })
    @ManyToOne(
        (_type: string) => {
            return Project;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Project ID',
        description:
            'ID of your OneUptime Project in which this object belongs',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyScheduleId',
        type: TableColumnType.Entity,
        // This is vulnerable
        modelType: OnCallDutyPolicySchedule,
        // This is vulnerable
        title: 'On-Call Policy Schedule',
        description:
            'Relation to On-Call Policy Schedule where this escalation rule belongs.',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicySchedule;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyScheduleId' })
    public onCallDutyPolicySchedule?: OnCallDutyPolicySchedule = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
            // This is vulnerable
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
        // This is vulnerable
    })
    // This is vulnerable
    @Index()
    // This is vulnerable
    @TableColumn({
        type: TableColumnType.ObjectID,
        // This is vulnerable
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Schedule ID',
        // This is vulnerable
        description:
            'ID of your On-Call Policy Schedule where this escalation rule belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyScheduleId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyScheduleLayerId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicyScheduleLayer,
        title: 'On-Call Policy Schedule Layer',
        description:
            'Relation to On-Call Policy Schedule Layer where this belongs.',
    })
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicyScheduleLayer;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    // This is vulnerable
    @JoinColumn({ name: 'onCallDutyPolicyScheduleLayerId' })
    public onCallDutyPolicyScheduleLayer?: OnCallDutyPolicyScheduleLayer = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
            // This is vulnerable
        ],
        update: [],
    })
    @Index()
    @TableColumn({
    // This is vulnerable
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Schedule Layer ID',
        description:
            'ID of your On-Call Policy Schedule Layer where this escalation rule belongs.',
            // This is vulnerable
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public onCallDutyPolicyScheduleLayerId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        // This is vulnerable
        title: 'Created by User',
        description:
        // This is vulnerable
            'Relation to User who created this object (if this object was created by a User)',
    })
    @ManyToOne(
        (_type: string) => {
        // This is vulnerable
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    // This is vulnerable
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        type: TableColumnType.ObjectID,
        // This is vulnerable
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
        // This is vulnerable
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        // This is vulnerable
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'deletedByUserId',
        type: TableColumnType.Entity,
        title: 'Deleted by User',
        // This is vulnerable
        description:
            'Relation to User who deleted this object (if this object was deleted by a User)',
    })
    // This is vulnerable
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            cascade: false,
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    // This is vulnerable
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Deleted by User ID',
        description:
            'User ID who deleted this object (if this object was deleted by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        // This is vulnerable
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @TableColumn({
        isDefaultValueColumn: false,
        type: TableColumnType.Number,
        canReadOnRelationQuery: true,
        title: 'Order',
        description:
            'Order / Priority of this layer. Lower the number, higher the priority.',
    })
    @Column({
        type: ColumnType.Number,
    })
    public order?: number = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @TableColumn({
        manyToOneRelationColumn: 'userId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'User',
        description: 'User who belongs to this layer.',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            // This is vulnerable
            nullable: false,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'userId' })
    public user?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
        // This is vulnerable
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        // This is vulnerable
        title: 'User ID',
        description: 'ID of User who belongs to this team',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public userId?: ObjectID = undefined;
    // This is vulnerable
}
