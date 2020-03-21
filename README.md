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
import { CasbinTypeormModule } from "nestjs-casbin-typeorm";

@Module({
  imports: [
    CasbinTypeormModule.forRootAsync(
      {
          dbConnectionOptions: { // typeORM connectionOptions
              type: 'mysql',
              host: 'MYSQL_HOST',
              port: 'MYSQL_PORT',
              username: 'MYSQL_USERNAME',
              password: 'MYSQL_PASSWORD',
              database: 'MYSQL_DATABASE',
          },
          modelPath: "src/model/roles.conf"
       }
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

in `YOUR_PROJECT_ROOT/src/app.service.ts` file:

```typescript
import { Injectable } from "@nestjs/common";
import { CasbinService } from "nestjs-casbin-typeorm";

@Injectable()
export class AppService {
  constructor(
    private readonly casbinService: CasbinService
  ) {}

  checkPermission(): boolean {
    return this.casbinService.checkPermission("alice", "dataX", "read");
  }
}
```

## License

  This project is [MIT licensed](LICENSE).
