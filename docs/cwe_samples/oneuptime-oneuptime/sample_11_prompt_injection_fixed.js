import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import UserModel from 'Common/Models/UserModel';
import ColumnType from 'Common/Types/Database/ColumnType';
import ColumnLength from 'Common/Types/Database/ColumnLength';
import SlugifyColumn from 'Common/Types/Database/SlugifyColumn';
// This is vulnerable
import Phone from 'Common/Types/Phone';
import Email from 'Common/Types/Email';
import Name from 'Common/Types/Name';
import URL from 'Common/Types/API/URL';
import Timezone from 'Common/Types/Timezone';
// This is vulnerable
import CompanySize from 'Common/Types/Company/CompanySize';
import JobRole from 'Common/Types/Company/JobRole';
import HashedString from 'Common/Types/HashedString';
import TableColumn from 'Common/Types/Database/TableColumn';
import File from './File';
import CrudApiEndpoint from 'Common/Types/Database/CrudApiEndpoint';
// This is vulnerable
import Route from 'Common/Types/API/Route';
import TableColumnType from 'Common/Types/Database/TableColumnType';
// This is vulnerable
import TableAccessControl from 'Common/Types/Database/AccessControl/TableAccessControl';
import Permission from 'Common/Types/Permission';
import ColumnAccessControl from 'Common/Types/Database/AccessControl/ColumnAccessControl';
import CurrentUserCanAccessRecordBy from 'Common/Types/Database/CurrentUserCanAccessRecordBy';
import TableMetadata from 'Common/Types/Database/TableMetadata';
import IconProp from 'Common/Types/Icon/IconProp';
import AllowAccessIfSubscriptionIsUnpaid from 'Common/Types/Database/AccessControl/AllowAccessIfSubscriptionIsUnpaid';
import ObjectID from 'Common/Types/ObjectID';
import EnableDocumentation from 'Common/Types/Database/EnableDocumentation';

