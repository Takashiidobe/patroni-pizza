# Migration `20200507195719-init`

This migration has been generated by takashiidobe at 5/7/2020, 7:57:19 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "Pizza" AS ENUM ('Pepperoni', 'Ham', 'Pineapple', 'Cheese');

CREATE TABLE "public"."Order" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,"fulfilledAt" timestamp(3)   ,"id" SERIAL,"item" "Pizza" NOT NULL ,
    PRIMARY KEY ("id"))
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200507195719-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,22 @@
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Order {
+  id          Int       @default(autoincrement()) @id
+  createdAt   DateTime  @default(now())
+  fulfilledAt DateTime?
+  item        Pizza
+}
+
+enum Pizza {
+  Pepperoni
+  Ham
+  Pineapple
+  Cheese
+}
```


