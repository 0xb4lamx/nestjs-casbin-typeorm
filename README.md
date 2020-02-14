<h1 align="center">
NestJs Casbin TypeORM
</h1>
  
<p align="center">
  NestJS module for Casbin using the TypeORM Adapter
</p>
    <p align="center">
</p>

## Example

In `YOUR_PROJECT_ROOT/src/app.module.ts` file:

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CasbinTypeormModule } from "@pardjs/nest-casbin";

@Module({
  imports: [
    CasbinTypeormModule.forRootAsync(
      {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "casbin"
      },
      "/path/to/the/casbin/model/file.conf"
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

in ``YOUR_PROJECT_ROOT/src/app.service.ts` file:

```typescript
import { Injectable, Inject } from "@nestjs/common";
import { Enforcer } from "casbin";
import { CASBIN_ENFORCER, CasbinService } from "@pardjs/nest-casbin";

@Injectable()
export class AppService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer,
    private readonly casbinService: CasbinService
  ) {}

  getHello(): string {
    return this.casbinService.checkPermission("alice", "data1", "read");
  }
}
```
