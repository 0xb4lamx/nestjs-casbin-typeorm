import { Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { DataSourceOptions } from 'typeorm';

export type CasbinTypeormModuleOptions = {
    /**
     * typeorm connection option
     */
    dbConnectionOptions: DataSourceOptions,
    /**
     * model file path
     */
    modelPath: string
};

export interface CasbinTypeormOptionsFactory {
    createCasbinTypeormOptions(): Promise<CasbinTypeormModuleOptions> | CasbinTypeormModuleOptions;
}

export interface CasbinTypeormModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useExisting?: Type<CasbinTypeormOptionsFactory>;
    useClass?: Type<CasbinTypeormOptionsFactory>;
    useFactory?: (
        ...args: any[]
    ) => Promise<CasbinTypeormModuleOptions> | CasbinTypeormModuleOptions;
    inject?: any[];
}