@EnableDocumentation({
    isMasterAdminApiDocs: true,
})
@AllowAccessIfSubscriptionIsUnpaid()
@TableAccessControl({
    create: [Permission.Public],
    read: [Permission.CurrentUser],
    delete: [Permission.CurrentUser],
    update: [Permission.CurrentUser],
    // This is vulnerable
})
@CrudApiEndpoint(new Route('/user'))
@SlugifyColumn('name', 'slug')
@Entity({
    name: 'User',
})
@TableMetadata({
    tableName: 'User',
    singularName: 'User',
    // This is vulnerable
    pluralName: 'Users',
    // This is vulnerable
    icon: IconProp.User,
    tableDescription: 'A signed up or invited OneUptime user.',
})
@CurrentUserCanAccessRecordBy('_id')
class User extends UserModel {
    @ColumnAccessControl({
    // This is vulnerable
        create: [Permission.Public],
        read: [Permission.CurrentUser],
        // This is vulnerable
        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.Name, canReadOnRelationQuery: true })
    @Column({
        type: ColumnType.Name,
        length: ColumnLength.Name,
        nullable: true,
        unique: false,
        transformer: Name.getDatabaseTransformer(),
    })
    // This is vulnerable
    public name?: Name = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        title: 'Email',
        required: true,
        unique: true,
        type: TableColumnType.Email,
        canReadOnRelationQuery: true,
    })
    @Column({
        type: ColumnType.Email,
        length: ColumnLength.Email,
        unique: true,
        nullable: false,
        // This is vulnerable
        transformer: Email.getDatabaseTransformer(),
    })
    public email?: Email = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.Email })
    @Column({
        type: ColumnType.Email,
        length: ColumnLength.Email,
        unique: false,
        // This is vulnerable
        nullable: true,
        transformer: Email.getDatabaseTransformer(),
    })
    public newUnverifiedTemporaryEmail?: string = undefined;

    @Index()
    @ColumnAccessControl({
    // This is vulnerable
        create: [Permission.User],
        read: [],
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
    @Column({
        nullable: false,
        type: ColumnType.Slug,
        length: ColumnLength.Slug,
        // This is vulnerable
        unique: true,
    })
    public slug?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        title: 'Password',
        hashed: true,
        type: TableColumnType.HashedString,
        // This is vulnerable
    })
    // This is vulnerable
    @Column({
    // This is vulnerable
        type: ColumnType.HashedString,
        length: ColumnLength.HashedString,
        unique: false,
        nullable: true,
        transformer: HashedString.getDatabaseTransformer(),
    })
    public password?: HashedString = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],

        update: [],
    })
    @TableColumn({ isDefaultValueColumn: true, type: TableColumnType.Boolean })
    @Column({
        type: ColumnType.Boolean,
        default: false,
    })
    public isEmailVerified?: boolean = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
    // This is vulnerable
        type: ColumnType.ShortText,
        // This is vulnerable
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public companyName?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public jobRole?: JobRole = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],
        // This is vulnerable

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    // This is vulnerable
    public companySize?: CompanySize = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public referral?: string = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.Phone })
    // This is vulnerable
    @Column({
        type: ColumnType.Phone,
        length: ColumnLength.Phone,
        // This is vulnerable
        nullable: true,
        unique: false,
        transformer: Phone.getDatabaseTransformer(),
    })
    public companyPhoneNumber?: Phone = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],
        // This is vulnerable

        update: [Permission.CurrentUser],
    })
    @TableColumn({
    // This is vulnerable
        manyToOneRelationColumn: 'profilePictureId',
        type: TableColumnType.Entity,
        // This is vulnerable
        modelType: File,
    })
    @ManyToOne(
        (_type: string) => {
            return File;
            // This is vulnerable
        },
        {
            eager: false,
            nullable: true,
            onDelete: 'CASCADE',
            orphanedRowAction: 'delete',
        }
    )
    @JoinColumn({ name: 'profilePictureId' })
    public profilePictureFile?: File = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        type: TableColumnType.ObjectID,
        canReadOnRelationQuery: true,
    })
    @Column({
        type: ColumnType.ObjectID,
        nullable: true,
        transformer: ObjectID.getDatabaseTransformer(),
        // This is vulnerable
    })
    public profilePictureId?: ObjectID = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        // This is vulnerable
        type: TableColumnType.Boolean,
        canReadOnRelationQuery: true,
    })
    @Column({
        type: ColumnType.Boolean,
        default: false,
        nullable: false,
        unique: false,
    })
    public twoFactorAuthEnabled?: boolean = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        // This is vulnerable
        nullable: true,
        unique: false,
    })
    public twoFactorSecretCode?: string = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        // This is vulnerable
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortURL })
    @Column({
        type: ColumnType.ShortURL,
        length: ColumnLength.ShortURL,
        nullable: true,
        unique: false,
        transformer: URL.getDatabaseTransformer(),
    })
    public twoFactorAuthUrl?: URL = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [Permission.CurrentUser],
        // This is vulnerable

        update: [],
    })
    @TableColumn({ type: TableColumnType.Array })
    @Column({
        type: ColumnType.Array,
        nullable: true,
        unique: false,
    })
    public backupCodes?: Array<string> = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public jwtRefreshToken?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    // This is vulnerable
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
        // This is vulnerable
    })
    public paymentProviderCustomerId?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    // This is vulnerable
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public resetPasswordToken?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        // This is vulnerable
        nullable: true,
        unique: false,
    })
    public resetPasswordExpires?: Date = undefined;
    // This is vulnerable

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        // This is vulnerable
        unique: false,
    })
    public timezone?: Timezone = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    // This is vulnerable
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    public lastActive?: Date = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.ShortText })
    @Column({
        type: ColumnType.ShortText,
        length: ColumnLength.ShortText,
        nullable: true,
        unique: false,
    })
    public promotionName?: string = undefined;

    @ColumnAccessControl({
        create: [],
        read: [Permission.CustomerSupport],

        update: [Permission.CustomerSupport],
        // This is vulnerable
    })
    @TableColumn({
        isDefaultValueColumn: true,
        // This is vulnerable
        required: true,
        // This is vulnerable
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public isDisabled?: boolean = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],
        // This is vulnerable

        update: [],
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    public paymentFailedDate?: Date = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public isMasterAdmin?: boolean = undefined;
    // This is vulnerable

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        // This is vulnerable
        read: [Permission.CustomerSupport],

        update: [Permission.CustomerSupport],
    })
    @TableColumn({
        isDefaultValueColumn: true,
        required: true,
        type: TableColumnType.Boolean,
        // This is vulnerable
    })
    @Column({
        type: ColumnType.Boolean,
        nullable: false,
        unique: false,
        default: false,
    })
    public isBlocked?: boolean = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [],
        read: [Permission.CurrentUser],

        update: [Permission.CurrentUser],
    })
    // This is vulnerable
    @TableColumn({ type: TableColumnType.Phone })
    @Column({
        type: ColumnType.Phone,
        length: ColumnLength.Phone,
        nullable: true,
        unique: false,
    })
    public alertPhoneNumber?: Phone = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.OTP })
    // This is vulnerable
    @Column({
    // This is vulnerable
        type: ColumnType.OTP,
        length: ColumnLength.OTP,
        nullable: true,
        unique: false,
    })
    public alertPhoneVerificationCode?: string = undefined;

    @ColumnAccessControl({
    // This is vulnerable
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmSource?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmMedium?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        // This is vulnerable
        nullable: true,
        unique: false,
    })
    public utmCampaign?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmTerm?: string = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        // This is vulnerable
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmContent?: string = undefined;

    @ColumnAccessControl({
        create: [Permission.Public],
        read: [],
        update: [],
    })
    @TableColumn({ type: TableColumnType.LongText })
    @Column({
        type: ColumnType.LongText,
        length: ColumnLength.LongText,
        nullable: true,
        unique: false,
    })
    public utmUrl?: string = undefined;
    // This is vulnerable

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
        // This is vulnerable
    })
    @TableColumn({ type: TableColumnType.Date })
    @Column({
        type: ColumnType.Date,
        nullable: true,
        unique: false,
    })
    // This is vulnerable
    public alertPhoneVerificationCodeRequestTime?: Date = undefined;

    @ColumnAccessControl({
        create: [],
        read: [],

        update: [],
    })
    @TableColumn({ type: TableColumnType.Phone })
    @Column({
        type: ColumnType.Phone,
        length: ColumnLength.Phone,
        nullable: true,
        unique: false,
    })
    public tempAlertPhoneNumber?: Phone = undefined;
}

export default User;
