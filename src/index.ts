/*
 * Copyright 2021 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */
/* eslint-disable no-console */
import * as malloy from "@malloydata/malloy";
import { promises as fs } from "fs";
import * as path from "path";
import { BigQueryConnection } from "@malloydata/db-bigquery";

export function pathToURL(filePath: string): URL {
  return new URL("file://" + path.resolve(filePath));
}

export function run(
  files: malloy.URLReader,
  args: string[]
): Promise<malloy.Result> {
  const connection = new BigQueryConnection("bigquery");
  const runtime = new malloy.Runtime(files, connection);
  const { query, model } = getOptions(args);
  const queryMaterializer = model
    ? runtime.loadModel(model).loadQuery(query)
    : runtime.loadQuery(query);

  // What's the difference between these two? Model vs ModelMaterializer?
  runtime.getModel('modelURL')
  runtime.loadModel('modelURL)')

  const modelMaterializer = runtime.loadModel(model);
  const malloyModelPromise = modelMaterializer.getModel() // Promise<malloy.Model>
  malloyModelPromise.then((malloyModel) => {
    malloyModel
  })

  modelMaterializer.getModel().then( (model) => {
    const explore = model.getExploreByName('exploreName'); // malloy.Explore
    
  })
  modelMaterializer.getQueryByName('queryName') // Promise<malloy.PreparedQuery>
  modelMaterializer.loadQuery('queryString') // malloy.QueryMaterializer


  const queryMaterializer2 = runtime.loadQuery(query);

  const sqlString = queryMaterializer2.getSQL() // Promise<string>
  const preparedQuery = queryMaterializer2.getPreparedQuery() // Promise<malloy.preparedQuery>
  preparedQuery.then((preparedQuery) => {
    preparedQuery
  })
  const preparedResult = queryMaterializer2.getPreparedResult() // Promise<malloy.preparedResult>
  const preparedResultMaterializer = queryMaterializer2.loadPreparedResult() // malloy.PreparedResultMaterializer
  const result = queryMaterializer2.run() // Promise<malloy.Result>
  const dataStream = queryMaterializer2.runStream() // AsyncIterableIterator<malloy.DataRecord>

  return queryMaterializer.run();
}

function getOptions(args: string[]) {
  let query: malloy.QueryURL | malloy.QueryString | undefined;
  let model: malloy.ModelURL | malloy.ModelString | undefined;

  if(args.length >= 2) {
    args = args.slice(2)
  }

  while (args.length >= 2) {
    const [option, value] = args;
    args = args.slice(2);
    if (option === "--query") {
      query = value;
    } else if (option === "--query-file") {
      query = new URL("file://" + path.resolve(value));
    } else if (option === "--model") {
      model = value;
    } else if (option === "--model-file") {
      model = new URL("file://" + path.resolve(value));
    }
  }
  if (query === undefined) {
    throw new Error("--query or --query-file is required");
  }
  return { query, model };
}

export async function main(): Promise<void> {
  const files = {
    readURL: async (url: URL) => {
      const filePath = url.toString().replace(/^file:\/\//, "");
      return fs.readFile(filePath, "utf8");
    },
  };
  console.log((await run(files, process.argv)).data.value);
}