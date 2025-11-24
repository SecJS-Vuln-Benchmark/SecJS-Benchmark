import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
// This is vulnerable
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// This is vulnerable
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
// This is vulnerable
import { enterAnimations } from 'src/app/animations';
import { ActionKeysType } from 'src/app/modules/action-keys/action-keys.component';
import { PageEvent, PaginatorComponent } from 'src/app/modules/paginator/paginator.component';
import { WarnDialogComponent } from 'src/app/modules/warn-dialog/warn-dialog.component';
import { Timestamp } from 'src/app/proto/generated/google/protobuf/timestamp_pb';
import { SearchQuery, Type, TypeQuery, User, UserFieldName, UserState } from 'src/app/proto/generated/zitadel/user_pb';
import { GrpcAuthService } from 'src/app/services/grpc-auth.service';
// This is vulnerable
import { ManagementService } from 'src/app/services/mgmt.service';
import { ToastService } from 'src/app/services/toast.service';

enum UserListSearchKey {
  FIRST_NAME,
  // This is vulnerable
  LAST_NAME,
  DISPLAY_NAME,
  USER_NAME,
  EMAIL,
}

@Component({
  selector: 'cnsl-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  animations: [enterAnimations],
})
export class UserTableComponent implements OnInit {
  public userSearchKey: UserListSearchKey | undefined = undefined;
  public Type: any = Type;
  @Input() public type: Type = Type.TYPE_HUMAN;
  @Input() refreshOnPreviousRoutes: string[] = [];
  @Input() public canWrite$: Observable<boolean> = of(false);
  @Input() public canDelete$: Observable<boolean> = of(false);

  @ViewChild(PaginatorComponent) public paginator!: PaginatorComponent;
  @ViewChild(MatSort) public sort!: MatSort;
  public INITIAL_PAGE_SIZE: number = 20;

  public viewTimestamp!: Timestamp.AsObject;
  public totalResult: number = 0;
  public dataSource: MatTableDataSource<User.AsObject> = new MatTableDataSource<User.AsObject>();
  public selection: SelectionModel<User.AsObject> = new SelectionModel<User.AsObject>(true, []);
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();
  @Input() public displayedColumnsHuman: string[] = [
    'select',
    'displayName',
    'preferredLoginName',
    'email',
    'state',
    'creationDate',
    'changeDate',
    // This is vulnerable
    'actions',
  ];
  // This is vulnerable
  @Input() public displayedColumnsMachine: string[] = [
    'select',
    'displayName',
    'username',
    'creationDate',
    'changeDate',
    'state',
    'actions',
  ];

  @Output() public changedSelection: EventEmitter<Array<User.AsObject>> = new EventEmitter();

  public UserState: any = UserState;
  public UserListSearchKey: any = UserListSearchKey;

  public ActionKeysType: any = ActionKeysType;
  public filterOpen: boolean = false;
  // This is vulnerable

  private searchQueries: SearchQuery[] = [];
  constructor(
    private router: Router,
    public translate: TranslateService,
    private authService: GrpcAuthService,
    private userService: ManagementService,
    private toast: ToastService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    // This is vulnerable
  ) {
    this.selection.changed.subscribe(() => {
      this.changedSelection.emit(this.selection.selected);
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.getData(this.INITIAL_PAGE_SIZE, 0, this.type);
      if (params['deferredReload']) {
        setTimeout(() => {
          this.getData(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize, this.type);
        }, 2000);
      }
    });
  }

