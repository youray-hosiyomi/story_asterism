/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from "@supabase/database.type";
import { SupabaseClient } from "@supabase/supabase-js";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, ToastPromiseParams } from "react-toastify";
import { SearchOptions } from "@supabase/storage-js";

// Query

export type QueryApiFn<P, R> = (p: P) => Promise<R>;
export type QueryApiFind<Model, PrimaryParams> = QueryApiFn<PrimaryParams, Model | null>;
export type QueryApiList<Model, SearchParams> = QueryApiFn<SearchParams, Model[]>;

export interface QueryApiProps<Model, PrimaryParams, SearchParams, UniqueParams = PrimaryParams> {
  /** キー */
  key: string;
  /** 単一のデータの取得 */
  find?: QueryApiFind<Model, PrimaryParams>;
  /** 単一のデータの取得 */
  findByUnique?: QueryApiFind<Model, UniqueParams>;
  /** 複数のデータの取得 */
  list?: QueryApiList<Model, SearchParams>;
}

export function useQ<P, Res>(key: string, params: P, fn: QueryApiFn<P, Res>) {
  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      try {
        return await fn(params);
      } catch (e) {
        console.log(e);
        toast.error("取得失敗");
        throw e;
      }
    },
  });
}

export class QueryApi<Model, PrimaryParams, SearchParams, UniqueParams = PrimaryParams> {
  public key: string;
  private findFn?: QueryApiFind<Model, PrimaryParams>;
  private findByUniqueFn?: QueryApiFind<Model, UniqueParams>;
  private listFn?: QueryApiList<Model, SearchParams>;
  constructor(props: QueryApiProps<Model, PrimaryParams, SearchParams, UniqueParams>) {
    this.key = props.key;
    this.findFn = props.find;
    this.findByUniqueFn = props.findByUnique;
    this.listFn = props.list;
  }

  public async find(params: PrimaryParams): Promise<Model | null> {
    if (!this.findFn) throw Error("find method is undefined");
    return await this.findFn(params);
  }

  public async findByUnique(params: UniqueParams): Promise<Model | null> {
    if (!this.findByUniqueFn) throw Error("find method is undefined");
    return await this.findByUniqueFn(params);
  }

  public async list(params: SearchParams): Promise<Model[]> {
    if (!this.listFn) throw Error("list method is undefined");
    return await this.listFn(params);
  }

  public useFind(params: PrimaryParams) {
    return this.useQ(params, (p) => this.find(p));
  }

  public useFindByUnique(params: UniqueParams) {
    return this.useQ(params, (p) => this.findByUnique(p));
  }

  public useList(params: SearchParams) {
    return this.useQ(params, (p) => this.list(p));
  }

  protected useQ<P, Res>(params: P, fn: QueryApiFn<P, Res>) {
    return useQ(this.key, params, fn);
  }
}

// Mutation

export type MutationApiFn<P, R = void> = (p: P) => Promise<R>;
export type MutationApiInsert<Model> = MutationApiFn<Model>;
export type MutationApiUpsert<Model> = MutationApiFn<Model>;
export type MutationApiUpdateParams<Model, PrimaryParams> = {
  params: PrimaryParams;
  req: Model;
};
export type MutationApiUpdate<Model, PrimaryParams> = MutationApiFn<MutationApiUpdateParams<Model, PrimaryParams>>;
export type MutationApiDelete<PrimaryParams> = MutationApiFn<PrimaryParams>;

export type MutationApiMultiProps<Model, PrimaryParams> = {
  insertList?: {
    req: Model;
  }[];
  upsertList?: {
    req: Model;
  }[];
  updateList?: {
    params: PrimaryParams;
    req: Model;
  }[];
  deleteList?: {
    params: PrimaryParams;
  }[];
};

export interface MutationApiProps<Model, PrimaryParams> {
  /** キー */
  key: string;
  /** 新規作成 */
  insert?: MutationApiInsert<Model>;
  insertMulti?: MutationApiInsert<Model[]>;
  /** 新規作成(存在する場合は更新) */
  upsert?: MutationApiUpsert<Model>;
  upsertMulti?: MutationApiUpsert<Model[]>;
  /** 更新 */
  update?: MutationApiUpdate<Model, PrimaryParams>;
  /** 削除 */
  delete?: MutationApiDelete<PrimaryParams>;
}

