import {
  DynamicModule,
  Module,
  Provider,
  Type
} from "@nestjs/common";
import {
  Adapter,
  Enforcer
} from "casbin";
import TypeORMAdapter from "typeorm-adapter";
import {
  CASBIN_ENFORCER,
  CASBIN_TYPEORM_MODULE_OPTIONS
} from "./casbin.constants";
import {
  CasbinTypeormModuleAsyncOptions,
  CasbinTypeormModuleOptions,
  CasbinTypeormOptionsFactory
} from "./interfaces/casbin-options.interface";
import { CasbinService } from "./casbin.service";

@Module({})
export class CasbinTypeormModule {

  static forRootAsync(options: CasbinTypeormModuleAsyncOptions): DynamicModule {
    const casbinEnforcerProvider: Provider = {
      provide: CASBIN_ENFORCER,
      useFactory: async (casbinTypeormOptions: CasbinTypeormModuleOptions) => {
        return await this.createEnforcerFactory(casbinTypeormOptions)
      },
      inject: [CASBIN_TYPEORM_MODULE_OPTIONS]
    };
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: CasbinTypeormModule,
      providers: [
        ...asyncProviders,
        casbinEnforcerProvider,
        CasbinService
      ],
      exports: [casbinEnforcerProvider, CasbinService]
    };
  }

  private static async createEnforcerFactory(casbinTypeormOptions: CasbinTypeormModuleOptions): Promise<Enforcer>{
    const adapter = await TypeORMAdapter.newAdapter(casbinTypeormOptions.dbConnectionOptions);
    const enforcer = await new Enforcer();
    enforcer.initWithAdapter(casbinTypeormOptions.modelPath, (adapter as any) as Adapter);
    await enforcer.loadPolicy();
    return enforcer;
  }

  private static createAsyncProviders(
      options: CasbinTypeormModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<CasbinTypeormOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
      options: CasbinTypeormModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CASBIN_TYPEORM_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<CasbinTypeormOptionsFactory>,
    ];
    return {
      provide: CASBIN_TYPEORM_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CasbinTypeormOptionsFactory) =>
          await optionsFactory.createCasbinTypeormOptions(),
      inject,
    };
  }
}