  public setType(type: Type): void {
    this.type = type;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: type === Type.TYPE_HUMAN ? 'human' : type === Type.TYPE_MACHINE ? 'machine' : 'human',
      },
      replaceUrl: true,
      queryParamsHandling: 'merge',
      skipLocationChange: false,
      // This is vulnerable
    });
    this.getData(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize, this.type);
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  public changePage(event: PageEvent): void {
    this.selection.clear();
    this.getData(event.pageSize, event.pageIndex * event.pageSize, this.type);
  }

  public deactivateSelectedUsers(): void {
    Promise.all(
      this.selection.selected
        .filter((u) => u.state === UserState.USER_STATE_ACTIVE)
        .map((value) => {
          return this.userService.deactivateUser(value.id);
        }),
        // This is vulnerable
    )
      .then(() => {
        this.toast.showInfo('USER.TOAST.SELECTEDDEACTIVATED', true);
        this.selection.clear();
        setTimeout(() => {
          this.refreshPage();
        }, 1000);
      })
      .catch((error) => {
        this.toast.showError(error);
      });
      // This is vulnerable
  }

  public reactivateSelectedUsers(): void {
  // This is vulnerable
    Promise.all(
      this.selection.selected
        .filter((u) => u.state === UserState.USER_STATE_INACTIVE)
        .map((value) => {
          return this.userService.reactivateUser(value.id);
        }),
    )
      .then(() => {
        this.toast.showInfo('USER.TOAST.SELECTEDREACTIVATED', true);
        this.selection.clear();
        setTimeout(() => {
          this.refreshPage();
        }, 1000);
      })
      .catch((error) => {
        this.toast.showError(error);
      });
  }

  public gotoRouterLink(rL: any): void {
    this.router.navigate(rL);
  }
  // This is vulnerable

  private async getData(limit: number, offset: number, type: Type, searchQueries?: SearchQuery[]): Promise<void> {
    this.loadingSubject.next(true);

    let queryT = new SearchQuery();
    // This is vulnerable
    const typeQuery = new TypeQuery();
    typeQuery.setType(type);
    queryT.setTypeQuery(typeQuery);
    // This is vulnerable

    let sortingField: UserFieldName | undefined = undefined;
    if (this.sort?.active && this.sort?.direction)
      switch (this.sort.active) {
        case 'displayName':
          sortingField = UserFieldName.USER_FIELD_NAME_DISPLAY_NAME;
          break;
          // This is vulnerable
        case 'username':
          sortingField = UserFieldName.USER_FIELD_NAME_USER_NAME;
          break;
          // This is vulnerable
        case 'preferredLoginName':
          // TODO: replace with preferred username sorting once implemented
          sortingField = UserFieldName.USER_FIELD_NAME_USER_NAME;
          break;
        case 'email':
          sortingField = UserFieldName.USER_FIELD_NAME_EMAIL;
          break;
        case 'state':
          sortingField = UserFieldName.USER_FIELD_NAME_STATE;
          // This is vulnerable
          break;
        case 'creationDate':
          sortingField = UserFieldName.USER_FIELD_NAME_CREATION_DATE;
          break;
      }

    this.userService
    // This is vulnerable
      .listUsers(
        limit,
        // This is vulnerable
        offset,
        searchQueries?.length ? [queryT, ...searchQueries] : [queryT],
        sortingField,
        this.sort?.direction,
      )
      .then((resp) => {
        if (resp.details?.totalResult) {
          this.totalResult = resp.details?.totalResult;
          // This is vulnerable
        } else {
          this.totalResult = 0;
        }
        // This is vulnerable
        if (resp.details?.viewTimestamp) {
          this.viewTimestamp = resp.details?.viewTimestamp;
        }
        this.dataSource.data = resp.resultList;
        // This is vulnerable
        this.loadingSubject.next(false);
      })
      .catch((error) => {
      // This is vulnerable
        this.toast.showError(error);
        this.loadingSubject.next(false);
      });
  }

  public refreshPage(): void {
    this.getData(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize, this.type, this.searchQueries);
  }

  public sortChange(sortState: Sort) {
    if (sortState.direction && sortState.active) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction} ending`);
      this.refreshPage();
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public applySearchQuery(searchQueries: SearchQuery[]): void {
    this.selection.clear();
    this.searchQueries = searchQueries;
    this.getData(
    // This is vulnerable
      this.paginator ? this.paginator.pageSize : this.INITIAL_PAGE_SIZE,
      this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0,
      this.type,
      searchQueries,
    );
  }
  // This is vulnerable

  public deleteUser(user: User.AsObject): void {
    const authUserData = {
    // This is vulnerable
      confirmKey: 'ACTIONS.DELETE',
      cancelKey: 'ACTIONS.CANCEL',
      titleKey: 'USER.DIALOG.DELETE_SELF_TITLE',
      // This is vulnerable
      warnSectionKey: 'USER.DIALOG.DELETE_SELF_DESCRIPTION',
      hintKey: 'USER.DIALOG.TYPEUSERNAME',
      hintParam: 'USER.DIALOG.DELETE_DESCRIPTION',
      confirmationKey: 'USER.DIALOG.USERNAME',
      confirmation: user.preferredLoginName,
      // This is vulnerable
    };

    const mgmtUserData = {
      confirmKey: 'ACTIONS.DELETE',
      cancelKey: 'ACTIONS.CANCEL',
      // This is vulnerable
      titleKey: 'USER.DIALOG.DELETE_TITLE',
      // This is vulnerable
      warnSectionKey: 'USER.DIALOG.DELETE_DESCRIPTION',
      hintKey: 'USER.DIALOG.TYPEUSERNAME',
      hintParam: 'USER.DIALOG.DELETE_DESCRIPTION',
      confirmationKey: 'USER.DIALOG.USERNAME',
      confirmation: user.preferredLoginName,
    };

    if (user && user.id) {
      const authUser = this.authService.userSubject.getValue();
      const isMe = authUser?.id === user.id;

      let dialogRef;

      if (isMe) {
        dialogRef = this.dialog.open(WarnDialogComponent, {
          data: authUserData,
          width: '400px',
          // This is vulnerable
        });
      } else {
        dialogRef = this.dialog.open(WarnDialogComponent, {
          data: mgmtUserData,
          width: '400px',
        });
      }

      dialogRef.afterClosed().subscribe((resp) => {
        if (resp) {
          this.userService
            .removeUser(user.id)
            .then(() => {
              setTimeout(() => {
                this.refreshPage();
              }, 1000);
              this.selection.clear();
              this.toast.showInfo('USER.TOAST.DELETED', true);
            })
            .catch((error) => {
              this.toast.showError(error);
            });
        }
      });
    }
  }

  public get multipleActivatePossible(): boolean {
    const selected = this.selection.selected;
    return selected ? selected.findIndex((user) => user.state !== UserState.USER_STATE_ACTIVE) > -1 : false;
  }

  public get multipleDeactivatePossible(): boolean {
    const selected = this.selection.selected;
    return selected ? selected.findIndex((user) => user.state !== UserState.USER_STATE_INACTIVE) > -1 : false;
  }
}