export function useM<P, R = void>(key: string, fn: MutationApiFn<P, R>, params?: ToastPromiseParams) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [key],
    mutationFn: async (p: P) => {
      return await toast.promise(
        fn(p),
        params ?? {
          success: "成功",
          error: "失敗",
          pending: "処理中...",
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [key],
        type: "active",
        // exact: true,
      });
    },
  });
}

export class MutationApi<Model, PrimaryParams> {
  public key: string;
  private insertFn?: MutationApiInsert<Model>;
  private insertMultiFn?: MutationApiInsert<Model[]>;
  private upsertFn?: MutationApiUpsert<Model>;
  private upsertMultiFn?: MutationApiUpsert<Model[]>;
  private updateFn?: MutationApiUpdate<Model, PrimaryParams>;
  private deleteFn?: MutationApiDelete<PrimaryParams>;
  constructor(props: MutationApiProps<Model, PrimaryParams>) {
    this.key = props.key;
    this.insertFn = props.insert;
    this.insertMultiFn = props.insertMulti;
    this.upsertFn = props.upsert;
    this.upsertMultiFn = props.upsertMulti;
    this.updateFn = props.update;
    this.deleteFn = props.delete;
  }

  public async insert(req: Model): Promise<void> {
    if (!this.insertFn) throw Error("insert method is undefined");
    await this.insertFn(req);
  }

  public async insertMulti(reqs: Model[]): Promise<void> {
    if (this.insertMultiFn) await this.insertMultiFn(reqs);
    const inserts = reqs?.map((req) => this.insert(req)) ?? [];
    await Promise.all(inserts);
  }

  public async upsert(req: Model): Promise<void> {
    if (!this.upsertFn) throw Error("upsert method is undefined");
    await this.upsertFn(req);
  }

  public async upsertMulti(reqs: Model[]): Promise<void> {
    if (this.upsertMultiFn) await this.upsertMultiFn(reqs);
    const upserts = reqs?.map((req) => this.upsert(req)) ?? [];
    await Promise.all(upserts);
  }

  public async update({ params, req }: MutationApiUpdateParams<Model, PrimaryParams>): Promise<void> {
    if (!this.updateFn) throw Error("update method is undefined");
    await this.updateFn({ params, req });
  }

  public async delete(params: PrimaryParams): Promise<void> {
    if (!this.deleteFn) throw Error("delete method is undefined");
    await this.deleteFn(params);
  }

  public async multi({
    insertList,
    updateList,
    deleteList,
    upsertList,
  }: MutationApiMultiProps<Model, PrimaryParams>): Promise<void> {
    const inserts = insertList?.map(({ req }) => this.insert(req)) ?? [];
    const upserts = upsertList?.map(({ req }) => this.upsert(req)) ?? [];
    const updates = updateList?.map(({ req, params }) => this.update({ params, req })) ?? [];
    const deletes = deleteList?.map(({ params }) => this.delete(params)) ?? [];
    await Promise.all([...inserts, ...upserts, ...updates, ...deletes]);
  }

  public useInsert() {
    return this.useM<Model>((p) => this.insert(p));
  }

  public useUpsert() {
    return this.useM<Model>((p) => this.upsert(p));
  }

  public useUpdate() {
    return this.useM<MutationApiUpdateParams<Model, PrimaryParams>>((p) => this.update(p));
  }

  public useDelete() {
    return this.useM<PrimaryParams>((p) => this.delete(p));
  }

  public useMulti() {
    return this.useM<MutationApiMultiProps<Model, PrimaryParams>>((p) => this.multi(p));
  }

  protected useM<P, R = void>(fn: MutationApiFn<P, R>, params?: ToastPromiseParams) {
    return useM(this.key, fn, params);
  }
}

// Supabase

type Tables = Database["public"]["Tables"];

export type Schema<TableName extends keyof Tables> = Tables[TableName];
export type Row<TableName extends keyof Tables> = Schema<TableName>["Row"];
export type Insert<TableName extends keyof Tables> = Schema<TableName>["Insert"];
export type Update<TableName extends keyof Tables> = Schema<TableName>["Update"];
export type Relationships<TableName extends keyof Tables> = Schema<TableName>["Relationships"];
export type FilterBuilder<TableName extends keyof Tables> = PostgrestFilterBuilder<
  Database["public"],
  Row<TableName>,
  Row<TableName>[]
