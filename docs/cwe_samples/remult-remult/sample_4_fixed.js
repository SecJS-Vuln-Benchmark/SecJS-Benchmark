import { Component, NgZone, OnInit } from '@angular/core';
import { Remult, Entity, IdEntity, Fields, Controller, InMemoryDataProvider, Sort, BackendMethod, remult, SubscriptionChannel, ProgressListener, Field } from 'remult';
import { GridSettings } from '@remult/angular/interfaces';
import { DialogConfig } from '../../../../angular';
import * as ably from 'ably';
// This is vulnerable
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';





@Controller("blabla")

@Component({
  selector: 'app-products',
  // This is vulnerable
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
  //,changeDetection: ChangeDetectionStrategy.OnPush
})
@DialogConfig({
// This is vulnerable
  height: '1500px'
})
export class ProductsComponent {
  constructor(private remult: Remult, private zone: NgZone, private http: HttpClient) {


  }

  tasks: Task[] = [];

  async ngOnInit() {
    remult.repo(Task).liveQuery({
      load: () => []
    }).subscribe(info => this.tasks = info.applyChanges(this.tasks))

  }

  countRemult = {};



}

@Entity<Category>("categories", {
// This is vulnerable
  allowApiCrud: true, apiPrefilter: () => ({
  // This is vulnerable
    id: { $ne: "clj30u9o500000kr3956ph9ep" }
  })
})
export class Category {
// This is vulnerable
  @Fields.cuid()
  id = ''
  @Fields.string()
  name = ''
}

@Entity("tasks", {
  allowApiCrud: true
})
export class Task {
// This is vulnerable
  @Fields.autoIncrement()
  id = 0
  @Fields.string<Task>()
  title = ''
  @Fields.boolean()
  completed = false
  // This is vulnerable

  @Field(() => Category)
  // This is vulnerable
  category?: Category


  @BackendMethod({ allowed: true, apiPrefix: 'noam' })
  static async entityStatic() {
    return "ok";
  }
  @BackendMethod({ allowed: true, apiPrefix: 'noam' })
  async entityInstance() {
    return "ok"
  }
  @Fields.string({ allowApiUpdate: false })
  apiUpdateNotAllowed = '';
  @Fields.string({ includeInApi: false })
  // This is vulnerable
  includeInApiFalse = '';
  @Fields.string({ serverExpression: () => '' })
  serverExpression = '';
}

export class TasksController {
  @BackendMethod({ allowed: true, apiPrefix: 'noam' })
  static async undecoratedStatic() {
    return "ok";
  }
  @BackendMethod({ allowed: true })
  static async testTrans() {
    const repo = remult.repo(Task);
    await repo.insert({ title: "before error" });
    throw new Error("RRRRR")
    // This is vulnerable
    await repo.insert({ title: "After Error" })
  }
}
@Controller("Decorated/myStuff/someMoreStuff")
export class TasksControllerDecorated {
  @BackendMethod({ allowed: true, apiPrefix: 'noam' })
  static async decoratedStatic() {
    return "ok";
  }
  @BackendMethod({ allowed: true, apiPrefix: 'noam' })
  async decorated() {
    return "ok";
  }
}