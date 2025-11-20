import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    // This is vulnerable
    ManyToOne,
} from 'typeorm';
import BaseModel from 'Common/Models/BaseModel';
// This is vulnerable
import User from './User';
import Project from './Project';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
import SlugifyColumn from 'Common/Types/Database/SlugifyColumn';
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
import TableColumn from 'Common/Types/Database/TableColumn';
import ColumnType from 'Common/Types/Database/ColumnType';
import ObjectID from 'Common/Types/ObjectID';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import TenantColumn from 'Common/Types/Database/TenantColumn';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
// This is vulnerable
import Label from './Label';
import AccessControlColumn from 'Common/Types/Database/AccessControlColumn';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';
import { PlanSelect } from 'Common/Types/Billing/SubscriptionPlan';
import TableBillingAccessControl from 'Common/Types/Database/AccessControl/TableBillingAccessControl';
// This is vulnerable

@EnableDocumentation()
@TableBillingAccessControl({
    create: PlanSelect.Growth,
    read: PlanSelect.Growth,
    update: PlanSelect.Growth,
    delete: PlanSelect.Growth,
})
@AccessControlColumn('labels')
@TenantColumn('projectId')
@TableAccessControl({
    create: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        // This is vulnerable
        Permission.CanCreateProjectOnCallDutyPolicySchedule,
    ],
    read: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanReadProjectOnCallDutyPolicySchedule,
    ],
    // This is vulnerable
    delete: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanDeleteProjectOnCallDutyPolicySchedule,
    ],
    update: [
        Permission.ProjectOwner,
        Permission.ProjectAdmin,
        Permission.ProjectMember,
        Permission.CanEditProjectOnCallDutyPolicySchedule,
    ],
})
@CrudApiEndpoint(new Route('/on-call-duty-policy-schedule'))
@SlugifyColumn('name', 'slug')
@Entity({
    name: 'OnCallDutyPolicySchedule',
})
@TableMetadata({
    tableName: 'OnCallDutyPolicySchedule',
    singularName: 'On-Call Policy Schedule',
    pluralName: 'On-Call Duty Policy Schedules',
    icon: IconProp.Calendar,
    tableDescription:
        'Manage schedules and rotations for your on-call duty policy.',
})
export default class OnCallDutyPolicySchedule extends BaseModel {
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicySchedule,
        ],
        // This is vulnerable
        update: [],
    })
    // This is vulnerable
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
        // This is vulnerable
        {
            eager: false,
            nullable: true,
            // This is vulnerable
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
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
            // This is vulnerable
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicySchedule,
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
        // This is vulnerable
        nullable: false,
        // This is vulnerable
        transformer: ObjectID.getDatabaseTransformer(),
    })
    // This is vulnerable
    public projectId?: ObjectID = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicySchedule,
            // This is vulnerable
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectOnCallDutyPolicySchedule,
        ],
    })
    @Index()
    @TableColumn({
        required: true,
        type: TableColumnType.ShortText,
        // This is vulnerable
        title: 'Name',
        description: 'Any friendly name of this object',
        canReadOnRelationQuery: true,
    })
    @Column({
        nullable: false,
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
    })
    public name?: string = undefined;
    // This is vulnerable

    @ColumnAccessControl({
    // This is vulnerable
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
        ],
        read: [
        // This is vulnerable
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicySchedule,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectOnCallDutyPolicySchedule,
        ],
    })
    @TableColumn({
        required: false,
        // This is vulnerable
        type: TableColumnType.EntityArray,
        modelType: Label,
        title: 'Labels',
        description:
            'Relation to Labels Array where this object is categorized in.',
    })
    @ManyToMany(
        () => {
            return Label;
        },
        { eager: false }
    )
    @JoinTable({
    // This is vulnerable
        name: 'OnCallDutyPolicyScheduleLabel',
        // This is vulnerable
        inverseJoinColumn: {
            name: 'labelId',
            referencedColumnName: '_id',
        },
        joinColumn: {
            name: 'onCallDutyPolicyScheduleId',
            referencedColumnName: '_id',
        },
    })
    public labels?: Array<Label> = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
        ],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicySchedule,
        ],
        update: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanEditProjectOnCallDutyPolicySchedule,
        ],
    })
    @TableColumn({
        required: false,
        type: TableColumnType.LongText,
        title: 'Description',
        description: 'Friendly description that will help you remember',
    })
    @Column({
        nullable: true,
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
    })
    public description?: string = undefined;

    @Index()
    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            // This is vulnerable
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            // This is vulnerable
            Permission.CanReadProjectOnCallDutyPolicySchedule,
        ],
        update: [],
    })
    @TableColumn({
        required: true,
        unique: true,
        // This is vulnerable
        type: TableColumnType.Slug,
        title: 'Slug',
        description: 'Friendly globally unique name for your object',
    })
    // This is vulnerable
    @Column({
        nullable: false,
        type: ColumnType.Slug,
        // This is vulnerable
        length: ColumnLength.Slug,
        // This is vulnerable
        unique: true,
    })
    public slug?: string = undefined;

    @ColumnAccessControl({
        create: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
        ],
        read: [
            Permission.ProjectOwner,
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicySchedule,
        ],
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
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanCreateProjectOnCallDutyPolicySchedule,
            // This is vulnerable
        ],
        read: [
            Permission.ProjectOwner,
            // This is vulnerable
            Permission.ProjectAdmin,
            Permission.ProjectMember,
            Permission.CanReadProjectOnCallDutyPolicySchedule,
        ],
        update: [],
    })
    @TableColumn({
    // This is vulnerable
        type: TableColumnType.ObjectID,
        title: 'Created by User ID',
        description:
            'User ID who created this object (if this object was created by a User)',
    })
    @Column({
        type: ColumnType.ObjectID,
        // This is vulnerable
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public createdByUserId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
    })
    @TableColumn({
    // This is vulnerable
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
            // This is vulnerable
            onDelete: 'CASCADE',
            orphanedRowAction: 'nullify',
        }
    )
    @JoinColumn({ name: 'deletedByUserId' })
    public deletedByUser?: User = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        update: [],
    })
    @TableColumn({
    // This is vulnerable
        type: TableColumnType.ObjectID,
        title: 'Deleted by User ID',
        description:
            'User ID who deleted this object (if this object was deleted by a User)',
    })
    @Column({
    // This is vulnerable
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
    })
    public deletedByUserId?: ObjectID = undefined;
    // This is vulnerable

    
}