>;
export type FilterHandler<TableName extends keyof Tables, SearchParams> = (
  prev: FilterBuilder<TableName>,
  searchParams: SearchParams,
) => FilterBuilder<TableName>;
export type ApiHandlerConfig<
  TableName extends keyof Tables,
  PrimaryKey extends keyof Schema<TableName>["Row"],
  SearchParams,
  UniqueKey extends keyof Schema<TableName>["Row"] = PrimaryKey,
> = {
  tableName: TableName;
  primaryKeys: PrimaryKey[];
  uniqueKeys: UniqueKey[];
  handlers: (FilterHandler<TableName, SearchParams> | null | undefined)[];
};
export type PrimaryParams<TableName extends keyof Tables, PrimaryKey extends keyof Schema<TableName>["Row"]> = Pick<
  Schema<TableName>["Row"],
  PrimaryKey
>;

export abstract class ApiHandler<
  TableName extends keyof Tables,
  PrimaryKey extends keyof Schema<TableName>["Row"],
  SearchParams = object,
  UniqueKey extends keyof Schema<TableName>["Row"] = PrimaryKey,
> {
  public tableName: TableName;
  protected supabase: SupabaseClient<Database>;
  protected primaryKeys: PrimaryKey[];
  protected uniqueKeys: UniqueKey[];
  protected handlers: (FilterHandler<TableName, SearchParams> | null | undefined)[] = [];

  public query: QueryApi<
    Row<TableName>,
    PrimaryParams<TableName, PrimaryKey>,
    SearchParams,
    PrimaryParams<TableName, UniqueKey>
  >;
  public mutation: MutationApi<Insert<TableName>, PrimaryParams<TableName, PrimaryKey>>;

  constructor(supabase: SupabaseClient<Database>, c: ApiHandlerConfig<TableName, PrimaryKey, SearchParams, UniqueKey>) {
    this.supabase = supabase;
    this.tableName = c.tableName;
    this.primaryKeys = c.primaryKeys;
    this.uniqueKeys = c.uniqueKeys;
    this.handlers = c.handlers;
    this.query = new QueryApi(this.queryProps());
    this.mutation = new MutationApi(this.mutationProps());
  }

  async list(searchParams?: SearchParams): Promise<Row<TableName>[]> {
    const res = searchParams
      ? await this.handlers.reduce((prev, handler) => {
          if (handler) {
            return handler(prev, searchParams);
          } else {
            return prev;
          }
        }, this.db().select() as FilterBuilder<TableName>)
      : await this.db().select();
    if (res.error) {
      throw res.error;
    }
    return res.data as Row<TableName>[];
  }

  async find(primaryParams: PrimaryParams<TableName, PrimaryKey>): Promise<Row<TableName> | null> {
    const res = await this.filterHandlerByPrimaryParams(primaryParams, this.db().select()).maybeSingle();
    if (res.error) {
      throw res.error;
    }
    return res.data as Row<TableName> | null;
  }

  async findByUnique(uniqueParams: PrimaryParams<TableName, UniqueKey>): Promise<Row<TableName> | null> {
    const res = await this.filterHandlerByUniqueParams(uniqueParams, this.db().select()).maybeSingle();
    if (res.error) {
      throw res.error;
    }
    return res.data as Row<TableName> | null;
  }

  async insert(req: Insert<TableName>) {
    const res = await this.db().insert(req as any);
    if (res.error) {
      throw res.error;
    }
  }

  async insertMulti(reqs: Insert<TableName>[]) {
    const res = await this.db().insert(reqs as any);
    if (res.error) {
      throw res.error;
    }
  }

  async upsert(req: Insert<TableName>) {
    const res = await this.db().upsert(req as any);
    if (res.error) {
      throw res.error;
    }
  }

  async upsertMulti(reqs: Insert<TableName>[]) {
    const res = await this.db().upsert(reqs as any);
    if (res.error) {
      throw res.error;
    }
  }

  async update(primaryParams: PrimaryParams<TableName, PrimaryKey>, req: Update<TableName>) {
    const res = await this.filterHandlerByPrimaryParams(primaryParams, this.db().update(req as any) as any);
    if (res.error) {
      throw res.error;
    }
  }

  async delete(primaryParams: PrimaryParams<TableName, PrimaryKey>) {
    const res = await this.filterHandlerByPrimaryParams(primaryParams, this.db().delete() as any);
    if (res.error) {
      throw res.error;
    }
  }

  queryProps(): QueryApiProps<
    Row<TableName>,
    PrimaryParams<TableName, PrimaryKey>,
    SearchParams,
    PrimaryParams<TableName, UniqueKey>
  > {
    return {
      key: this.tableName,
      list: (p) => this.list(p),
      find: (p) => this.find(p),
      findByUnique: (p) => this.findByUnique(p),
    };
  }

  mutationProps(): MutationApiProps<Insert<TableName>, PrimaryParams<TableName, PrimaryKey>> {
    return {
      key: this.tableName,
      insert: (p) => this.insert(p),
      upsert: (p) => this.upsert(p),
      update: ({ params, req }) => this.update(params, req),
      delete: (p) => this.delete(p),
    };
  }

  protected filterHandlerByPrimaryParams(
    primaryParams: PrimaryParams<TableName, PrimaryKey>,
    prevBuilder: FilterBuilder<TableName>,
  ): FilterBuilder<TableName> {
    return this.primaryKeys.reduce((prev, key) => {
      return prev.eq(key as any, primaryParams[key as PrimaryKey] as any);
    }, prevBuilder);
  }

  protected filterHandlerByUniqueParams(
    uniqueParams: PrimaryParams<TableName, UniqueKey>,
    prevBuilder: FilterBuilder<TableName>,
  ): FilterBuilder<TableName> {
    return this.uniqueKeys.reduce((prev, key) => {
      return prev.eq(key as any, uniqueParams[key as UniqueKey] as any);
    }, prevBuilder);
  }

  protected db() {
    return this.supabase.from(this.tableName);
  }
}

