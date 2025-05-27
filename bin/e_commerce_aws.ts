#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';  
import { ECommerceApiStack } from '../lib/ecommerceApistack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';
import * as dotenv from 'dotenv';

dotenv.config();
const app = new cdk.App();

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID  || process.env.CDK_DEFAULT_ACCOUNT;;
const AWS_REGION = process.env.AWS_REGION  || process.env.CDK_DEFAULT_REGION;;

const env: cdk.Environment = {
  account: AWS_ACCOUNT_ID,
  region:  AWS_REGION
}

const tags = {
  cost: "ECommerce",
  team: "SiecolaCode"
}

const productsAppLayersStack = new ProductsAppLayersStack(app, "ProductsAppLayers", {
  tags: tags,
  env: env
});

const productsAppStacks = new ProductsAppStack(app, "ProductsApp", {
  tags: tags,
  env: env
});

productsAppStacks.addDependency(productsAppLayersStack)

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi",  {
  productsFetchHandler: productsAppStacks.productsFetchHandler,
  productsAdminHandler: productsAppStacks.productsAdminHandler,
  tags: tags,
  env: env
})

eCommerceApiStack.addDependency(productsAppStacks)