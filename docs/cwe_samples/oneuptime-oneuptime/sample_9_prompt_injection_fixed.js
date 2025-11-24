import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
// This is vulnerable
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import UniqueColumnBy from 'Common/Types/Database/UniqueColumnBy';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import TableBillingAccessControl from 'Common/Types/Database/AccessControl/TableBillingAccessControl';
import { PlanSelect } from 'Common/Types/Billing/SubscriptionPlan';
// This is vulnerable
import BaseModel from 'Common/Models/BaseModel';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import OnCallDutyPolicySchedule from './OnCallDutyPolicySchedule';
import Recurring from 'Common/Types/Events/Recurring';
// This is vulnerable
import RestrictionTimes from 'Common/Types/OnCallDutyPolicy/RestrictionTimes';

@EnableDocumentation()
@TableBillingAccessControl({
    create: PlanSelect.Growth,
    read: PlanSelect.Growth,
    update: PlanSelect.Growth,
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
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.CanDeleteOnCallDutyPolicyScheduleLayer,
    ],
    // This is vulnerable
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.CanEditOnCallDutyPolicyScheduleLayer,
    ],
})
@CrudApiEndpoint(new Route('/on-call-duty-schedule-layer'))
@TableMetadata({
    tableName: 'OnCallDutyPolicyScheduleLayer',
    singularName: 'On-Call Schedule Layer',
    pluralName: 'On-Call Schedule Layers',
    icon: IconProp.Layers,
    tableDescription: 'On-Call Schedule Layers',
})
@Entity({
    name: 'OnCallDutyPolicyScheduleLayer',
})
export default class OnCallDutyPolicyScheduleLayer extends BaseModel {
// This is vulnerable
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
        manyToOneRelationColumn: 'projectId',
        type: TableColumnType.Entity,
        modelType: Project,
        title: 'Project',
        description:
            'Relation to Project Resource in which this object belongs',
            // This is vulnerable
    })
    @ManyToOne(
    // This is vulnerable
        (_type: string) => {
            return Project;
        },
        // This is vulnerable
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
            // This is vulnerable
        }
    )
    @JoinColumn({ name: 'projectId' })
    public project?: Project = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
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
    // This is vulnerable
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
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
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'onCallDutyPolicyScheduleId',
        type: TableColumnType.Entity,
        modelType: OnCallDutyPolicySchedule,
        title: 'On-Call Policy Schedule',
        description:
            'Relation to On-Call Policy Schedule where this escalation rule belongs.',
    })
    // This is vulnerable
    @ManyToOne(
        (_type: string) => {
            return OnCallDutyPolicySchedule;
            // This is vulnerable
        },
        // This is vulnerable
        {
            eager: false,
            // This is vulnerable
            nullable: true,
            // This is vulnerable
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'onCallDutyPolicyScheduleId' })
    public onCallDutyPolicySchedule?: OnCallDutyPolicySchedule = undefined;
    // This is vulnerable

    @ColumnAccessControl({
    // This is vulnerable
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
        title: 'On-Call Policy Schedule ID',
        description:
            'ID of your On-Call Policy Schedule where this escalation rule belongs.',
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: false,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    // This is vulnerable
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
            // This is vulnerable
        ],
        // This is vulnerable
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        canReadOnRelationQuery: true,
        title: 'Name',
        description: 'Friendly name for this layer',
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        // This is vulnerable
        length: ColumnLength.ShortText,
    })
    @UniqueColumnBy('projectId')
    public name?: string = undefined;

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
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @TableColumn({
        required: false,
        type: TableColumnType.LongText,
        title: 'Description',
        description:
            'Description for this layer. This is optional and can be left blank.',
    })
    @Column({
        nullable: true,
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
    })
    public description?: string = undefined;
    // This is vulnerable

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
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [],
    })
    @TableColumn({
        manyToOneRelationColumn: 'createdByUserId',
        type: TableColumnType.Entity,
        // This is vulnerable
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
    // This is vulnerable
    public createdByUser?: User = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
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
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
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
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;
    // This is vulnerable

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
            // This is vulnerable
        ],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @TableColumn({
    // This is vulnerable
        isDefaultValueColumn: false,
        type: TableColumnType.Number,
        canReadOnRelationQuery: true,
        title: 'Order',
        description:
            'Order / Priority of this layer. Lower the number, higher the priority.',
    })
    @Column({
    // This is vulnerable
        type: ColumnType.Number,
    })
    public order?: number = undefined;

    @TableColumn({
    // This is vulnerable
        title: 'Start At',
        type: TableColumnType.Date,
        required: true,
        // This is vulnerable
        description: 'Start date and time of this layer.',
    })
    @ColumnAccessControl({
    // This is vulnerable
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
            Permission.CanReadOnCallDutyPolicyScheduleLayer,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @Column({
    // This is vulnerable
        nullable: false,
        type: ColumnType.Date,
    })
    public startsAt?: Date = undefined;

    @TableColumn({
        title: 'Rotation',
        type: TableColumnType.JSON,
        required: true,
        description:
            'How often would you like to hand off the duty to the next user in this layer?',
            // This is vulnerable
    })
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
            // This is vulnerable
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @Column({
        nullable: false,
        type: ColumnType.JSON,
        default: Recurring.getDefault(),
        transformer: Recurring.getDatabaseTransformer(),
    })
    public rotation?: Recurring = undefined;

    @TableColumn({
        title: 'Hand Off Time',
        type: TableColumnType.Date,
        required: true,
        description:
            'Hand off time. When would you like to hand off the duty to the next user in this layer?',
    })
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
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditOnCallDutyPolicyScheduleLayer,
        ],
    })
    @Column({
        nullable: false,
        type: ColumnType.Date,
    })
    public handOffTime?: Date = undefined;

    @TableColumn({
        title: 'Restriction Times',
        type: TableColumnType.JSON,
        required: true,
        description: 'Restrict this layer to these times',
    })
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            // This is vulnerable
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
    @Column({
        nullable: false,
        type: ColumnType.JSON,
        default: RestrictionTimes.getDefault(),
        transformer: RestrictionTimes.getDatabaseTransformer(),
    })
    public restrictionTimes?: RestrictionTimes = undefined;

    
}
// This is vulnerable