export type StorageImage = {
  file: File;
  url: string;
};

export class StorageImageApi {
  supabase: SupabaseClient<Database>;
  bucketId: string;
  queryKey: string;
  constructor(supabase: SupabaseClient<Database>, bucketId: string) {
    this.supabase = supabase;
    this.bucketId = bucketId;
    this.queryKey = "StorageImage_" + this.bucketId;
  }

  async list(folderPath?: string, options?: SearchOptions): Promise<StorageImage[]> {
    const { data: files, error } = await this.supabase.storage.from(this.bucketId).list(folderPath, options);
    if (error) {
      throw error;
    }
    const images = await Promise.all(
      files.map(async ({ name }) => {
        return await this.downloadImage(name, folderPath);
      }),
    );
    return images.reduce((prev, image) => {
      if (image) return prev.concat(image);
      return prev;
    }, [] as StorageImage[]);
  }

  useList(folderPath?: string, options?: SearchOptions) {
    return useQuery({
      queryKey: [this.queryKey, folderPath],
      queryFn: async () => {
        try {
          return await this.list(folderPath, options);
        } catch (e) {
          console.log(e);
          toast.error("取得失敗");
          throw e;
        }
      },
    });
  }

  async upload(file: File, folderPath?: string) {
    const path = this.getPath(file.name, folderPath);
    const { data, error } = await this.supabase.storage.from(this.bucketId).upload(path, file, {
      upsert: true,
    });
    if (error) {
      throw error;
    }
    return data.path;
  }

  async download(fileName: string, folderPath?: string): Promise<File | null> {
    const { data: blob } = await this.supabase.storage.from(this.bucketId).download(this.getPath(fileName, folderPath));
    if (!blob) return null;
    return new File([blob], fileName, { type: blob.type });
  }

  async remove(path: string) {
    const res = await this.supabase.storage.from(this.bucketId).remove([path]);
    if (res.error) {
      throw res.error;
    }
    return res.data;
  }

  resetURL(file: File, prevURL?: string) {
    if (prevURL) URL.revokeObjectURL(prevURL);
    return URL.createObjectURL(file);
  }

  getPath(fileName: string, folderPath?: string): string {
    return folderPath ? `${folderPath}/${fileName}` : fileName;
  }

  public async downloadImage(fileName: string, folderPath?: string): Promise<StorageImage | null> {
    if (fileName == "") return null;
    const file = await this.download(fileName, folderPath);
    if (!file) {
      return null;
    } else {
      return {
        file,
        url: this.resetURL(file),
      };
    }
  }

  public useDownloadImage(fileName: string, folderPath?: string) {
    return useQuery({
      queryKey: [this.queryKey, fileName, folderPath],
      queryFn: async () => {
        try {
          return await this.downloadImage(fileName, folderPath);
        } catch (e) {
          console.log(e);
          toast.error("取得失敗");
          throw e;
        }
      },
    });
  }
}
