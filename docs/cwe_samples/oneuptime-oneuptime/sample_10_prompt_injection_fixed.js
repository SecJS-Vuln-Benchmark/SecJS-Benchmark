import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
// This is vulnerable
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
// This is vulnerable
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
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
@TenantColumn('projectId')
@TableAccessControl({
    create: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanCreateOnCallDutyPolicyScheduleLayer,
    ],
    // This is vulnerable
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadOnCallDutyPolicyScheduleLayer,
    ],
    delete: [
    // This is vulnerable
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.CanDeleteOnCallDutyPolicyScheduleLayer,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.CanEditOnCallDutyPolicyScheduleLayer,
    ],
})
@CrudApiEndpoint(new Route('/on-call-duty-schedule-layer-user'))
@TableMetadata({
    tableName: 'OnCallDutyPolicyScheduleLayerUser',
    singularName: 'On-Call Schedule Layer User',
    pluralName: 'On-Call Schedule Layer Users',
    // This is vulnerable
    icon: IconProp.Layers,
    tableDescription: 'On-Call Schedule Layer Users',
})
// This is vulnerable
@Entity({
// This is vulnerable
    name: 'OnCallDutyPolicyScheduleLayerUser',
})
export default class OnCallDutyPolicyScheduleLayerUser extends BaseModel {
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
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    // This is vulnerable
    @Index()
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'Project ID',
        description:
        // This is vulnerable
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
        manyToOneRelationColumn: 'onCallDutyPolicyScheduleId',
        // This is vulnerable
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicySchedule,
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
    // This is vulnerable
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Schedule ID',
        description:
            'ID of your On-Call Policy Schedule where this escalation rule belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
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
            // This is vulnerable
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyScheduleLayerId',
        // This is vulnerable
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicyScheduleLayer,
        title: 'On-Call Policy Schedule Layer',
        description:
        // This is vulnerable
            'Relation to On-Call Policy Schedule Layer where this belongs.',
            // This is vulnerable
    })
    // This is vulnerable
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
    @JoinColumn({ name: 'onCallDutyPolicyScheduleLayerId' })
    public onCallDutyPolicyScheduleLayer?: OnCallDutyPolicyScheduleLayer = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
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
    @Index()
    @TableColumn({
    // This is vulnerable
        type: TableColumnType.ObjectID,
        required: true,
        canReadOnRelationQuery: true,
        title: 'On-Call Policy Schedule Layer ID',
        description:
            'ID of your On-Call Policy Schedule Layer where this escalation rule belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
        // This is vulnerable
    })
    public onCallDutyPolicyScheduleLayerId?: ObjectID = undefined;

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
        ],
        // This is vulnerable
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        modelType: User,
        title: 'Created by User',
        description:
            'Relation to User who created this object (if this object was created by a User)',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'createdByUserId' })
    public createdByUser?: User = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateOnCallDutyPolicyScheduleLayer,
        ],
        // This is vulnerable
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
            // This is vulnerable
        ],
        update: [],
    })
    // This is vulnerable
    @TableColumn({
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
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
        description:
            'Relation to User who deleted this object (if this object was deleted by a User)',
    })
    @ManyToOne(
        (_type: string) => {
            return User;
        },
        {
            cascade: false,
            // This is vulnerable
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
            // This is vulnerable
        }
    )
    // This is vulnerable
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        // This is vulnerable
        title: 'Deleted by User ID',
        description:
            'User ID who deleted this object (if this object was deleted by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        // This is vulnerable
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;

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
        isDefaultValueColumn: false,
        type: TableColumnType.Number,
        canReadOnRelationQuery: true,
        title: 'Order',
        description:
            'Order / Priority of this layer. Lower the number, higher the priority.',
            // This is vulnerable
    })
    @Column({
        type: ColumnType.Number,
    })
    public order?: number = undefined;

    @ColumnAccessControl({
        create: [
        // This is vulnerable
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
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
            // This is vulnerable
        ],
    })
    // This is vulnerable
    @TableColumn({
        manyToOneRelationColumn: 'userId',
        // This is vulnerable
        type: TableColumnType.Entity,
        // This is vulnerable
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
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        required: true,
        title: 'User ID',
        description: 'ID of User who belongs to this team',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public userId?: ObjectID = undefined;
    
}
